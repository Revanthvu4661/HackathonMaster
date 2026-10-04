"""HackathonMaster web service.

Serves the static site (HTML/CSS/JS/JSON/images in the repo root) from a FastAPI app so it can run on
Render as a Web Service. Run locally:   uvicorn server.app:app --reload --port 8000

What this adds over a static host:
  * an allow-list, so repo files (.git, scripts, firestore.rules, *.py ...) are never served
  * a real HTTP 404 for unknown paths (serves 404.html), and /strategist redirects to /strategist.html
  * ETag / 304 revalidation, and gzip that is computed once and cached (offline_data_v3.js is 19 MB raw)
  * security headers, including a Content-Security-Policy that starts in Report-Only mode
  * GET /healthz for Render's health check
"""
from __future__ import annotations

import gzip
import mimetypes
import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse, RedirectResponse, Response

ROOT = Path(__file__).resolve().parent.parent

# Only these file types are ever served. Anything else (.py, .md, .rules, .yaml, .txt ...) is a 404.
ALLOWED_EXT = {
    ".html", ".css", ".js", ".json", ".xml", ".svg", ".ico", ".webmanifest",
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".woff", ".woff2",
}
ALLOWED_FILES = {"robots.txt"}                       # exact-name exceptions
DENIED_FILES = {"firebase.json", "package.json", "package-lock.json"}
DENIED_TOP_DIRS = {"server", "scripts", "scratch", "_dev", "node_modules"}
COMPRESSIBLE = {".html", ".css", ".js", ".json", ".xml", ".svg", ".webmanifest"}
LONG_CACHE = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".woff", ".woff2"}  # 1 day; everything else revalidates

MIME = {
    ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
    ".json": "application/json", ".xml": "application/xml", ".svg": "image/svg+xml",
    ".webmanifest": "application/manifest+json", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff",
}

# CSP: report-only by default so a missed domain can't break sign-in. Set CSP_MODE=enforce once the
# browser console shows no "[Report Only]" violations on the pages you use.
CSP = "; ".join([
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.gstatic.com https://apis.google.com https://cdnjs.cloudflare.com "
    "https://cdn.jsdelivr.net https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    # connect-src is the important one: it limits where a stolen API key could be sent.
    "connect-src 'self' https://generativelanguage.googleapis.com https://google.serper.dev "
    "https://raw.githubusercontent.com https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com "
    "https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
    "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://apis.google.com",
    "object-src 'none'", "base-uri 'self'", "frame-ancestors 'self'",
])
CSP_HEADER = ("Content-Security-Policy"
              if os.getenv("CSP_MODE", "report-only").lower() == "enforce"
              else "Content-Security-Policy-Report-Only")

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=15552000",
    CSP_HEADER: CSP,
}

app = FastAPI(title="HackathonMaster", docs_url=None, redoc_url=None, openapi_url=None)

_gzip_cache: dict[tuple[str, int, int], bytes] = {}   # (path, mtime_ns, size) -> compressed bytes


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    for k, v in SECURITY_HEADERS.items():
        response.headers.setdefault(k, v)
    return response


@app.get("/healthz", include_in_schema=False)
async def healthz():
    return JSONResponse({"status": "ok"}, headers={"Cache-Control": "no-store"})


def resolve(url_path: str) -> Path | None:
    """Map a URL path to a servable file inside ROOT, or None. Never leaves ROOT, never serves dotfiles."""
    rel = url_path.strip("/") or "index.html"
    parts = [p for p in rel.split("/") if p]
    if any(p.startswith(".") for p in parts):                      # .git, .github, .env, .firebaserc ...
        return None
    if parts and parts[0].lower() in DENIED_TOP_DIRS:
        return None
    candidates = [rel] if Path(rel).suffix else [rel + ".html", rel + "/index.html"]   # /strategist -> strategist.html
    for c in candidates:
        try:
            target = (ROOT / c).resolve()
        except (OSError, ValueError):
            return None
        if ROOT != target and ROOT not in target.parents:          # path traversal
            return None
        name = target.name
        if not target.is_file() or name.lower() in DENIED_FILES:
            continue
        if target.suffix.lower() in ALLOWED_EXT or name.lower() in ALLOWED_FILES:
            return target
    return None


def etag_for(st: os.stat_result, gz: bool) -> str:
    return f'W/"{st.st_mtime_ns:x}-{st.st_size:x}{"-gz" if gz else ""}"'


@app.api_route("/{url_path:path}", methods=["GET", "HEAD"], include_in_schema=False)
async def site(url_path: str, request: Request):
    target = resolve(url_path)
    if target is None:
        page = ROOT / "404.html"
        body = page.read_bytes() if page.is_file() else b"404 Not Found"
        return Response(body, status_code=404, media_type="text/html",
                        headers={"Cache-Control": "no-store"})

    # /strategist -> /strategist.html (one canonical URL per page; theme.js/navbar highlight and the sitemap use .html)
    clean = url_path.strip("/")
    if clean and not Path(clean).suffix and target.suffix.lower() == ".html" and target.name != "index.html":
        query = request.url.query
        return RedirectResponse(f"/{clean}.html" + (f"?{query}" if query else ""), status_code=308)

    ext = target.suffix.lower()
    st = target.stat()
    wants_gzip = ext in COMPRESSIBLE and "gzip" in request.headers.get("accept-encoding", "")
    etag = etag_for(st, wants_gzip)
    headers = {
        "ETag": etag,
        "Vary": "Accept-Encoding",
        "Cache-Control": "public, max-age=86400" if ext in LONG_CACHE else "no-cache",   # no-cache = always revalidate (304)
    }
    if request.headers.get("if-none-match") == etag:
        return Response(status_code=304, headers=headers)

    media = MIME.get(ext) or mimetypes.guess_type(target.name)[0] or "application/octet-stream"
    if wants_gzip:
        key = (str(target), st.st_mtime_ns, st.st_size)
        data = _gzip_cache.get(key)
        if data is None:
            data = gzip.compress(target.read_bytes(), compresslevel=6)   # once per file version, then cached
            if len(_gzip_cache) >= 64:
                _gzip_cache.clear()
            _gzip_cache[key] = data
        headers["Content-Encoding"] = "gzip"
        return Response(data, media_type=media, headers=headers)
    return FileResponse(target, media_type=media, headers=headers)
