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

stacks = [
    "Next.js + Tailwind CSS + Supabase",
    "React + Python FastAPI + PostgreSQL",
    "SvelteKit + Go + Redis",
    "Vue.js + Node.js + MongoDB Atlas",
    "React Native + Firebase + Google Cloud"
]

def generate_entry(industry, type_name, id_val):
    title = f"{industry} {type_name} Elite v{id_val}"
    stack = random.choice(stacks)
    kws = random.sample(keywords_pool[industry], 3)
    
    entry = {
        "keywords": kws + [f"{industry.lower()} {type_name.lower()}", title.lower()],
        "result": {
            "overview": f"<h3>🚀 Project Understanding</h3><p>A master-level {industry} solution focusing on building a {title}. This project targets high-frequency hackathon requests by providing a robust, production-ready blueprint.</p>",
            "techstack": f"{stack} - Optimized for 48-hour development sprints and judge-ready demos.",
            "ai_strategy": "Implement a hybrid AI approach using Gemini 2.0 Flash for core logic and RAG for industry-specific data retrieval.",
            "mega_prompt": f"Act as an Elite Hackathon Architect. Build a {title} using {stack.split(' + ')[0]}. Focus on extremely high-quality UI/UX (dark mode, glassmorphism) and seamless AI integration. Implement a flawless onboarding flow and a 'magic' dashboard.",
            "database_schema": "Table Users {\n  id uuid [pk]\n  email varchar\n  metadata jsonb\n}\n\nTable Projects {\n  id uuid [pk]\n  user_id uuid\n  status varchar\n  data jsonb\n}",
            "api_endpoints": "POST /api/v1/auth\nGET /api/v1/stats\nPOST /api/v1/generate-intelligence",
            "win_secret": f"To win in {industry}, focus on 'Technical Complexity' and 'Social Impact'. Show a live demo that works in under 10 seconds.",
            "industry": industry
        }
    }
    return entry

final_500 = []
for i in range(500):
    ind = industries[i // 20]
    typ = project_types[i % 20]
    final_500.append(generate_entry(ind, typ, (i % 20) + 1))

with open('offline_data_500_new.js', 'w', encoding='utf-8') as f:
    f.write("window.OFFLINE_KNOWLEDGE_BASE_500 = " + json.dumps(final_500, indent=2) + ";")

print("Generated 500 'Most Asked' blueprints in offline_data_500_new.js")
