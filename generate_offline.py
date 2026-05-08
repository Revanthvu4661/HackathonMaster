import json
import random

categories = {
    "Healthcare / MedTech": [
        {"kw": ["hospital", "patient", "clinic"], "focus": "Hospital Management System"},
        {"kw": ["telemedicine", "doctor call", "video consultation"], "focus": "Telemedicine Platform"},
        {"kw": ["symptoms", "diagnosis", "disease"], "focus": "AI Symptom Checker"},
        {"kw": ["mental health", "therapy", "depression"], "focus": "Mental Health Chatbot"},
        {"kw": ["wearable", "heart rate", "fitness tracker"], "focus": "Health Data Sync"}
    ],
    "Fintech / DeFi": [
        {"kw": ["budget", "expense", "tracker"], "focus": "Personal Finance Tracker"},
        {"kw": ["invest", "stocks", "trading"], "focus": "Stock Trading Algorithm"},
        {"kw": ["crypto", "wallet", "blockchain"], "focus": "Web3 Crypto Wallet"},
        {"kw": ["invoice", "billing", "payment"], "focus": "B2B Invoicing System"},
        {"kw": ["loan", "credit score", "lending"], "focus": "Micro-lending Platform"}
    ],
    "EdTech / Learning": [
        {"kw": ["course", "lms", "elearning"], "focus": "Learning Management System"},
        {"kw": ["tutor", "homework", "study"], "focus": "AI Virtual Tutor"},
        {"kw": ["language", "vocabulary", "speak"], "focus": "Language Learning App"},
        {"kw": ["flashcards", "quiz", "test"], "focus": "Gamified Quiz Platform"},
        {"kw": ["kids", "preschool", "toddler"], "focus": "Early Education App"}
    ],
    "Sustainability / GreenTech": [
        {"kw": ["carbon footprint", "emissions", "co2"], "focus": "Carbon Tracking Dashboard"},
        {"kw": ["recycling", "waste", "trash"], "focus": "Waste Management Optimization"},
        {"kw": ["solar", "energy", "renewable"], "focus": "Solar Panel Yield Predictor"},
        {"kw": ["water conservation", "drought", "leak"], "focus": "Smart Water Metering"},
        {"kw": ["vegan", "plant-based", "eco-friendly"], "focus": "Eco-friendly Product Marketplace"}
    ],
    "E-Commerce / Retail": [
        {"kw": ["shop", "cart", "store"], "focus": "Headless E-Commerce Storefront"},
        {"kw": ["recommendation", "products", "upsell"], "focus": "AI Product Recommender"},
        {"kw": ["inventory", "warehouse", "stock"], "focus": "Inventory Management System"},
        {"kw": ["thrift", "second-hand", "resell"], "focus": "Peer-to-peer Marketplace"},
        {"kw": ["loyalty", "rewards", "points"], "focus": "Customer Loyalty Program"}
    ],
    "Social & Community": [
        {"kw": ["friends", "feed", "post"], "focus": "Niche Social Network"},
        {"kw": ["dating", "match", "meet"], "focus": "AI Matchmaking App"},
        {"kw": ["event", "meetup", "party"], "focus": "Local Event Finder"},
        {"kw": ["forum", "discussion", "community"], "focus": "Community Discussion Board"},
        {"kw": ["volunteer", "charity", "donate"], "focus": "Volunteer Coordination Platform"}
    ],
    "Gaming & Entertainment": [
        {"kw": ["game", "play", "multiplayer"], "focus": "Web-based Multiplayer Game"},
        {"kw": ["streaming", "video", "watch"], "focus": "Video Streaming Platform"},
        {"kw": ["music", "playlist", "audio"], "focus": "AI Playlist Generator"},
        {"kw": ["esports", "tournament", "bracket"], "focus": "Esports Tournament Organizer"},
        {"kw": ["vr", "ar", "metaverse"], "focus": "AR/VR Experience Portal"}
    ],
    "Productivity & Office": [
        {"kw": ["task", "todo", "kanban"], "focus": "Agile Task Manager"},
        {"kw": ["notes", "document", "wiki"], "focus": "Collaborative Workspace"},
        {"kw": ["calendar", "schedule", "meeting"], "focus": "Smart Scheduling Assistant"},
        {"kw": ["time tracking", "pomodoro", "focus"], "focus": "Focus & Time Tracking App"},
        {"kw": ["automation", "workflow", "zapier"], "focus": "No-Code Workflow Builder"}
    ],
    "Real Estate & PropTech": [
        {"kw": ["house", "rent", "property"], "focus": "Property Listing Platform"},
        {"kw": ["tenant", "landlord", "lease"], "focus": "Tenant Management Portal"},
        {"kw": ["mortgage", "interest rate", "housing"], "focus": "Mortgage Calculator & Predictor"},
        {"kw": ["interior design", "furniture", "room"], "focus": "AR Interior Designer"},
        {"kw": ["smart home", "iot", "appliance"], "focus": "Smart Home Hub"}
    ],
    "Logistics & Supply Chain": [
        {"kw": ["delivery", "courier", "package"], "focus": "Last-mile Delivery Router"},
        {"kw": ["fleet", "truck", "gps"], "focus": "Fleet Tracking System"},
        {"kw": ["supply chain", "vendor", "supplier"], "focus": "Supply Chain Transparency Tool"},
        {"kw": ["cargo", "shipping", "freight"], "focus": "Freight Bidding Marketplace"},
        {"kw": ["drones", "autonomous", "robot"], "focus": "Drone Delivery Interface"}
    ],
    "Security & Privacy": [
        {"kw": ["password", "auth", "login"], "focus": "Passwordless Auth System"},
        {"kw": ["vpn", "proxy", "anonymous"], "focus": "Privacy-first Browser Extension"},
        {"kw": ["malware", "virus", "phishing"], "focus": "Phishing Detection AI"},
        {"kw": ["encryption", "keys", "pki"], "focus": "End-to-End Encrypted Chat"},
        {"kw": ["audit", "compliance", "logs"], "focus": "Security Audit Logger"}
    ],
    "AgriTech & Farming": [
        {"kw": ["farm", "crop", "harvest"], "focus": "Crop Yield Predictor"},
        {"kw": ["soil", "moisture", "irrigation"], "focus": "Smart Irrigation Controller"},
        {"kw": ["tractor", "drone", "agriculture"], "focus": "Farm Equipment Tracker"},
        {"kw": ["livestock", "cow", "poultry"], "focus": "Livestock Health Monitor"},
        {"kw": ["organic", "pesticide", "fertilizer"], "focus": "Organic Farming Advisor"}
    ],
    "Food & Beverage": [
        {"kw": ["restaurant", "menu", "order"], "focus": "QR Code Menu & Ordering"},
        {"kw": ["recipe", "cooking", "chef"], "focus": "AI Recipe Generator"},
        {"kw": ["grocery", "supermarket", "food delivery"], "focus": "Grocery Delivery App"},
        {"kw": ["diet", "nutrition", "calories"], "focus": "Macro Tracking Dashboard"},
        {"kw": ["wine", "brewery", "alcohol"], "focus": "Wine Pairing Recommender"}
    ],
    "HR & Jobs": [
        {"kw": ["job", "resume", "hire"], "focus": "AI Resume Parsing System"},
        {"kw": ["interview", "candidate", "recruiter"], "focus": "Automated Interview Scheduler"},
        {"kw": ["payroll", "salary", "tax"], "focus": "Payroll Management System"},
        {"kw": ["employee", "onboarding", "training"], "focus": "Employee Onboarding Portal"},
        {"kw": ["performance", "review", "feedback"], "focus": "360-Degree Feedback Tool"}
    ],
    "Legal & RegTech": [
        {"kw": ["law", "contract", "lawyer"], "focus": "AI Contract Analyzer"},
        {"kw": ["compliance", "gdpr", "ccpa"], "focus": "Data Privacy Compliance Tool"},
        {"kw": ["ip", "trademark", "patent"], "focus": "Trademark Search Engine"},
        {"kw": ["court", "litigation", "case"], "focus": "Case Management System"},
        {"kw": ["notary", "signature", "esign"], "focus": "Digital Signature Platform"}
    ],
    "Travel & Hospitality": [
        {"kw": ["hotel", "booking", "room"], "focus": "Hotel Booking Aggregator"},
        {"kw": ["flight", "airline", "airport"], "focus": "Flight Price Predictor"},
        {"kw": ["itinerary", "vacation", "trip"], "focus": "AI Travel Itinerary Builder"},
        {"kw": ["tour guide", "attraction", "museum"], "focus": "Local Tour Guide App"},
        {"kw": ["backpacking", "hostel", "camping"], "focus": "Backpacker Social Network"}
    ],
    "Fitness & Wellness": [
        {"kw": ["workout", "gym", "exercise"], "focus": "Personalized Workout Planner"},
        {"kw": ["yoga", "meditation", "mindfulness"], "focus": "Mindfulness Meditation App"},
        {"kw": ["running", "cycling", "strava"], "focus": "GPS Activity Tracker"},
        {"kw": ["coach", "personal trainer", "athlete"], "focus": "Virtual Personal Trainer"},
        {"kw": ["posture", "ergonomics", "stretching"], "focus": "AI Posture Corrector"}
    ],
    "Art & Design": [
        {"kw": ["art", "painting", "drawing"], "focus": "Digital Art Portfolio"},
        {"kw": ["design", "ui", "ux"], "focus": "UI Component Library Generator"},
        {"kw": ["photo", "image", "edit"], "focus": "AI Photo Enhancer"},
        {"kw": ["animation", "3d", "render"], "focus": "Browser-based 3D Modeler"},
        {"kw": ["nft", "mint", "collection"], "focus": "NFT Minting Dashboard"}
    ],
    "Smart City & IoT": [
        {"kw": ["traffic", "parking", "commute"], "focus": "Smart Parking Finder"},
        {"kw": ["streetlight", "infrastructure", "city"], "focus": "City Infrastructure Monitor"},
        {"kw": ["public transit", "bus", "train"], "focus": "Public Transit Tracker"},
        {"kw": ["air quality", "pollution", "smog"], "focus": "Air Quality Dashboard"},
        {"kw": ["emergency", "police", "fire"], "focus": "Emergency Response Router"}
    ],
    "Automotive & Transport": [
        {"kw": ["car", "vehicle", "auto"], "focus": "Car Maintenance Tracker"},
        {"kw": ["ev", "charging", "electric vehicle"], "focus": "EV Charging Station Map"},
        {"kw": ["ride share", "uber", "taxi"], "focus": "Peer-to-peer Ridesharing"},
        {"kw": ["mechanic", "repair", "garage"], "focus": "On-demand Mechanic Booking"},
        {"kw": ["autonomous", "self-driving", "driverless"], "focus": "Autonomous Vehicle Simulator"}
    ]
}

offline_db = []

tech_stacks = [
    "Next.js + Tailwind CSS + Supabase",
    "React + Node.js + MongoDB",
    "Vue.js + FastAPI + PostgreSQL",
    "SvelteKit + Go + Redis",
    "React Native + Firebase",
    "Next.js + Prisma + PlanetScale"
]

ai_strategies = [
    "Utilize Gemini 2.0 Flash for blazing-fast natural language processing and recommendations.",
    "Implement Claude 3.5 Sonnet for complex reasoning and data summarization.",
    "Use OpenAI GPT-4o for robust conversational agents and dynamic content generation.",
    "Deploy a local LLM via Ollama for privacy-preserving AI inference.",
    "Use Med-PaLM 2 or specialized models tailored to high-accuracy requirements."
]

for ind, items in categories.items():
    for item in items:
        focus = item["focus"]
        tech = random.choice(tech_stacks)
        ai = random.choice(ai_strategies)
        
        entry = {
            "keywords": item["kw"],
            "result": {
                "overview": f"<h3>🚀 Project Understanding</h3><p>A cutting-edge solution focused on building a {focus} to revolutionize the {ind} industry. This platform will address core pain points through seamless automation and intelligent design.</p>",
                "techstack": f"{tech} - Chosen for high scalability, rapid iteration speed, and extensive community support.",
                "ai_strategy": ai,
                "mega_prompt": f"Act as a Senior Full Stack Engineer. Build a {focus} using {tech.split(' + ')[0]} and Tailwind CSS. Implement secure authentication, a dynamic dashboard, and integrate AI features via API. Ensure the UI is fully responsive with dark mode support.",
                "database_schema": f"Table Users {{\\n  id uuid [pk]\\n  email varchar\\n  created_at timestamp\\n}}\\n\\nTable CoreData {{\\n  id uuid [pk]\\n  user_id uuid\\n  type varchar\\n  metadata jsonb\\n}}",
                "api_endpoints": "POST /api/v1/auth/login\\nGET /api/v1/dashboard/stats\\nPOST /api/v1/data/process",
                "win_secret": f"Judges look for extreme polish in {ind} applications. Focus heavily on smooth UI transitions and a flawless 'magic moment' during your demo.",
                "industry": ind
            }
        }
        offline_db.append(entry)

# Write to JS file
with open("c:/Users/revan/Desktop/Hackathon Helper/offline_data_100.js", "w", encoding="utf-8") as f:
    f.write("window.OFFLINE_KNOWLEDGE_BASE = ")
    json.dump(offline_db, f, indent=2)
    f.write(";")
    
print(f"Generated {len(offline_db)} items in offline_data_100.js")
