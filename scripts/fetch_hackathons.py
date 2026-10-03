#!/usr/bin/env python3
"""
Fetch live hackathons from Devfolio, Devpost, MLH (+ a static Unstop anchor
list) and write them to data/hackathons.json.

Run:  python scripts/fetch_hackathons.py [--out data/hackathons.json]

Each source is isolated in try/except: one failing source never blocks the
others, and the static Unstop list is always included.
Total runtime budget: < 60 s (10 s per request, 1 s pause between sources).

Endpoint notes (verified 2026-09-30):
  * devpost.com/hackathons.rss  -> 406 for scripts. We use the public JSON API
    (devpost.com/api/hackathons) and only fall back to RSS via feedparser.
  * api.devfolio.co GET /api/hackathons rejects page=0 (422). The site's own
    search endpoint (POST /api/search/hackathons) works, so we use that.
  * mlh.io/seasons/<year>/events redirects to mlh.com and embeds all events as
    JSON in <script data-page="app">. We parse that instead of the HTML tags.
"""
from __future__ import annotations

import argparse
import html
import json
import logging
import re
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests

try:  # optional: use the OS trust store (fixes local Windows/corporate-proxy SSL errors)
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    pass

try:  # optional: only used for the Devpost RSS fallback
    import feedparser
except ImportError:  # pragma: no cover
    feedparser = None

log = logging.getLogger("fetch_hackathons")

USER_AGENT = "RARHackathonHelper/1.0 (contact@hackathonmaster.com)"
TIMEOUT = 10  # seconds per request
SOURCE_DELAY = 1.0  # seconds between sources (rate-limit courtesy)
CLOSING_SOON_DAYS = 3
INR_TO_USD = 0.012  # rough, only used for sorting via prize_numeric

# Higher number wins when the same hackathon appears in several sources.
SOURCE_PRIORITY = {"devfolio": 4, "devpost": 3, "mlh": 2, "unstop": 1}

# ---------------------------------------------------------------------------
# Static Unstop anchors. Unstop blocks scraping, so this list is curated by
# hand. These are rolling / annual programmes with no fixed deadline we can
# verify from here, so they carry deadline=None and status "Live".
# >>> EDIT THIS LIST whenever you learn of a new major Unstop hackathon. <<<
# ---------------------------------------------------------------------------
UNSTOP_STATIC = [
    {"name": "Unstop Hackathons Hub", "theme": "Open Theme", "prize": "Varies",
     "mode": "Online", "teamSize": "1-4", "link": "https://unstop.com/hackathons",
     "tags": ["Unstop", "Open Theme", "Rolling"]},
    {"name": "Smart India Hackathon (SIH)", "theme": "Open Innovation", "prize": "₹1,00,000 per problem statement",
     "prize_numeric": 1200, "mode": "Hybrid", "teamSize": "6", "link": "https://www.sih.gov.in/",
     "tags": ["India", "Government", "Annual"]},
    {"name": "Flipkart GRiD", "theme": "E-commerce / AI", "prize": "Cash + PPO",
     "mode": "Online", "teamSize": "1-3", "link": "https://unstop.com/hackathons",
     "tags": ["Unstop", "AI/ML", "Annual"]},
    {"name": "Google Solution Challenge", "theme": "UN SDGs", "prize": "Mentorship + Google support",
     "mode": "Online", "teamSize": "1-4", "link": "https://developers.google.com/community/gdsc-solution-challenge",
     "tags": ["Google", "Students", "Annual"]},
    {"name": "Microsoft Imagine Cup", "theme": "AI / Cloud", "prize": "$100,000",
     "prize_numeric": 100000, "mode": "Online", "teamSize": "1-4", "link": "https://imaginecup.microsoft.com/",
     "tags": ["Microsoft", "Students", "Annual"]},
    {"name": "NASA International Space Apps Challenge", "theme": "Space Tech", "prize": "Global Recognition",
     "mode": "Hybrid", "teamSize": "1-6", "link": "https://www.spaceappschallenge.org/",
     "tags": ["Space Tech", "Open Data", "Annual"]},
]

# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------
_MONTHS = {m: i for i, m in enumerate(
    ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], 1)}


def make_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"User-Agent": USER_AGENT, "Accept": "application/json, text/html;q=0.9, */*;q=0.5"})
    return s


def http(session: requests.Session, method: str, url: str, **kw) -> requests.Response:
    """Request with one polite retry on HTTP 429."""
    kw.setdefault("timeout", TIMEOUT)
    kw.setdefault("allow_redirects", True)
    for attempt in (1, 2):
        r = session.request(method, url, **kw)
        if r.status_code == 429 and attempt == 1:
            wait = min(int(r.headers.get("Retry-After", "2") or 2), 5)
            log.warning("429 from %s, sleeping %ss", url, wait)
            time.sleep(wait)
            continue
        r.raise_for_status()
        return r
    raise RuntimeError("unreachable")


def parse_iso(s: str | None) -> datetime | None:
    if not s:
        return None
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(timezone.utc)
    except ValueError:
        return None


def clean_text(s: str | None) -> str:
    if not s:
        return ""
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    try:  # Devpost sometimes double-encodes UTF-8 (e.g. "â‚¹" for "₹")
        s = s.encode("cp1252").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        pass
    return re.sub(r"\s+", " ", s).strip()


def parse_money(text: str) -> tuple[str, int]:
    """'$10,000' -> ('$10,000', 10000). INR is converted roughly to USD."""
    text = clean_text(text)
    if not text:
        return "See details", 0
    m = re.search(r"([\d][\d,\.]*)\s*([kKmM])?", text)
    if not m:
        return text, 0
    try:
        num = float(m.group(1).replace(",", ""))
    except ValueError:
        return text, 0
    mult = {"k": 1e3, "m": 1e6}.get((m.group(2) or "").lower(), 1)
    num *= mult
    if "₹" in text or "INR" in text.upper() or "Rs" in text:
        num *= INR_TO_USD
    return text, int(num)


def parse_date_range(txt: str) -> tuple[datetime | None, datetime | None]:
    """Devpost strings: 'Sep 25 - 30, 2026' | 'Oct 20, 2026 - Jan 5, 2027' | 'Sep 30 - Oct 5, 2026'."""
    txt = clean_text(txt)
    if not txt:
        return None, None
    parts = [p.strip() for p in re.split(r"\s+-\s+|\s+–\s+", txt)]
    year_m = re.search(r"(\d{4})\s*$", parts[-1])
    end_year = int(year_m.group(1)) if year_m else datetime.now(timezone.utc).year

    def one(part: str, default_month: int | None, default_year: int):
        m = re.match(r"(?:([A-Za-z]{3})[a-z]*\.?\s+)?(\d{1,2})(?:,?\s*(\d{4}))?", part)
        if not m:
            return None
        mon = _MONTHS.get((m.group(1) or "").lower()[:3], default_month)
        if not mon:
            return None
        return datetime(int(m.group(3) or default_year), mon, int(m.group(2)), tzinfo=timezone.utc)

    end = one(parts[-1], None, end_year)
    if end is None and len(parts) > 1:
        return None, None
    start = None
    if len(parts) == 1:
        start = end
    else:
        start = one(parts[0], end.month if end else None, end_year)
        if start and end and start > end:  # 'Dec 28 - Jan 3, 2027' -> start is previous year
            start = start.replace(year=start.year - 1)
    return start, end


def norm_key(name: str) -> str:
    n = re.sub(r"\b(19|20)\d{2}\b", "", name.lower())
    n = re.sub(r"\b(hackathon|hacks?|season|edition|the|by)\b", "", n)
    return re.sub(r"[^a-z0-9]", "", n)


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]


def fmt_duration(start: datetime | None, end: datetime | None) -> str:
    if not start or not end or end <= start:
        return "Varies"
    hours = round((end - start).total_seconds() / 3600)
    return f"{hours}h" if hours <= 72 else f"{round(hours / 24)}d"


def mode_of(is_online=None, text: str = "") -> str:
    t = (text or "").lower()
    if is_online is True or t in {"online", "virtual", "digital", "globe"}:
        return "Online"
    if "hybrid" in t:
        return "Hybrid"
    if is_online is False or t in {"physical", "in-person", "in person"}:
        return "In-person"
    return "Online" if "online" in t else "In-person" if t else "Online"


def compute_status(start: datetime | None, deadline: datetime | None, now: datetime) -> str | None:
    """Return status, or None if the hackathon is expired and must be skipped."""
    if deadline is not None:
        if deadline <= now:
            return None
        if deadline - now < timedelta(days=CLOSING_SOON_DAYS):
            return "Closing Soon"
    if start is not None and start > now:
        return "Upcoming"
    return "Live"


def clean_url(u):
    """Only http(s) URLs are allowed; anything else becomes None so the UI hides the Register button."""
    return u.strip() if isinstance(u, str) and re.match(r"^https?://\S+$", u.strip()) else None


def build(now, *, source, sid, name, link, start, deadline, theme="Open Theme", prize="See details",
          prize_numeric=0, mode="Online", team="Varies", duration=None, tags=None, registration_url=None):
    status = compute_status(start, deadline, now)
    if status is None:
        return None
    return {
        "id": f"{source}-{slugify(sid or name)}",
        "name": name.strip(),
        "platform": {"devpost": "DevPost", "devfolio": "Devfolio", "mlh": "MLH", "unstop": "Unstop"}[source],
        "theme": theme,
        "prize": prize,
        "prize_numeric": prize_numeric,
        "deadline": deadline.strftime("%Y-%m-%d") if deadline else None,
        "deadline_ts": int(deadline.timestamp()) if deadline else None,
        "duration": duration or fmt_duration(start, deadline),
        "mode": mode,
        "teamSize": team,
        "link": link,
        "registrationUrl": clean_url(registration_url),
        "status": status,
        "tags": list(dict.fromkeys(t for t in (tags or []) if t))[:5],
        "source": source,
        "last_updated": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
    }


# ---------------------------------------------------------------------------
# sources
# ---------------------------------------------------------------------------
def fetch_devfolio(session, now):
    r = http(session, "POST", "https://api.devfolio.co/api/search/hackathons",
             json={"type": "application_open", "from": 0, "size": 40})
    out = []
    for hit in r.json().get("hits", {}).get("hits", []):
        s = hit.get("_source", {})
        if s.get("private") or not s.get("slug") or not s.get("name"):
            continue
        setting = s.get("hackathon_setting") or {}
        start = parse_iso(s.get("starts_at"))
        end = parse_iso(s.get("ends_at"))
        deadline = parse_iso(setting.get("reg_ends_at")) or end  # application deadline first
        # Prize isn't a structured field; pull the first currency amount from the description.
        m = re.search(r"([₹$€£]\s?[\d][\d,\.]*\s?[kKlL]?(?:akh)?)", s.get("desc") or "")
        prize, num = parse_money(m.group(1)) if m else ("See details", 0)
        themes = [t.get("name") for t in (s.get("themes") or []) if isinstance(t, dict)]
        team_min, team_max = s.get("team_min"), s.get("team_size")
        team = f"{team_min}-{team_max}" if team_min and team_max and team_min != team_max else str(team_max or "Varies")
        loc = s.get("city") or s.get("location")
        rec = build(now, source="devfolio", sid=s["slug"], name=s["name"],
                    link=f"https://{s['slug']}.devfolio.co/",  # Devfolio hosts each event on a subdomain
                    # NB: devfolio.co/hackathons/{slug}/apply returns 404 (verified 2026-10); the event page
                    # on the subdomain is where applying happens.
                    registration_url=f"https://{s['slug']}.devfolio.co/",
                    start=start, deadline=deadline,
                    theme=(themes[0] if themes else "Open Theme"), prize=prize, prize_numeric=num,
                    mode=mode_of(s.get("is_online")), team=team,
                    duration=fmt_duration(start, end),
                    tags=themes[:3] + ([loc] if loc else []) + ["Open"])
        if rec:
            out.append(rec)
    return out


def fetch_devpost(session, now):
    out, seen = [], set()
    for page in (1, 2, 3):
        r = http(session, "GET", "https://devpost.com/api/hackathons",
                 params=[("status[]", "open"), ("status[]", "upcoming"), ("order_by", "deadline"), ("page", page)])
        items = r.json().get("hackathons", [])
        if not items:
            break
        for h in items:
            if h["id"] in seen or h.get("invite_only"):
                continue
            seen.add(h["id"])
            start, end = parse_date_range(h.get("submission_period_dates", ""))
            if end:  # end of the submission day
                end = end.replace(hour=23, minute=59, second=59)
            prize, num = parse_money(h.get("prize_amount") or "")
            themes = [t["name"] for t in h.get("themes", []) if t.get("name")]
            loc = (h.get("displayed_location") or {})
            rec = build(now, source="devpost", sid=h["url"].split("//")[-1].split(".")[0], name=h["title"],
                        link=h["url"], registration_url=h["url"], start=start, deadline=end,
                        theme=(themes[0] if themes else "Open Theme"), prize=prize if num else "See details",
                        prize_numeric=num, mode=mode_of(text=loc.get("icon") or loc.get("location", "")),
                        team="Varies", tags=themes[:3] + ["Open" if h.get("open_state") == "open" else "Upcoming"])
            if rec:
                out.append(rec)
        time.sleep(0.5)
    return out


def fetch_devpost_rss(session, now):  # fallback only, RSS is often blocked (406)
    if feedparser is None:
        raise RuntimeError("feedparser not installed")
    r = http(session, "GET", "https://devpost.com/hackathons.rss")
    feed = feedparser.parse(r.content)
    out = []
    for e in feed.entries:
        pub = datetime(*e.published_parsed[:6], tzinfo=timezone.utc) if getattr(e, "published_parsed", None) else None
        # RSS carries no deadline; keep it only if the description reveals one.
        m = re.search(r"(\d{4}-\d{2}-\d{2})", e.get("summary", ""))
        deadline = parse_iso(m.group(1) + "T23:59:59+00:00") if m else None
        rec = build(now, source="devpost", sid=e.link, name=e.title, link=e.link, registration_url=e.link, start=pub, deadline=deadline,
                    tags=[t.term for t in e.get("tags", [])][:3])
        if rec:
            out.append(rec)
    return out


def fetch_mlh(session, now):
    out, seen = [], set()
    for year in range(now.year, now.year + 2):
        try:
            r = http(session, "GET", f"https://mlh.io/seasons/{year}/events")
        except requests.RequestException as exc:
            log.warning("MLH season %s failed: %s", year, exc)
            continue
        m = re.search(r'<script data-page="app" type="application/json">(.*?)</script>', r.text, re.S)
        if not m:
            log.warning("MLH season %s: embedded JSON not found (page layout changed?)", year)
            continue
        for ev in json.loads(m.group(1)).get("props", {}).get("upcomingEvents", []):
            if ev["id"] in seen:
                continue
            seen.add(ev["id"])
            start, end = parse_iso(ev.get("startsAt")), parse_iso(ev.get("endsAt"))
            fmt = ev.get("formatType") or ""
            rec = build(now, source="mlh", sid=ev.get("slug") or ev["name"], name=ev["name"],
                        link=ev.get("websiteUrl") or f"https://mlh.io{ev.get('url', '')}",
                        registration_url=ev.get("websiteUrl"),
                        start=start, deadline=end, theme="Student Hackathon",
                        prize="See details", mode=mode_of(text=fmt), team="Varies",
                        tags=["MLH", "Students", ev.get("location")])
            if rec:
                out.append(rec)
    return out


def static_unstop(now):
    out = []
    for e in UNSTOP_STATIC:
        rec = build(now, source="unstop", sid=e["name"], name=e["name"], link=e["link"],
                    registration_url=e.get("registrationUrl", e["link"]), start=None, deadline=None,
                    theme=e["theme"], prize=e["prize"], prize_numeric=e.get("prize_numeric", 0), mode=e["mode"],
                    team=e["teamSize"], duration="Varies", tags=e["tags"])
        if rec:
            out.append(rec)
    return out


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------
def dedupe(records):
    best = {}
    for r in records:
        k = norm_key(r["name"])
        if not k:
            continue
        cur = best.get(k)
        if cur is None or SOURCE_PRIORITY[r["source"]] > SOURCE_PRIORITY[cur["source"]]:
            best[k] = r
    return list(best.values())


def sort_key(r):
    order = {"Closing Soon": 0, "Live": 1, "Upcoming": 2}
    return (order.get(r["status"], 9), r["deadline_ts"] is None, r["deadline_ts"] or 0, r["name"].lower())


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(Path(__file__).resolve().parent.parent / "data" / "hackathons.json"))
    args = ap.parse_args(argv)
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")

    t0 = time.monotonic()
    now = datetime.now(timezone.utc)
    session = make_session()
    records = []

    sources = [("devfolio", [fetch_devfolio]), ("devpost", [fetch_devpost, fetch_devpost_rss]), ("mlh", [fetch_mlh])]
    for i, (name, fns) in enumerate(sources):
        if i:
            time.sleep(SOURCE_DELAY)
        for fn in fns:
            try:
                got = fn(session, now)
                log.info("%s: %d hackathons (%s)", name, len(got), fn.__name__)
                records += got
                break
            except Exception as exc:  # noqa: BLE001 - a source must never crash the run
                log.warning("%s via %s failed: %s", name, fn.__name__, exc)

    records += static_unstop(now)  # always present
    final = sorted(dedupe(records), key=sort_key)

    payload = {"last_updated": now.strftime("%Y-%m-%dT%H:%M:%SZ"), "total": len(final), "hackathons": final}
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    log.info("wrote %d hackathons to %s in %.1fs", len(final), out, time.monotonic() - t0)
    return 0


if __name__ == "__main__":
    sys.exit(main())
