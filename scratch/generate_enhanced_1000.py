import json
import random

industries = [
    "FinTech", "HealthTech", "EdTech", "GreenTech", "SocialImpact",
    "CyberSecurity", "AITools", "DevTools", "Web3", "E-commerce",
    "Logistics", "SmartCity", "PropTech", "LegalTech", "HRTech",
    "AdTech", "Media", "Gaming", "SportsTech", "FoodTech",
    "FashionTech", "AgriTech", "SpaceTech", "BioTech", "DeepTech"
]

project_types = [
    "Dashboard", "Marketplace", "Assistant", "Tracker", "Optimizer",
    "Network", "Analyzer", "Generator", "Portal", "Platform",
    "Engine", "Hub", "Tool", "System", "Service",
    "App", "Bot", "Algorithm", "Manager", "Interface"
]

keywords_pool = {
    "FinTech": ["money", "bank", "payment", "loan", "invest", "trading", "crypto", "defi", "wallet", "budget"],
    "HealthTech": ["doctor", "patient", "hospital", "medical", "disease", "health", "symptom", "therapy", "mental", "fitness"],
    "EdTech": ["school", "learning", "student", "course", "tutor", "education", "quiz", "homework", "study", "language"],
    "GreenTech": ["earth", "climate", "eco", "carbon", "sustainable", "energy", "solar", "wind", "recycle", "waste"],
    "SocialImpact": ["community", "volunteer", "charity", "donate", "help", "accessibility", "inclusive", "diversity", "equality", "peace"],
    "CyberSecurity": ["security", "hack", "privacy", "encrypt", "firewall", "auth", "token", "shield", "protect", "leak"],
    "AITools": ["model", "llm", "chat", "image", "vision", "speech", "text", "generate", "predict", "analyze"],
    "DevTools": ["code", "debug", "deploy", "git", "api", "framework", "library", "sdk", "cli", "ide"],
    "Web3": ["blockchain", "nft", "dao", "contract", "dapp", "ether", "solana", "mining", "ledger", "mint"],
    "E-commerce": ["shop", "cart", "store", "buy", "sell", "product", "inventory", "shipping", "order", "retail"],
    "Logistics": ["delivery", "truck", "warehouse", "cargo", "route", "supply", "chain", "freight", "fleet", "parcel"],
    "SmartCity": ["urban", "traffic", "parking", "lighting", "transit", "public", "utility", "city", "planning", "sensor"],
    "PropTech": ["house", "rent", "property", "apartment", "broker", "real estate", "lease", "tenant", "listing", "home"],
    "LegalTech": ["law", "contract", "court", "judge", "attorney", "legal", "compliance", "notary", "brief", "case"],
    "HRTech": ["hiring", "resume", "employee", "payroll", "talent", "recruitment", "interview", "career", "job", "perk"],
    "AdTech": ["ads", "marketing", "campaign", "click", "brand", "conversion", "pixel", "targeting", "reach", "spend"],
    "Media": ["video", "audio", "movie", "news", "stream", "podcast", "content", "journalism", "broadcast", "viral"],
    "Gaming": ["game", "play", "multiplayer", "esports", "vr", "ar", "unity", "unreal", "steam", "metaverse"],
    "SportsTech": ["athlete", "coach", "stats", "score", "workout", "stadium", "fan", "training", "league", "rehab"],
    "FoodTech": ["recipe", "restaurant", "delivery", "kitchen", "nutrition", "chef", "calorie", "meal", "grocery", "order"],
    "FashionTech": ["clothing", "style", "wear", "closet", "try-on", "textile", "model", "runway", "designer", "brand"],
    "AgriTech": ["farm", "crop", "soil", "harvest", "plant", "irrigation", "pest", "yield", "agri", "tractor"],
    "SpaceTech": ["mars", "moon", "orbit", "satellite", "rocket", "star", "galaxy", "telescope", "nasa", "spacex"],
    "BioTech": ["dna", "gene", "protein", "cell", "lab", "pharma", "clinical", "molecular", "drug", "cure"],
    "DeepTech": ["quantum", "robotics", "fusion", "nano", "semiconductor", "photonics", "physics", "advanced", "compute", "nextgen"]
}

def generate_enhanced_entry(industry, type_name, id_val):
    title = f"{industry} {type_name} Pro-Grade v{id_val}"
    
    # Enhanced Tech Stack
    fe = random.choice(["Next.js 14 (App Router)", "React + Vite", "SvelteKit", "Nuxt.js 3"])
    be = random.choice(["Python FastAPI", "Node.js (TypeScript)", "Go (Fiber)", "Rust (Axum)"])
    db = random.choice(["PostgreSQL (Supabase)", "MongoDB Atlas", "Convex (Real-time)", "Turso (Edge SQLite)"])
    auth = random.choice(["Clerk", "Kinde", "Auth.js (NextAuth)", "Supabase Auth"])
    
    stack_desc = f"<h4>Frontend:</h4> {fe} with Tailwind CSS & Framer Motion.<br><h4>Backend:</h4> {be} for high-performance processing.<br><h4>Database:</h4> {db} for scalable data persistence.<br><h4>Auth:</h4> {auth} for rapid secure onboarding."
    
    # Enhanced AI Strategy
    ai_model = random.choice(["Gemini 2.0 Flash", "Claude 3.5 Sonnet", "GPT-4o", "DeepSeek-V3"])
    ai_strategy = f"1. <b>Model Selection:</b> Use {ai_model} for primary reasoning.<br>2. <b>Implementation:</b> Integrate a RAG (Retrieval-Augmented Generation) pipeline using Pinecone or Supabase Vector to provide domain-specific context.<br>3. <b>Streaming:</b> Implement Server-Sent Events (SSE) to stream AI responses directly to the UI for a 'live thinking' effect."
    
    # Mega Prompt
    mega_prompt = f"Act as a World-Class {industry} Engineer and Product Designer. Build a professional-grade {title} using {fe}, {be}, and {db}. \n\nKey Requirements:\n- UI: Premium dark mode with Glassmorphism, smooth entry animations using Framer Motion, and Lucide React icons.\n- Dashboard: A real-time command center showing key metrics, recent activities, and an AI-powered command bar.\n- Core Feature: Implement the {type_name} logic using a modular service architecture. \n- Auth: Use {auth} for seamless social login. \n- Data Visualization: Integrate Recharts or Tremor for beautiful, interactive data insights. \n\nThe code must be production-ready, clean, and follow the latest best practices for {fe}."

    # Database Schema
    schema = f"Table Users {{\n  id uuid [pk]\n  email varchar [unique]\n  role enum('user', 'admin')\n  preferences jsonb\n  created_at timestamp\n}}\n\nTable {type_name}s {{\n  id uuid [pk]\n  owner_id uuid [ref: > Users.id]\n  title varchar\n  content text\n  status varchar\n  metadata jsonb\n  last_updated timestamp\n}}\n\nTable AuditLog {{\n  id uuid [pk]\n  action varchar\n  user_id uuid\n  details jsonb\n}}"

    # API Endpoints
    apis = f"- POST /api/v1/auth/signup - User registration\n- GET /api/v1/{type_name.lower()}s - List all records with pagination\n- POST /api/v1/{type_name.lower()}s/create - Create a new entry with AI analysis\n- GET /api/v1/{type_name.lower()}s/:id - Fetch detailed record with relationships\n- WS /api/v1/realtime - WebSocket for live state synchronization"

    # Win Secret
    win_secret = f"<b>The {industry} Edge:</b> Judges in this niche prioritize 'Technical Feasibility' and 'UI Polish'. To win, demonstrate a working AI integration that solves a specific pain point within 10 seconds of the demo starting. Don't waste time on a long landing page; build a flawless dashboard that screams 'ready for production'."

    kws = random.sample(keywords_pool[industry], 4)
    
    entry = {
        "keywords": kws + [industry.lower(), type_name.lower(), title.lower()],
        "result": {
            "overview": f"<h3>🚀 High-Impact Strategy</h3><p>This {industry} solution is architected to be the gold standard for a {type_name}. It leverages modern cloud-native patterns to ensure your hackathon project stands out for its engineering depth and commercial viability.</p>",
            "techstack": stack_desc,
            "ai_strategy": ai_strategy,
            "mega_prompt": mega_prompt,
            "database_schema": schema,
            "api_endpoints": apis,
            "win_secret": win_secret,
            "industry": industry
        }
    }
    return entry

final_1000 = []
for i in range(1000):
    ind = industries[i // 40]
    typ = project_types[i % 20] # Cycle types
    final_1000.append(generate_enhanced_entry(ind, typ, (i % 40) + 1))

with open('offline_data_1000_enhanced.js', 'w', encoding='utf-8') as f:
    f.write("window.OFFLINE_KNOWLEDGE_BASE = " + json.dumps(final_1000, indent=2) + ";")

print("Generated 1,000 ENHANCED blueprints in offline_data_1000_enhanced.js")
