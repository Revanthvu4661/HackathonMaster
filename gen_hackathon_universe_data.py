import json
import random

india_orgs = ["AICTE", "Ministry of Education", "ISRO", "Flipkart", "Infosys", "Myntra", "Microsoft India", "TCS", "Techgig", "HackerEarth", "Devfolio", "IIT Bombay", "Google India", "Amazon India", "NITI Aayog", "Ministry of Home Affairs", "RBI", "SBI", "NASSCOM", "CDAC"]
global_orgs = ["MIT", "Stanford", "UC Berkeley", "Georgia Tech", "NASA", "Google", "Meta", "Microsoft", "IBM", "ETH Zurich", "Junction", "University of Waterloo", "MLH", "Devpost", "OpenAI", "Anthropic", "Apple", "Amazon", "Stripe", "Y Combinator"]

domains = ["HealthTech", "AgriTech", "SmartCity", "EdTech", "FinTech", "Logistics", "CyberSecurity", "Energy", "Web3", "AI/ML", "AR/VR", "SpaceTech", "ClimateTech", "Robotics", "E-commerce"]

india_hackathons = [
    {"id": "sih", "name": "Smart India Hackathon", "short_name": "SIH", "org": "AICTE / MoE", "category": "Government", "emoji": "🇮🇳", "website": "https://sih.gov.in"},
    {"id": "isro", "name": "ISRO Space Hackathon", "short_name": "ISRO Hack", "org": "ISRO", "category": "Government", "emoji": "🚀", "website": "https://isro.gov.in"},
    {"id": "kavach", "name": "Kavach Cybersecurity Hackathon", "short_name": "Kavach", "org": "Ministry of Home Affairs", "category": "Government", "emoji": "🛡️", "website": "https://kavach.mic.gov.in"},
    {"id": "flipkart_grid", "name": "Flipkart GRiD", "short_name": "GRiD", "org": "Flipkart", "category": "Corporate", "emoji": "🛍️", "website": "https://unstop.com/hackathons/flipkart-grid"},
    {"id": "hackwithinfy", "name": "HackWithInfy", "short_name": "InfyHack", "org": "Infosys", "category": "Corporate", "emoji": "💻", "website": "https://infosys.com"},
]

global_hackathons = [
    {"id": "hackmit", "name": "HackMIT", "short_name": "HackMIT", "org": "MIT", "category": "University", "emoji": "🧠", "website": "https://hackmit.org"},
    {"id": "spaceapps", "name": "NASA Space Apps Challenge", "short_name": "SpaceApps", "org": "NASA", "category": "Government", "emoji": "🌌", "website": "https://spaceappschallenge.org"},
    {"id": "callforcode", "name": "IBM Call for Code", "short_name": "CallForCode", "org": "IBM", "category": "Corporate", "emoji": "🌍", "website": "https://callforcode.org"},
    {"id": "imaginecup", "name": "Microsoft Imagine Cup", "short_name": "ImagineCup", "org": "Microsoft", "category": "Corporate", "emoji": "🏆", "website": "https://imaginecup.microsoft.com"},
    {"id": "treehacks", "name": "TreeHacks", "short_name": "TreeHacks", "org": "Stanford", "category": "University", "emoji": "🌲", "website": "https://treehacks.com"},
]

# Generate more to reach 50 each
for i in range(45):
    india_hackathons.append({
        "id": f"ind_hack_{i}",
        "name": f"India {random.choice(domains)} Hackathon 2024",
        "short_name": f"IND-{i}",
        "org": random.choice(india_orgs),
        "category": random.choice(["Government", "Corporate", "University", "Startup"]),
        "emoji": "🇮🇳",
        "website": "https://example.com"
    })
    global_hackathons.append({
        "id": f"glb_hack_{i}",
        "name": f"Global {random.choice(domains)} Summit {2024}",
        "short_name": f"GLB-{i}",
        "org": random.choice(global_orgs),
        "category": random.choice(["Government", "Corporate", "University", "Startup"]),
        "emoji": "🌍",
        "website": "https://example.com"
    })

def generate_problems(count):
    problems = []
    for j in range(count):
        problems.append({
            "year": random.choice([2022, 2023, 2024]),
            "id": f"PS-{random.randint(1000,9999)}",
            "title": f"AI for {random.choice(domains)}",
            "domain": random.choice(domains),
            "track": random.choice(["Software", "Hardware", "Design"]),
            "ministry": random.choice(["Ministry of Tech", "Dept of Science", "N/A"]),
            "description": "Develop an innovative solution to solve real-world problems in this domain.",
            "problem_full_text": "This is the complete problem statement requiring a robust, scalable architecture...",
            "constraints": ["Must work offline", "Open-source stack preferred", "Low latency"],
            "expected_deliverables": ["Working prototype", "Source code", "Pitch deck"],
            "tech_hints": ["Python", "React", "AI/ML", "Node.js"],
            "difficulty": random.choice(["Easy", "Medium", "Hard"]),
            "is_winner_problem": True
        })
    return problems

def generate_winners(count, problems):
    winners = []
    for j in range(count):
        prob = random.choice(problems)
        winners.append({
            "year": prob["year"],
            "rank": random.choice([1, 2, 3]),
            "emoji": ["🥇", "🥈", "🥉"][random.choice([0,1,2])],
            "project_name": f"Project {random.randint(100,999)}",
            "team_name": f"Team {random.choice(['Alpha', 'Beta', 'Gamma', 'Delta'])}",
            "college": "Top Tech University",
            "state": "State/Region",
            "problem_id": prob["id"],
            "problem_title": prob["title"],
            "tech_stack": ["React", "Node", "Python"],
            "what_they_built": "A highly scalable microservices based application.",
            "innovation": "Used edge computing for faster processing.",
            "judge_quote": "Very practical and deployable solution.",
            "github_url": "https://github.com/example",
            "demo_url": "https://youtube.com/example",
            "prize_won": "₹1,00,000",
            "mentor": "Prof. Smith"
        })
    return winners

def hydrate(hackathon):
    probs = generate_problems(random.randint(5, 12))
    h = {
        "id": hackathon["id"],
        "name": hackathon["name"],
        "short_name": hackathon["short_name"],
        "organizer": hackathon["org"],
        "emoji": hackathon["emoji"],
        "website": hackathon["website"],
        "category": hackathon["category"],
        "prestige_score": round(random.uniform(7.0, 9.9), 1),
        "prize_pool": random.choice(["₹1 Crore+", "₹50 Lakhs", "$100,000", "$50,000"]),
        "prize_breakdown": {
            "first": "₹1,00,000" if hackathon["emoji"] == "🇮🇳" else "$10,000",
            "second": "₹75,000" if hackathon["emoji"] == "🇮🇳" else "$5,000",
            "third": "₹50,000" if hackathon["emoji"] == "🇮🇳" else "$2,500",
            "special": "Various goodies"
        },
        "team_size": {"min": random.randint(1, 3), "max": random.randint(4, 6)},
        "eligibility": "Students & Professionals",
        "frequency": "Annual",
        "month": random.choice(["January", "March", "July", "September", "December"]),
        "participants": f"{random.randint(10, 100)}K+ participants",
        "description": f"The {hackathon['name']} is a premier event bringing together top talent.",
        "history": "Started a few years ago, it has grown exponentially.",
        "domains": random.sample(domains, 4),
        "judging_criteria": [
            {"name": "Innovation & Uniqueness", "weight": 25},
            {"name": "Technical Feasibility", "weight": 20},
            {"name": "Social Impact", "weight": 25},
            {"name": "Business Viability", "weight": 15},
            {"name": "Presentation", "weight": 15}
        ],
        "tags": [hackathon["category"].lower(), "hackathon", "innovation"],
        "search_keywords": [hackathon["name"].lower(), hackathon["short_name"].lower(), "hackathon"],
        "problem_statements": probs,
        "winners": generate_winners(random.randint(3, 9), probs),
        "strategy_guide": {
            "what_judges_value": "Focus on real-world impact and working prototypes.",
            "common_mistakes": ["Too much focus on presentation over code", "Not addressing the core problem"],
            "winning_pattern": "Clear problem definition -> Working prototype -> Good pitch",
            "recommended_stack": "React + Node/Python + Postgres",
            "ideal_team": "1 Designer, 2 Frontend, 2 Backend",
            "demo_vs_build": "20% presentation, 80% build",
            "preparation_tips": ["Read docs", "Prepare boilerplate", "Practice pitch"]
        },
        "analytics": {
            "participation_trend": {"2022": 5000, "2023": 8000, "2024": 12000},
            "top_winning_domains": random.sample(domains, 3),
            "top_winning_stacks": ["React", "Python", "Node.js"],
            "avg_winner_team_size": 4,
            "problems_per_year": {"2022": 15, "2023": 25, "2024": 30}
        }
    }
    return h

universe = {
    "india": [hydrate(h) for h in india_hackathons],
    "global": [hydrate(h) for h in global_hackathons]
}

js_content = "window.HACKATHON_UNIVERSE = " + json.dumps(universe, indent=2) + ";"
with open("D:/RAR Hackathon/hackathon_universe.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Generated hackathon_universe.js")
