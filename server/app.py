"""HackathonMaster API: an authenticated, rate-limited Gemini proxy.

Why: every visitor used to paste their own Gemini key into the browser (localStorage), where any XSS can
read it. This service keeps ONE server-side key and only calls Gemini for signed-in users.

    POST /api/gemini   Authorization: Bearer <Firebase ID token>
    GET  /api/health

Deploy (render.yaml, rootDir: server):   uvicorn app:app --host 0.0.0.0 --port $PORT
Local, from the repo root:               uvicorn server.app:app --reload --port 8000
    (locally the website is also served from the same process, see the bottom of this file)

NOTE: do not add `from __future__ import annotations` here: slowapi's decorator hides postponed type hints
from FastAPI, so the request body would be mistaken for a query parameter (every call would 422).

Required env vars:  GEMINI_API_KEY, FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL
                    (+ FIREBASE_PRIVATE_KEY_ID, FIREBASE_CLIENT_ID)
Optional env vars (all have defaults):
    ALLOWED_ORIGINS        comma list for CORS (default: DEFAULT_ORIGINS below)
    GEMINI_MODELS          comma list of models clients may request (default: gemini-2.0-flash,gemini-2.5-flash)
    RATE_LIMIT_PER_MINUTE  per signed-in user (default 10)
    RATE_LIMIT_PER_DAY     per signed-in user (default 100)
"""
import logging
import os
import time
from pathlib import Path
from typing import Literal

import firebase_admin
import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth as fb_auth
from firebase_admin import credentials
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

HERE = Path(__file__).resolve().parent
load_dotenv(HERE / ".env")                       # server/.env
load_dotenv(HERE.parent / "backend" / ".env")    # backend/.env (where .env.example lives); never overrides real env vars
log = logging.getLogger("hackathonmaster")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

# ---------------------------------------------------------------------------
# config
# ---------------------------------------------------------------------------
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
ALLOWED_MODELS = {m.strip() for m in os.getenv("GEMINI_MODELS", "gemini-2.0-flash,gemini-2.5-flash").split(",") if m.strip()}
DEFAULT_MODEL = "gemini-2.0-flash" if "gemini-2.0-flash" in ALLOWED_MODELS else sorted(ALLOWED_MODELS)[0]
MAX_PROMPT_CHARS = 60_000      # total characters across all parts
MAX_OUTPUT_TOKENS = 8_192
MAX_BODY_BYTES = 300_000
RATE = f"{os.getenv('RATE_LIMIT_PER_MINUTE', '10')}/minute;{os.getenv('RATE_LIMIT_PER_DAY', '100')}/day"
# Browser origins allowed to call this API (CORS). Override on Render with ALLOWED_ORIGINS (comma separated).
DEFAULT_ORIGINS = [
    "https://hackathon-master.onrender.com",
    "https://hackathon-master-frontend.onrender.com",   # the new static frontend
    "https://hackathonmaster.onrender.com",             # the current live static site: remove once it is retired
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:8000",                            # local FastAPI serving the site itself
    "http://127.0.0.1:8000",
]
ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", ",".join(DEFAULT_ORIGINS)).split(",") if o.strip()]


# ---------------------------------------------------------------------------
# request schema: strict allow-list. Anything not listed (tools, safety overrides, ...) is rejected.
# ---------------------------------------------------------------------------
class _Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


class Part(_Strict):
    text: str


class Content(_Strict):
    role: Literal["user", "model"] = "user"
    parts: list[Part] = Field(min_length=1, max_length=20)


class SystemInstruction(_Strict):
    parts: list[Part] = Field(min_length=1, max_length=5)


class GenerationConfig(_Strict):
    temperature: float | None = Field(default=None, ge=0, le=2)
    topP: float | None = Field(default=None, ge=0, le=1)
    maxOutputTokens: int | None = Field(default=None, ge=1, le=MAX_OUTPUT_TOKENS)
    responseMimeType: Literal["application/json", "text/plain"] | None = None


class GoogleSearchTool(_Strict):
    """The ONLY tool clients may use: Google Search grounding (`{"google_search": {}}`), used by Deep Search.
    No parameters are accepted, and code execution / URL context / function calling stay blocked."""
    google_search: dict = Field(default_factory=dict)

    @field_validator("google_search")
    @classmethod
    def _no_params(cls, v: dict) -> dict:
        if v:
            raise ValueError("google_search takes no parameters")
        return v


class GeminiRequest(_Strict):
    model: str = DEFAULT_MODEL
    contents: list[Content] = Field(min_length=1, max_length=40)
    systemInstruction: SystemInstruction | None = None
    generationConfig: GenerationConfig | None = None
    tools: list[GoogleSearchTool] | None = Field(default=None, max_length=1)

    @model_validator(mode="after")
    def _limit_size(self):
        total = sum(len(p.text) for c in self.contents for p in c.parts)
        if self.systemInstruction:
            total += sum(len(p.text) for p in self.systemInstruction.parts)
        if total > MAX_PROMPT_CHARS:
            raise ValueError(f"prompt too long ({total} > {MAX_PROMPT_CHARS} characters)")
        return self


# ---------------------------------------------------------------------------
# Firebase Admin (lazy: the app boots and /api/health works even before credentials are configured)
# ---------------------------------------------------------------------------
def firebase_configured() -> bool:
    return all(os.getenv(k) for k in ("FIREBASE_PROJECT_ID", "FIREBASE_PRIVATE_KEY", "FIREBASE_CLIENT_EMAIL"))


def init_firebase() -> None:
    if firebase_admin._apps:
        return
    if not firebase_configured():
        raise HTTPException(503, "Server is not configured for sign-in verification yet.")
    try:
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": os.environ["FIREBASE_PROJECT_ID"],
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID", ""),
            "private_key": os.environ["FIREBASE_PRIVATE_KEY"].replace("\\n", "\n"),   # env vars store newlines as \n
            "client_email": os.environ["FIREBASE_CLIENT_EMAIL"],
            "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
            "token_uri": "https://oauth2.googleapis.com/token",
        })
        firebase_admin.initialize_app(cred)
    except Exception:   # never include the exception text: it can echo credential fragments
        log.error("Firebase Admin initialisation failed (check FIREBASE_* env vars)")
        raise HTTPException(503, "Server sign-in verification is misconfigured.")


bearer = HTTPBearer(auto_error=False)


async def current_user(request: Request, creds: HTTPAuthorizationCredentials | None = Depends(bearer)) -> dict:
    if creds is None or not creds.credentials:
        raise HTTPException(401, "Sign in to use the AI proxy.", headers={"WWW-Authenticate": "Bearer"})
    init_firebase()
    try:
        decoded = await run_in_threadpool(fb_auth.verify_id_token, creds.credentials)
    except Exception:
        raise HTTPException(401, "Invalid or expired sign-in. Please sign in again.", headers={"WWW-Authenticate": "Bearer"})
    request.state.uid = decoded["uid"]   # the rate limiter keys on this
    return decoded


# ---------------------------------------------------------------------------
# app
# ---------------------------------------------------------------------------
def rate_key(request: Request) -> str:
    return getattr(request.state, "uid", None) or get_remote_address(request)


limiter = Limiter(key_func=rate_key)   # in-memory: correct for a single instance (Render free/starter)

app = FastAPI(title="HackathonMaster API", docs_url=None, redoc_url=None, openapi_url=None)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(CORSMiddleware, allow_origins=ORIGINS, allow_methods=["GET", "POST", "OPTIONS"],
                   allow_headers=["Authorization", "Content-Type"], allow_credentials=False, max_age=600)


@app.on_event("startup")
async def _startup() -> None:
    app.state.http = httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=10.0))
    if not os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY", "").startswith("your_"):
        log.warning("GEMINI_API_KEY is not set: /api/gemini will answer 503")
    if not firebase_configured():
        log.warning("FIREBASE_* credentials are not set: /api/gemini will answer 503")


@app.on_event("shutdown")
async def _shutdown() -> None:
    await app.state.http.aclose()


@app.middleware("http")
async def api_hardening(request: Request, call_next):
    if request.url.path.startswith("/api/"):
        size = request.headers.get("content-length")
        if size and size.isdigit() and int(size) > MAX_BODY_BYTES:
            return JSONResponse({"detail": "Request too large."}, status_code=413)
    response = await call_next(request)
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"
        response.headers["X-Content-Type-Options"] = "nosniff"
    return response


api = APIRouter()


@api.get("/api/health")
async def health() -> dict:
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    return {"status": "ok", "gemini_configured": bool(gemini_key) and not gemini_key.startswith("your_"),
            "auth_configured": firebase_configured()}


@api.get("/healthz", include_in_schema=False)
async def healthz() -> dict:
    return {"status": "ok"}


@api.post("/api/gemini")
@limiter.limit(RATE)
async def gemini(request: Request, body: GeminiRequest, user: dict = Depends(current_user)):
    if body.model not in ALLOWED_MODELS:
        raise HTTPException(400, f"Model not allowed. Use one of: {', '.join(sorted(ALLOWED_MODELS))}")
    key = os.getenv("GEMINI_API_KEY", "")
    if not key or key.startswith("your_"):
        raise HTTPException(503, "The AI service is not configured yet.")

    payload = body.model_dump(exclude={"model"}, exclude_none=True)
    started = time.monotonic()
    try:
        resp = await request.app.state.http.post(
            GEMINI_URL.format(model=body.model), json=payload,
            headers={"x-goog-api-key": key, "Content-Type": "application/json"})   # header, not ?key= (URLs get logged)
    except httpx.TimeoutException:
        raise HTTPException(504, "The AI service took too long. Please try again.")
    except httpx.HTTPError:
        raise HTTPException(502, "Could not reach the AI service.")

    ms = int((time.monotonic() - started) * 1000)
    log.info("gemini uid=%s model=%s status=%s %dms", user["uid"], body.model, resp.status_code, ms)   # never log prompts or keys

    if resp.status_code == 200:
        return resp.json()
    if resp.status_code == 429:
        raise HTTPException(429, "The AI service is busy. Try again in a minute.")
    if resp.status_code == 400:
        try:
            msg = str(resp.json().get("error", {}).get("message", ""))[:300]
        except ValueError:
            msg = ""
        raise HTTPException(400, f"The AI rejected this request. {msg}".strip())
    log.error("Gemini upstream error %s (check GEMINI_API_KEY / model name)", resp.status_code)
    raise HTTPException(502, "The AI service returned an error.")


app.include_router(api)

# Local development convenience: serve the website from the same process when the site files are present
# (repo root). On Render with `rootDir: server` they are not, so only the API runs there.
# Mounted LAST so the /api/* routes above always win.
try:
    try:
        from .static_site import ROOT as _SITE_ROOT, app as _site      # uvicorn server.app:app (from repo root)
    except ImportError:
        from static_site import ROOT as _SITE_ROOT, app as _site       # uvicorn app:app (cwd = server/)
    if (_SITE_ROOT / "index.html").is_file():
        app.mount("/", _site)
        log.info("Serving the website from %s", _SITE_ROOT)
    else:
        log.info("Website files not found next to the server folder: running API only")
except ImportError:
    log.warning("static_site.py not found: running API only")
