import json
import random

industries = [
    "QuantumComputing", "NeuroTech", "CircularEconomy", "OceanTech", "MicroSaaS",
    "AIGovernance", "DigitalSovereignty", "Longevity", "HumanitarianTech", "PrivacyTech"
]

project_themes = [
    "Simulator", "Neural Interface", "Recycling Hub", "Marine Sensor", "Niche Automation",
    "Bias Detector", "Data Vault", "Biomarker Tracker", "Crisis Mapper", "Encryption Layer",
    "Algorithm", "Dataset", "Network", "Protocol", "Dashboard",
    "Analyzer", "Optimizer", "System", "Portal", "Platform"
]

keywords_pool = {
    "QuantumComputing": ["quantum", "qubit", "entanglement", "superposition", "annealing", "circuit"],
    "NeuroTech": ["brain", "neural", "bci", "eeg", "neuro", "cognitive"],
    "CircularEconomy": ["recycle", "waste", "reuse", "sustainability", "material", "lifecycle"],
    "OceanTech": ["ocean", "marine", "water", "sea", "underwater", "aquatic"],
    "MicroSaaS": ["saas", "automation", "niche", "workflow", "small business", "productivity"],
    "AIGovernance": ["bias", "ethics", "fairness", "transparency", "alignment", "policy"],
    "DigitalSovereignty": ["privacy", "sovereignty", "decentralized", "data", "identity", "vault"],
    "Longevity": ["aging", "longevity", "healthspan", "biomarker", "biological", "vitality"],
    "HumanitarianTech": ["crisis", "disaster", "relief", "humanitarian", "aid", "refugee"],
    "PrivacyTech": ["encryption", "privacy", "zkp", "fhe", "secure", "anonymous"]
}

stacks = [
    "Next.js + Tailwind CSS + Supabase",
    "React + Python FastAPI + PostgreSQL",
    "SvelteKit + Go + Redis",
    "Vue.js + Node.js + MongoDB Atlas",
    "React Native + Firebase + Google Cloud"
]

def generate_entry(industry, theme, id_val):
    title = f"{industry} {theme} Alpha v{id_val}"
    stack = random.choice(stacks)
    kws = random.sample(keywords_pool[industry], 2)
    
    entry = {
        "keywords": kws + [industry.lower(), theme.lower(), title.lower()],
        "result": {
            "overview": f"<h3>🚀 Project Understanding</h3><p>An advanced {industry} initiative focusing on building a {title}. This blueprint addresses emerging technology frontiers and high-complexity hackathon challenges.</p>",
            "techstack": f"{stack} - Engineered for high-performance computing and cutting-edge data handling.",
            "ai_strategy": "Leverage advanced AI models for predictive analysis and complex system simulation.",
            "mega_prompt": f"Act as a Visionary Technology Architect. Build a {title} using {stack.split(' + ')[0]}. Prioritize technical depth, robust security, and a future-forward user interface.",
            "database_schema": "Table Users {\n  id uuid [pk]\n  identity_token varchar\n}\n\nTable ResearchData {\n  id uuid [pk]\n  metadata jsonb\n  timestamp datetime\n}",
            "api_endpoints": "POST /api/v1/auth\nGET /api/v1/telemetry\nPOST /api/v1/compute-quantum",
            "win_secret": f"In {industry}, judges value 'Innovation' above all else. Show a proof of concept that solves a problem previously thought impossible.",
            "industry": industry
        }
    }
    return entry

final_200 = []
for i in range(200):
    ind = industries[i // 20]
    theme = project_themes[i % 20]
    final_200.append(generate_entry(ind, theme, (i % 20) + 1))

with open('offline_data_200_emerging.js', 'w', encoding='utf-8') as f:
    f.write("window.OFFLINE_KNOWLEDGE_BASE_EMERGING = " + json.dumps(final_200, indent=2) + ";")

print("Generated 200 'Emerging Tech' blueprints in offline_data_200_emerging.js")
