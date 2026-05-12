import json

industries = [
    ("SpaceTech", ["space", "satellite", "mars", "moon", "rocket", "orbit"]),
    ("AgriTech", ["farm", "agriculture", "crop", "soil", "harvest", "irrigation"]),
    ("GovTech", ["government", "citizen", "voting", "public", "policy", "urban"]),
    ("CyberSecurity", ["security", "hack", "encryption", "privacy", "firewall", "auth"]),
    ("BioTech", ["dna", "genetic", "biology", "lab", "protein", "pharma"]),
    ("LegalTech", ["law", "legal", "contract", "court", "judge", "attorney"]),
    ("TravelTech", ["travel", "flight", "hotel", "tourism", "itinerary", "booking"]),
    ("PropTech", ["real estate", "property", "house", "apartment", "mortgage", "broker"]),
    ("RetailTech", ["retail", "shop", "commerce", "inventory", "pos", "customer"]),
    ("Logistics", ["shipping", "delivery", "warehouse", "supply chain", "truck", "cargo"]),
    ("Energy", ["power", "solar", "wind", "grid", "battery", "utility"]),
    ("HRTech", ["hiring", "resume", "employee", "payroll", "talent", "recruitment"]),
    ("AdTech", ["advertising", "marketing", "campaign", "click", "brand", "social media"]),
    ("Media & Ent", ["movie", "music", "video", "stream", "gaming", "content"]),
    ("SportsTech", ["sports", "fitness", "athlete", "coach", "game", "stadium"]),
    ("FashionTech", ["fashion", "clothing", "style", "virtual try-on", "wardrobe", "textile"]),
    ("FoodTech", ["food", "recipe", "restaurant", "delivery", "kitchen", "nutrition"]),
    ("InsureTech", ["insurance", "claim", "policy", "risk", "premium", "underwriting"]),
    ("CleanTech", ["clean", "pollution", "waste", "recycle", "water", "air"]),
    ("DeepTech", ["quantum", "robotics", "nanotech", "material", "semiconductor", "fusion"])
]

stacks = [
    "Next.js + Tailwind CSS + Supabase",
    "React + Python FastAPI + PostgreSQL",
    "SvelteKit + Go + Redis",
    "Vue.js + Node.js + MongoDB Atlas",
    "React Native + Firebase + Google Cloud"
]

ai_strategies = [
    "Utilize Gemini 2.0 Flash for blazing-fast natural language processing and recommendations.",
    "Implement Claude 3.5 Sonnet for complex reasoning and data summarization.",
    "Use OpenAI GPT-4o for robust conversational agents and dynamic content generation.",
    "Deploy a local LLM via Ollama for privacy-preserving AI inference.",
    "Use Med-PaLM 2 or specialized models tailored to high-accuracy requirements."
]

def generate_entry(industry_name, keywords, index):
    title = f"{industry_name} Solution v{index}"
    stack = stacks[index % len(stacks)]
    ai = ai_strategies[index % len(ai_strategies)]
    
    entry = {
        "keywords": keywords + [f"{industry_name.lower()} {index}"],
        "result": {
            "overview": f"<h3>🚀 Project Understanding</h3><p>A cutting-edge solution focused on building a {title} to revolutionize the {industry_name} industry. This platform will address core pain points through seamless automation and intelligent design.</p>",
            "techstack": f"{stack} - Chosen for high scalability, rapid iteration speed, and extensive community support.",
            "ai_strategy": ai,
            "mega_prompt": f"Act as a Senior Full Stack Engineer. Build a {title} using {stack.split(' + ')[0]} and Tailwind CSS. Implement secure authentication, a dynamic dashboard, and integrate AI features via API. Ensure the UI is fully responsive with dark mode support.",
            "database_schema": "Table Users {\n  id uuid [pk]\n  email varchar\n  created_at timestamp\n}\n\nTable CoreData {\n  id uuid [pk]\n  user_id uuid\n  type varchar\n  metadata jsonb\n}",
            "api_endpoints": "POST /api/v1/auth/login\nGET /api/v1/dashboard/stats\nPOST /api/v1/data/process",
            "win_secret": f"Judges look for extreme polish in {industry_name} applications. Focus heavily on smooth UI transitions and a flawless 'magic moment' during your demo.",
            "industry": industry_name
        }
    }
    return entry

new_data = []
for i in range(200):
    ind_name, keywords = industries[i // 10]
    new_data.append(generate_entry(ind_name, keywords, (i % 10) + 1))

with open('offline_data_200_new.js', 'w', encoding='utf-8') as f:
    f.write("window.OFFLINE_KNOWLEDGE_BASE_EXTRA = " + json.dumps(new_data, indent=2) + ";")

print("Generated 200 new entries in offline_data_200_new.js")
