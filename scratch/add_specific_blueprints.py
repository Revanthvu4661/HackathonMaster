import json

def load_js_data(filename, var_name):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        json_str = content.replace(f'window.{var_name} = ', '').strip()
        if json_str.endswith(';'):
            json_str = json_str[:-1]
        return json.loads(json_str)

data = load_js_data('offline_data_1000.js', 'OFFLINE_KNOWLEDGE_BASE')

specific_entries = [
    {
        "keywords": ["team", "builder", "find team", "collaboration", "teammate", "group"],
        "result": {
            "overview": "<h3>🚀 Team Builder Intelligence</h3><p>An advanced platform designed to solve the #1 hackathon problem: finding the right teammates. This solution uses multi-dimensional skill matching and interest-based clustering to form high-performance teams instantly.</p>",
            "techstack": "<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + Framer Motion<br><h4>Backend:</h4> Node.js (TypeScript) + Socket.io for real-time chat<br><h4>Database:</h4> PostgreSQL (Supabase) + Vector Search for skill matching<br><h4>Auth:</h4> Clerk for social login",
            "ai_strategy": "1. <b>Skill Analysis:</b> Use Gemini 2.0 Flash to parse user LinkedIn/GitHub profiles and extract latent skills.<br>2. <b>Clustering:</b> Implement a K-Means clustering algorithm via Python/FastAPI to group compatible personalities.<br>3. <b>Compatibility Score:</b> Generate a percentage score for potential teammates based on skill gaps and time-zone alignment.",
            "mega_prompt": "Act as a Senior Product Engineer. Build a 'Hackathon Team Builder' platform. \n\nFeatures:\n- Profile creation with automated skill extraction from GitHub URLs.\n- Real-time 'Team Search' with filters for Tech Stack, Experience, and Role (Dev, Designer, PM).\n- Integrated real-time messaging system using WebSockets.\n- 'Team Formation' wizard that suggests the best missing roles for an incomplete group.\n\nUI: Modern, collaborative dark-mode interface with sleek card layouts and glassmorphism effects.",
            "database_schema": "Table Users {\n  id uuid [pk]\n  name varchar\n  skills text[]\n  github_url varchar\n}\n\nTable Teams {\n  id uuid [pk]\n  name varchar\n  looking_for text[]\n  members uuid[] [ref: > Users.id]\n}\n\nTable Messages {\n  id uuid [pk]\n  sender_id uuid\n  receiver_id uuid\n  content text\n  timestamp datetime\n}",
            "api_endpoints": "- GET /api/v1/matchmaking - Fetch suggested teammates\n- POST /api/v1/teams/invite - Send team invitation\n- GET /api/v1/skills/parse - Trigger AI skill extraction from URL",
            "win_secret": "<b>The Secret Sauce:</b> Focus on the 'Onboarding' experience. If a user can find a team in under 3 clicks, you've won. Add a 'Quick Pitch' video feature to make profiles more human.",
            "industry": "Social / Productivity"
        }
    },
    {
        "keywords": ["role", "matcher", "job", "recruitment", "skill match", "hire", "resume"],
        "result": {
            "overview": "<h3>🚀 AI Role Matcher Strategy</h3><p>A high-precision talent matching engine that bridges the gap between job requirements and candidate capabilities. It moves beyond keyword matching to understand the semantic context of experience and potential.</p>",
            "techstack": "<h4>Frontend:</h4> React + Vite + Tremor for dashboards<br><h4>Backend:</h4> Python FastAPI (optimized for AI/ML processing)<br><h4>Database:</h4> MongoDB Atlas (flexible schema for resumes)<br><h4>AI:</h4> LangChain + OpenAI GPT-4o",
            "ai_strategy": "1. <b>Semantic Matching:</b> Use Sentence-Transformers to convert job descriptions and resumes into vectors.<br>2. <b>Gap Analysis:</b> Implement an AI agent that identifies exactly what skills a candidate is missing for a specific role and recommends learning paths.<br>3. <b>Interview Simulation:</b> Generate role-specific interview questions based on the candidate's unique background.",
            "mega_prompt": "Act as a Senior HR-Tech Architect. Build a 'Precision Role Matcher' platform. \n\nFeatures:\n- Drag-and-drop resume uploader with instant AI parsing.\n- Dynamic 'Match Dashboard' showing how well a user fits 50+ roles.\n- Skill Gap Visualizer: A spider chart showing current vs required skills.\n- AI Career Roadmapper: Automatically suggests the next 3 steps to land a dream role.\n\nUI: Professional, clean, and data-dense interface with a focus on clear typography and actionable insights.",
            "database_schema": "Table Candidates {\n  id uuid [pk]\n  profile_json jsonb\n  vector_embedding vector\n}\n\nTable Roles {\n  id uuid [pk]\n  title varchar\n  description text\n  required_skills text[]\n}\n\nTable Matches {\n  id uuid [pk]\n  candidate_id uuid\n  role_id uuid\n  score float\n  feedback text\n}",
            "api_endpoints": "- POST /api/v1/resume/upload - Parse and vectorize resume\n- GET /api/v1/roles/matches - Get top matched jobs\n- POST /api/v1/career/roadmap - Generate AI learning path",
            "win_secret": "<b>Judge Insight:</b> Real-world utility is key. Demonstrate how this tool can reduce hiring bias by focusing purely on skill vectors rather than traditional resume formatting.",
            "industry": "HR-Tech / AI"
        }
    }
]

# Add specific entries at the beginning so they match first
data = specific_entries + data

with open('offline_data_1000.js', 'w', encoding='utf-8') as f:
    f.write("window.OFFLINE_KNOWLEDGE_BASE = " + json.dumps(data, indent=2) + ";")

print("Added Team Builder and Role Matcher to offline_data_1000.js")
