import json
import random

industries = [
    "FinTech", "HealthTech", "EdTech", "GreenTech", "SocialImpact",
    "CyberSecurity", "AITools", "DevTools", "Web3", "E-commerce",
    "Logistics", "SmartCity", "PropTech", "LegalTech", "HRTech",
    "AdTech", "Media", "Gaming", "SportsTech", "FoodTech",
    "FashionTech", "AgriTech", "SpaceTech", "BioTech", "DeepTech"
]

# Industry-specific stacks for better accuracy
industry_profiles = {
    "FinTech": {"fe": "Next.js 14", "be": "Go (Fiber)", "db": "PostgreSQL", "auth": "Clerk", "ai": "DeepSeek-V3"},
    "HealthTech": {"fe": "React + Vite", "be": "Python (FastAPI)", "db": "MongoDB Atlas", "auth": "Kinde", "ai": "Claude 3.5 Sonnet"},
    "EdTech": {"fe": "Nuxt.js 3", "be": "Node.js (TS)", "db": "Supabase", "auth": "Supabase Auth", "ai": "GPT-4o"},
    "Web3": {"fe": "Next.js", "be": "Rust (Axum)", "db": "Solana / Arweave", "auth": "Privy", "ai": "Claude 3.5 Sonnet"},
    "CyberSecurity": {"fe": "SvelteKit", "be": "Python", "db": "ElasticSearch", "auth": "Auth0", "ai": "Gemini 2.0 Flash"},
    "Gaming": {"fe": "Three.js + React", "be": "C++ / Node.js", "db": "Redis", "auth": "PlayFab", "ai": "GPT-4o"},
    "DeepTech": {"fe": "Next.js", "be": "Python (PyTorch)", "db": "Pinecone", "auth": "Clerk", "ai": "Gemini 2.0 Flash"}
}

project_types = [
    "Dashboard", "Marketplace", "Assistant", "Tracker", "Optimizer",
    "Network", "Analyzer", "Generator", "Portal", "Platform",
    "Engine", "Hub", "Tool", "System", "Service",
    "App", "Bot", "Algorithm", "Manager", "Interface"
]

keywords_pool = {
    "FinTech": ["money", "bank", "payment", "loan", "invest", "trading", "crypto", "defi", "wallet", "budget", "finance", "stock"],
    "HealthTech": ["doctor", "patient", "hospital", "medical", "disease", "health", "symptom", "therapy", "mental", "fitness", "wellness", "clinical"],
    "EdTech": ["school", "learning", "student", "course", "tutor", "education", "quiz", "homework", "study", "language", "academy", "campus"],
    "GreenTech": ["earth", "climate", "eco", "carbon", "sustainable", "energy", "solar", "wind", "recycle", "waste", "nature", "green"],
    "SocialImpact": ["community", "volunteer", "charity", "donate", "help", "accessibility", "inclusive", "diversity", "equality", "peace", "ngo", "social"],
    "CyberSecurity": ["security", "hack", "privacy", "encrypt", "firewall", "auth", "token", "shield", "protect", "leak", "cyber", "threat"],
    "AITools": ["model", "llm", "chat", "image", "vision", "speech", "text", "generate", "predict", "analyze", "ai", "intelligence"],
    "DevTools": ["code", "debug", "deploy", "git", "api", "framework", "library", "sdk", "cli", "ide", "developer", "backend"],
    "Web3": ["blockchain", "nft", "dao", "contract", "dapp", "ether", "solana", "mining", "ledger", "mint", "crypto", "decentralized"],
    "E-commerce": ["shop", "cart", "store", "buy", "sell", "product", "inventory", "shipping", "order", "retail", "marketplace", "sale"],
    "Logistics": ["delivery", "truck", "warehouse", "cargo", "route", "supply", "chain", "freight", "fleet", "parcel", "tracking", "shipment"],
    "SmartCity": ["urban", "traffic", "parking", "lighting", "transit", "public", "utility", "city", "planning", "sensor", "iot", "infrastructure"],
    "PropTech": ["house", "rent", "property", "apartment", "broker", "real estate", "lease", "tenant", "listing", "home", "building", "estate"],
    "LegalTech": ["law", "contract", "court", "judge", "attorney", "legal", "compliance", "notary", "brief", "case", "justice", "statute"],
    "HRTech": ["hiring", "resume", "employee", "payroll", "talent", "recruitment", "interview", "career", "job", "perk", "staff", "hr"],
    "AdTech": ["ads", "marketing", "campaign", "click", "brand", "conversion", "pixel", "targeting", "reach", "spend", "audience", "traffic"],
    "Media": ["video", "audio", "movie", "news", "stream", "podcast", "content", "journalism", "broadcast", "viral", "entertainment", "social"],
    "Gaming": ["game", "play", "multiplayer", "esports", "vr", "ar", "unity", "unreal", "steam", "metaverse", "gaming", "console"],
    "SportsTech": ["athlete", "coach", "stats", "score", "workout", "stadium", "fan", "training", "league", "rehab", "fitness", "sport"],
    "FoodTech": ["recipe", "restaurant", "delivery", "kitchen", "nutrition", "chef", "calorie", "meal", "grocery", "order", "food", "cook"],
    "FashionTech": ["clothing", "style", "wear", "closet", "try-on", "textile", "model", "runway", "designer", "brand", "fashion", "retail"],
    "AgriTech": ["farm", "crop", "soil", "harvest", "plant", "irrigation", "pest", "yield", "agri", "tractor", "agriculture", "field"],
    "SpaceTech": ["mars", "moon", "orbit", "satellite", "rocket", "star", "galaxy", "telescope", "nasa", "spacex", "astronomy", "launch"],
    "BioTech": ["dna", "gene", "protein", "cell", "lab", "pharma", "clinical", "molecular", "drug", "cure", "biology", "science"],
    "DeepTech": ["quantum", "robotics", "fusion", "nano", "semiconductor", "photonics", "physics", "advanced", "compute", "nextgen", "hardware", "scientific"]
}

def generate_entry(industry, type_name, id_val):
    title = f"{industry} {type_name} Pro-Grade v{id_val}"
    
    # Get profile or random
    profile = industry_profiles.get(industry, {
        "fe": random.choice(["Next.js", "React"]),
        "be": random.choice(["Node.js", "FastAPI"]),
        "db": random.choice(["Postgres", "MongoDB"]),
        "auth": random.choice(["Clerk", "Supabase"]),
        "ai": "Gemini 2.0 Flash"
    })
    
    fe, be, db, auth, ai = profile["fe"], profile["be"], profile["db"], profile["auth"], profile["ai"]
    
    # --- STRATEGIC RESULT ---
    strat_result = {
        "overview": f"<h3>🚀 High-Impact Strategy</h3><p>This {industry} solution is architected to be the gold standard for a {type_name}. It leverages modern cloud-native patterns to ensure your hackathon project stands out for its engineering depth and commercial viability.</p>",
        "techstack": f"<h4>Frontend:</h4> {fe} with Tailwind CSS & Framer Motion.<br><h4>Backend:</h4> {be} (optimized for {industry}).<br><h4>Database:</h4> {db} for scalability.<br><h4>Auth:</h4> {auth} for rapid onboarding.",
        "ai_strategy": f"1. <b>Model:</b> {ai} for primary reasoning.<br>2. <b>Vector Store:</b> {db if 'Supabase' in db else 'Pinecone'} for RAG workflows.<br>3. <b>Experience:</b> Real-time streaming and intent detection.",
        "mega_prompt": f"Act as a Principal Engineer. Build a {title} using {fe}, {be}, and {db}. Include a real-time dashboard, AI-powered analytics, and {auth} integration. Focus on a premium dark mode UI with smooth transitions.",
        "database_schema": f"Table Users {{ id uuid [pk] email varchar preferences jsonb }}\nTable {type_name}s {{ id uuid [pk] owner_id uuid title varchar data jsonb created_at timestamp }}",
        "api_endpoints": f"- POST /api/v1/auth/signup\n- GET /api/v1/{type_name.lower()}s\n- POST /api/v1/{type_name.lower()}s/generate",
        "win_secret": f"<b>The {industry} Edge:</b> Focus on 'Technical Depth' and 'Market Readiness'. Demonstrate a working AI feature that solves a major pain point in the first 30 seconds of your demo.",
        "industry": industry
    }
    
    # --- TEAM BUILDER RESULT ---
    team_result = {
        "project_summary": {
            "name": title,
            "complexity": "High" if random.random() > 0.5 else "Medium",
            "core_stack": [fe, be, ai]
        },
        "roles": [
            {
                "title": f"Lead {industry} Engineer",
                "type": "Engineering",
                "priority": "Critical",
                "description": f"Drives the core logic and {industry}-specific integrations.",
                "primary_skills": [be, "System Design", "Security"],
                "responsibilities": ["Backend architecture", "API Design", "Security hardening"]
            },
            {
                "title": "Full-Stack AI Developer",
                "type": "Engineering",
                "priority": "Critical",
                "description": f"Integrates {ai} and builds the responsive {fe} interface.",
                "primary_skills": [fe, ai, "Prompt Engineering"],
                "responsibilities": ["UI/UX Implementation", "AI Workflow Design", "Prompt Tuning"]
            }
        ],
        "skills_map": [
            {
                "domain": "Domain Logic",
                "required_skills": [{"name": be, "level": "Expert"}, {"name": "Business Logic", "level": "High"}]
            },
            {
                "domain": "User Interface",
                "required_skills": [{"name": fe, "level": "Expert"}, {"name": "Framer Motion", "level": "Intermediate"}]
            },
            {
                "domain": "Intelligence",
                "required_skills": [{"name": ai, "level": "Expert"}, {"name": "RAG Patterns", "level": "High"}]
            }
        ],
        "task_timeline": [
            {
                "phase": "0-4h: Core Foundation",
                "tasks": ["Repo setup", "Authentication flow", "Database modeling"],
                "roles_involved": [f"Lead {industry} Engineer"]
            },
            {
                "phase": "4-12h: Logic & UI",
                "tasks": ["Main dashboard build", "Core API implementation"],
                "roles_involved": ["Full-Stack AI Developer"]
            },
            {
                "phase": "12-20h: AI Integration",
                "tasks": ["RAG pipeline setup", "AI-powered feature build"],
                "roles_involved": ["Full-Stack AI Developer", f"Lead {industry} Engineer"]
            }
        ],
        "collaboration": {
            "tools": [{"name": "GitHub", "use": "Monorepo"}, {"name": "Notion", "use": "PRD/Tasks"}],
            "protocols": ["Immediate blocker escalation", "Unified UI components library"]
        },
        "solo_strategy": {
            "is_solo": False,
            "warning": "This is a complex professional-grade architecture.",
            "ai_tools": [{"name": "Cursor/V0", "use": "Speed up frontend scaffolding"}]
        }
    }
    
    kws = random.sample(keywords_pool[industry], 6)
    return {
        "keywords": kws + [industry.lower(), type_name.lower(), title.lower()],
        "result": strat_result,
        "team_result": team_result
    }

final_1000 = []
for i in range(1000):
    ind = industries[i // 40]
    typ = project_types[i % 20]
    final_1000.append(generate_entry(ind, typ, (i % 40) + 1))

# Add Special Entries (already have high quality)
# ... omitted for brevity in this script but I will merge them ...

with open('offline_data_1000.js', 'w', encoding='utf-8') as f:
    f.write("window.OFFLINE_KNOWLEDGE_BASE = " + json.dumps(final_1000, indent=2) + ";")

print("Generated 1000 ULTIMATE industry-aligned blueprints in offline_data_1000.js")
