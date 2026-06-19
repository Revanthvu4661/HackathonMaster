/**
 * OFFLINE DATA MODULES — Phase 2 domain expansion pack
 *
 * HOW TO ADD MORE ENTRIES with ChatGPT / Gemini (free):
 *  1. Copy one of the SKELETON entries at the bottom of this file.
 *  2. Paste into ChatGPT / Gemini with this prompt:
 *     "Fill in this hackathon knowledge base entry for the domain: [YOUR DOMAIN].
 *      Follow the exact JSON structure. Make everything specific to [DOMAIN].
 *      Keep overview/techstack as HTML strings. Keep mega_prompt as a direct AI instruction."
 *  3. Paste the filled entry above the SKELETON section.
 *  4. Add the new domain keyword to the 'keywords' array so scoring works.
 *
 * ADDING A DOMAIN:
 *  - Add keywords that are UNIQUE to that domain (avoid generic words like "app", "user", "build")
 *  - Include plural forms, synonyms, abbreviations (e.g. "iot", "internet of things", "sensor")
 *  - 8-15 keywords per entry is the sweet spot
 */

window.OFFLINE_KNOWLEDGE_BASE_MODULES = [

/* ─────────────────────────────────────────────
   1. SUPPLY CHAIN / LOGISTICS
   ───────────────────────────────────────────── */
{
  "keywords": [
    "supply chain", "logistics", "shipment", "delivery", "warehouse",
    "inventory", "fleet", "tracking", "last mile", "freight",
    "dispatch", "route optimization", "cargo", "procurement"
  ],
  "result": {
    "overview": "<h3>🚚 Supply Chain Intelligence Platform</h3><p>Build a real-time logistics visibility tool that cuts delivery costs and eliminates the black-box problem in supply chains. The winning angle: <b>live GPS tracking + AI route optimization + automated anomaly alerts</b> — demo-able in 30 seconds.</p>",
    "techstack": "<h4>Frontend:</h4> React + Leaflet.js (real-time map).<br><h4>Backend:</h4> Node.js + Express with WebSocket for live updates.<br><h4>Database:</h4> Supabase (PostgreSQL + realtime).<br><h4>Maps/Routes:</h4> OpenRouteService API (free tier) or Google Maps.<br><h4>AI:</h4> Gemini API for anomaly detection + ETA prediction.",
    "ai_strategy": "1. <b>Route Optimizer:</b> Feed current traffic + order list to Gemini → get optimized stop sequence.<br>2. <b>Anomaly Alerts:</b> Compare expected vs actual location/time → Gemini flags delays before they cascade.<br>3. <b>Demand Forecast:</b> RAG over past shipment data → predict next week's inventory needs.",
    "mega_prompt": "Act as a Principal Logistics Engineer. Build a Supply Chain Visibility Platform using React, Node.js, Supabase, and Gemini API. Core features: (1) Live shipment tracker on Leaflet map, (2) AI route optimizer that takes a list of delivery stops and returns the optimal sequence with estimated arrival times, (3) Delay anomaly detector that fires an alert when a shipment deviates >15 min from schedule. Use WebSocket for real-time location updates. Include a clean dashboard with KPIs: on-time rate, avg delivery time, cost per km. Mobile-responsive. Dark mode.",
    "database_schema": "Table shipments { id uuid [pk] order_id varchar origin text destination text status varchar current_lat float current_lng float eta timestamp created_at timestamp }\nTable routes { id uuid [pk] shipment_id uuid stops jsonb optimized_sequence jsonb distance_km float }\nTable alerts { id uuid [pk] shipment_id uuid type varchar message text resolved_at timestamp }",
    "api_endpoints": "POST /api/shipments — create new shipment\nGET /api/shipments/:id/track — live location\nPOST /api/routes/optimize — AI route optimization\nGET /api/alerts/active — active delay alerts\nPOST /api/forecast/demand — inventory demand forecast",
    "win_secret": "<b>Judge Trigger:</b> On demo day, show a live map with a truck icon moving. Hit 'Optimize Route' and watch the stops reorder. Then manually trigger a delay and show the AI alert fire in real-time. Judges remember visuals — a moving map is unforgettable.",
    "industry": "Logistics"
  },
  "team_result": {
    "project_summary": {
      "name": "LogiTrack AI",
      "complexity": "High",
      "core_stack": ["React", "Node.js + WebSocket", "Supabase", "Gemini API", "Leaflet.js"]
    },
    "roles": [
      {
        "title": "Backend + Real-time Engineer",
        "type": "Engineering",
        "priority": "Critical",
        "description": "Builds the shipment tracking API, WebSocket server, and Supabase schema.",
        "primary_skills": ["Node.js", "WebSocket", "Supabase", "PostgreSQL"],
        "responsibilities": ["Real-time location API", "DB schema + migrations", "Alert pipeline"]
      },
      {
        "title": "AI / Route Optimization Engineer",
        "type": "Engineering",
        "priority": "Critical",
        "description": "Integrates Gemini API for route optimization and anomaly detection.",
        "primary_skills": ["Gemini API", "Prompt Engineering", "Algorithm design"],
        "responsibilities": ["Route optimizer prompt chain", "Anomaly detection logic", "Demand forecast model"]
      },
      {
        "title": "Frontend Map Developer",
        "type": "Engineering",
        "priority": "High",
        "description": "Builds the interactive Leaflet map dashboard with live tracking.",
        "primary_skills": ["React", "Leaflet.js", "WebSocket client", "Tailwind CSS"],
        "responsibilities": ["Live map component", "Dashboard KPIs", "Alert notification UI"]
      },
      {
        "title": "DevOps + Demo Lead",
        "type": "Engineering",
        "priority": "Medium",
        "description": "Handles deployment, seeds demo data, and runs the pitch demo.",
        "primary_skills": ["Railway/Render deploy", "Supabase seed scripts", "Presentation"],
        "responsibilities": ["Production deploy", "Demo data setup", "Live demo rehearsal"]
      }
    ],
    "skills_map": [
      { "domain": "Backend", "required_skills": [{ "name": "Node.js", "level": "Expert" }, { "name": "WebSocket", "level": "High" }] },
      { "domain": "AI Integration", "required_skills": [{ "name": "Gemini API", "level": "Expert" }, { "name": "Prompt Engineering", "level": "High" }] },
      { "domain": "Frontend / Maps", "required_skills": [{ "name": "React", "level": "Expert" }, { "name": "Leaflet.js", "level": "High" }] }
    ],
    "task_timeline": [
      { "phase": "0-4h: Foundation", "tasks": ["Supabase schema", "Auth setup", "Basic shipment CRUD"], "roles_involved": ["Backend + Real-time Engineer"] },
      { "phase": "4-12h: Core Build", "tasks": ["WebSocket location updates", "Leaflet map", "Route optimizer prompt"], "roles_involved": ["Backend + Real-time Engineer", "Frontend Map Developer", "AI / Route Optimization Engineer"] },
      { "phase": "12-20h: AI + Alerts", "tasks": ["Anomaly detection", "Demand forecast", "Alert notification UI"], "roles_involved": ["AI / Route Optimization Engineer", "Frontend Map Developer"] },
      { "phase": "20-24h: Polish + Demo", "tasks": ["Seed demo data", "UI polish", "Live demo rehearsal"], "roles_involved": ["DevOps + Demo Lead", "Frontend Map Developer"] }
    ],
    "collaboration": {
      "communication": "Discord + 30-min standups every 4 hours",
      "version_control": "Git feature branches — map, backend, ai-routes",
      "decision_making": "One owner per service area; sync on API contracts first hour"
    },
    "solo_strategy": {
      "is_solo": false,
      "warning": null,
      "ai_multipliers": ["Cursor AI for WebSocket boilerplate", "Gemini for route optimization logic", "Supabase for real-time subscriptions (zero backend code)", "v0.dev for dashboard UI shell"],
      "mvp_scope": ["Static map with 3 hardcoded shipment pins", "One working AI route optimizer call", "Clean dashboard with mock KPIs"]
    }
  }
},

/* ─────────────────────────────────────────────
   2. PROPTECH / REAL ESTATE
   ───────────────────────────────────────────── */
{
  "keywords": [
    "proptech", "real estate", "property", "rent", "housing",
    "apartment", "landlord", "tenant", "mortgage", "listing",
    "home buying", "property management", "lease", "valuation"
  ],
  "result": {
    "overview": "<h3>🏠 AI-Powered Property Intelligence</h3><p>Build the property search that actually understands you. Instead of checkbox filters, users describe their ideal home in natural language and AI surfaces the best matches with instant price forecasts and neighbourhood scores.</p>",
    "techstack": "<h4>Frontend:</h4> Next.js 14 + Tailwind CSS.<br><h4>Backend:</h4> Node.js + Supabase with pgvector for semantic property search.<br><h4>AI:</h4> Gemini API for NL query parsing + property Q&A + valuation explanations.<br><h4>Maps:</h4> Mapbox GL JS (free tier) for neighbourhood visualisation.<br><h4>Data:</h4> Open property APIs (RapidAPI / Zillow / Zoopla depends on region).",
    "ai_strategy": "1. <b>Semantic Search:</b> Embed property descriptions with Gemini → store in pgvector → query with user's natural language description.<br>2. <b>Price Predictor:</b> Feed comparable sales + location features to Gemini → get instant valuation with reasoning.<br>3. <b>Neighbourhood AI:</b> Aggregate nearby school ratings, crime index, transit score → Gemini produces a human-readable neighbourhood report.",
    "mega_prompt": "Act as a Senior PropTech Engineer. Build an AI Property Search Platform using Next.js 14, Supabase (with pgvector), and Gemini API. Core features: (1) Natural language property search — user types 'quiet 2-bed near a park, under £1500/month' and AI returns ranked matches from the database, (2) Instant AI valuation: input address, Gemini returns estimated price with comparable sales reasoning, (3) Neighbourhood intelligence card: school rating, walkability, safety score, transit links. Use Mapbox for interactive property map. Seed with 50 fake listings to demo. Dark theme, mobile-first.",
    "database_schema": "Table properties { id uuid [pk] title varchar price int bedrooms int description text embedding vector(768) lat float lng float available_from date }\nTable valuations { id uuid [pk] address text estimated_price int comparables jsonb ai_reasoning text created_at timestamp }\nTable saved_searches { id uuid [pk] user_id uuid query_text text results_snapshot jsonb }",
    "api_endpoints": "POST /api/search/semantic — NL property search\nPOST /api/valuation — AI price estimate\nGET /api/neighbourhood/:lat/:lng — neighbourhood report\nGET /api/properties/:id — single listing detail\nPOST /api/saved-searches — save a search query",
    "win_secret": "<b>Demo Hook:</b> Type 'cosy flat near a tube station, pet-friendly, under £1200' — watch AI return 3 perfectly matched listings in 2 seconds. Then click one and show the AI valuation card with price reasoning. Judges will immediately see product-market fit.",
    "industry": "PropTech"
  },
  "team_result": {
    "project_summary": {
      "name": "HomeIQ AI",
      "complexity": "High",
      "core_stack": ["Next.js 14", "Supabase + pgvector", "Gemini API", "Mapbox GL JS"]
    },
    "roles": [
      {
        "title": "Full-Stack Lead",
        "type": "Engineering",
        "priority": "Critical",
        "description": "Builds Next.js frontend, Supabase schema with pgvector, and REST API layer.",
        "primary_skills": ["Next.js 14", "Supabase", "pgvector", "REST API"],
        "responsibilities": ["DB schema + embeddings setup", "API routes", "Auth flow"]
      },
      {
        "title": "AI Search Engineer",
        "type": "Engineering",
        "priority": "Critical",
        "description": "Builds semantic search pipeline and valuation AI using Gemini.",
        "primary_skills": ["Gemini API", "Vector embeddings", "Prompt Engineering"],
        "responsibilities": ["Embedding pipeline", "Semantic search logic", "Valuation prompt chain"]
      },
      {
        "title": "Frontend + Map Developer",
        "type": "Engineering",
        "priority": "High",
        "description": "Implements Mapbox property map, listing cards, and neighbourhood UI.",
        "primary_skills": ["React", "Mapbox GL JS", "Tailwind CSS", "Framer Motion"],
        "responsibilities": ["Property map", "Listing UI", "Neighbourhood card component"]
      }
    ],
    "skills_map": [
      { "domain": "Backend", "required_skills": [{ "name": "Supabase", "level": "Expert" }, { "name": "pgvector", "level": "High" }] },
      { "domain": "AI", "required_skills": [{ "name": "Gemini API", "level": "Expert" }, { "name": "Vector Search", "level": "High" }] },
      { "domain": "Frontend", "required_skills": [{ "name": "Next.js 14", "level": "Expert" }, { "name": "Mapbox GL JS", "level": "Intermediate" }] }
    ],
    "task_timeline": [
      { "phase": "0-4h: Foundation", "tasks": ["Supabase + pgvector setup", "50 seed listings", "Next.js scaffold"], "roles_involved": ["Full-Stack Lead"] },
      { "phase": "4-12h: Core Build", "tasks": ["Embedding pipeline", "Semantic search API", "Property listing UI"], "roles_involved": ["AI Search Engineer", "Full-Stack Lead", "Frontend + Map Developer"] },
      { "phase": "12-20h: AI + Map", "tasks": ["Valuation prompt chain", "Neighbourhood report", "Mapbox integration"], "roles_involved": ["AI Search Engineer", "Frontend + Map Developer"] },
      { "phase": "20-24h: Polish", "tasks": ["UI polish", "Demo data", "Pitch rehearsal"], "roles_involved": ["Frontend + Map Developer", "Full-Stack Lead"] }
    ],
    "collaboration": { "communication": "Discord standups every 4h", "version_control": "Git branches: frontend, ai-search, infra", "decision_making": "API contract defined in hour 1 — each person owns their layer" },
    "solo_strategy": { "is_solo": false, "warning": null, "ai_multipliers": ["Supabase pgvector for semantic search (no ML infra needed)", "Gemini for valuation + NL parsing", "v0.dev for listing card UI", "Mapbox free tier for maps"], "mvp_scope": ["Semantic search over 10 seeded listings", "One AI valuation flow", "Static Mapbox map with pins"] }
  }
},

/* ─────────────────────────────────────────────
   3. CYBERSECURITY / SECURITY TOOLS
   ───────────────────────────────────────────── */
{
  "keywords": [
    "cybersecurity", "security", "phishing", "threat", "vulnerability",
    "breach", "malware", "intrusion", "firewall", "penetration testing",
    "pentest", "soc", "siem", "zero trust", "attack", "exploit"
  ],
  "result": {
    "overview": "<h3>🛡️ AI Security Operations Assistant</h3><p>Build an AI-powered Security Operations Centre (SOC) tool that helps small teams detect and respond to threats at enterprise speed. The winning demo: paste a suspicious email/log → AI instantly classifies the threat, explains the attack vector, and suggests remediation steps.</p>",
    "techstack": "<h4>Frontend:</h4> React + Tailwind CSS (dark terminal aesthetic).<br><h4>Backend:</h4> Node.js + Express.<br><h4>AI:</h4> Gemini API for threat analysis + phishing detection.<br><h4>Database:</h4> Supabase for incident logging.<br><h4>Extras:</h4> VirusTotal API (free) for file hash checking, Shodan API for asset exposure scanning.",
    "ai_strategy": "1. <b>Phishing Detector:</b> User pastes email text → Gemini analyses headers, tone, links, urgency signals → returns threat score + reasoning.<br>2. <b>Log Analyser:</b> Paste server/firewall logs → Gemini identifies anomalous patterns, suspicious IPs, potential attack chains.<br>3. <b>Remediation AI:</b> Given a CVE number or attack type → Gemini returns step-by-step remediation playbook tailored to the user's stack.",
    "mega_prompt": "Act as a Senior Cybersecurity Engineer. Build an AI Security Operations Tool using React, Node.js, Supabase, and Gemini API. Features: (1) Phishing email analyser — paste raw email, AI returns threat score (0-10), attack type, indicators of compromise, and recommended action; (2) Log anomaly detector — paste server/firewall logs, AI highlights suspicious patterns and potential attack chains; (3) CVE Remediation assistant — input a CVE ID or describe a vulnerability, AI outputs a remediation playbook. Terminal-style dark UI with red/amber/green severity indicators. Incident log saved to Supabase.",
    "database_schema": "Table incidents { id uuid [pk] type varchar severity varchar raw_input text ai_analysis text status varchar created_at timestamp }\nTable threat_intel { id uuid [pk] indicator varchar indicator_type varchar threat_level varchar source varchar }\nTable playbooks { id uuid [pk] attack_type varchar steps jsonb created_at timestamp }",
    "api_endpoints": "POST /api/analyse/phishing — email threat analysis\nPOST /api/analyse/logs — log anomaly detection\nPOST /api/remediation/playbook — generate remediation steps\nGET /api/incidents — incident log\nPOST /api/threat-intel/lookup — IOC lookup",
    "win_secret": "<b>Shock Demo:</b> Paste a well-known phishing email template (e.g. 'Your Amazon account is suspended'). Show AI instantly returning threat score 9/10 with exact reasons: urgent language, spoofed sender domain, suspicious link. Then paste a benign email — AI returns 1/10. Judges love seeing AI catch real attacks.",
    "industry": "CyberSecurity"
  },
  "team_result": {
    "project_summary": {
      "name": "ShieldAI SOC",
      "complexity": "High",
      "core_stack": ["React", "Node.js", "Supabase", "Gemini API", "VirusTotal API"]
    },
    "roles": [
      {
        "title": "Security AI Engineer",
        "type": "Engineering",
        "priority": "Critical",
        "description": "Designs and implements all Gemini-powered threat analysis prompts.",
        "primary_skills": ["Gemini API", "Prompt Engineering", "Cybersecurity fundamentals"],
        "responsibilities": ["Phishing detection prompt", "Log analysis chain", "Remediation playbook generation"]
      },
      {
        "title": "Full-Stack Engineer",
        "type": "Engineering",
        "priority": "Critical",
        "description": "Builds backend API, Supabase incident log, and VirusTotal integration.",
        "primary_skills": ["Node.js", "Supabase", "VirusTotal API", "REST APIs"],
        "responsibilities": ["API endpoints", "Incident database", "External API integrations"]
      },
      {
        "title": "Frontend / UX Engineer",
        "type": "Engineering",
        "priority": "High",
        "description": "Builds the terminal-style SOC dashboard with severity indicators.",
        "primary_skills": ["React", "Tailwind CSS", "Data visualisation"],
        "responsibilities": ["Threat analysis UI", "Incident log dashboard", "Severity indicator components"]
      }
    ],
    "skills_map": [
      { "domain": "AI Security", "required_skills": [{ "name": "Gemini API", "level": "Expert" }, { "name": "Security Knowledge", "level": "High" }] },
      { "domain": "Backend", "required_skills": [{ "name": "Node.js", "level": "Expert" }, { "name": "Supabase", "level": "High" }] },
      { "domain": "Frontend", "required_skills": [{ "name": "React", "level": "Expert" }, { "name": "Tailwind CSS", "level": "High" }] }
    ],
    "task_timeline": [
      { "phase": "0-4h: Foundation", "tasks": ["Supabase schema", "API scaffold", "React shell with dark terminal UI"], "roles_involved": ["Full-Stack Engineer", "Frontend / UX Engineer"] },
      { "phase": "4-12h: Core AI", "tasks": ["Phishing detection prompt", "Log analyser prompt", "API endpoints"], "roles_involved": ["Security AI Engineer", "Full-Stack Engineer"] },
      { "phase": "12-20h: Features", "tasks": ["Remediation playbook", "VirusTotal integration", "Incident log UI"], "roles_involved": ["Security AI Engineer", "Full-Stack Engineer", "Frontend / UX Engineer"] },
      { "phase": "20-24h: Demo Prep", "tasks": ["Prepare 3 demo attack scenarios", "UI polish", "Severity badges"], "roles_involved": ["Frontend / UX Engineer", "Security AI Engineer"] }
    ],
    "collaboration": { "communication": "Discord + async updates", "version_control": "Git branches: ai-engine, backend-api, frontend", "decision_making": "Security AI engineer owns prompt design; full-stack owns data layer" },
    "solo_strategy": { "is_solo": false, "warning": null, "ai_multipliers": ["Gemini for all threat analysis — no ML training needed", "Supabase for instant incident log backend", "v0.dev for terminal-style dark UI components", "Pre-built phishing email datasets for demo seeding"], "mvp_scope": ["Working phishing email analyser with threat score", "Incident log saving to Supabase", "Clean dark terminal UI"] }
  }
},

/* ─────────────────────────────────────────────
   4. SMART CITY / IoT
   ───────────────────────────────────────────── */
{
  "keywords": [
    "smart city", "iot", "internet of things", "sensor", "smart home",
    "urban", "infrastructure", "traffic", "pollution", "waste management",
    "smart grid", "energy monitoring", "connected devices", "embedded"
  ],
  "result": {
    "overview": "<h3>🏙️ Smart City Intelligence Dashboard</h3><p>Build a unified city operations dashboard that ingests real-time sensor data (simulated for the hackathon), detects anomalies with AI, and lets city managers respond faster. One AI insight: 'Block 5 air quality sensor is 40% above safe limit — correlates with 3pm traffic peak'.</p>",
    "techstack": "<h4>Frontend:</h4> React + Recharts + Leaflet.js (sensor map).<br><h4>Backend:</h4> Node.js + Express + WebSocket (simulated sensor stream).<br><h4>Database:</h4> Supabase with realtime subscriptions.<br><h4>AI:</h4> Gemini API for anomaly detection + citizen chatbot.<br><h4>Simulation:</h4> Node cron job emitting fake sensor readings every 5 seconds.",
    "ai_strategy": "1. <b>Anomaly Detector:</b> Stream sensor readings → Gemini compares to baseline → fires alert when outlier detected.<br>2. <b>Root Cause AI:</b> Given an anomaly → Gemini cross-references time, location, other sensors → suggests probable cause.<br>3. <b>Citizen Chatbot:</b> Residents ask questions ('Is it safe to jog in Central Park today?') → AI answers using live sensor data.",
    "mega_prompt": "Act as a Smart City Platform Architect. Build a City Intelligence Dashboard using React, Node.js, Supabase, and Gemini API. Features: (1) Real-time sensor dashboard — 6 sensor types (air quality, traffic density, noise, waste bin fill level, street light status, water pressure) displayed on a city map and live charts; (2) AI anomaly detector — when any sensor reading exceeds threshold, Gemini analyses the pattern and generates a human-readable alert card with probable cause; (3) Citizen Q&A chatbot — residents ask about city conditions and AI answers using the latest sensor readings. Use WebSocket for live updates, Recharts for time-series graphs. Simulate sensors with a Node.js cron job.",
    "database_schema": "Table sensors { id uuid [pk] name varchar type varchar lat float lng float zone varchar }\nTable readings { id uuid [pk] sensor_id uuid value float unit varchar timestamp timestamp }\nTable alerts { id uuid [pk] sensor_id uuid severity varchar message text root_cause text resolved_at timestamp }\nTable citizen_queries { id uuid [pk] question text ai_response text created_at timestamp }",
    "api_endpoints": "GET /api/sensors/live — current readings for all sensors\nPOST /api/alerts/analyse — trigger AI anomaly analysis\nGET /api/alerts/active — active city alerts\nPOST /api/citizen/query — citizen chatbot Q&A\nGET /api/analytics/trends — 24h trend data per sensor type",
    "win_secret": "<b>Visual Impact:</b> Show a live city map with colour-coded sensor pins (green/amber/red). Then simulate an air quality spike — watch the pin turn red, an alert card appear with AI root cause analysis. Then type a citizen question: 'Can I go running near the park?' and show the AI answering with the current AQI reading. Zero judges will forget this demo.",
    "industry": "SmartCity / IoT"
  },
  "team_result": {
    "project_summary": {
      "name": "CityMind AI",
      "complexity": "High",
      "core_stack": ["React", "Node.js + WebSocket", "Supabase", "Gemini API", "Leaflet.js + Recharts"]
    },
    "roles": [
      {
        "title": "IoT Backend Engineer",
        "type": "Engineering",
        "priority": "Critical",
        "description": "Builds the sensor simulation, WebSocket server, and Supabase data pipeline.",
        "primary_skills": ["Node.js", "WebSocket", "Supabase", "Cron jobs"],
        "responsibilities": ["Sensor simulator", "Real-time data pipeline", "Alert triggering logic"]
      },
      {
        "title": "AI Analytics Engineer",
        "type": "Engineering",
        "priority": "Critical",
        "description": "Designs Gemini prompts for anomaly detection, root cause analysis, and citizen chatbot.",
        "primary_skills": ["Gemini API", "Prompt Engineering", "Data analysis"],
        "responsibilities": ["Anomaly detection chain", "Root cause AI prompts", "Citizen Q&A chatbot"]
      },
      {
        "title": "Dashboard Frontend Engineer",
        "type": "Engineering",
        "priority": "High",
        "description": "Builds the live city map, time-series charts, and alert notification system.",
        "primary_skills": ["React", "Leaflet.js", "Recharts", "WebSocket client"],
        "responsibilities": ["City map with sensor pins", "Live chart components", "Alert card UI"]
      }
    ],
    "skills_map": [
      { "domain": "IoT / Backend", "required_skills": [{ "name": "Node.js", "level": "Expert" }, { "name": "WebSocket", "level": "High" }, { "name": "Supabase Realtime", "level": "High" }] },
      { "domain": "AI Analytics", "required_skills": [{ "name": "Gemini API", "level": "Expert" }, { "name": "Prompt Engineering", "level": "High" }] },
      { "domain": "Visualisation", "required_skills": [{ "name": "React", "level": "Expert" }, { "name": "Recharts", "level": "High" }, { "name": "Leaflet.js", "level": "Intermediate" }] }
    ],
    "task_timeline": [
      { "phase": "0-4h: Foundation", "tasks": ["Supabase sensor schema", "Node sensor simulator (cron)", "React shell"], "roles_involved": ["IoT Backend Engineer"] },
      { "phase": "4-12h: Live Data", "tasks": ["WebSocket stream to frontend", "Live charts", "City map with pins"], "roles_involved": ["IoT Backend Engineer", "Dashboard Frontend Engineer"] },
      { "phase": "12-20h: AI Layer", "tasks": ["Anomaly detection prompt", "Alert cards", "Citizen chatbot"], "roles_involved": ["AI Analytics Engineer", "Dashboard Frontend Engineer"] },
      { "phase": "20-24h: Demo", "tasks": ["Simulate crisis scenario", "UI colour-coding", "Pitch rehearsal"], "roles_involved": ["Dashboard Frontend Engineer", "AI Analytics Engineer"] }
    ],
    "collaboration": { "communication": "Discord + sync every 4h on sensor data format", "version_control": "Git branches: iot-backend, ai-engine, dashboard", "decision_making": "Define sensor data schema in hour 1 — everyone depends on it" },
    "solo_strategy": { "is_solo": false, "warning": null, "ai_multipliers": ["Supabase Realtime for live sensor subscriptions (no WebSocket code needed)", "Gemini for all AI analysis", "Recharts for charts (zero D3 knowledge needed)", "Leaflet.js for free interactive map"], "mvp_scope": ["3 sensor types on a map", "One working anomaly alert with AI explanation", "Citizen chatbot with one demo question"] }
  }
},

/* ─────────────────────────────────────────────
   5. HR TECH / RECRUITMENT
   ───────────────────────────────────────────── */
{
  "keywords": [
    "hr", "human resources", "recruitment", "hiring", "talent",
    "resume", "cv", "job matching", "employee", "onboarding",
    "workforce", "applicant tracking", "payroll", "performance review"
  ],
  "result": {
    "overview": "<h3>👥 AI Talent Intelligence Platform</h3><p>Build the recruitment tool that ends the 200-resume nightmare. AI screens candidates in seconds, ranks them against the job description, and generates tailored interview question packs — letting hiring managers focus on humans, not spreadsheets.</p>",
    "techstack": "<h4>Frontend:</h4> Next.js 14 + Tailwind CSS.<br><h4>Backend:</h4> Node.js + Supabase.<br><h4>AI:</h4> Gemini API for CV parsing, candidate scoring, and interview question generation.<br><h4>File handling:</h4> PDF.js for CV parsing, Supabase Storage for file uploads.<br><h4>Extras:</h4> Resend API (free) for automated candidate status emails.",
    "ai_strategy": "1. <b>CV Screener:</b> Upload a PDF CV → Gemini extracts skills, experience, education → scores against the job description (0-100) with reasoning.<br>2. <b>Interview Generator:</b> For each shortlisted candidate → Gemini generates 5 personalised interview questions based on gaps and strengths in their CV.<br>3. <b>Culture Fit Analyser:</b> Compare candidate responses to a values questionnaire → Gemini generates a culture-fit summary.",
    "mega_prompt": "Act as a Senior HRTech Engineer. Build an AI Recruitment Platform using Next.js 14, Supabase, and Gemini API. Features: (1) Job posting creator — HR inputs job title, Gemini suggests full JD with requirements and responsibilities; (2) AI CV screener — upload multiple PDFs, Gemini scores each against the JD (0-100) with a written summary of strengths/gaps; (3) Ranked candidate dashboard — sortable table of candidates with scores, tags, and one-click interview question generator; (4) Automated email — when candidate is shortlisted, send templated email via Resend API. Clean professional UI, mobile responsive.",
    "database_schema": "Table jobs { id uuid [pk] title varchar description text requirements jsonb status varchar }\nTable candidates { id uuid [pk] job_id uuid name varchar email varchar cv_url text ai_score int ai_summary text status varchar }\nTable interviews { id uuid [pk] candidate_id uuid questions jsonb scheduled_at timestamp notes text }\nTable emails_sent { id uuid [pk] candidate_id uuid template varchar sent_at timestamp }",
    "api_endpoints": "POST /api/jobs — create job posting\nPOST /api/jobs/:id/generate-jd — AI job description generation\nPOST /api/candidates/screen — CV upload + AI screening\nGET /api/candidates?job_id=X — ranked candidate list\nPOST /api/interview/questions — generate interview questions\nPOST /api/emails/shortlist — send shortlist email",
    "win_secret": "<b>Live Demo Script:</b> (1) Create a 'Software Engineer' job in 10 seconds using AI JD generator. (2) Upload 3 PDFs (prepared beforehand). (3) Watch the ranked list appear: Alex 89/100, Sam 72/100, Jordan 44/100. (4) Click 'Generate Interview Questions' for the top candidate — 5 tailored questions appear instantly. Judges will immediately think 'this saves us 10 hours'.",
    "industry": "HRTech"
  },
  "team_result": {
    "project_summary": {
      "name": "TalentIQ AI",
      "complexity": "High",
      "core_stack": ["Next.js 14", "Supabase", "Gemini API", "PDF.js", "Resend API"]
    },
    "roles": [
      {
        "title": "AI HR Engineer",
        "type": "Engineering",
        "priority": "Critical",
        "description": "Builds CV parsing pipeline and all Gemini-powered screening + question generation.",
        "primary_skills": ["Gemini API", "PDF.js", "Prompt Engineering"],
        "responsibilities": ["CV extraction prompt", "Scoring chain", "Interview question generator"]
      },
      {
        "title": "Full-Stack Engineer",
        "type": "Engineering",
        "priority": "Critical",
        "description": "Builds Next.js frontend, Supabase schema, file upload, and email integration.",
        "primary_skills": ["Next.js 14", "Supabase", "Supabase Storage", "Resend API"],
        "responsibilities": ["DB schema", "File upload flow", "API routes", "Email automation"]
      },
      {
        "title": "UI / Product Designer",
        "type": "Design",
        "priority": "High",
        "description": "Designs the candidate dashboard, job posting UI, and scoring visualisation.",
        "primary_skills": ["Figma", "Tailwind CSS", "Data tables"],
        "responsibilities": ["Candidate table with sort/filter", "Score visualisation", "Job creation form"]
      }
    ],
    "skills_map": [
      { "domain": "AI Processing", "required_skills": [{ "name": "Gemini API", "level": "Expert" }, { "name": "PDF parsing", "level": "High" }] },
      { "domain": "Backend", "required_skills": [{ "name": "Supabase", "level": "Expert" }, { "name": "Next.js API routes", "level": "High" }] },
      { "domain": "Frontend / Design", "required_skills": [{ "name": "Next.js 14", "level": "Expert" }, { "name": "Tailwind CSS", "level": "High" }] }
    ],
    "task_timeline": [
      { "phase": "0-4h: Foundation", "tasks": ["Supabase schema", "File upload to Supabase Storage", "Next.js scaffold"], "roles_involved": ["Full-Stack Engineer"] },
      { "phase": "4-12h: AI Core", "tasks": ["CV parsing prompt", "Scoring chain", "JD generator"], "roles_involved": ["AI HR Engineer", "Full-Stack Engineer"] },
      { "phase": "12-20h: Dashboard", "tasks": ["Ranked candidate table", "Interview Q generator UI", "Email automation"], "roles_involved": ["UI / Product Designer", "Full-Stack Engineer", "AI HR Engineer"] },
      { "phase": "20-24h: Demo Prep", "tasks": ["Prepare 3 demo CVs", "UI polish", "Scoring visualisation"], "roles_involved": ["UI / Product Designer", "Full-Stack Engineer"] }
    ],
    "collaboration": { "communication": "Discord + daily syncs", "version_control": "Git branches: ai-pipeline, backend, ui", "decision_making": "API schema locked in hour 1; AI engineer unblocked to start prompts in parallel" },
    "solo_strategy": { "is_solo": false, "warning": null, "ai_multipliers": ["Gemini for CV parsing + scoring (no ML needed)", "Supabase Storage for CV file management", "PDF.js for in-browser PDF extraction", "Resend free tier for email automation"], "mvp_scope": ["CV upload + AI score for one job", "Ranked candidate list", "Interview question generator for top candidate"] }
  }
},

/* ═══════════════════════════════════════════════════════════════
   SKELETON ENTRIES — EXPAND WITH ChatGPT / GEMINI

   Prompt to use:
   "Fill this hackathon KB entry for [DOMAIN]. Use the same JSON structure.
    Make keywords specific (no generic words). Make mega_prompt a direct build
    instruction for Cursor AI. Keep overview/techstack as HTML strings."
   ═══════════════════════════════════════════════════════════════ */

/* SKELETON: E-COMMERCE / MARKETPLACE */
{
  "keywords": [
    "ecommerce", "marketplace", "shop", "store", "product listing",
    "cart", "checkout", "seller", "buyer", "dropshipping",
    "retail", "product recommendation", "wishlist"
  ],
  "result": {
    "overview": "<h3>🛒 TODO: AI E-Commerce Platform</h3><p>Fill this with ChatGPT: 'Write a hackathon overview for an AI-powered e-commerce/marketplace platform. Include the winning angle, core differentiator, and demo hook. Format as HTML with h3 and p tags.'</p>",
    "techstack": "<h4>TODO:</h4> Fill with ChatGPT: 'Suggest a modern tech stack for an AI e-commerce hackathon project using React/Next.js, Supabase, and Gemini API. Include frontend, backend, database, and AI. Format as HTML.'",
    "ai_strategy": "TODO: Fill with ChatGPT: 'Give 3 AI use cases for an e-commerce platform (product recommendation, review summarisation, dynamic pricing). Format as: 1. Name: description.'",
    "mega_prompt": "TODO: Fill with ChatGPT: 'Write a Cursor AI mega-prompt for building an AI e-commerce platform with: product recommendation engine, AI review summariser, dynamic pricing assistant. Include tech stack, features, and styling instructions.'",
    "database_schema": "TODO: Fill with ChatGPT: 'Write a database schema for an e-commerce platform with tables for products, users, orders, reviews, and AI recommendations.'",
    "api_endpoints": "TODO: Fill with ChatGPT: 'List 6 REST API endpoints for an AI e-commerce platform.'",
    "win_secret": "<b>TODO:</b> Fill with ChatGPT: 'Give me the best hackathon demo script for an AI e-commerce platform that will impress judges in 60 seconds.'",
    "industry": "E-Commerce"
  },
  "team_result": {
    "project_summary": { "name": "ShopIQ AI", "complexity": "High", "core_stack": ["Next.js 14", "Supabase", "Gemini API", "Stripe"] },
    "roles": [
      { "title": "TODO: Fill Role 1", "type": "Engineering", "priority": "Critical", "description": "TODO", "primary_skills": ["TODO"], "responsibilities": ["TODO"] },
      { "title": "TODO: Fill Role 2", "type": "Engineering", "priority": "Critical", "description": "TODO", "primary_skills": ["TODO"], "responsibilities": ["TODO"] },
      { "title": "TODO: Fill Role 3", "type": "Design", "priority": "High", "description": "TODO", "primary_skills": ["TODO"], "responsibilities": ["TODO"] }
    ],
    "skills_map": [
      { "domain": "TODO Domain 1", "required_skills": [{ "name": "TODO Skill", "level": "Expert" }] }
    ],
    "task_timeline": [
      { "phase": "0-4h: Foundation", "tasks": ["TODO"], "roles_involved": ["TODO"] },
      { "phase": "4-12h: Core Build", "tasks": ["TODO"], "roles_involved": ["TODO"] },
      { "phase": "12-20h: AI + Polish", "tasks": ["TODO"], "roles_involved": ["TODO"] },
      { "phase": "20-24h: Demo Prep", "tasks": ["TODO"], "roles_involved": ["TODO"] }
    ],
    "collaboration": { "communication": "TODO", "version_control": "TODO", "decision_making": "TODO" },
    "solo_strategy": { "is_solo": false, "warning": null, "ai_multipliers": ["TODO"], "mvp_scope": ["TODO"] }
  }
},

/* SKELETON: GREEN TECH / SUSTAINABILITY */
{
  "keywords": [
    "green tech", "sustainability", "carbon", "carbon footprint", "climate",
    "renewable energy", "solar", "wind", "recycling", "eco", "environment",
    "net zero", "emissions", "clean energy", "carbon offset"
  ],
  "result": {
    "overview": "<h3>🌱 TODO: GreenTech AI Platform</h3><p>TODO: Fill with ChatGPT</p>",
    "techstack": "<h4>TODO:</h4> Frontend, Backend, AI stack for sustainability app.",
    "ai_strategy": "TODO: 3 AI use cases for sustainability (carbon tracker, eco-score, green alternatives recommender).",
    "mega_prompt": "TODO: Cursor AI mega-prompt for green tech platform.",
    "database_schema": "TODO: Schema for carbon_logs, users, eco_products, offset_certificates.",
    "api_endpoints": "TODO: 5 endpoints for carbon tracking + AI recommendations.",
    "win_secret": "<b>TODO:</b> Demo hook for green tech judges.",
    "industry": "GreenTech"
  },
  "team_result": {
    "project_summary": { "name": "EcoIQ AI", "complexity": "Medium", "core_stack": ["React", "Node.js", "Supabase", "Carbon Interface API", "Gemini API"] },
    "roles": [
      { "title": "TODO: Role 1", "type": "Engineering", "priority": "Critical", "description": "TODO", "primary_skills": ["TODO"], "responsibilities": ["TODO"] },
      { "title": "TODO: Role 2", "type": "Engineering", "priority": "High", "description": "TODO", "primary_skills": ["TODO"], "responsibilities": ["TODO"] }
    ],
    "skills_map": [{ "domain": "TODO", "required_skills": [{ "name": "TODO", "level": "Expert" }] }],
    "task_timeline": [
      { "phase": "0-4h: Foundation", "tasks": ["TODO"], "roles_involved": ["TODO"] },
      { "phase": "4-24h: Build", "tasks": ["TODO"], "roles_involved": ["TODO"] }
    ],
    "collaboration": { "communication": "TODO", "version_control": "TODO", "decision_making": "TODO" },
    "solo_strategy": { "is_solo": false, "warning": null, "ai_multipliers": ["TODO"], "mvp_scope": ["TODO"] }
  }
},

/* SKELETON: AGRITECH / SMART FARMING */
{
  "keywords": [
    "agriculture", "agritech", "farming", "crop", "soil", "irrigation",
    "smart farming", "precision agriculture", "harvest", "livestock",
    "pest detection", "drone farming", "yield prediction", "farmer"
  ],
  "result": {
    "overview": "<h3>🌾 TODO: AgriTech AI Platform</h3><p>TODO: Fill with ChatGPT</p>",
    "techstack": "<h4>TODO:</h4> Stack for smart farming app with AI crop advisory.",
    "ai_strategy": "TODO: 3 AI use cases (crop disease detection via camera, weather-based irrigation, yield prediction).",
    "mega_prompt": "TODO: Cursor AI mega-prompt for smart farming dashboard.",
    "database_schema": "TODO: Schema for farms, crops, sensor_readings, ai_advisories.",
    "api_endpoints": "TODO: 5 endpoints for crop management + AI advisory.",
    "win_secret": "<b>TODO:</b> Demo hook for agritech judges.",
    "industry": "AgriTech"
  },
  "team_result": {
    "project_summary": { "name": "FarmIQ AI", "complexity": "High", "core_stack": ["React", "Node.js", "Supabase", "Gemini Vision API"] },
    "roles": [
      { "title": "TODO: Role 1", "type": "Engineering", "priority": "Critical", "description": "TODO", "primary_skills": ["TODO"], "responsibilities": ["TODO"] },
      { "title": "TODO: Role 2", "type": "Engineering", "priority": "High", "description": "TODO", "primary_skills": ["TODO"], "responsibilities": ["TODO"] }
    ],
    "skills_map": [{ "domain": "TODO", "required_skills": [{ "name": "TODO", "level": "Expert" }] }],
    "task_timeline": [
      { "phase": "0-4h: Foundation", "tasks": ["TODO"], "roles_involved": ["TODO"] },
      { "phase": "4-24h: Build", "tasks": ["TODO"], "roles_involved": ["TODO"] }
    ],
    "collaboration": { "communication": "TODO", "version_control": "TODO", "decision_making": "TODO" },
    "solo_strategy": { "is_solo": false, "warning": null, "ai_multipliers": ["TODO"], "mvp_scope": ["TODO"] }
  }
},

/* SKELETON: DEVTOOLS */
{
  "keywords": [
    "devtools", "developer tools", "code review", "ci cd", "deployment",
    "github", "debugging", "code generation", "api testing", "documentation",
    "developer productivity", "ide", "linting", "testing automation"
  ],
  "result": {
    "overview": "<h3>⚙️ TODO: AI Developer Tools</h3><p>TODO: Fill with ChatGPT</p>",
    "techstack": "<h4>TODO:</h4> Stack for AI devtools (GitHub API, Gemini for code review).",
    "ai_strategy": "TODO: 3 AI use cases (code review bot, auto-doc generator, PR summariser).",
    "mega_prompt": "TODO: Cursor AI mega-prompt for AI developer tools platform.",
    "database_schema": "TODO: Schema for repos, pull_requests, code_reviews, docs.",
    "api_endpoints": "TODO: 5 endpoints for code review + documentation generation.",
    "win_secret": "<b>TODO:</b> Demo hook for devtools judges.",
    "industry": "DevTools"
  },
  "team_result": {
    "project_summary": { "name": "DevIQ AI", "complexity": "High", "core_stack": ["Next.js 14", "GitHub API", "Gemini API", "Supabase"] },
    "roles": [
      { "title": "TODO: Role 1", "type": "Engineering", "priority": "Critical", "description": "TODO", "primary_skills": ["TODO"], "responsibilities": ["TODO"] },
      { "title": "TODO: Role 2", "type": "Engineering", "priority": "High", "description": "TODO", "primary_skills": ["TODO"], "responsibilities": ["TODO"] }
    ],
    "skills_map": [{ "domain": "TODO", "required_skills": [{ "name": "TODO", "level": "Expert" }] }],
    "task_timeline": [
      { "phase": "0-4h: Foundation", "tasks": ["TODO"], "roles_involved": ["TODO"] },
      { "phase": "4-24h: Build", "tasks": ["TODO"], "roles_involved": ["TODO"] }
    ],
    "collaboration": { "communication": "TODO", "version_control": "TODO", "decision_making": "TODO" },
    "solo_strategy": { "is_solo": false, "warning": null, "ai_multipliers": ["TODO"], "mvp_scope": ["TODO"] }
  }
},

/* SKELETON: PRODUCTIVITY / TASK MANAGEMENT */
{
  "keywords": [
    "productivity", "task management", "project management", "todo",
    "workflow", "automation", "time tracking", "meeting notes",
    "team collaboration", "kanban", "sprint planning", "focus"
  ],
  "result": {
    "overview": "<h3>⚡ TODO: AI Productivity Platform</h3><p>TODO: Fill with ChatGPT</p>",
    "techstack": "<h4>TODO:</h4> Stack for AI productivity app (task prioritisation, meeting summaries).",
    "ai_strategy": "TODO: 3 AI use cases (task prioritiser, meeting note taker, workflow automation builder).",
    "mega_prompt": "TODO: Cursor AI mega-prompt for AI productivity/task management platform.",
    "database_schema": "TODO: Schema for tasks, projects, meetings, automations.",
    "api_endpoints": "TODO: 5 endpoints for task management + AI prioritisation.",
    "win_secret": "<b>TODO:</b> Demo hook for productivity tool judges.",
    "industry": "Productivity"
  },
  "team_result": {
    "project_summary": { "name": "FlowIQ AI", "complexity": "Medium", "core_stack": ["Next.js 14", "Supabase", "Gemini API", "Resend API"] },
    "roles": [
      { "title": "TODO: Role 1", "type": "Engineering", "priority": "Critical", "description": "TODO", "primary_skills": ["TODO"], "responsibilities": ["TODO"] },
      { "title": "TODO: Role 2", "type": "Engineering", "priority": "High", "description": "TODO", "primary_skills": ["TODO"], "responsibilities": ["TODO"] }
    ],
    "skills_map": [{ "domain": "TODO", "required_skills": [{ "name": "TODO", "level": "Expert" }] }],
    "task_timeline": [
      { "phase": "0-4h: Foundation", "tasks": ["TODO"], "roles_involved": ["TODO"] },
      { "phase": "4-24h: Build", "tasks": ["TODO"], "roles_involved": ["TODO"] }
    ],
    "collaboration": { "communication": "TODO", "version_control": "TODO", "decision_making": "TODO" },
    "solo_strategy": { "is_solo": false, "warning": null, "ai_multipliers": ["TODO"], "mvp_scope": ["TODO"] }
  }
}

];
