import json, re

# ── helpers ────────────────────────────────────────────────────────────────
def entry(industry, name, complexity, keywords, overview_body,
          techstack_body, ai_strategy_body, mega_prompt_body,
          db_schema_body, api_body, win_body,
          role1_title, role1_skills, role2_title, role2_skills,
          stack_list):
    return {
        "keywords": keywords,
        "result": {
            "overview": overview_body,
            "techstack": techstack_body,
            "ai_strategy": ai_strategy_body,
            "mega_prompt": mega_prompt_body,
            "database_schema": db_schema_body,
            "api_endpoints": api_body,
            "win_secret": win_body,
            "industry": industry
        },
        "team_result": {
            "project_summary": {
                "name": name,
                "complexity": complexity,
                "core_stack": stack_list
            },
            "roles": [
                {
                    "title": role1_title,
                    "type": "Engineering",
                    "priority": "Critical",
                    "description": f"Drives the core {industry} logic and domain-specific integrations.",
                    "primary_skills": role1_skills,
                    "responsibilities": ["Backend architecture","API design","Security hardening"]
                },
                {
                    "title": role2_title,
                    "type": "Engineering",
                    "priority": "Critical",
                    "description": f"Builds the AI pipeline and responsive frontend for {name}.",
                    "primary_skills": role2_skills,
                    "responsibilities": ["UI/UX implementation","AI workflow design","Prompt engineering"]
                }
            ],
            "skills_map": [
                {"domain":"Domain Logic","required_skills":[{"name":role1_skills[0],"level":"Expert"},{"name":"Business Logic","level":"High"}]},
                {"domain":"User Interface","required_skills":[{"name":"Next.js 14","level":"Expert"},{"name":"Tailwind CSS","level":"High"}]},
                {"domain":"Intelligence","required_skills":[{"name":"GPT-4o","level":"Expert"},{"name":"RAG Patterns","level":"High"}]}
            ],
            "task_timeline": [
                {"phase":"0-4h: Foundation","tasks":["Repo setup","Auth flow","DB schema"],"roles_involved":[role1_title]},
                {"phase":"4-12h: Core Build","tasks":["Main feature","API implementation","UI scaffold"],"roles_involved":[role2_title]},
                {"phase":"12-20h: AI Integration","tasks":["RAG pipeline","AI feature","Demo polish"],"roles_involved":[role1_title, role2_title]}
            ],
            "collaboration": {
                "tools":[{"name":"GitHub","use":"Monorepo"},{"name":"Notion","use":"PRD/Tasks"}],
                "protocols":["Immediate blocker escalation","Unified UI component library"]
            },
            "solo_strategy": {
                "is_solo": False,
                "warning": "Complex architecture — use AI pair-programming tools.",
                "ai_tools":[{"name":"Cursor/V0","use":"Speed up frontend scaffolding"}]
            }
        }
    }

# ── HealthTech (50 entries) ────────────────────────────────────────────────
HEALTHTECH_KW = [
    "hospital","patient","doctor","medical","health","clinic","healthcare",
    "diagnosis","treatment","ehr","emr","telemedicine","telehealth","wearable",
    "vitals","disease","pharmacy","radiology","mental health","wellness",
    "nursing","prescription","medication","lab results","imaging","xray","mri",
    "ecg","blood pressure","glucose","diabetes","cancer","cardiology",
    "pediatrics","dermatology","patient monitoring","remote patient monitoring",
    "health tracker","symptom checker","drug interaction","appointment booking",
    "health dashboard","ai diagnosis","ai doctor","smart hospital",
    "digital health","health analytics","predictive health","health chatbot",
    "medical chatbot","fhir","hl7","hipaa","dicom","helath","hosptial",
    "pateint","medcial","diagonsis","health app","doctor app","medical app",
    "hospital app","health startup","medtech","health hackathon","ai health",
    "reduce readmission","early detection","patient outcomes","clinical workflow",
    "electronic health record","hospital management","clinic management",
    "build health app","create medical system","win health track"
]

HEALTH_PROJECTS = [
    ("AI-Powered Symptom Checker","High"),
    ("Remote Patient Monitoring Platform","High"),
    ("EHR Management System","High"),
    ("AI Radiology Assistant","High"),
    ("Telemedicine Platform","Medium"),
    ("Medication Adherence Tracker","Medium"),
    ("Mental Health Companion App","Medium"),
    ("Hospital Bed Management System","Medium"),
    ("Drug Interaction Checker","Medium"),
    ("Predictive Readmission Risk Tool","High"),
    ("Smart Vital Signs Monitor","Medium"),
    ("AI Dermatology Screener","High"),
    ("Clinical Trial Matcher","High"),
    ("Patient Appointment Scheduler","Low"),
    ("Healthcare Analytics Dashboard","High"),
    ("Prescription Refill Automation","Medium"),
    ("AI-Assisted Pathology Viewer","High"),
    ("Chronic Disease Management App","Medium"),
    ("Elder Care Monitoring System","Medium"),
    ("Nutrition and Diet Planner","Low"),
    ("Mental Health Crisis Chatbot","Medium"),
    ("Telehealth Video Consultation","Medium"),
    ("FHIR Data Integration Hub","High"),
    ("Wearable Health Data Aggregator","High"),
    ("AI Cardiology ECG Analyzer","High"),
    ("Pediatric Growth Tracker","Low"),
    ("Vaccine Management System","Medium"),
    ("Hospital Supply Chain Optimizer","High"),
    ("Patient Feedback & NPS Platform","Low"),
    ("AI Triage Assistant","High"),
    ("Genomics Data Analyzer","High"),
    ("Diabetes Management Dashboard","Medium"),
    ("Oncology Treatment Planner","High"),
    ("Sleep Disorder Tracker","Medium"),
    ("Post-Surgical Recovery Monitor","Medium"),
    ("Medical Image Annotation Tool","High"),
    ("Pharmacy Inventory Manager","Medium"),
    ("Healthcare Fraud Detection","High"),
    ("Clinical Decision Support System","High"),
    ("Patient Discharge Planner","Medium"),
    ("Wellness Incentive Platform","Medium"),
    ("AI Mental Health Screener","Medium"),
    ("Home Health Aide Coordinator","Medium"),
    ("Blood Bank Management System","Medium"),
    ("Allergy & Immunology Tracker","Low"),
    ("Robotic Surgery Assistant UI","High"),
    ("Rehab Exercise Coach","Medium"),
    ("Health Insurance Claim Processor","High"),
    ("Epidemic Outbreak Predictor","High"),
    ("Hospital Wayfinding App","Low"),
]

def healthtech_entries():
    entries = []
    for i, (proj_name, complexity) in enumerate(HEALTH_PROJECTS):
        kw = list(HEALTHTECH_KW)  # 70 keywords
        full_name = f"HealthTech {proj_name}"
        ov = (f'<h3>🏥 {proj_name}</h3><p>The global digital health market is projected to reach '
              f'<b>$659 billion by 2025</b>. This solution targets a critical gap in clinical workflows '
              f'by leveraging AI to deliver real-time {proj_name.lower()} capabilities. '
              f'Built on FHIR-compliant APIs and HIPAA-ready infrastructure, it can reduce operational '
              f'costs by up to 35% and improve patient outcomes measurably. The winning angle: '
              f'demonstrate a live AI feature — symptom analysis, imaging inference, or predictive '
              f'risk — in the first 60 seconds of your demo. Judges respond to working AI, not slides. '
              f'Target the HealthTech track and mention interoperability with Epic or Cerner for bonus credibility.</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui + Framer Motion.<br>'
              '<h4>Backend:</h4> FastAPI (Python) + Celery for async tasks.<br>'
              '<h4>Database:</h4> PostgreSQL + Redis cache + Pinecone vector store.<br>'
              '<h4>Auth:</h4> Clerk with HIPAA-compliant session handling.<br>'
              '<h4>AI:</h4> GPT-4o for reasoning + Med-PaLM 2 embeddings + Whisper for voice.<br>'
              '<h4>Deploy:</h4> Vercel (frontend) + Railway (backend) + Cloudflare CDN.')
        ai = (f'1. <b>Data Ingestion:</b> Parse HL7/FHIR messages, PDF lab reports, and wearable streams into structured JSON.<br>'
              f'2. <b>Embedding Pipeline:</b> Chunk clinical notes → embed with text-embedding-3-large → store in Pinecone.<br>'
              f'3. <b>RAG Query:</b> User query → semantic search → top-5 context chunks → GPT-4o with system prompt enforcing HIPAA disclaimers.<br>'
              f'4. <b>Prediction Model:</b> XGBoost classifier on structured vitals data for risk scoring (diabetes, readmission, sepsis).<br>'
              f'5. <b>Vision AI:</b> YOLOv8 / Med-SAM for medical image analysis (X-ray, skin lesion, retinal scan).<br>'
              f'6. <b>Offline Fallback:</b> Pre-cached clinical guidelines JSON served when API rate limit hit during demo.')
        mp = (f'You are a Principal Full-Stack Engineer and Medical AI Specialist. Build "{full_name}" — '
              f'a production-ready health platform using Next.js 14, FastAPI, PostgreSQL, and GPT-4o. '
              f'Requirements: (1) HIPAA-compliant auth via Clerk with role-based access for Doctor/Patient/Admin. '
              f'(2) Real-time dashboard showing patient vitals, alerts, and AI-generated summaries. '
              f'(3) RAG pipeline: ingest FHIR/HL7 data → embed → query GPT-4o for clinical insights. '
              f'(4) Predictive risk scoring using XGBoost on structured patient data. '
              f'(5) FHIR R4 API endpoints for interoperability with Epic/Cerner. '
              f'(6) Mobile-first dark/light UI with Framer Motion transitions. '
              f'Demo flow: Login as doctor → view patient list → click patient → see AI risk score + '
              f'clinical summary → trigger AI recommendation. This should wow judges in 90 seconds. '
              f'Deploy on Vercel + Railway. Use shadcn/ui for all components. Start with auth + DB schema.')
        db = ('Table users { id uuid [pk], email varchar, role enum(doctor,patient,admin), org_id uuid, created_at timestamp }\n'
              'Table patients { id uuid [pk], user_id uuid [ref: > users.id], dob date, gender varchar, medical_record_no varchar, insurance_id varchar }\n'
              'Table vitals { id uuid [pk], patient_id uuid [ref: > patients.id], recorded_at timestamp, heart_rate int, bp_systolic int, bp_diastolic int, spo2 float, glucose float, weight float }\n'
              'Table clinical_notes { id uuid [pk], patient_id uuid [ref: > patients.id], author_id uuid, note_text text, embedding vector(1536), created_at timestamp }\n'
              'Table appointments { id uuid [pk], patient_id uuid, doctor_id uuid, scheduled_at timestamp, status enum(pending,confirmed,completed,cancelled), notes text }')
        api = ('- POST /api/v1/auth/register\n- POST /api/v1/auth/login\n- GET /api/v1/patients\n'
               '- GET /api/v1/patients/{id}\n- POST /api/v1/patients/{id}/vitals\n'
               '- GET /api/v1/patients/{id}/risk-score\n- POST /api/v1/notes/search (RAG)\n'
               '- POST /api/v1/ai/diagnose\n- GET /api/v1/appointments\n- POST /api/v1/appointments\n'
               '- PUT /api/v1/appointments/{id}\n- GET /api/v1/analytics/dashboard\n'
               '- POST /api/v1/fhir/patient (FHIR R4)\n- GET /api/v1/fhir/observation/{id}\n'
               '- WS /ws/vitals-stream (real-time vitals)')
        win = ('<b>Judge Psychology:</b> Health judges fear two things: fake demos and privacy violations. '
               'Preempt both — show real FHIR data flowing, mention HIPAA/HL7, and have a fallback dataset ready.<br>'
               '<b>Demo Hook (0-30s):</b> Open with a live patient risk alert firing — "This patient has a 78% readmission risk. '
               'Here\'s why." Judges will lean forward.<br>'
               '<b>Market Stat:</b> "EHR interoperability failures cost the US $8.3 billion annually — we fix that."<br>'
               '<b>Q&A Prep:</b> Know HIPAA Safe Harbor, FHIR R4 vs DSTU2, and how you\'d handle PHI in production.')
        entries.append(entry(
            "HealthTech", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead Healthcare Backend Engineer", ["FastAPI","PostgreSQL","FHIR/HL7"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","Prompt Engineering"],
            ["Next.js 14","FastAPI","GPT-4o"]
        ))
    return entries

# ── EdTech (50 entries) ────────────────────────────────────────────────────
EDTECH_KW = [
    "education","learning","student","teacher","school","university","course",
    "lms","elearning","e-learning","online learning","classroom","curriculum",
    "tutoring","quiz","assessment","grade","exam","lecture","homework",
    "edtech","educational technology","adaptive learning","personalized learning",
    "mooc","khan academy","coursera","udemy","skill","training","certification",
    "flashcard","study","revision","spaced repetition","gamification","badge",
    "leaderboard","progress tracking","ai tutor","ai teacher","ai quiz generator",
    "content generation","video lecture","transcript","study planner",
    "learning analytics","student performance","dropout prediction","engagement",
    "accessibility education","special needs","dyslexia","language learning",
    "coding bootcamp","stem education","university app","school app","edcation",
    "studetn","learing","taecher","ai education","education hackathon",
    "build lms","create tutoring app","education startup","ed tech","learn tech",
    "knowledge graph","competency mapping","micro-learning","bite-sized learning"
]

EDTECH_PROJECTS = [
    ("AI Adaptive Learning Platform","High"),
    ("Smart Quiz Generator","Medium"),
    ("Student Performance Analytics","High"),
    ("AI-Powered Essay Grader","High"),
    ("Personalized Study Planner","Medium"),
    ("Interactive Coding Bootcamp","High"),
    ("Gamified Language Learning App","Medium"),
    ("Virtual Classroom Platform","High"),
    ("AI Flashcard Generator","Medium"),
    ("Dropout Risk Prediction System","High"),
    ("Micro-Learning Content Creator","Medium"),
    ("Peer Tutoring Marketplace","Medium"),
    ("School Administration Dashboard","Medium"),
    ("AI Math Problem Solver","Medium"),
    ("Curriculum Mapping Tool","High"),
    ("Video Lecture Transcription","Medium"),
    ("Accessibility Learning Tools","Medium"),
    ("STEM Lab Simulator","High"),
    ("Parent-Teacher Communication App","Low"),
    ("Exam Scheduling Optimizer","Medium"),
    ("Knowledge Graph Builder","High"),
    ("Competency-Based Assessment","High"),
    ("Spaced Repetition Study System","Medium"),
    ("AI Writing Coach","Medium"),
    ("Learning Path Recommender","High"),
    ("Campus Safety Alert System","Medium"),
    ("Student Mental Wellness App","Medium"),
    ("Internship Matching Platform","High"),
    ("Alumni Network Builder","Medium"),
    ("Hackathon Team Finder for Students","Low"),
    ("Virtual Science Fair Platform","Medium"),
    ("Accessibility Caption Generator","Medium"),
    ("AI Debate Practice Coach","Medium"),
    ("Financial Aid Advisor Bot","Medium"),
    ("University Course Planner","Medium"),
    ("Teacher Resource Marketplace","Medium"),
    ("Student Portfolio Builder","Low"),
    ("Library Digital Catalog AI","Medium"),
    ("AI Research Paper Summarizer","Medium"),
    ("Collaborative Note-Taking App","Low"),
    ("Educational Game Engine","High"),
    ("Skill Gap Analyzer","High"),
    ("Professional Certification Tracker","Medium"),
    ("AI Code Review for Students","High"),
    ("Reading Comprehension Trainer","Medium"),
    ("Multilingual Content Translator","Medium"),
    ("Early Childhood Development Tracker","Low"),
    ("Special Education IEP Manager","Medium"),
    ("Hackathon Project Showcase","Low"),
    ("Career Readiness Assessment","Medium"),
]

def edtech_entries():
    entries = []
    for proj_name, complexity in EDTECH_PROJECTS:
        kw = list(EDTECH_KW)
        full_name = f"EdTech {proj_name}"
        ov = (f'<h3>📚 {proj_name}</h3><p>The global EdTech market is valued at <b>$404 billion and growing at 16% CAGR</b>. '
              f'This platform addresses the critical need for {proj_name.lower()} using AI-driven personalization. '
              f'Studies show AI tutoring can improve learning outcomes by 30-40% versus traditional methods. '
              f'The winning angle: show a live AI interaction — adaptive quiz, instant feedback, or personalized path — '
              f'in the first 60 seconds. Target learners aged 13-35, the most digitally engaged segment. '
              f'Integrates with Google Classroom, Canvas, and Moodle via LTI 1.3 for institutional adoption. '
              f'Highlight accessibility features to score diversity/inclusion bonus points with judges.</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui + Lottie animations.<br>'
              '<h4>Backend:</h4> Node.js (Express) + Bull queue for async jobs.<br>'
              '<h4>Database:</h4> PostgreSQL + Redis + Pinecone vector store.<br>'
              '<h4>Auth:</h4> Clerk with Google/GitHub OAuth for students.<br>'
              '<h4>AI:</h4> GPT-4o for content generation + Whisper for voice + DALL-E 3 for visuals.<br>'
              '<h4>Deploy:</h4> Vercel + Railway + Cloudflare R2 for media storage.')
        ai = ('1. <b>Personalization Engine:</b> Track user interactions → build knowledge graph → recommend next lesson via collaborative filtering.<br>'
              '2. <b>Content RAG:</b> Upload curriculum PDFs → chunk → embed (text-embedding-3-large) → store in Pinecone → GPT-4o generates questions.<br>'
              '3. <b>Assessment AI:</b> GPT-4o evaluates open-ended answers with rubric-based scoring and detailed feedback.<br>'
              '4. <b>Dropout Predictor:</b> XGBoost model on engagement features (login frequency, quiz scores, time-on-task) for early intervention.<br>'
              '5. <b>Voice Features:</b> Whisper transcribes lecture audio → GPT-4o generates summaries and flashcards automatically.<br>'
              '6. <b>Offline Mode:</b> Pre-cached lesson content + local quiz engine for low-connectivity environments.')
        mp = (f'You are a Principal EdTech Engineer. Build "{full_name}" — a production-ready learning platform using '
              f'Next.js 14, Node.js, PostgreSQL, and GPT-4o. Requirements: (1) Multi-role auth (Student/Teacher/Admin) via Clerk. '
              f'(2) AI-powered adaptive learning path that adjusts based on performance. '
              f'(3) RAG pipeline: ingest course materials → embed → query GPT-4o for tutoring responses. '
              f'(4) Real-time quiz engine with instant AI feedback and progress tracking. '
              f'(5) Analytics dashboard showing student engagement, risk scores, and completion rates. '
              f'(6) LTI 1.3 integration endpoint for Google Classroom/Canvas. '
              f'Demo flow: Log in as student → start adaptive quiz → get instant AI explanation → '
              f'view personalized study plan → teacher sees class analytics. '
              f'Use shadcn/ui components, dark mode, smooth Framer Motion transitions. '
              f'Deploy on Vercel + Railway. Start with auth + database schema + quiz engine core.')
        db = ('Table users { id uuid [pk], email varchar, role enum(student,teacher,admin), name varchar, created_at timestamp }\n'
              'Table courses { id uuid [pk], teacher_id uuid [ref: > users.id], title varchar, description text, published bool }\n'
              'Table lessons { id uuid [pk], course_id uuid [ref: > courses.id], title varchar, content text, embedding vector(1536), order_index int }\n'
              'Table enrollments { id uuid [pk], student_id uuid, course_id uuid, enrolled_at timestamp, progress float, last_active timestamp }\n'
              'Table quiz_attempts { id uuid [pk], student_id uuid, lesson_id uuid, score float, answers jsonb, completed_at timestamp, ai_feedback text }')
        api = ('- POST /api/v1/auth/register\n- POST /api/v1/auth/login\n- GET /api/v1/courses\n'
               '- POST /api/v1/courses\n- GET /api/v1/courses/{id}/lessons\n'
               '- POST /api/v1/ai/generate-quiz\n- POST /api/v1/ai/evaluate-answer\n'
               '- GET /api/v1/students/{id}/progress\n- GET /api/v1/students/{id}/recommendations\n'
               '- POST /api/v1/ai/summarize-lecture\n- GET /api/v1/analytics/class-overview\n'
               '- GET /api/v1/analytics/dropout-risk\n- POST /api/v1/lti/launch\n'
               '- GET /api/v1/flashcards/{lesson_id}\n- WS /ws/quiz-session (real-time multiplayer quiz)')
        win = ('<b>Judge Psychology:</b> EdTech judges care about learning outcomes and accessibility. '
               'Show a before/after — "without our AI, students get generic content; with it, they get personalized paths."<br>'
               '<b>Demo Hook (0-30s):</b> Live AI quiz generation from a pasted URL or PDF. "I just uploaded a textbook chapter — '
               'here are 10 adaptive quiz questions in 3 seconds."<br>'
               '<b>Market Stat:</b> "30% of online learners drop out in week 1. Our AI reduces that by predicting at-risk students 48 hours in advance."<br>'
               '<b>Q&A Prep:</b> Know FERPA (student data privacy), WCAG 2.1 AA for accessibility, and LTI 1.3 for LMS integration.')
        entries.append(entry(
            "EdTech", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead EdTech Backend Engineer", ["Node.js","PostgreSQL","LTI 1.3"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","Adaptive Learning"],
            ["Next.js 14","Node.js","GPT-4o"]
        ))
    return entries

# ── FinTech (50 entries) ────────────────────────────────────────────────────
FINTECH_KW = [
    "finance","fintech","banking","payment","wallet","crypto","blockchain",
    "defi","trading","investment","loan","mortgage","insurance","tax","budget",
    "expense","money","currency","exchange","credit","debt","savings","revenue",
    "cashflow","invoice","payroll","audit","compliance","kyc","aml","fraud",
    "stock","portfolio","robo-advisor","neobank","open banking","plaid","stripe",
    "api banking","payment gateway","swift","sepa","ach","iban","bic",
    "financial dashboard","wealth management","asset management","microfinance",
    "crowdfunding","p2p lending","buy now pay later","bnpl","nft","tokenization",
    "smart contract","solidity","ethereum","web3 finance","fintch","fincance",
    "payemnt","investement","blokchain","crytpo","fintech app","banking app",
    "payment app","finance startup","fintech hackathon","build fintech",
    "create payment system","win fintech track","money management app",
    "financial inclusion","underbanked","remittance","cross-border payment"
]

FINTECH_PROJECTS = [
    ("AI Personal Finance Manager","High"),
    ("Fraud Detection System","High"),
    ("Crypto Portfolio Tracker","Medium"),
    ("Invoice Automation Platform","Medium"),
    ("Robo-Advisor Investment App","High"),
    ("KYC Identity Verification","High"),
    ("Open Banking Data Aggregator","High"),
    ("BNPL Credit Scoring Engine","High"),
    ("Cross-Border Payment System","High"),
    ("Tax Filing Assistant AI","Medium"),
    ("Expense Tracking Dashboard","Medium"),
    ("Small Business Lending Platform","High"),
    ("Insurance Claim Processor","High"),
    ("Crypto DeFi Yield Optimizer","High"),
    ("Payroll Automation System","Medium"),
    ("Financial Literacy Chatbot","Medium"),
    ("Stock Market Sentiment Analyzer","High"),
    ("Neobank Mobile App","High"),
    ("P2P Lending Marketplace","High"),
    ("Budget Planning AI","Medium"),
    ("Regulatory Compliance Checker","High"),
    ("Payment Reconciliation Tool","Medium"),
    ("NFT Marketplace Analytics","High"),
    ("ESG Investment Screener","High"),
    ("Microfinance Platform","High"),
    ("Treasury Management Dashboard","High"),
    ("Currency Exchange Rate Tracker","Low"),
    ("Smart Contract Auditor","High"),
    ("Wealth Management Platform","High"),
    ("Financial Inclusion App","Medium"),
    ("Real Estate Investment Analyzer","High"),
    ("Credit Card Rewards Optimizer","Medium"),
    ("Anti-Money Laundering Scanner","High"),
    ("Payroll Tax Calculator","Medium"),
    ("Subscription Management Platform","Medium"),
    ("Crowdfunding Analytics Tool","Medium"),
    ("Digital Bank Onboarding","Medium"),
    ("Loan Origination System","High"),
    ("Merchant Analytics Dashboard","High"),
    ("Savings Goal Tracker","Low"),
    ("Financial Document Parser","High"),
    ("Risk Assessment Engine","High"),
    ("Remittance Tracker","Medium"),
    ("Accounting Automation AI","High"),
    ("Investment Research Aggregator","High"),
    ("Peer-to-Peer Donation Platform","Medium"),
    ("Crypto Staking Rewards Manager","Medium"),
    ("Insurance Premium Calculator","Medium"),
    ("Corporate Card Spend Analyzer","High"),
    ("Embedded Finance SDK","High"),
]

def fintech_entries():
    entries = []
    for proj_name, complexity in FINTECH_PROJECTS:
        kw = list(FINTECH_KW)
        full_name = f"FinTech {proj_name}"
        ov = (f'<h3>💰 {proj_name}</h3><p>Global FinTech investment reached <b>$226 billion in 2023</b>, '
              f'with AI-driven solutions capturing the fastest-growing share. '
              f'This platform addresses {proj_name.lower()} — a pain point affecting millions of users and billions in '
              f'lost or inefficient capital daily. The winning angle: demonstrate real money movement, '
              f'live fraud detection, or AI-driven financial insight within the first 30 seconds. '
              f'Built on PCI-DSS compliant infrastructure with end-to-end encryption. '
              f'Integrates Plaid for bank connections, Stripe for payments, and OpenAI for intelligence. '
              f'Judges respond to demos where they can see actual transactions and AI reasoning in real time.</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui + Recharts for financial visualizations.<br>'
              '<h4>Backend:</h4> Go (Fiber) — optimal for high-throughput financial APIs.<br>'
              '<h4>Database:</h4> PostgreSQL (ACID) + Redis for rate limiting + TimescaleDB for time-series data.<br>'
              '<h4>Auth:</h4> Clerk with MFA + JWT with short expiry for security.<br>'
              '<h4>Integrations:</h4> Plaid API + Stripe + Coinbase Commerce + Twilio for OTP.<br>'
              '<h4>AI:</h4> GPT-4o for NLP + XGBoost for fraud/risk scoring.<br>'
              '<h4>Deploy:</h4> Vercel + Railway + AWS S3 for statements.')
        ai = ('1. <b>Transaction Intelligence:</b> Parse raw bank transactions → GPT-4o categorizes and extracts insights → stored with embeddings.<br>'
              '2. <b>Fraud Detection:</b> XGBoost model trained on transaction patterns → real-time scoring on every transaction → alert pipeline.<br>'
              '3. <b>RAG Financial Advisor:</b> User query → semantic search over financial knowledge base → GPT-4o generates personalized advice.<br>'
              '4. <b>Anomaly Detection:</b> Isolation Forest on spending patterns → flag unusual activity → push notification.<br>'
              '5. <b>Document AI:</b> GPT-4 Vision parses bank statements, invoices, tax docs → structured JSON extraction.<br>'
              '6. <b>Offline Fallback:</b> Cached financial tips + local rule-based fraud flags when API unavailable during demo.')
        mp = (f'You are a Principal FinTech Engineer with deep expertise in financial systems and AI. '
              f'Build "{full_name}" using Next.js 14, Go (Fiber), PostgreSQL, and GPT-4o. '
              f'Requirements: (1) PCI-DSS compliant auth via Clerk with MFA. (2) Plaid integration for real bank account linking. '
              f'(3) Real-time transaction feed with AI categorization and anomaly detection. '
              f'(4) XGBoost fraud scoring on every transaction with risk level display. '
              f'(5) Financial dashboard with Recharts showing spending trends, net worth, savings rate. '
              f'(6) RAG chatbot for personalized financial advice using GPT-4o. '
              f'(7) Export statements as PDF. '
              f'Demo flow: Connect bank → see AI-categorized transactions → get fraud alert → ask AI "how can I save more?" → see AI advice. '
              f'Use Go Fiber for all financial APIs (performance critical). PostgreSQL with proper indexing. '
              f'Deploy Vercel + Railway. Start with auth, Plaid integration, and transaction schema.')
        db = ('Table users { id uuid [pk], email varchar, name varchar, risk_profile enum(conservative,moderate,aggressive), kyc_status enum, created_at timestamp }\n'
              'Table bank_accounts { id uuid [pk], user_id uuid [ref: > users.id], plaid_account_id varchar, institution varchar, balance float, currency varchar, last_synced timestamp }\n'
              'Table transactions { id uuid [pk], account_id uuid [ref: > bank_accounts.id], amount float, merchant varchar, category varchar, ai_category varchar, fraud_score float, date timestamp }\n'
              'Table ai_insights { id uuid [pk], user_id uuid, insight_type varchar, content text, embedding vector(1536), created_at timestamp }\n'
              'Table budgets { id uuid [pk], user_id uuid, category varchar, limit_amount float, period enum(weekly,monthly), spent_amount float }')
        api = ('- POST /api/v1/auth/register\n- POST /api/v1/auth/login\n- POST /api/v1/plaid/link-token\n'
               '- POST /api/v1/plaid/exchange-token\n- GET /api/v1/accounts\n'
               '- GET /api/v1/transactions?account_id=&from=&to=\n- POST /api/v1/transactions/categorize\n'
               '- GET /api/v1/fraud/score/{transaction_id}\n- GET /api/v1/analytics/spending-summary\n'
               '- POST /api/v1/ai/advice (RAG endpoint)\n- GET /api/v1/budgets\n- POST /api/v1/budgets\n'
               '- GET /api/v1/net-worth\n- POST /api/v1/export/statement (PDF)\n'
               '- WS /ws/transaction-stream (real-time feed)')
        win = ('<b>Judge Psychology:</b> FinTech judges test security instincts. Mention "PCI-DSS", "end-to-end encryption", '
               '"tokenized card data" in your first minute — it signals production-readiness.<br>'
               '<b>Demo Hook (0-30s):</b> Connect a real (or sandbox) bank account live. Watch transactions populate. '
               'Then trigger a fraud alert on a suspicious transaction. Judges lean forward immediately.<br>'
               '<b>Market Stat:</b> "Global payment fraud losses hit $40 billion in 2023. Our AI catches 94% of fraudulent patterns in under 200ms."<br>'
               '<b>Q&A Prep:</b> Know PCI-DSS Level 1 requirements, Plaid vs direct bank API tradeoffs, and KYC/AML regulations by region.')
        entries.append(entry(
            "FinTech", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead FinTech Backend Engineer", ["Go (Fiber)","PostgreSQL","Plaid API"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","XGBoost"],
            ["Next.js 14","Go (Fiber)","GPT-4o"]
        ))
    return entries

# ── SmartCity (50 entries) ──────────────────────────────────────────────────
SMARTCITY_KW = [
    "smart city","urban","city","municipality","government","public sector",
    "infrastructure","traffic","transport","transit","bus","metro","parking",
    "traffic lights","congestion","road","sidewalk","pedestrian","bike lane",
    "air quality","pollution","noise","sensor","iot","smart sensor","lidar",
    "city data","open data","gis","geospatial","mapping","urban planning",
    "zoning","permit","building","utility","water","energy","electricity",
    "waste","recycling","garbage","emergency","police","fire","ambulance",
    "citizen services","e-government","civic tech","public safety","surveillance",
    "smart lighting","smart parking","smart grid","flood detection","disaster",
    "urban mobility","ride sharing","autonomous vehicle","last mile","city app",
    "smrt city","uban","trafic","municpality","smart city hackathon","civic hack",
    "build smart city","urban tech","city startup","govtech","government tech",
    "public transport app","citizen engagement","city dashboard","urban analytics"
]

SMARTCITY_PROJECTS = [
    ("AI Traffic Flow Optimizer","High"),
    ("Smart Parking System","Medium"),
    ("Air Quality Monitoring Dashboard","Medium"),
    ("Citizen Service Request Portal","Medium"),
    ("Smart Street Lighting Controller","Medium"),
    ("Urban Mobility Analytics","High"),
    ("Flood Early Warning System","High"),
    ("Smart Waste Management","Medium"),
    ("Public Safety Incident Tracker","High"),
    ("City Budget Transparency Dashboard","Medium"),
    ("E-Government Document Portal","Medium"),
    ("Smart Grid Energy Optimizer","High"),
    ("Urban Heat Island Mapper","High"),
    ("Public Transit Real-Time Tracker","High"),
    ("Pothole Detection System","Medium"),
    ("Noise Pollution Monitor","Medium"),
    ("Urban Green Space Finder","Low"),
    ("Building Permit Automation","Medium"),
    ("Smart Meter Dashboard","Medium"),
    ("City Accessibility Map","Medium"),
    ("Disaster Response Coordinator","High"),
    ("Community Engagement Platform","Medium"),
    ("Urban Crime Predictor","High"),
    ("Smart Bike-Share System","Medium"),
    ("City Carbon Footprint Tracker","High"),
    ("Digital Twin City Visualizer","High"),
    ("Smart Crosswalk System","Medium"),
    ("Utility Outage Tracker","Medium"),
    ("Parks & Recreation Booking","Low"),
    ("City Event Management System","Low"),
    ("Urban Logistics Optimizer","High"),
    ("Smart School Zone Alert","Medium"),
    ("City Data Open Portal","High"),
    ("Autonomous Shuttle Tracker","High"),
    ("Urban Water Quality Monitor","Medium"),
    ("Smart Fire Hydrant Monitor","Medium"),
    ("City-Wide Wi-Fi Analytics","Medium"),
    ("Public Feedback Sentiment Analyzer","Medium"),
    ("Urban Agriculture Zone Planner","Medium"),
    ("Emergency Alert Broadcast System","High"),
    ("City Volunteer Coordinator","Low"),
    ("Smart Library System","Low"),
    ("Urban Inequality Heatmap","High"),
    ("City Noise Complaint Handler","Low"),
    ("Smart Bus Stop Display","Medium"),
    ("Urban Planning AI Advisor","High"),
    ("City Event Safety Monitor","Medium"),
    ("Road Condition Reporter","Medium"),
    ("Smart Lamppost Network","Medium"),
    ("Civic Crowdfunding Platform","Medium"),
]

def smartcity_entries():
    entries = []
    for proj_name, complexity in SMARTCITY_PROJECTS:
        kw = list(SMARTCITY_KW)
        full_name = f"SmartCity {proj_name}"
        ov = (f'<h3>🏙️ {proj_name}</h3><p>The global smart city market will reach <b>$873 billion by 2026</b>. '
              f'Cities worldwide are investing in digital infrastructure to improve livability, reduce costs, and cut emissions. '
              f'This platform delivers {proj_name.lower()} by fusing IoT sensor data, open government datasets, '
              f'and AI to create actionable insights for city administrators and citizens. '
              f'The winning angle: show a live map or dashboard with real data — even simulated — '
              f'that reacts in real time. Judges from civic tech backgrounds respond to "measurable impact" — '
              f'cite emissions reduced, minutes saved, or dollars saved per resident. '
              f'Integrates with city open data APIs and standard GIS formats (GeoJSON, Shapefile).</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + Mapbox GL JS / Leaflet + Recharts.<br>'
              '<h4>Backend:</h4> FastAPI (Python) + MQTT broker for IoT data + Celery for processing.<br>'
              '<h4>Database:</h4> PostgreSQL + PostGIS for geospatial + InfluxDB for time-series IoT.<br>'
              '<h4>Auth:</h4> Clerk with government SSO integration (SAML ready).<br>'
              '<h4>AI:</h4> GPT-4o for NLP queries + scikit-learn for anomaly detection + TensorFlow Lite edge models.<br>'
              '<h4>Deploy:</h4> Vercel + Railway + AWS IoT Core for sensor ingestion.')
        ai = ('1. <b>IoT Ingestion:</b> MQTT broker receives sensor streams → FastAPI normalizes → stored in InfluxDB with PostGIS tags.<br>'
              '2. <b>Anomaly Detection:</b> Isolation Forest on time-series data detects traffic spikes, air quality drops, flood levels.<br>'
              '3. <b>Natural Language Query:</b> Citizens/admins type "show me traffic hotspots yesterday" → GPT-4o translates to SQL/API call.<br>'
              '4. <b>Predictive Routing:</b> ML model predicts traffic 15 min ahead using historical + real-time feeds for transit optimization.<br>'
              '5. <b>Satellite/GIS Analysis:</b> Segment anything model (SAM) on aerial imagery for green space, parking, building change detection.<br>'
              '6. <b>Offline Fallback:</b> Pre-cached city datasets (OSM) + local rule-based alerts when cloud connectivity drops.')
        mp = (f'You are a Principal Smart City Platform Engineer. Build "{full_name}" using Next.js 14, FastAPI, '
              f'PostgreSQL + PostGIS, and GPT-4o. Requirements: (1) Interactive Mapbox map showing real-time city data layers. '
              f'(2) IoT sensor data ingestion via MQTT → InfluxDB → live dashboard. '
              f'(3) AI natural language query interface: type city questions → get map + data response. '
              f'(4) Anomaly detection alerting with push notifications for critical events. '
              f'(5) City admin panel for managing reports, permits, and citizen requests. '
              f'(6) Public citizen-facing portal with transparent city data. '
              f'Demo flow: Show map with live sensor overlay → trigger anomaly alert → admin resolves → citizen sees update. '
              f'Use Mapbox GL JS for mapping, PostGIS for geospatial queries, InfluxDB for sensor time-series. '
              f'Deploy Vercel + Railway. Start with map component + sensor ingestion pipeline.')
        db = ('Table sensors { id uuid [pk], location geometry(Point,4326), type varchar, name varchar, status enum(active,offline), installed_at timestamp }\n'
              'Table sensor_readings { id uuid [pk], sensor_id uuid [ref: > sensors.id], value float, unit varchar, recorded_at timestamp, anomaly_score float }\n'
              'Table incidents { id uuid [pk], type varchar, location geometry(Point,4326), description text, status enum(open,in_progress,resolved), reported_at timestamp, resolved_at timestamp }\n'
              'Table citizen_requests { id uuid [pk], user_id uuid, category varchar, description text, location geometry(Point,4326), status varchar, created_at timestamp }\n'
              'Table city_zones { id uuid [pk], name varchar, type varchar, boundary geometry(Polygon,4326), properties jsonb }')
        api = ('- GET /api/v1/sensors?bbox=&type=\n- POST /api/v1/sensors/{id}/readings\n'
               '- GET /api/v1/sensors/{id}/readings?from=&to=\n- GET /api/v1/incidents\n'
               '- POST /api/v1/incidents\n- PUT /api/v1/incidents/{id}/status\n'
               '- GET /api/v1/analytics/air-quality\n- GET /api/v1/analytics/traffic-heatmap\n'
               '- POST /api/v1/citizen-requests\n- GET /api/v1/citizen-requests?status=\n'
               '- POST /api/v1/ai/city-query (NLP → data)\n- GET /api/v1/city-zones\n'
               '- GET /api/v1/open-data/export\n- GET /api/v1/alerts\n'
               '- WS /ws/sensor-stream (real-time IoT feed)')
        win = ('<b>Judge Psychology:</b> Smart city judges are often government officials or urban planners. '
               'Use their language: "cost per citizen", "service level agreement", "interoperability with existing systems".<br>'
               '<b>Demo Hook (0-30s):</b> Open the map, show a live sensor anomaly firing — "This air quality sensor just hit dangerous levels. '
               'Our system auto-dispatched the alert and logged the incident."<br>'
               '<b>Market Stat:</b> "Cities lose $87 billion annually to traffic congestion. Our AI routing reduces commute times by 18%."<br>'
               '<b>Q&A Prep:</b> Know GDPR for public surveillance data, open data standards (GTFS, CityGML), and how to handle legacy city infrastructure APIs.')
        entries.append(entry(
            "SmartCity", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead SmartCity Backend Engineer", ["FastAPI","PostGIS","MQTT/IoT"],
            "Full-Stack AI Developer", ["Next.js 14","Mapbox GL","GPT-4o"],
            ["Next.js 14","FastAPI","PostGIS"]
        ))
    return entries

# ── AgriTech (50 entries) ──────────────────────────────────────────────────
AGRITECH_KW = [
    "agriculture","farming","farm","crop","soil","irrigation","fertilizer",
    "harvest","yield","pest","disease","livestock","cattle","poultry","dairy",
    "agritech","precision agriculture","smart farming","vertical farming",
    "hydroponics","aquaponics","greenhouse","food security","rural","farmer",
    "agronomy","satellite imagery","drone","ndvi","remote sensing","weather",
    "microclimate","soil moisture","ph level","crop monitoring","plant health",
    "supply chain","cold chain","market price","commodity","grain","rice",
    "wheat","corn","cotton","soybean","carbon farming","regenerative agriculture",
    "farm management","fms","iot farm","sensor farm","agri data","crop yield",
    "farmar","agrcultural","crrop","irgation","agri app","farming app",
    "agriculture hackathon","agri startup","smart agriculture","farm tech",
    "build farm app","create agriculture system","win agritech track",
    "food waste","food production","food system","sustainable farming"
]

AGRITECH_PROJECTS = [
    ("AI Crop Disease Detector","High"),
    ("Smart Irrigation Controller","High"),
    ("Precision Farming Dashboard","High"),
    ("Livestock Health Monitor","Medium"),
    ("Market Price Intelligence","Medium"),
    ("Farm Management System","High"),
    ("Drone Field Analysis Tool","High"),
    ("Soil Health Analyzer","Medium"),
    ("Weather-Crop Yield Predictor","High"),
    ("Supply Chain Transparency Platform","High"),
    ("Vertical Farm Optimizer","High"),
    ("Crop Insurance Automation","High"),
    ("Pest Detection System","High"),
    ("Agricultural Loan Platform","High"),
    ("Cold Chain Monitor","Medium"),
    ("Farmer Advisory Chatbot","Medium"),
    ("Greenhouse Automation System","High"),
    ("Carbon Farming Credit Tracker","High"),
    ("Seed Quality Checker","Medium"),
    ("Agricultural Marketplace","Medium"),
    ("Water Usage Optimizer","Medium"),
    ("Harvest Planning Scheduler","Medium"),
    ("Livestock Feed Optimizer","Medium"),
    ("Farm Worker Safety Monitor","Medium"),
    ("Aquaponics Controller","Medium"),
    ("Farm Carbon Footprint Calculator","Medium"),
    ("Satellite NDVI Crop Analyzer","High"),
    ("Agricultural Export Tracker","Medium"),
    ("Rural Financial Inclusion Platform","High"),
    ("Animal Behavior Analyzer","High"),
    ("Agri E-Commerce Platform","Medium"),
    ("Crop Rotation Planner","Medium"),
    ("Smart Poultry Farm Manager","Medium"),
    ("Farm Equipment Tracker","Medium"),
    ("Composting AI Advisor","Low"),
    ("Farm-to-Table Traceability","High"),
    ("Agricultural Data Marketplace","High"),
    ("Hydroponics Nutrient Controller","Medium"),
    ("Food Safety Compliance Checker","High"),
    ("Dairy Farm Milk Quality Monitor","Medium"),
    ("Swarm Drone Coordinator","High"),
    ("Agricultural Subsidy Tracker","Medium"),
    ("Farm Succession Planner","Low"),
    ("Beekeeping Health Monitor","Medium"),
    ("Seed Bank Management System","Medium"),
    ("Crop Storage Optimizer","Medium"),
    ("Rural Telemedicine for Farmers","Medium"),
    ("Agricultural Waste Recycler","Medium"),
    ("Smart Fertilizer Dispenser","Medium"),
    ("Precision Livestock Farming","High"),
]

def agritech_entries():
    entries = []
    for proj_name, complexity in AGRITECH_PROJECTS:
        kw = list(AGRITECH_KW)
        full_name = f"AgriTech {proj_name}"
        ov = (f'<h3>🌾 {proj_name}</h3><p>Global food demand will increase <b>50% by 2050</b>, '
              f'yet 30% of crops are lost to inefficiency, disease, and climate. '
              f'This platform tackles {proj_name.lower()} using a fusion of satellite imagery, IoT sensors, '
              f'and AI to give farmers data-driven superpowers. The market opportunity: '
              f'<b>570 million farms worldwide</b>, 80% without access to real-time analytics. '
              f'Winning angle: show a live AI prediction — crop disease identified from a photo, '
              f'or irrigation schedule auto-optimized — within 30 seconds. '
              f'Judges respond to real-world social impact. Cite lives impacted and yield improvements. '
              f'Integrates with NASA Earthdata, OpenWeatherMap, and satellite APIs (Sentinel-2).</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + Mapbox GL JS + Recharts.<br>'
              '<h4>Backend:</h4> FastAPI + Celery + MQTT for IoT sensors.<br>'
              '<h4>Database:</h4> PostgreSQL + PostGIS + TimescaleDB for time-series sensor data.<br>'
              '<h4>Auth:</h4> Clerk (SMS OTP for low-internet farmers).<br>'
              '<h4>AI:</h4> YOLOv8 for crop disease image detection + GPT-4o for advisory chatbot + Prophet for yield forecasting.<br>'
              '<h4>Deploy:</h4> Vercel + Railway + edge deployment for low-latency rural access.')
        ai = ('1. <b>Image Disease Detection:</b> YOLOv8 trained on PlantVillage dataset → farmer uploads crop photo → real-time disease + treatment recommendation.<br>'
              '2. <b>Yield Prediction:</b> Facebook Prophet + weather data + NDVI indices → 30-day yield forecast per field.<br>'
              '3. <b>Advisory RAG:</b> Agronomy knowledge base → embedded chunks → GPT-4o answers farmer questions in local language.<br>'
              '4. <b>Irrigation AI:</b> Soil moisture sensor data + weather forecast → RL agent optimizes irrigation schedule, reduces water use 40%.<br>'
              '5. <b>Pest Monitoring:</b> Satellite NDVI change detection → alert when crop health degrades → overlay on farm map.<br>'
              '6. <b>Offline Mode:</b> Mobile PWA with cached disease detection model (TensorFlow Lite) works without internet.')
        mp = (f'You are a Principal AgriTech Engineer. Build "{full_name}" using Next.js 14, FastAPI, '
              f'PostgreSQL + PostGIS, YOLOv8, and GPT-4o. Requirements: (1) Farmer dashboard with field map overlay (Mapbox). '
              f'(2) Image upload → YOLOv8 disease detection → treatment plan displayed in <3 seconds. '
              f'(3) IoT sensor integration (soil moisture, temperature, humidity) via MQTT. '
              f'(4) Weather API integration (OpenWeatherMap) → irrigation recommendation engine. '
              f'(5) Advisory chatbot: farmer types question → RAG over agronomy KB → GPT-4o answer. '
              f'(6) Yield prediction dashboard with Prophet time-series model. '
              f'(7) PWA with offline support for rural areas. '
              f'Demo flow: Upload diseased crop photo → see AI detection → view treatment plan → '
              f'check irrigation schedule → ask chatbot "when to harvest?" '
              f'Use PostGIS for field boundaries, TimescaleDB for sensor history. '
              f'Deploy Vercel + Railway. Start with disease detection model integration + farm map.')
        db = ('Table farms { id uuid [pk], owner_id uuid, name varchar, location geometry(Point,4326), area_hectares float, created_at timestamp }\n'
              'Table fields { id uuid [pk], farm_id uuid [ref: > farms.id], name varchar, boundary geometry(Polygon,4326), crop_type varchar, planted_at date }\n'
              'Table sensor_readings { id uuid [pk], field_id uuid [ref: > fields.id], sensor_type varchar, value float, unit varchar, recorded_at timestamp }\n'
              'Table disease_detections { id uuid [pk], field_id uuid, image_url varchar, disease_name varchar, confidence float, treatment_plan text, detected_at timestamp }\n'
              'Table yield_predictions { id uuid [pk], field_id uuid, predicted_yield float, unit varchar, confidence_interval jsonb, predicted_for date, created_at timestamp }')
        api = ('- POST /api/v1/auth/register\n- POST /api/v1/farms\n- GET /api/v1/farms/{id}/fields\n'
               '- POST /api/v1/fields/{id}/sensors\n- GET /api/v1/fields/{id}/sensor-history\n'
               '- POST /api/v1/ai/detect-disease (image upload)\n- GET /api/v1/ai/irrigation-schedule\n'
               '- GET /api/v1/ai/yield-prediction/{field_id}\n- POST /api/v1/ai/advisory-chat\n'
               '- GET /api/v1/weather/{location}\n- GET /api/v1/ndvi/{field_id}\n'
               '- POST /api/v1/alerts\n- GET /api/v1/analytics/farm-performance\n'
               '- GET /api/v1/market-prices?crop=\n- WS /ws/sensor-stream')
        win = ('<b>Judge Psychology:</b> AgriTech judges care about farmer adoption and real-world impact. '
               'Frame everything as "a farmer with a $200 Android phone can do this". Avoid complex jargon.<br>'
               '<b>Demo Hook (0-30s):</b> Take your phone, photograph a plant leaf (or use a sample image). '
               'Watch the AI identify the disease and show treatment steps in <3 seconds. Judges are instantly impressed.<br>'
               '<b>Market Stat:</b> "Crop diseases cause $220 billion in losses annually. Our AI detects 38 disease types with 94% accuracy."<br>'
               '<b>Q&A Prep:</b> Know PlantVillage dataset, Sentinel-2 satellite bands, NDVI calculation, and how to handle low-bandwidth rural deployment.')
        entries.append(entry(
            "AgriTech", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead AgriTech Backend Engineer", ["FastAPI","PostGIS","YOLOv8"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","Prophet"],
            ["Next.js 14","FastAPI","YOLOv8"]
        ))
    return entries

# ── CyberSecurity (50 entries) ──────────────────────────────────────────────
CYBERSECURITY_KW = [
    "security","cybersecurity","hacking","penetration testing","pentest","soc",
    "threat","vulnerability","malware","ransomware","phishing","ddos","xss",
    "sql injection","owasp","cvss","cve","zero day","exploit","firewall",
    "intrusion detection","ids","ips","siem","threat intelligence","osint",
    "dark web","endpoint security","network security","cloud security","devsecops",
    "cryptography","encryption","authentication","mfa","oauth","jwt","ssl","tls",
    "certificate","zero trust","identity","access control","iam","rbac","abac",
    "incident response","forensics","log analysis","security audit","compliance",
    "gdpr security","iso27001","nist","soc2","pcidss","hipaa security",
    "bug bounty","ctf","capture the flag","red team","blue team","purple team",
    "secuirty","cyberscurity","hackin","vulnrability","cybersec hackathon",
    "security app","build soc","create security tool","win security track",
    "threat hunting","security dashboard","security analytics","ai security"
]

CYBERSECURITY_PROJECTS = [
    ("AI Threat Detection System","High"),
    ("Phishing Email Analyzer","High"),
    ("Vulnerability Scanner","High"),
    ("SOC Dashboard","High"),
    ("Zero Trust Access Manager","High"),
    ("Dark Web Monitoring Tool","High"),
    ("Security Awareness Training Platform","Medium"),
    ("Incident Response Orchestrator","High"),
    ("OSINT Intelligence Gatherer","High"),
    ("Malware Analysis Sandbox","High"),
    ("Bug Bounty Management Platform","High"),
    ("Compliance Checker Dashboard","High"),
    ("Password Manager with AI","Medium"),
    ("API Security Scanner","High"),
    ("Cloud Misconfiguration Detector","High"),
    ("Network Intrusion Detector","High"),
    ("Log Analysis SIEM Tool","High"),
    ("Ransomware Backup Protector","High"),
    ("Identity Threat Detection","High"),
    ("Security Code Reviewer","High"),
    ("DDoS Attack Simulator","High"),
    ("Threat Intelligence Aggregator","High"),
    ("Secure File Sharing Platform","Medium"),
    ("Certificate Expiry Monitor","Medium"),
    ("Security Posture Scorer","High"),
    ("Endpoint Detection & Response","High"),
    ("AI Red Team Assistant","High"),
    ("Privacy Policy Analyzer","Medium"),
    ("Security Training CTF Platform","High"),
    ("DevSecOps Pipeline Scanner","High"),
    ("Browser Extension Security Checker","Medium"),
    ("Social Engineering Simulator","High"),
    ("IoT Device Security Scanner","High"),
    ("Crypto Key Manager","High"),
    ("Security Metrics Dashboard","High"),
    ("Fraud Pattern Detector","High"),
    ("Secure Messaging App","High"),
    ("Honeypot Deployment System","High"),
    ("Threat Modeling Assistant","High"),
    ("Security Policy Generator AI","Medium"),
    ("Penetration Test Report Maker","Medium"),
    ("Digital Forensics Tool","High"),
    ("Secure Code Snippet Library","Medium"),
    ("Zero-Day Exploit Tracker","High"),
    ("Multi-Factor Auth Platform","High"),
    ("Security Incident Timeline","High"),
    ("Cyber Risk Quantifier","High"),
    ("Open Source License Checker","Medium"),
    ("Supply Chain Security Scanner","High"),
    ("Security Knowledge Graph","High"),
]

def cybersecurity_entries():
    entries = []
    for proj_name, complexity in CYBERSECURITY_PROJECTS:
        kw = list(CYBERSECURITY_KW)
        full_name = f"CyberSecurity {proj_name}"
        ov = (f'<h3>🔒 {proj_name}</h3><p>Global cybersecurity spending will exceed <b>$215 billion by 2024</b>, '
              f'driven by a 3,000% increase in ransomware attacks since 2019. '
              f'This platform addresses {proj_name.lower()} — a critical security gap that costs organizations '
              f'an average of <b>$4.45 million per breach</b>. Built with a zero-trust architecture, '
              f'end-to-end encryption, and AI-powered threat intelligence. '
              f'The winning angle: run a live "attack and defend" demo — trigger a simulated threat, '
              f'watch your AI detect and respond in real time. Judges from enterprise backgrounds '
              f'will immediately understand the value. OWASP Top 10 compliant, SOC 2 ready architecture.</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui + D3.js for threat visualization.<br>'
              '<h4>Backend:</h4> Go (Fiber) for high-performance security event processing.<br>'
              '<h4>Database:</h4> PostgreSQL + Elasticsearch for log indexing + Redis for rate limiting.<br>'
              '<h4>Auth:</h4> Clerk with hardware MFA + RBAC with fine-grained permissions.<br>'
              '<h4>AI:</h4> GPT-4o for threat analysis + BERT fine-tuned for malware classification + graph neural networks for anomaly detection.<br>'
              '<h4>Deploy:</h4> Vercel + Railway + isolated execution environment.')
        ai = ('1. <b>Log Intelligence:</b> Ingest SIEM logs → parse with regex + NLP → embed in Elasticsearch → semantic search for threat patterns.<br>'
              '2. <b>Threat Classification:</b> Fine-tuned BERT on CIC-IDS2018 dataset → classify network traffic as benign/suspicious/malicious.<br>'
              '3. <b>Phishing Detection:</b> GPT-4o analyzes email headers, links, tone → confidence score + explanation.<br>'
              '4. <b>Vulnerability Correlation:</b> CVE database embedded in Pinecone → semantic search finds related vulnerabilities for any asset.<br>'
              '5. <b>Anomaly Graph:</b> Graph neural network builds normal behavior baseline → flags deviations in user/entity behavior (UEBA).<br>'
              '6. <b>Offline Fallback:</b> Pre-cached OWASP Top 10 rules + local regex patterns run when cloud unavailable.')
        mp = (f'You are a Principal Security Engineer. Build "{full_name}" using Next.js 14, Go (Fiber), '
              f'PostgreSQL + Elasticsearch, and GPT-4o. Requirements: (1) RBAC auth (Analyst/SOC Manager/Admin) via Clerk with MFA. '
              f'(2) Real-time threat event feed with severity classification (Critical/High/Medium/Low). '
              f'(3) AI threat analysis: paste log snippet or file → GPT-4o explains threat, maps to MITRE ATT&CK framework. '
              f'(4) CVE lookup: enter asset/software → semantic search returns relevant CVEs with CVSS scores. '
              f'(5) Phishing analyzer: paste email content → AI returns verdict + explanation. '
              f'(6) Security metrics dashboard with D3.js threat visualization. '
              f'Demo flow: Show incoming threat alert → click for AI analysis → see MITRE ATT&CK mapping → one-click incident creation. '
              f'Use Elasticsearch for log search, Go Fiber for event processing. Start with threat ingestion pipeline + RBAC.')
        db = ('Table users { id uuid [pk], email varchar, role enum(analyst,manager,admin), mfa_enabled bool, last_login timestamp }\n'
              'Table threats { id uuid [pk], source_ip varchar, dest_ip varchar, severity enum(critical,high,medium,low), type varchar, raw_data text, ai_analysis text, mitre_mapping jsonb, detected_at timestamp }\n'
              'Table incidents { id uuid [pk], threat_id uuid [ref: > threats.id], title varchar, status enum(open,investigating,resolved), assigned_to uuid, timeline jsonb, created_at timestamp }\n'
              'Table assets { id uuid [pk], org_id uuid, name varchar, type varchar, ip_range varchar, cve_scores jsonb, last_scanned timestamp }\n'
              'Table audit_logs { id uuid [pk], user_id uuid, action varchar, resource varchar, ip_address varchar, timestamp timestamp }')
        api = ('- POST /api/v1/auth/login\n- GET /api/v1/threats?severity=&from=&to=\n'
               '- POST /api/v1/threats/{id}/analyze (AI analysis)\n- GET /api/v1/incidents\n'
               '- POST /api/v1/incidents\n- PUT /api/v1/incidents/{id}\n'
               '- POST /api/v1/ai/analyze-phishing\n- POST /api/v1/ai/scan-code\n'
               '- GET /api/v1/cve/search?q=\n- GET /api/v1/assets\n'
               '- POST /api/v1/assets/{id}/scan\n- GET /api/v1/analytics/threat-summary\n'
               '- GET /api/v1/mitre/tactics\n- POST /api/v1/reports/generate\n'
               '- WS /ws/threat-stream (real-time threat feed)')
        win = ('<b>Judge Psychology:</b> Security judges are skeptical — they\'ll probe for fake demos. '
               'Have real (sanitized) log data and be able to explain exactly what each AI decision is based on.<br>'
               '<b>Demo Hook (0-30s):</b> Play a 10-second "attack scenario" — show brute force logs flooding in, '
               'watch the AI classify it, create an incident, and map it to MITRE ATT&CK T1110 — all in real time.<br>'
               '<b>Market Stat:</b> "Mean time to detect a breach is 204 days. Our AI reduces detection to under 60 seconds."<br>'
               '<b>Q&A Prep:</b> Know MITRE ATT&CK framework, CVSS scoring, SOC 2 vs ISO 27001 differences, and zero-trust vs perimeter security.')
        entries.append(entry(
            "CyberSecurity", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead Security Backend Engineer", ["Go (Fiber)","Elasticsearch","SIEM"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","D3.js"],
            ["Next.js 14","Go (Fiber)","GPT-4o"]
        ))
    return entries

# ── GreenTech (50 entries) ──────────────────────────────────────────────────
GREENTECH_KW = [
    "green","sustainability","environment","climate","carbon","emission","renewable",
    "solar","wind","energy","clean energy","cleantech","net zero","carbon neutral",
    "carbon footprint","offset","esg","climate change","global warming","greenhouse gas",
    "recycling","waste","circular economy","biodiversity","deforestation","reforestation",
    "ocean","plastic","pollution","water conservation","energy efficiency",
    "smart grid","battery","storage","ev","electric vehicle","charging station",
    "green building","leed","passive house","heat pump","insulation",
    "carbon market","carbon trading","voluntary carbon offset","scope 1 2 3",
    "life cycle assessment","lca","environmental impact","sustainability report",
    "greentech","climatetech","cleantech hackathon","green startup","eco tech",
    "grean","sustainabilty","enviroment","carboon","emision","climate app",
    "build green app","sustainability dashboard","win greentech track",
    "renewable energy app","net zero tracker","carbon calculator"
]

GREENTECH_PROJECTS = [
    ("Carbon Footprint Calculator","Medium"),
    ("Renewable Energy Optimizer","High"),
    ("ESG Reporting Dashboard","High"),
    ("Smart EV Charging Network","High"),
    ("Solar Panel Performance Monitor","Medium"),
    ("Green Building Energy Analyzer","High"),
    ("Ocean Plastic Tracker","Medium"),
    ("Carbon Offset Marketplace","High"),
    ("Corporate Sustainability Reporter","High"),
    ("AI Waste Classification System","High"),
    ("Renewable Energy Trading Platform","High"),
    ("Carbon Credit Verification","High"),
    ("Climate Risk Assessment Tool","High"),
    ("Net Zero Roadmap Planner","High"),
    ("Smart Grid Load Balancer","High"),
    ("Biodiversity Impact Tracker","High"),
    ("Green Supply Chain Analyzer","High"),
    ("Scope 3 Emissions Calculator","High"),
    ("EV Fleet Management System","High"),
    ("Sustainable Product Ranker","Medium"),
    ("Wind Farm Performance Monitor","High"),
    ("Water Consumption Tracker","Medium"),
    ("Deforestation Alert System","High"),
    ("Green Finance Investment Screener","High"),
    ("Circular Economy Marketplace","Medium"),
    ("Energy Poverty Mapper","High"),
    ("Life Cycle Assessment Tool","High"),
    ("Reforestation Planner","Medium"),
    ("Sustainable Travel Carbon Tracker","Medium"),
    ("Green Certifications Tracker","Medium"),
    ("Food Waste Reduction Platform","Medium"),
    ("Air Quality Index Dashboard","Medium"),
    ("Battery Storage Optimizer","High"),
    ("Green IT Carbon Monitor","Medium"),
    ("Sustainable Fashion Ranker","Medium"),
    ("Climate Education Platform","Medium"),
    ("Carbon Accounting Automation","High"),
    ("Nature-Based Solutions Mapper","High"),
    ("Environmental Compliance Checker","High"),
    ("Eco-Score Product Labeler","Medium"),
    ("Urban Heat Island Reducer","High"),
    ("Plastic Waste Exchange Platform","Medium"),
    ("Hydrogen Energy Tracker","High"),
    ("Smart Thermostat AI","Medium"),
    ("Climate Financing Dashboard","High"),
    ("Methane Leakage Detector","High"),
    ("Sustainable Packaging Advisor","Medium"),
    ("Green Bond Tracker","High"),
    ("Biodegradable Materials DB","Low"),
    ("Climate Action Gamifier","Medium"),
]

def greentech_entries():
    entries = []
    for proj_name, complexity in GREENTECH_PROJECTS:
        kw = list(GREENTECH_KW)
        full_name = f"GreenTech {proj_name}"
        ov = (f'<h3>🌍 {proj_name}</h3><p>The global climate tech investment reached <b>$1.1 trillion in 2023</b>, '
              f'with carbon markets, renewable energy, and ESG solutions leading the charge. '
              f'This platform provides {proj_name.lower()} capabilities to help organizations '
              f'navigate the transition to net zero. The climate crisis is the defining challenge '
              f'of our time — and hackathon judges increasingly score on real-world environmental impact. '
              f'The winning angle: show a live carbon calculation or ESG metric with real data, '
              f'then demonstrate the AI\'s insight (reduction opportunity, risk score, or offset recommendation). '
              f'Cite your environmental impact in CO₂ tonnes saved or energy kWh optimized.</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui + Recharts + Mapbox GL JS.<br>'
              '<h4>Backend:</h4> FastAPI (Python) + Celery for heavy data processing.<br>'
              '<h4>Database:</h4> PostgreSQL + TimescaleDB for time-series energy data.<br>'
              '<h4>Auth:</h4> Clerk with org-level ESG accounts.<br>'
              '<h4>AI:</h4> GPT-4o for ESG report generation + scikit-learn for energy prediction + Prophet for forecasting.<br>'
              '<h4>Deploy:</h4> Vercel + Railway + AWS S3 for reports. Solar-powered hosting mentioned for bonus points.')
        ai = ('1. <b>Emissions Calculation:</b> GHG Protocol scope 1/2/3 formula engine → GPT-4o explains emission sources and reduction paths.<br>'
              '2. <b>Energy Forecasting:</b> Prophet time-series model on smart meter data → predicts peak demand + recommends load shifting.<br>'
              '3. <b>ESG Report Generation:</b> Company data → GPT-4o generates TCFD/GRI-aligned sustainability report in minutes.<br>'
              '4. <b>Satellite Monitoring:</b> Sentinel-2 imagery + NDVI → deforestation alerts and green area change detection.<br>'
              '5. <b>Carbon Offset Matching:</b> Pinecone semantic search over verified carbon offset projects → match to company profile.<br>'
              '6. <b>Offline Mode:</b> Pre-cached GHG emission factors + local calculation engine for fieldwork without connectivity.')
        mp = (f'You are a Principal GreenTech Engineer. Build "{full_name}" using Next.js 14, FastAPI, '
              f'PostgreSQL + TimescaleDB, and GPT-4o. Requirements: (1) Company onboarding with GHG Protocol framework selection. '
              f'(2) Scope 1/2/3 emissions calculator with data import (CSV, API). '
              f'(3) AI ESG report generator: input company data → GPT-4o outputs TCFD-aligned report. '
              f'(4) Carbon offset marketplace integration showing verified projects. '
              f'(5) Energy dashboard with Prophet forecasting and reduction recommendations. '
              f'(6) ESG benchmark comparison against industry peers. '
              f'Demo flow: Input company energy/travel/supply data → see scope 1/2/3 breakdown → '
              f'AI recommends top 3 reduction actions → generate downloadable ESG report. '
              f'Use Recharts for emissions charts, TimescaleDB for time-series energy data. '
              f'Deploy Vercel + Railway. Start with emissions calculator + data model.')
        db = ('Table organizations { id uuid [pk], name varchar, industry varchar, size enum(sme,large,enterprise), baseline_year int, net_zero_target int }\n'
              'Table emission_entries { id uuid [pk], org_id uuid [ref: > organizations.id], scope int, category varchar, amount float, unit varchar, source varchar, period_start date, period_end date }\n'
              'Table energy_readings { id uuid [pk], org_id uuid, meter_id varchar, kwh float, source enum(grid,solar,wind,other), recorded_at timestamp }\n'
              'Table carbon_offsets { id uuid [pk], org_id uuid, project_name varchar, tonnes_co2 float, verified_by varchar, cost_usd float, vintage_year int, purchased_at timestamp }\n'
              'Table esg_reports { id uuid [pk], org_id uuid, framework varchar, content text, period varchar, status enum(draft,published), generated_at timestamp }')
        api = ('- POST /api/v1/organizations\n- POST /api/v1/emissions\n- GET /api/v1/emissions?org_id=&scope=\n'
               '- GET /api/v1/emissions/summary\n- POST /api/v1/ai/generate-esg-report\n'
               '- GET /api/v1/carbon-offsets/marketplace\n- POST /api/v1/carbon-offsets/purchase\n'
               '- GET /api/v1/energy/forecast\n- POST /api/v1/energy/readings\n'
               '- GET /api/v1/benchmarks/{industry}\n- POST /api/v1/ai/reduction-recommendations\n'
               '- GET /api/v1/satellite/ndvi?bbox=\n- POST /api/v1/reports/export\n'
               '- GET /api/v1/analytics/progress-to-target\n- WS /ws/energy-stream')
        win = ('<b>Judge Psychology:</b> GreenTech judges are mission-driven. Connect your tech to measurable CO₂ impact. '
               '"Our platform helped reduce 1,200 tonnes of CO₂ in our pilot" beats any technical claim.<br>'
               '<b>Demo Hook (0-30s):</b> Enter a company name → watch AI calculate their estimated emissions → '
               'show the top 3 actionable reductions → generate a 2-page ESG summary in seconds.<br>'
               '<b>Market Stat:</b> "Companies spend 40+ hours manually compiling ESG reports. Our AI does it in 3 minutes with 92% accuracy."<br>'
               '<b>Q&A Prep:</b> Know GHG Protocol (Scope 1/2/3), TCFD framework, carbon offset verification (Gold Standard, VCS), and EU CSRD regulation.')
        entries.append(entry(
            "GreenTech", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead GreenTech Backend Engineer", ["FastAPI","TimescaleDB","GHG Protocol"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","Prophet"],
            ["Next.js 14","FastAPI","GPT-4o"]
        ))
    return entries

# ── Logistics (50 entries) ──────────────────────────────────────────────────
LOGISTICS_KW = [
    "logistics","supply chain","shipping","delivery","warehouse","inventory",
    "freight","cargo","transport","fleet","driver","route","tracking","parcel",
    "last mile","fulfillment","distribution","3pl","4pl","wms","tms","erp",
    "barcode","rfid","qr code","customs","import","export","trade","forwarder",
    "cold chain","refrigerated transport","perishable","hazmat","loading dock",
    "dispatch","scheduling","route optimization","vehicle routing","vrp",
    "eta","real-time tracking","geofencing","proof of delivery","pod",
    "returns management","reverse logistics","demand forecasting","sku",
    "procurement","purchase order","vendor","supplier","lead time","moq",
    "logistics app","shipping app","fleet app","logistcs","shiping","warehous",
    "logistic hackathon","supply chain startup","delivery tech","logistics tech",
    "build logistics","create fleet system","win logistics track","freight tech"
]

LOGISTICS_PROJECTS = [
    ("AI Route Optimization Engine","High"),
    ("Real-Time Package Tracker","Medium"),
    ("Warehouse Management System","High"),
    ("Demand Forecasting Platform","High"),
    ("Last-Mile Delivery Optimizer","High"),
    ("Fleet Management Dashboard","High"),
    ("Cold Chain Monitor","High"),
    ("Freight Rate Comparator","Medium"),
    ("Customs Documentation AI","High"),
    ("Returns Management System","Medium"),
    ("Driver Performance Analytics","High"),
    ("Supplier Risk Assessment","High"),
    ("Inventory Replenishment AI","High"),
    ("Cross-Dock Scheduler","High"),
    ("Proof of Delivery System","Medium"),
    ("Drone Delivery Coordinator","High"),
    ("Smart Loading Dock Manager","Medium"),
    ("Carbon-Neutral Logistics Tracker","High"),
    ("Predictive Maintenance for Fleets","High"),
    ("Reverse Logistics Platform","Medium"),
    ("Freight Marketplace","High"),
    ("Port Operations Dashboard","High"),
    ("Container Tracking System","High"),
    ("Parcel Locker Network Manager","Medium"),
    ("Supply Chain Visibility Platform","High"),
    ("Vendor Onboarding Automation","Medium"),
    ("Logistics Analytics Dashboard","High"),
    ("Dynamic Pricing Engine","High"),
    ("Hazmat Compliance Checker","High"),
    ("AI Dispatch System","High"),
    ("Multi-Modal Transport Planner","High"),
    ("Backhaul Optimization Tool","High"),
    ("Inventory Audit Automation","Medium"),
    ("Trade Finance Platform","High"),
    ("Export Documentation Generator","Medium"),
    ("Delivery Slot Optimizer","Medium"),
    ("Smart Packing Algorithm","Medium"),
    ("Carrier Performance Scorer","High"),
    ("Food Safety Cold Chain Logger","Medium"),
    ("Logistics Cost Analyzer","High"),
    ("Micro-Fulfillment Planner","High"),
    ("Electric Fleet Transition Planner","High"),
    ("AI Load Planner","High"),
    ("Warehouse Robot Coordinator","High"),
    ("Shipping Label Generator","Low"),
    ("Freight Emissions Calculator","Medium"),
    ("On-Demand Delivery Platform","High"),
    ("Supply Chain Disruption Predictor","High"),
    ("Transport Network Mapper","High"),
    ("Logistics Contract Analyzer","High"),
]

def logistics_entries():
    entries = []
    for proj_name, complexity in LOGISTICS_PROJECTS:
        kw = list(LOGISTICS_KW)
        full_name = f"Logistics {proj_name}"
        ov = (f'<h3>📦 {proj_name}</h3><p>Global logistics spending exceeds <b>$9.6 trillion annually</b>, '
              f'yet most operators still rely on spreadsheets and manual processes. '
              f'This platform delivers {proj_name.lower()} capabilities using AI and real-time data '
              f'to slash costs, reduce emissions, and delight customers. '
              f'The winning angle: show a live route optimization or delivery ETA update with measurable savings — '
              f'"this route saves 12 minutes and $3.40 in fuel per trip". '
              f'Last-mile delivery alone accounts for 53% of total logistics costs — '
              f'AI optimization here creates immediate, quantifiable ROI that any judge can understand. '
              f'Integrates with Google Maps Platform, HERE Maps, and major carrier APIs (FedEx, UPS, DHL).</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + Mapbox GL JS + Recharts.<br>'
              '<h4>Backend:</h4> Go (Fiber) — high-performance for real-time tracking and routing.<br>'
              '<h4>Database:</h4> PostgreSQL + PostGIS for geospatial + Redis for real-time location cache.<br>'
              '<h4>Auth:</h4> Clerk with multi-tenant (carrier/shipper/driver) roles.<br>'
              '<h4>AI:</h4> OR-Tools for VRP optimization + GPT-4o for document intelligence + Prophet for demand forecasting.<br>'
              '<h4>Deploy:</h4> Vercel + Railway + WebSocket gateway for real-time tracking.')
        ai = ('1. <b>Route Optimization:</b> Google OR-Tools VRP solver with real-time traffic → optimal routes for 100+ stops in <2 seconds.<br>'
              '2. <b>Demand Forecasting:</b> Prophet time-series model on historical orders → 30-day demand forecast per SKU/region.<br>'
              '3. <b>Document AI:</b> GPT-4 Vision parses shipping manifests, customs docs, invoices → structured data extraction.<br>'
              '4. <b>Predictive ETA:</b> XGBoost model on traffic + weather + carrier data → accurate delivery time prediction.<br>'
              '5. <b>Anomaly Detection:</b> Cold chain temperature deviation → Isolation Forest → immediate alert + automatic rerouting.<br>'
              '6. <b>Offline Driver App:</b> PWA with cached route data + offline POD capture → sync when connectivity restored.')
        mp = (f'You are a Principal Logistics Platform Engineer. Build "{full_name}" using Next.js 14, Go (Fiber), '
              f'PostgreSQL + PostGIS, OR-Tools, and GPT-4o. Requirements: (1) Multi-role auth (Dispatcher/Driver/Customer/Admin). '
              f'(2) Live map showing all vehicles, routes, and delivery stops with Mapbox. '
              f'(3) AI route optimization: input stops → OR-Tools VRP → optimal route with ETAs. '
              f'(4) Real-time driver tracking via WebSocket with geofencing alerts. '
              f'(5) Demand forecasting dashboard with Prophet showing next 30-day SKU predictions. '
              f'(6) Document scanner: upload shipping doc → AI extracts structured data. '
              f'(7) Driver mobile PWA with offline route + POD capture. '
              f'Demo flow: Add 20 delivery stops → AI optimizes route (save 18% distance) → '
              f'track driver live → customer receives ETA update → POD signed. '
              f'Deploy Vercel + Railway + Railway Redis. Start with map + route optimization.')
        db = ('Table organizations { id uuid [pk], name varchar, type enum(carrier,shipper,3pl) }\n'
              'Table shipments { id uuid [pk], org_id uuid, tracking_no varchar, origin geometry(Point,4326), destination geometry(Point,4326), status enum, weight float, value float, created_at timestamp }\n'
              'Table stops { id uuid [pk], shipment_id uuid [ref: > shipments.id], address varchar, location geometry(Point,4326), eta timestamp, status enum(pending,completed,failed), sequence int }\n'
              'Table vehicles { id uuid [pk], org_id uuid, plate varchar, type varchar, capacity float, driver_id uuid, current_location geometry(Point,4326), last_updated timestamp }\n'
              'Table tracking_events { id uuid [pk], shipment_id uuid, location geometry(Point,4326), event_type varchar, timestamp timestamp, metadata jsonb }')
        api = ('- POST /api/v1/shipments\n- GET /api/v1/shipments/{tracking_no}\n'
               '- POST /api/v1/routes/optimize\n- GET /api/v1/vehicles/locations\n'
               '- PUT /api/v1/stops/{id}/complete\n- POST /api/v1/ai/parse-document\n'
               '- GET /api/v1/forecast/demand?sku=&region=\n- GET /api/v1/analytics/on-time-rate\n'
               '- GET /api/v1/analytics/cost-per-mile\n- POST /api/v1/alerts/geofence\n'
               '- GET /api/v1/carriers/rates\n- POST /api/v1/proof-of-delivery\n'
               '- GET /api/v1/cold-chain/alerts\n- GET /api/v1/export/report\n'
               '- WS /ws/vehicle-tracking')
        win = ('<b>Judge Psychology:</b> Logistics judges think in ROI — cost per delivery, on-time %, utilization rate. '
               'Always frame impact as "X% reduction in cost" or "Y minutes saved per route".<br>'
               '<b>Demo Hook (0-30s):</b> Drop 20 pins on a map, click "Optimize", watch routes rearrange in 1.5 seconds with "18% fuel saved" displayed. '
               'No judge has seen anything more satisfying.<br>'
               '<b>Market Stat:</b> "Poor route planning costs US companies $125 billion annually in excess fuel and driver time."<br>'
               '<b>Q&A Prep:</b> Know VRP vs TSP distinction, OR-Tools vs custom ML, GTFS for transit data, and carrier API rate limits.')
        entries.append(entry(
            "Logistics", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead Logistics Backend Engineer", ["Go (Fiber)","PostGIS","OR-Tools"],
            "Full-Stack AI Developer", ["Next.js 14","Mapbox GL","GPT-4o"],
            ["Next.js 14","Go (Fiber)","OR-Tools"]
        ))
    return entries

# ── AITools (50 entries) ──────────────────────────────────────────────────
AITOOLS_KW = [
    "ai","artificial intelligence","machine learning","deep learning","llm","gpt",
    "chatgpt","openai","claude","gemini","llama","mistral","huggingface","transformer",
    "prompt engineering","rag","retrieval augmented generation","fine tuning","lora",
    "vector database","embedding","pinecone","weaviate","chroma","qdrant","pgvector",
    "langchain","llamaindex","semantic search","chat ui","ai assistant","ai agent",
    "ai tool","ai platform","ai workflow","ai automation","no code ai","low code ai",
    "image generation","stable diffusion","dall-e","midjourney","text to image",
    "voice ai","speech recognition","whisper","text to speech","tts","stt",
    "ai writing","content generation","ai summarizer","ai classifier","nlp",
    "named entity recognition","sentiment analysis","text analysis","ai pipeline",
    "ai testing","ai evaluation","ai monitoring","mlops","ai observability",
    "artifcial inteligence","machne learning","ai hackathon","build ai tool",
    "create ai assistant","win ai track","ai startup","ai product","llm app",
    "ai developer tools","ai api","ai sdk","ai copilot","ai companion"
]

AITOOLS_PROJECTS = [
    ("LLM Playground & Evaluator","High"),
    ("AI Prompt Management System","Medium"),
    ("RAG Knowledge Base Builder","High"),
    ("AI Model Comparison Tool","High"),
    ("Autonomous AI Agent Builder","High"),
    ("AI Writing Assistant","Medium"),
    ("Voice AI Interface Builder","High"),
    ("AI Image Generation Studio","High"),
    ("Fine-Tuning Dashboard","High"),
    ("AI Workflow Automation Builder","High"),
    ("MLOps Monitoring Platform","High"),
    ("AI Content Moderator","High"),
    ("Semantic Search Engine Builder","High"),
    ("AI Chatbot Builder","Medium"),
    ("AI Data Labeling Tool","High"),
    ("LLM Cost Optimizer","High"),
    ("AI Testing Framework","High"),
    ("Prompt Library & Marketplace","Medium"),
    ("AI-Powered Code Assistant","High"),
    ("Document Intelligence Platform","High"),
    ("AI Meeting Notes Generator","Medium"),
    ("AI Research Assistant","High"),
    ("Multi-Agent Orchestrator","High"),
    ("AI Translation Platform","Medium"),
    ("AI Audio Transcription Tool","Medium"),
    ("AI Model Registry","High"),
    ("Embeddings Visualization Tool","High"),
    ("AI Output Validator","High"),
    ("LLM Observability Dashboard","High"),
    ("AI Feature Store","High"),
    ("AI Persona Builder","Medium"),
    ("Knowledge Graph from Text","High"),
    ("AI Report Generator","Medium"),
    ("AI Dataset Generator","High"),
    ("AI Benchmark Suite","High"),
    ("AI Governance Dashboard","High"),
    ("AI Safety Checker","High"),
    ("Multi-Modal AI App Builder","High"),
    ("AI-Powered Slide Maker","Medium"),
    ("Context Window Optimizer","High"),
    ("AI Tool Chain Builder","High"),
    ("AI Feedback Collector","Medium"),
    ("AI A/B Testing Platform","High"),
    ("Retrieval Quality Evaluator","High"),
    ("AI Pipeline Debugger","High"),
    ("Conversational AI Analytics","High"),
    ("AI Usage Analytics Dashboard","High"),
    ("AI Persona Marketplace","Medium"),
    ("Edge AI Deployment Tool","High"),
    ("AI Model Versioning System","High"),
]

def aitools_entries():
    entries = []
    for proj_name, complexity in AITOOLS_PROJECTS:
        kw = list(AITOOLS_KW)
        full_name = f"AITools {proj_name}"
        ov = (f'<h3>🤖 {proj_name}</h3><p>The AI tools market is projected to reach <b>$1.81 trillion by 2030</b>, '
              f'growing at 37% CAGR as every developer and enterprise scrambles to build AI-native products. '
              f'This platform provides {proj_name.lower()} capabilities to dramatically accelerate '
              f'AI development workflows. The winning angle at hackathons: your tool makes OTHER AI builders faster. '
              f'Show it reducing prompt iteration from 30 minutes to 30 seconds, or cutting RAG evaluation '
              f'from days to minutes. Judges building their own AI projects will immediately covet your tool. '
              f'Supports GPT-4o, Claude 3.5, Gemini 1.5 Pro, and local Ollama models via unified API.</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui + Monaco Editor (VS Code editor component).<br>'
              '<h4>Backend:</h4> FastAPI (Python) — native AI ecosystem integration.<br>'
              '<h4>Database:</h4> PostgreSQL + Pinecone vector store + Redis for session/cache.<br>'
              '<h4>Auth:</h4> Clerk with API key management.<br>'
              '<h4>AI:</h4> OpenAI GPT-4o + Anthropic Claude 3.5 + LangChain + LlamaIndex.<br>'
              '<h4>Deploy:</h4> Vercel + Railway + Modal Labs for GPU workloads.')
        ai = ('1. <b>Multi-Model Routing:</b> LiteLLM proxy routes to GPT-4o/Claude/Gemini/Ollama with automatic failover and cost tracking.<br>'
              '2. <b>RAG Pipeline:</b> LlamaIndex ingests documents → text-embedding-3-large → Pinecone → GPT-4o retrieval with reranking (Cohere).<br>'
              '3. <b>Eval Framework:</b> RAGAS evaluates RAG quality (faithfulness, answer relevancy, context precision) automatically.<br>'
              '4. <b>Prompt Optimizer:</b> DSPy automatically optimizes prompts via gradient-free optimization → tracks versions in DB.<br>'
              '5. <b>Agent Orchestration:</b> LangGraph builds stateful multi-agent workflows with tool calling and human-in-the-loop.<br>'
              '6. <b>Offline Mode:</b> Ollama local models (Llama 3.1, Mistral) serve as fallback when cloud APIs unavailable.')
        mp = (f'You are a Principal AI Platform Engineer. Build "{full_name}" using Next.js 14, FastAPI, '
              f'PostgreSQL, Pinecone, LangChain/LlamaIndex, and GPT-4o. Requirements: (1) API key auth with usage metering via Clerk. '
              f'(2) Multi-model playground: write prompt → run on GPT-4o/Claude/Gemini side-by-side → compare responses + cost. '
              f'(3) RAG builder: upload docs → auto-chunk/embed → test retrieval quality with RAGAS scores. '
              f'(4) Prompt library: save/version/share prompts with metadata and performance tracking. '
              f'(5) Usage analytics: token count, cost per query, latency, model distribution. '
              f'(6) Monaco editor for prompt writing with syntax highlighting and autocomplete. '
              f'Demo flow: Upload PDF → build RAG → test query → see RAGAS scores → compare on 3 models → save best prompt. '
              f'Use LlamaIndex for RAG, RAGAS for eval, Recharts for analytics. '
              f'Deploy Vercel + Railway + Modal for GPU. Start with multi-model routing + RAG pipeline.')
        db = ('Table users { id uuid [pk], email varchar, api_key varchar [unique], token_budget int, tokens_used int }\n'
              'Table prompts { id uuid [pk], user_id uuid [ref: > users.id], title varchar, content text, system_prompt text, model varchar, version int, tags jsonb, created_at timestamp }\n'
              'Table conversations { id uuid [pk], user_id uuid, prompt_id uuid, model varchar, input_tokens int, output_tokens int, latency_ms int, response text, eval_scores jsonb, created_at timestamp }\n'
              'Table knowledge_bases { id uuid [pk], user_id uuid, name varchar, embedding_model varchar, chunk_size int, overlap int, doc_count int, pinecone_namespace varchar }\n'
              'Table usage_logs { id uuid [pk], user_id uuid, model varchar, tokens int, cost_usd float, endpoint varchar, timestamp timestamp }')
        api = ('- POST /api/v1/completions (multi-model)\n- POST /api/v1/rag/ingest\n'
               '- POST /api/v1/rag/query\n- GET /api/v1/rag/eval/{kb_id}\n'
               '- GET /api/v1/prompts\n- POST /api/v1/prompts\n'
               '- PUT /api/v1/prompts/{id}\n- POST /api/v1/compare (run on multiple models)\n'
               '- GET /api/v1/usage/summary\n- GET /api/v1/usage/cost-breakdown\n'
               '- POST /api/v1/embeddings\n- POST /api/v1/agents/run\n'
               '- GET /api/v1/models/available\n- POST /api/v1/fine-tune/start\n'
               '- WS /ws/streaming-completion')
        win = ('<b>Judge Psychology:</b> AI tool judges are developers themselves. '
               'Show them something they wish they had — "I\'ve spent 3 hours debugging a RAG pipeline this week; this would have taken 10 minutes."<br>'
               '<b>Demo Hook (0-30s):</b> Upload a 50-page PDF, click "Build RAG", ask a question, show the answer + source citations + RAGAS quality score — all in under 10 seconds.<br>'
               '<b>Market Stat:</b> "Developers spend 40% of AI project time on prompt iteration and evaluation. Our tool cuts that to 5%."<br>'
               '<b>Q&A Prep:</b> Know RAGAS evaluation metrics, LlamaIndex vs LangChain tradeoffs, embedding model benchmarks (MTEB), and token cost optimization strategies.')
        entries.append(entry(
            "AITools", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead AI Platform Engineer", ["FastAPI","LlamaIndex","Pinecone"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","LangChain"],
            ["Next.js 14","FastAPI","GPT-4o"]
        ))
    return entries

# ── HRTech (50 entries) ──────────────────────────────────────────────────
HRTECH_KW = [
    "hr","human resources","recruitment","hiring","talent","candidate","resume",
    "job","career","employee","workforce","onboarding","offboarding","payroll",
    "benefits","performance review","appraisal","okr","kpi","employee engagement",
    "culture","diversity","inclusion","dei","equity","workplace","remote work",
    "hybrid work","leave management","time tracking","attendance","learning development",
    "lms hr","succession planning","talent pool","headhunting","ats","applicant tracking",
    "job description","interview","screening","background check","reference check",
    "compensation","salary","benchmark","equity grant","stock option","retention",
    "turnover","attrition","burnout","wellbeing","hrms","hris","peopleops",
    "hrtch","humna resources","recrutment","employe","reesume","hr app",
    "hr hackathon","hr startup","talent tech","people tech","hrtech",
    "build hr tool","create recruitment system","win hr track","workforce app"
]

HRTECH_PROJECTS = [
    ("AI Resume Screener","High"),
    ("Employee Engagement Platform","High"),
    ("Performance Review System","High"),
    ("Smart Job Description Generator","Medium"),
    ("Diversity & Inclusion Analyzer","High"),
    ("Onboarding Automation Platform","Medium"),
    ("AI Interview Coach","High"),
    ("Payroll Automation System","High"),
    ("Employee Wellbeing Monitor","Medium"),
    ("Talent Pool Analytics","High"),
    ("Skills Gap Analyzer","High"),
    ("OKR Management Platform","High"),
    ("Leave Management System","Medium"),
    ("AI Career Path Advisor","High"),
    ("Compensation Benchmarking Tool","High"),
    ("Succession Planning Platform","High"),
    ("Employee Feedback System","Medium"),
    ("Remote Team Collaboration Score","High"),
    ("Workforce Analytics Dashboard","High"),
    ("Exit Interview Analyzer","Medium"),
    ("Job Market Intelligence Tool","High"),
    ("Benefits Administration Platform","High"),
    ("AI Reference Checker","High"),
    ("HR Compliance Checker","High"),
    ("Employee Recognition Platform","Medium"),
    ("Recruitment Marketing Platform","High"),
    ("Workforce Planning Simulator","High"),
    ("AI-Powered Background Checker","High"),
    ("Internal Mobility Platform","High"),
    ("HR Chatbot & Knowledge Base","Medium"),
    ("Time & Attendance Tracker","Medium"),
    ("Contractor Management Platform","High"),
    ("Culture Add Predictor","High"),
    ("Employee NPS (eNPS) Platform","Medium"),
    ("Learning Path Recommender","High"),
    ("Burnout Risk Predictor","High"),
    ("Hiring Pipeline Analytics","High"),
    ("Interview Scheduling Automation","Medium"),
    ("Team Structure Visualizer","Medium"),
    ("Equity & Pay Gap Analyzer","High"),
    ("Employee Survey Platform","Medium"),
    ("HR Data Insights Dashboard","High"),
    ("Headcount Planning Tool","High"),
    ("360-Degree Feedback System","High"),
    ("Job Board Aggregator","High"),
    ("AI Cover Letter Analyzer","Medium"),
    ("Talent Retention Predictor","High"),
    ("Remote Work Productivity Tracker","High"),
    ("Employee Learning Milestone Tracker","Medium"),
    ("HR Risk Assessment Tool","High"),
]

def hrtech_entries():
    entries = []
    for proj_name, complexity in HRTECH_PROJECTS:
        kw = list(HRTECH_KW)
        full_name = f"HRTech {proj_name}"
        ov = (f'<h3>👥 {proj_name}</h3><p>The global HR technology market is valued at <b>$33 billion</b> '
              f'and growing at 10% CAGR, driven by demand for AI-powered talent intelligence. '
              f'Companies lose $15,000 per bad hire on average — this platform solves that. '
              f'{proj_name} addresses one of the most human-critical challenges in modern business: '
              f'finding, developing, and retaining exceptional talent. '
              f'The AI edge: real-time bias detection, predictive attrition scoring, and automated workflows '
              f'that save HR teams 15+ hours per week. '
              f'Demo the AI screening or prediction feature live — show bias being flagged or attrition risk surfaced. '
              f'Judges from enterprise HR backgrounds will immediately see the ROI.</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui + Recharts.<br>'
              '<h4>Backend:</h4> Node.js (Express) + BullMQ for job processing.<br>'
              '<h4>Database:</h4> PostgreSQL + Redis + Pinecone for semantic candidate matching.<br>'
              '<h4>Auth:</h4> Clerk with SSO (SAML/OIDC) for enterprise HR teams.<br>'
              '<h4>AI:</h4> GPT-4o for resume/JD parsing + text-embedding-3-large for semantic matching + XGBoost for attrition prediction.<br>'
              '<h4>Deploy:</h4> Vercel + Railway.')
        ai = ('1. <b>Resume Intelligence:</b> GPT-4o parses resumes → extracts structured skills/experience → matches against JD using Pinecone semantic search.<br>'
              '2. <b>Bias Detection:</b> Fine-tuned BERT detects gender/age/ethnicity-coded language in JDs and screening criteria → suggestions.<br>'
              '3. <b>Attrition Prediction:</b> XGBoost on engagement surveys, performance data, tenure, salary gap → flags flight-risk employees.<br>'
              '4. <b>Interview AI:</b> GPT-4o generates behavioral interview questions from JD + evaluates recorded answers for competency signals.<br>'
              '5. <b>Compensation Benchmarking:</b> Scraped salary data + role/level/location → fair pay range recommendations.<br>'
              '6. <b>Offline Mode:</b> Pre-cached HR policy templates + local scoring rules for offline presentations.')
        mp = (f'You are a Principal HRTech Engineer. Build "{full_name}" using Next.js 14, Node.js, PostgreSQL, '
              f'Pinecone, and GPT-4o. Requirements: (1) Multi-role auth (HR Manager/Recruiter/Employee/Admin) via Clerk with SSO. '
              f'(2) Resume parser: upload PDF/DOCX → GPT-4o extracts structured data → semantic match vs job requirements. '
              f'(3) Bias detection scanner: paste JD text → AI flags biased language + suggests neutral alternatives. '
              f'(4) Attrition risk dashboard: employee list with XGBoost risk scores and actionable interventions. '
              f'(5) Automated interview scheduler with calendar integration. '
              f'(6) Performance OKR tracker with team/individual views. '
              f'Demo flow: Upload 10 resumes → AI ranks by job fit → flag biased JD language → '
              f'see attrition dashboard → schedule top candidate interview. '
              f'Use Pinecone for candidate semantic search. Deploy Vercel + Railway. Start with resume parsing + auth.')
        db = ('Table employees { id uuid [pk], org_id uuid, email varchar, name varchar, department varchar, role varchar, start_date date, salary float, manager_id uuid }\n'
              'Table job_postings { id uuid [pk], org_id uuid, title varchar, department varchar, description text, requirements text, embedding vector(1536), status enum(open,closed), created_at timestamp }\n'
              'Table applications { id uuid [pk], job_id uuid [ref: > job_postings.id], candidate_email varchar, resume_url varchar, parsed_data jsonb, match_score float, status enum, applied_at timestamp }\n'
              'Table performance_reviews { id uuid [pk], employee_id uuid [ref: > employees.id], reviewer_id uuid, period varchar, scores jsonb, ai_summary text, created_at timestamp }\n'
              'Table engagement_surveys { id uuid [pk], employee_id uuid, survey_type varchar, responses jsonb, attrition_risk_score float, completed_at timestamp }')
        api = ('- POST /api/v1/auth/login\n- POST /api/v1/resumes/parse\n'
               '- POST /api/v1/resumes/match?job_id=\n- GET /api/v1/applications?job_id=\n'
               '- POST /api/v1/ai/scan-jd-bias\n- GET /api/v1/employees\n'
               '- GET /api/v1/employees/{id}/attrition-risk\n- POST /api/v1/performance-reviews\n'
               '- GET /api/v1/analytics/team-engagement\n- GET /api/v1/analytics/hiring-funnel\n'
               '- POST /api/v1/interviews/schedule\n- GET /api/v1/compensation/benchmark\n'
               '- POST /api/v1/surveys\n- GET /api/v1/surveys/{id}/results\n'
               '- GET /api/v1/okrs?employee_id=')
        win = ('<b>Judge Psychology:</b> HR judges think about human impact. Frame your AI as "augmenting HR, not replacing it". '
               'Show how the tool saves hours while improving fairness and outcomes for employees.<br>'
               '<b>Demo Hook (0-30s):</b> Upload 5 resumes → AI ranks them in 3 seconds → then show the JD bias scanner flagging "young and energetic" as age-coded language. '
               'Two powerful demos in one minute.<br>'
               '<b>Market Stat:</b> "Recruiters spend 23 hours screening candidates per hire. Our AI cuts that to 2 hours with 40% better quality matches."<br>'
               '<b>Q&A Prep:</b> Know EEOC guidelines, GDPR for candidate data, AI hiring bias regulations (NYC Local Law 144), and ATS integration APIs.')
        entries.append(entry(
            "HRTech", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead HRTech Backend Engineer", ["Node.js","PostgreSQL","Pinecone"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","XGBoost"],
            ["Next.js 14","Node.js","GPT-4o"]
        ))
    return entries

# ── LegalTech (50 entries) ──────────────────────────────────────────────────
LEGALTECH_KW = [
    "legal","law","lawyer","attorney","contract","agreement","compliance",
    "regulation","court","litigation","ip","intellectual property","patent",
    "trademark","copyright","gdpr","privacy","terms of service","nda",
    "due diligence","m&a","legal research","case law","precedent","statute",
    "jurisdiction","arbitration","mediation","clm","contract lifecycle",
    "e-discovery","legal document","document review","legal ai","lawtech",
    "legaltech","law firm","in-house counsel","paralegal","notary","signature",
    "e-signature","docusign","legal workflow","legal analytics","legal billing",
    "matter management","legal ops","legal spend","outside counsel",
    "regulatory compliance","sec","finra","gdpr compliance","hipaa legal",
    "leagal","laywer","contraact","legla","compliance app","legal hackathon",
    "build legal tool","create compliance system","win legaltech track",
    "contract analysis","ai lawyer","legal startup","law tech","legal chatbot"
]

LEGALTECH_PROJECTS = [
    ("AI Contract Analyzer","High"),
    ("Legal Document Generator","Medium"),
    ("Compliance Monitoring Dashboard","High"),
    ("Legal Research Assistant","High"),
    ("Contract Lifecycle Manager","High"),
    ("E-Signature Platform","Medium"),
    ("Due Diligence Automation","High"),
    ("IP Portfolio Tracker","High"),
    ("Legal Billing & Time Tracker","Medium"),
    ("GDPR Compliance Checker","High"),
    ("NDA Generator & Analyzer","Medium"),
    ("Court Date Manager","Medium"),
    ("Legal Q&A Chatbot","High"),
    ("Regulatory Change Tracker","High"),
    ("M&A Deal Room","High"),
    ("Patent Prior Art Searcher","High"),
    ("Legal Spend Analytics","High"),
    ("Matter Management System","High"),
    ("E-Discovery Document Classifier","High"),
    ("Legal Risk Scorer","High"),
    ("Contract Redline Comparator","High"),
    ("Statute & Case Law Searcher","High"),
    ("Law Firm Client Portal","Medium"),
    ("Legal Precedent Finder","High"),
    ("Terms of Service Summarizer","Medium"),
    ("Privacy Policy Generator","Medium"),
    ("Legal Workflow Automation","High"),
    ("Regulatory Sandbox Tracker","High"),
    ("Corporate Governance Dashboard","High"),
    ("IP Infringement Detector","High"),
    ("Legal Entity Management","High"),
    ("Arbitration Case Manager","High"),
    ("Legal Translation Platform","High"),
    ("Contract Obligation Tracker","High"),
    ("Law Firm Performance Analytics","High"),
    ("Legal Knowledge Graph","High"),
    ("Compliance Training Platform","Medium"),
    ("Anti-Bribery Compliance Checker","High"),
    ("Bankruptcy Risk Analyzer","High"),
    ("Legal Cost Predictor","High"),
    ("Deposition Summarizer","High"),
    ("Legal Brief Generator","High"),
    ("Whistleblower Portal","Medium"),
    ("Open Source License Analyzer","High"),
    ("Vendor Contract Reviewer","High"),
    ("Employment Law Advisor","Medium"),
    ("Real Estate Contract Checker","High"),
    ("Cross-Border Compliance Mapper","High"),
    ("Legal Deadline Tracker","Medium"),
    ("Lawyer Marketplace Platform","High"),
]

def legaltech_entries():
    entries = []
    for proj_name, complexity in LEGALTECH_PROJECTS:
        kw = list(LEGALTECH_KW)
        full_name = f"LegalTech {proj_name}"
        ov = (f'<h3>⚖️ {proj_name}</h3><p>The global legal technology market is valued at <b>$29 billion</b> '
              f'and growing at 14% CAGR as AI transforms one of the last manual-intensive professions. '
              f'Traditional contract review takes lawyers 2-3 hours per document; AI can do it in 30 seconds. '
              f'This platform provides {proj_name.lower()} capabilities, cutting legal costs by up to 80% '
              f'while improving accuracy and consistency. The winning angle: show live contract analysis — '
              f'upload a real NDA and watch the AI extract key terms, flag risks, and suggest redlines '
              f'in under a minute. Judges in legal tracks value both technical sophistication and '
              f'practical legal accuracy. Cite specific clause types and legal frameworks (GDPR Art. 17, CCPA, UCC).</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui + PDF.js for document rendering.<br>'
              '<h4>Backend:</h4> FastAPI (Python) + Celery for async document processing.<br>'
              '<h4>Database:</h4> PostgreSQL + Pinecone for semantic legal search.<br>'
              '<h4>Auth:</h4> Clerk with attorney-grade security (SOC 2 compliant sessions).<br>'
              '<h4>AI:</h4> GPT-4o for legal reasoning + Claude 3.5 for long documents + text-embedding-3-large for clause similarity.<br>'
              '<h4>Deploy:</h4> Vercel + Railway + encrypted S3 for document storage.')
        ai = ('1. <b>Contract Intelligence:</b> PDF → GPT-4o extracts parties, obligations, termination clauses, IP ownership → structured JSON.<br>'
              '2. <b>Risk Scoring:</b> Clause comparison against 50,000 clause library → flag above/below-market positions with risk scores.<br>'
              '3. <b>Legal Research RAG:</b> Case law and statute database embedded in Pinecone → GPT-4o answers legal questions with citations.<br>'
              '4. <b>Clause Suggestions:</b> Risky clause detected → GPT-4o generates alternative playbook language from best-practice templates.<br>'
              '5. <b>Regulatory Monitor:</b> Scrape regulatory websites → summarize changes → alert affected clients via classification model.<br>'
              '6. <b>Offline Mode:</b> GDPR Article summaries + standard clause templates cached for offline demos.')
        mp = (f'You are a Principal LegalTech Engineer with expertise in AI and contract law. '
              f'Build "{full_name}" using Next.js 14, FastAPI, PostgreSQL, Pinecone, and GPT-4o. '
              f'Requirements: (1) Secure auth with attorney-client privilege data isolation per org. '
              f'(2) Document upload (PDF/DOCX) → AI extracts parties, dates, obligations, risks → structured review. '
              f'(3) Clause risk scoring: compare extracted clauses vs market standard → traffic light risk display. '
              f'(4) Legal Q&A: type legal question → RAG over legal KB → GPT-4o answer with source citations. '
              f'(5) Contract template library with AI customization. '
              f'(6) Collaboration: multi-user redline tracking with version history. '
              f'Demo flow: Upload an NDA → AI extracts 15 key clauses → flags 3 risky provisions → '
              f'suggests alternative language → one-click accept/reject → export redlined document. '
              f'Store documents encrypted on S3, index clauses in Pinecone. Deploy Vercel + Railway.')
        db = ('Table organizations { id uuid [pk], name varchar, type enum(law_firm,corporate,individual), plan varchar }\n'
              'Table documents { id uuid [pk], org_id uuid, title varchar, type varchar, s3_key varchar, status enum(processing,reviewed,signed), uploaded_at timestamp }\n'
              'Table clauses { id uuid [pk], document_id uuid [ref: > documents.id], clause_type varchar, content text, embedding vector(1536), risk_score float, risk_level enum(low,medium,high), ai_note text }\n'
              'Table legal_queries { id uuid [pk], user_id uuid, question text, answer text, citations jsonb, created_at timestamp }\n'
              'Table contract_parties { id uuid [pk], document_id uuid, party_name varchar, role varchar, signature_status enum(pending,signed), signed_at timestamp }')
        api = ('- POST /api/v1/documents/upload\n- GET /api/v1/documents/{id}/analysis\n'
               '- GET /api/v1/documents/{id}/clauses\n- POST /api/v1/clauses/{id}/suggest-alternative\n'
               '- POST /api/v1/ai/legal-qa\n- GET /api/v1/templates\n'
               '- POST /api/v1/templates/generate\n- POST /api/v1/documents/{id}/compare\n'
               '- GET /api/v1/compliance/gdpr-check\n- GET /api/v1/analytics/document-summary\n'
               '- POST /api/v1/signatures/request\n- GET /api/v1/regulatory/updates\n'
               '- POST /api/v1/documents/{id}/export\n- GET /api/v1/search/clauses?q=\n'
               '- WS /ws/document-collaboration')
        win = ('<b>Judge Psychology:</b> Legal judges are risk-averse. Emphasize accuracy ("GPT-4o with legal fine-tuning"), '
               'security ("attorney-client privilege protected"), and compliance ("SOC 2 Type II").<br>'
               '<b>Demo Hook (0-30s):</b> Upload a real NDA (anonymized) → watch AI extract 15 clauses in 10 seconds → '
               'highlight a "unilateral termination" risk clause in red. Every judge who\'s reviewed contracts will feel the pain you\'re solving.<br>'
               '<b>Market Stat:</b> "Lawyers charge $300-$500/hour for contract review. Our AI does the same in 30 seconds."<br>'
               '<b>Q&A Prep:</b> Know attorney-client privilege implications for AI tools, UPL (unauthorized practice of law) guardrails, and GDPR Art. 22 on automated decision-making.')
        entries.append(entry(
            "LegalTech", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead LegalTech Backend Engineer", ["FastAPI","PostgreSQL","Pinecone"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","Claude 3.5"],
            ["Next.js 14","FastAPI","GPT-4o"]
        ))
    return entries

# ── FoodTech (50 entries) ──────────────────────────────────────────────────
FOODTECH_KW = [
    "food","restaurant","delivery","kitchen","menu","recipe","nutrition","diet",
    "calories","meal","cooking","chef","grocery","supermarket","food delivery",
    "uber eats","doordash","swiggy","zomato","foodpanda","cloud kitchen","ghost kitchen",
    "food safety","hygiene","haccp","food waste","sustainability food","organic",
    "plant-based","vegan","vegetarian","allergen","intolerance","gluten","dairy",
    "meal planning","calorie tracking","macro","food app","restaurant app",
    "order management","pos system","kitchen display","inventory food","supply",
    "food logistics","cold chain food","freshness","expiry","qr menu","contactless",
    "foodtech","food technology","food startup","restaurant tech","food hackathon",
    "foood","restarant","recipie","nutriton","meal preperation","food app",
    "build food app","create restaurant system","win foodtech track","healthy eating"
]

FOODTECH_PROJECTS = [
    ("AI Menu Optimizer","High"),
    ("Smart Kitchen Display System","Medium"),
    ("Food Waste Reduction Platform","High"),
    ("Personalized Meal Planner","High"),
    ("Restaurant Analytics Dashboard","High"),
    ("Cloud Kitchen Management System","High"),
    ("AI Recipe Generator","Medium"),
    ("Food Allergen Checker","High"),
    ("Nutrition Tracking App","Medium"),
    ("QR Code Digital Menu","Low"),
    ("Food Delivery Route Optimizer","High"),
    ("AI Chef Assistant","High"),
    ("Restaurant Inventory Manager","Medium"),
    ("Food Safety Compliance Tracker","High"),
    ("Ghost Kitchen Coordinator","High"),
    ("Meal Subscription Platform","High"),
    ("Food Cost Calculator","Medium"),
    ("Restaurant Review Sentiment Analyzer","High"),
    ("Grocery Shopping AI Assistant","Medium"),
    ("Diet Plan Generator","Medium"),
    ("Food Supply Chain Tracker","High"),
    ("Smart Fridge Inventory","Medium"),
    ("Restaurant Loyalty Platform","Medium"),
    ("Food Expiry Tracker","Low"),
    ("Catering Management System","Medium"),
    ("AI Nutritionist Chatbot","High"),
    ("Food Trend Predictor","High"),
    ("Restaurant Staff Scheduler","Medium"),
    ("Farm-to-Fork Traceability","High"),
    ("Dynamic Pricing for Food","High"),
    ("Food Marketplace Platform","High"),
    ("Calorie Counter AI","Medium"),
    ("School Meal Planner","Medium"),
    ("Hospital Diet Manager","High"),
    ("Food Franchise Dashboard","High"),
    ("AI Food Photographer","Medium"),
    ("Restaurant Booking Platform","Medium"),
    ("Food Subscription Box Manager","Medium"),
    ("Plant-Based Food Ranker","Medium"),
    ("Food Carbon Calculator","Medium"),
    ("Meal Kit Customizer","Medium"),
    ("Food Influencer Analytics","High"),
    ("Dark Store Inventory Manager","High"),
    ("Restaurant POS with AI","High"),
    ("Food Recall Alert System","High"),
    ("International Cuisine Explorer","Low"),
    ("Hyperlocal Food Delivery","High"),
    ("Food Bank Coordinator","Medium"),
    ("Halal/Kosher Certification Tracker","Medium"),
    ("Restaurant Opening Predictor","High"),
]

def foodtech_entries():
    entries = []
    for proj_name, complexity in FOODTECH_PROJECTS:
        kw = list(FOODTECH_KW)
        full_name = f"FoodTech {proj_name}"
        ov = (f'<h3>🍕 {proj_name}</h3><p>The global food technology market is projected to reach <b>$342 billion by 2027</b>, '
              f'with AI-driven personalization, waste reduction, and delivery optimization at the forefront. '
              f'Restaurants waste 4-10% of purchased food before it reaches customers. '
              f'This platform provides {proj_name.lower()} to tackle this and other critical food industry challenges. '
              f'The winning angle: show something tangible — a recipe generated from fridge inventory, '
              f'a waste reduction suggestion, or a personalized meal plan — in real time. '
              f'Judges in FoodTech tracks appreciate both technical depth and real consumer impact. '
              f'Integrates with Spoonacular API, USDA food database, and major POS systems.</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui + Framer Motion for food-rich animations.<br>'
              '<h4>Backend:</h4> Node.js (Express) + BullMQ for order processing queues.<br>'
              '<h4>Database:</h4> PostgreSQL + Redis for real-time order status.<br>'
              '<h4>Auth:</h4> Clerk with restaurant/customer multi-role support.<br>'
              '<h4>AI:</h4> GPT-4o for recipe generation + GPT-4 Vision for food image analysis + DALL-E 3 for menu photos.<br>'
              '<h4>Deploy:</h4> Vercel + Railway + Cloudflare Images for food photography CDN.')
        ai = ('1. <b>Recipe Intelligence:</b> Ingredients input → GPT-4o generates recipes with nutritional breakdown + plating suggestions.<br>'
              '2. <b>Vision Food AI:</b> GPT-4 Vision analyzes food photo → estimates calories, ingredients, allergens → logs to nutrition tracker.<br>'
              '3. <b>Demand Forecasting:</b> Historical orders + weather + events → Prophet predicts next-day demand per menu item → reduces waste.<br>'
              '4. <b>Personalization Engine:</b> User preferences + dietary restrictions + past orders → collaborative filtering recommendations.<br>'
              '5. <b>Sentiment Analysis:</b> Google/Yelp reviews → BERT sentiment → actionable insights for menu and service improvements.<br>'
              '6. <b>Offline Mode:</b> Cached popular recipes + basic nutrition data + local allergen checker for demo without API.')
        mp = (f'You are a Principal FoodTech Engineer. Build "{full_name}" using Next.js 14, Node.js, '
              f'PostgreSQL, and GPT-4o. Requirements: (1) Multi-role auth (Restaurant Owner/Chef/Customer/Admin). '
              f'(2) AI recipe generator: input ingredients → GPT-4o generates detailed recipe with nutrition info. '
              f'(3) Real-time order management with kitchen display system view. '
              f'(4) Inventory tracker with low-stock alerts and waste prediction. '
              f'(5) Customer-facing menu with allergen filter and AI personalization. '
              f'(6) Analytics dashboard: revenue, popular items, waste reduction progress. '
              f'Demo flow: Chef inputs today\'s inventory → AI suggests 3 optimal menus to minimize waste → '
              f'customer browses personalized menu → order goes live on KDS → see analytics update. '
              f'Use USDA FoodData Central API for nutritional data. Deploy Vercel + Railway. Start with menu + order flow.')
        db = ('Table restaurants { id uuid [pk], owner_id uuid, name varchar, cuisine_type varchar, address varchar, plan varchar }\n'
              'Table menu_items { id uuid [pk], restaurant_id uuid [ref: > restaurants.id], name varchar, description text, price float, calories int, allergens jsonb, category varchar, available bool }\n'
              'Table orders { id uuid [pk], restaurant_id uuid, customer_id uuid, items jsonb, total float, status enum(placed,preparing,ready,delivered), placed_at timestamp }\n'
              'Table inventory { id uuid [pk], restaurant_id uuid, ingredient varchar, quantity float, unit varchar, expiry_date date, cost_per_unit float }\n'
              'Table nutrition_logs { id uuid [pk], user_id uuid, food_item varchar, calories int, protein float, carbs float, fat float, logged_at timestamp }')
        api = ('- POST /api/v1/auth/register\n- GET /api/v1/menu?restaurant_id=&allergens=\n'
               '- POST /api/v1/orders\n- GET /api/v1/orders/{id}/status\n'
               '- POST /api/v1/ai/generate-recipe\n- POST /api/v1/ai/analyze-food-image\n'
               '- GET /api/v1/inventory\n- GET /api/v1/inventory/waste-prediction\n'
               '- POST /api/v1/ai/menu-optimizer\n- GET /api/v1/analytics/revenue\n'
               '- GET /api/v1/analytics/popular-items\n- POST /api/v1/nutrition/log\n'
               '- GET /api/v1/nutrition/summary\n- GET /api/v1/reviews/sentiment\n'
               '- WS /ws/kitchen-display')
        win = ('<b>Judge Psychology:</b> FoodTech judges love to see relatable demos. '
               'Everyone eats — show something they instantly understand and want.<br>'
               '<b>Demo Hook (0-30s):</b> Photograph whatever food is in the room → AI identifies it, calculates calories, flags allergens. '
               'Or: type "chicken, spinach, garlic" → watch AI generate a Michelin-quality recipe in 3 seconds.<br>'
               '<b>Market Stat:</b> "Restaurants lose $162 billion to food waste annually. Our AI reduces waste by 23% through demand forecasting."<br>'
               '<b>Q&A Prep:</b> Know HACCP food safety standards, FDA menu labeling requirements, and allergen disclosure regulations (EU 1169/2011).')
        entries.append(entry(
            "FoodTech", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead FoodTech Backend Engineer", ["Node.js","PostgreSQL","BullMQ"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","GPT-4 Vision"],
            ["Next.js 14","Node.js","GPT-4o"]
        ))
    return entries

# ── SportsTech (50 entries) ──────────────────────────────────────────────────
SPORTSTECH_KW = [
    "sports","athlete","fitness","workout","gym","training","performance",
    "coaching","team","league","tournament","match","game","score","stat",
    "analytics","wearable sport","gps tracking","heart rate sport","vo2 max",
    "recovery","sleep sport","nutrition sport","injury","rehabilitation",
    "football","soccer","basketball","tennis","cricket","baseball","rugby",
    "swimming","running","cycling","triathlon","esports","fantasy sports",
    "sports betting","odds","fan engagement","stadium","ticketing","sports app",
    "scouting","recruitment athlete","draft","performance tracking","video analysis",
    "sportstech","sports technology","sport hackathon","sports startup",
    "sprot","athlte","fitnes","gyym","sport app","build sports app",
    "create fitness platform","win sports track","athlete monitoring",
    "sports data","sports analytics platform","ai coaching","ai referee"
]

SPORTSTECH_PROJECTS = [
    ("AI Athlete Performance Analyzer","High"),
    ("Smart Training Load Manager","High"),
    ("Injury Prevention System","High"),
    ("Sports Video Analysis Tool","High"),
    ("Fan Engagement Platform","High"),
    ("Team Scouting & Draft Tool","High"),
    ("Fantasy Sports AI Advisor","High"),
    ("Fitness Workout Generator","Medium"),
    ("Real-Time Match Analytics","High"),
    ("Nutrition & Recovery Tracker","Medium"),
    ("Live Sports Commentary AI","High"),
    ("Sports Betting Odds Analyzer","High"),
    ("eSports Performance Dashboard","High"),
    ("Stadium Operations Manager","High"),
    ("Youth Academy Talent Tracker","High"),
    ("Sports Wearable Data Hub","High"),
    ("Referee Decision Support System","High"),
    ("Sports Contract Analyzer","High"),
    ("Sports Sponsorship Matcher","High"),
    ("Golf Performance Tracker","Medium"),
    ("Swimming Stroke Analyzer","High"),
    ("Marathon Training Planner","Medium"),
    ("Cycling Power Optimizer","Medium"),
    ("Cricket Match Predictor","High"),
    ("Basketball Shot Analyzer","High"),
    ("Tennis Serve Speed Tracker","Medium"),
    ("Sports Injury Rehab Tracker","Medium"),
    ("Sports Media Analytics","High"),
    ("Gym Equipment Booking System","Low"),
    ("Sports Community Platform","Medium"),
    ("Athlete Mental Health Platform","Medium"),
    ("Sports Scheduling Optimizer","Medium"),
    ("Sports Ticket Resale Platform","High"),
    ("Player Biometric Dashboard","High"),
    ("Sports Highlights Generator","High"),
    ("Coach AI Assistant","High"),
    ("Sports Merchandise Personalizer","Medium"),
    ("League Management System","Medium"),
    ("Sports Data Marketplace","High"),
    ("Fitness Challenge Platform","Medium"),
    ("Sleep & Recovery Optimizer","Medium"),
    ("Sports Live Polling Platform","Medium"),
    ("Club Financial Dashboard","High"),
    ("Sports Volunteer Coordinator","Low"),
    ("Virtual Sports Training App","High"),
    ("Sports Physics Simulator","High"),
    ("Parkrun Progress Tracker","Low"),
    ("Outdoor Adventure Planner","Medium"),
    ("Sports NFT Platform","High"),
    ("AI Personal Trainer App","High"),
]

def sportstech_entries():
    entries = []
    for proj_name, complexity in SPORTSTECH_PROJECTS:
        kw = list(SPORTSTECH_KW)
        full_name = f"SportsTech {proj_name}"
        ov = (f'<h3>⚽ {proj_name}</h3><p>The global sports technology market is valued at <b>$31 billion</b> '
              f'and growing at 19% CAGR. AI is transforming how teams train, scout, and compete. '
              f'This platform provides {proj_name.lower()} capabilities, giving athletes and coaches '
              f'data-driven insights previously available only to elite professional teams. '
              f'The winning angle: show live athletic data — movement patterns, performance metrics, '
              f'or injury risk scores — in a visually stunning real-time dashboard. '
              f'Sports judges respond to demos where you can see an athlete\'s performance story unfolding. '
              f'Mention partnerships with professional sports data providers (Opta, Stats Perform, Hawkeye).</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui + Recharts + D3.js for sport visualizations.<br>'
              '<h4>Backend:</h4> FastAPI (Python) + WebSocket for real-time data.<br>'
              '<h4>Database:</h4> PostgreSQL + TimescaleDB for time-series athlete data.<br>'
              '<h4>Auth:</h4> Clerk with team/athlete multi-role.<br>'
              '<h4>AI:</h4> YOLOv8 for pose estimation/video analysis + GPT-4o for coaching insights + Prophet for performance trends.<br>'
              '<h4>Deploy:</h4> Vercel + Railway + Cloudflare Stream for video.')
        ai = ('1. <b>Video Analysis:</b> YOLOv8 + MediaPipe Pose estimates athlete biomechanics from video → flags technique errors.<br>'
              '2. <b>Performance Prediction:</b> LSTM neural network on time-series wearable data → predicts peak performance windows.<br>'
              '3. <b>Injury Risk Model:</b> XGBoost on training load, sleep, HRV, previous injuries → injury probability score per athlete.<br>'
              '4. <b>Coaching AI:</b> GPT-4o with sport-specific knowledge base → personalized training recommendations and feedback.<br>'
              '5. <b>Match Intelligence:</b> Real-time event stream → tactical pattern recognition → live coach alerts.<br>'
              '6. <b>Offline Mode:</b> Pre-cached athlete profiles + training plans for use in remote training facilities.')
        mp = (f'You are a Principal SportsTech Engineer. Build "{full_name}" using Next.js 14, FastAPI, '
              f'PostgreSQL + TimescaleDB, YOLOv8, and GPT-4o. Requirements: (1) Multi-role auth (Coach/Athlete/Admin/Scout). '
              f'(2) Athlete dashboard with real-time performance metrics from wearable sync. '
              f'(3) Injury risk scoring: XGBoost model on training load + sleep + biometrics → traffic light risk. '
              f'(4) Video upload → YOLOv8 pose analysis → technique feedback with annotated video output. '
              f'(5) AI coaching chat: ask questions about training → GPT-4o answers with sport-specific context. '
              f'(6) Team analytics: squad comparison, load distribution, readiness scores. '
              f'Demo flow: Upload athlete training data → see performance trend → check injury risk → '
              f'upload video → get technique feedback → ask AI coach a question. '
              f'Use TimescaleDB for time-series metrics, Recharts for visualizations. Deploy Vercel + Railway.')
        db = ('Table athletes { id uuid [pk], team_id uuid, name varchar, dob date, position varchar, dominant_foot varchar, height float, weight float }\n'
              'Table training_sessions { id uuid [pk], athlete_id uuid [ref: > athletes.id], date date, duration_min int, distance_km float, avg_heart_rate int, rpe int, sleep_hours float }\n'
              'Table performance_metrics { id uuid [pk], athlete_id uuid, metric_type varchar, value float, unit varchar, recorded_at timestamp }\n'
              'Table injury_records { id uuid [pk], athlete_id uuid, injury_type varchar, body_part varchar, severity enum(minor,moderate,major), start_date date, return_date date }\n'
              'Table match_events { id uuid [pk], match_id uuid, athlete_id uuid, event_type varchar, minute int, location_x float, location_y float, outcome varchar }')
        api = ('- POST /api/v1/athletes\n- GET /api/v1/athletes/{id}/dashboard\n'
               '- POST /api/v1/training-sessions\n- GET /api/v1/athletes/{id}/performance-trend\n'
               '- GET /api/v1/athletes/{id}/injury-risk\n- POST /api/v1/ai/analyze-video\n'
               '- POST /api/v1/ai/coaching-advice\n- GET /api/v1/teams/{id}/squad-readiness\n'
               '- GET /api/v1/analytics/load-distribution\n- POST /api/v1/match-events/batch\n'
               '- GET /api/v1/match/{id}/heatmap\n- GET /api/v1/scouting/recommendations\n'
               '- GET /api/v1/benchmarks/position-averages\n- POST /api/v1/reports/athlete\n'
               '- WS /ws/live-match-feed')
        win = ('<b>Judge Psychology:</b> Sports judges often have deep domain knowledge (former athletes, coaches, sports executives). '
               'Technical demos that show real sports data (GPS traces, heart rate curves, sprint speeds) score higher than generic charts.<br>'
               '<b>Demo Hook (0-30s):</b> Show a real athlete GPS heatmap from a match, then surface their injury risk score: '
               '"Player 7 has been overloaded for 3 days. Here\'s why we\'re recommending rest tomorrow."<br>'
               '<b>Market Stat:</b> "Elite clubs spend $2M+ per injury. Our AI predicts 73% of non-contact injuries 5 days before they occur."<br>'
               '<b>Q&A Prep:</b> Know HRV (heart rate variability) as a recovery metric, RPE (rate of perceived exertion) scales, and major sports data APIs (Opta, Wyscout).')
        entries.append(entry(
            "SportsTech", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead SportsTech Backend Engineer", ["FastAPI","TimescaleDB","YOLOv8"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","D3.js"],
            ["Next.js 14","FastAPI","GPT-4o"]
        ))
    return entries

# ── Web3 (50 entries) ──────────────────────────────────────────────────────
WEB3_KW = [
    "web3","blockchain","crypto","nft","defi","dao","smart contract","ethereum",
    "solidity","polygon","avalanche","solana","cardano","polkadot","layer2",
    "optimism","arbitrum","zk rollup","zero knowledge","zk proof","wallet",
    "metamask","walletconnect","wagmi","rainbow kit","ipfs","filecoin","arweave",
    "token","tokenomics","erc20","erc721","erc1155","nft marketplace","opensea",
    "uniswap","aave","compound","yield farming","liquidity pool","amm","dex",
    "cex","bridge","cross-chain","multi-chain","staking","governance","voting",
    "on-chain","off-chain","oracle","chainlink","the graph","subgraph",
    "web3 app","dapp","decentralized","trustless","permissionless","web 3",
    "blokchain","etereum","soliidity","nft app","defi app","web3 hackathon",
    "build dapp","create web3 app","win web3 track","crypto startup","dao tool",
    "nft creator","token launch","blockchain analytics","on-chain analytics"
]

WEB3_PROJECTS = [
    ("NFT Marketplace Platform","High"),
    ("DeFi Yield Aggregator","High"),
    ("DAO Governance System","High"),
    ("Smart Contract Auditor AI","High"),
    ("On-Chain Analytics Dashboard","High"),
    ("Multi-Chain Wallet Tracker","High"),
    ("Token Launch Launchpad","High"),
    ("DeFi Portfolio Manager","High"),
    ("Cross-Chain Bridge UI","High"),
    ("Web3 Identity & Reputation","High"),
    ("Blockchain Voting System","High"),
    ("NFT Creator Studio","High"),
    ("DeFi Liquidity Optimizer","High"),
    ("Web3 Social Platform","High"),
    ("Crypto Tax Calculator","High"),
    ("Smart Contract Template Library","High"),
    ("On-Chain Credit Scoring","High"),
    ("Decentralized Freelance Platform","High"),
    ("Web3 Gaming Item Marketplace","High"),
    ("Tokenized Real Estate Platform","High"),
    ("DeFi Risk Analyzer","High"),
    ("Blockchain Supply Chain Tracer","High"),
    ("Web3 Subscription Platform","High"),
    ("DAO Treasury Manager","High"),
    ("NFT Rarity Analyzer","Medium"),
    ("Crypto Portfolio Rebalancer","High"),
    ("On-Chain Fund Manager","High"),
    ("Web3 Knowledge Base","Medium"),
    ("Decentralized Insurance Protocol","High"),
    ("Blockchain Certificate Issuer","High"),
    ("Web3 Event Ticketing","High"),
    ("Crypto Sentiment Analyzer","High"),
    ("DeFi News Aggregator","Medium"),
    ("Smart Contract Deployment Tool","High"),
    ("NFT Provenance Tracker","High"),
    ("Decentralized Content Platform","High"),
    ("Web3 Crowdfunding Platform","High"),
    ("On-Chain Reputation System","High"),
    ("Multi-Sig Treasury Tool","High"),
    ("Tokenomics Simulator","High"),
    ("Blockchain Diploma Verifier","Medium"),
    ("Crypto Wallet Analyzer","High"),
    ("DeFi Protocol Comparator","High"),
    ("Web3 Referral System","High"),
    ("Blockchain Data Indexer","High"),
    ("Crypto Donation Platform","Medium"),
    ("NFT Staking Platform","High"),
    ("Web3 API Gateway","High"),
    ("DAO Proposal Manager","High"),
    ("Crypto Derivatives Tracker","High"),
]

def web3_entries():
    entries = []
    for proj_name, complexity in WEB3_PROJECTS:
        kw = list(WEB3_KW)
        full_name = f"Web3 {proj_name}"
        ov = (f'<h3>🔗 {proj_name}</h3><p>The global blockchain market is projected to reach <b>$1.4 trillion by 2030</b>. '
              f'Web3 is rebuilding financial infrastructure, creative economies, and governance from the ground up. '
              f'This platform delivers {proj_name.lower()} capabilities on-chain, enabling trustless, '
              f'permissionless interactions with full transparency and user ownership of data and assets. '
              f'The winning angle: make it work with a real wallet in a real testnet transaction — '
              f'judges at Web3 hackathons connect MetaMask instantly and test everything live. '
              f'Support Ethereum mainnet + Polygon PoS + testnet demos. '
              f'Show gas optimization (important!) and front-end responsiveness in the demo. '
              f'Reference EIP standards and audit status for credibility.</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui + wagmi + RainbowKit for wallet connection.<br>'
              '<h4>Smart Contracts:</h4> Solidity 0.8+ + Hardhat + OpenZeppelin contracts.<br>'
              '<h4>Indexing:</h4> The Graph (subgraphs) for on-chain data querying.<br>'
              '<h4>Storage:</h4> IPFS (Pinata) for decentralized storage + PostgreSQL for off-chain metadata.<br>'
              '<h4>Auth:</h4> Sign-In With Ethereum (EIP-4361) + JWT for session.<br>'
              '<h4>AI:</h4> GPT-4o for smart contract analysis + on-chain data explanation.<br>'
              '<h4>Deploy:</h4> Vercel (frontend) + Hardhat Deploy to Polygon Mumbai/Mainnet.')
        ai = ('1. <b>Smart Contract AI:</b> GPT-4o analyzes Solidity code → identifies reentrancy, integer overflow, access control bugs + suggests fixes.<br>'
              '2. <b>On-Chain Analytics:</b> The Graph indexes events → GPT-4o generates plain-English summaries of wallet activity and protocol usage.<br>'
              '3. <b>Fraud Detection:</b> Graph analysis of transaction networks → detect wash trading, Sybil attacks, front-running patterns.<br>'
              '4. <b>Tokenomics Simulator:</b> Agent-based model simulates token supply/demand dynamics under different emission/burn scenarios.<br>'
              '5. <b>DeFi Optimizer:</b> Real-time APY data across protocols → optimization algorithm suggests best yield allocation.<br>'
              '6. <b>Offline Mode:</b> Cached blockchain data + local ERC-20 calculation engine for demo without RPC connectivity.')
        mp = (f'You are a Principal Web3 Engineer. Build "{full_name}" using Next.js 14, Solidity, '
              f'Hardhat, wagmi/RainbowKit, The Graph, and GPT-4o. Requirements: (1) Wallet connection with RainbowKit (MetaMask, WalletConnect). '
              f'(2) Smart contract: deploy on Polygon Mumbai testnet with Hardhat. '
              f'(3) The Graph subgraph to index contract events for real-time data. '
              f'(4) AI smart contract analyzer: paste Solidity code → GPT-4o flags vulnerabilities. '
              f'(5) Beautiful dashboard showing on-chain data with real transaction feeds. '
              f'(6) IPFS upload for decentralized metadata storage via Pinata. '
              f'Demo flow: Connect MetaMask → interact with contract on testnet → see transaction indexed → '
              f'view AI contract analysis → explore on-chain analytics. '
              f'Use OpenZeppelin for contract security. Deploy to Polygon Mumbai. Start with contract + frontend wallet connection.')
        db = ('Table wallets { id uuid [pk], address varchar [unique], ens_name varchar, first_seen timestamp, tx_count int }\n'
              'Table contracts { id uuid [pk], address varchar [unique], chain_id int, name varchar, abi jsonb, bytecode_hash varchar, deployed_at timestamp, audit_status varchar }\n'
              'Table transactions { id uuid [pk], hash varchar [unique], from_address varchar, to_address varchar, value_wei numeric, gas_used int, block_number int, timestamp timestamp }\n'
              'Table nft_tokens { id uuid [pk], contract_id uuid [ref: > contracts.id], token_id varchar, owner_address varchar, metadata_uri varchar, rarity_score float, last_transfer timestamp }\n'
              'Table defi_positions { id uuid [pk], wallet_address varchar, protocol varchar, position_type varchar, asset varchar, amount float, usd_value float, apy float, updated_at timestamp }')
        api = ('- POST /api/v1/auth/siwe (Sign-In With Ethereum)\n- GET /api/v1/wallet/{address}/portfolio\n'
               '- GET /api/v1/wallet/{address}/transactions\n- POST /api/v1/ai/analyze-contract\n'
               '- GET /api/v1/nfts/{contract}/{token_id}\n- GET /api/v1/defi/yields\n'
               '- GET /api/v1/analytics/gas-tracker\n- POST /api/v1/ipfs/upload\n'
               '- GET /api/v1/governance/proposals?dao=\n- POST /api/v1/governance/vote\n'
               '- GET /api/v1/token/{address}/holders\n- GET /api/v1/token/{address}/analytics\n'
               '- POST /api/v1/deploy/contract\n- GET /api/v1/search/contracts?q=\n'
               '- WS /ws/mempool-stream')
        win = ('<b>Judge Psychology:</b> Web3 judges will test your dApp live with their own wallet. '
               'Ensure the transaction flow is smooth and works on testnet without errors or timeouts.<br>'
               '<b>Demo Hook (0-30s):</b> Connect MetaMask → execute one on-chain transaction → see it indexed in real time. '
               'Then show the AI contract analyzer flagging a real vulnerability in a famous hacked protocol\'s code.<br>'
               '<b>Market Stat:</b> "$3.8 billion was lost to smart contract exploits in 2022. Our AI audit tool catches 85% of known vulnerability patterns."<br>'
               '<b>Q&A Prep:</b> Know EIP-4626 (tokenized vaults), EIP-4337 (account abstraction), The Graph subgraph deployment, and gas optimization techniques (SSTORE, memory vs calldata).')
        entries.append(entry(
            "Web3", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead Web3 Smart Contract Engineer", ["Solidity","Hardhat","The Graph"],
            "Full-Stack Web3 Developer", ["Next.js 14","wagmi","GPT-4o"],
            ["Next.js 14","Solidity","The Graph"]
        ))
    return entries

# ── GamingTech (50 entries) ──────────────────────────────────────────────────
GAMINGTECH_KW = [
    "game","gaming","gamer","video game","mobile game","pc game","console game",
    "unity","unreal engine","godot","game dev","game developer","game design",
    "multiplayer","online game","pvp","pve","mmo","mmorpg","battle royale",
    "fps","rpg","strategy","puzzle","casual game","hyper-casual","indie game",
    "level design","quest","npc","ai npc","procedural generation","game engine",
    "leaderboard","achievement","badge","in-app purchase","monetization",
    "game analytics","player behavior","churn prediction","ltv","dau","mau",
    "esports","streaming","twitch","youtube gaming","game community","clan",
    "guild","matchmaking","elo rating","anti-cheat","game moderation",
    "3d model","animation","shader","physics engine","particle system",
    "gming","vido game","gmae","unity game","game hackathon","gaming startup",
    "build game","create game tool","win gaming track","game analytics platform",
    "game backend","game server","real-time multiplayer","game ai"
]

GAMINGTECH_PROJECTS = [
    ("AI NPC Behavior Engine","High"),
    ("Game Analytics Dashboard","High"),
    ("Procedural Level Generator","High"),
    ("Anti-Cheat Detection System","High"),
    ("Matchmaking Algorithm Builder","High"),
    ("Player Behavior Analyzer","High"),
    ("Game Backend-as-a-Service","High"),
    ("Live Ops Management Platform","High"),
    ("Game Moderation AI","High"),
    ("Esports Tournament Manager","High"),
    ("Game Economy Simulator","High"),
    ("AI Game Master Assistant","High"),
    ("Player Churn Predictor","High"),
    ("Game Localization Platform","Medium"),
    ("Game QA Bug Reporter","Medium"),
    ("Multiplayer Server Manager","High"),
    ("Game Asset Marketplace","High"),
    ("AI Dungeon Master","High"),
    ("Gaming Community Platform","Medium"),
    ("Game Achievement System","Medium"),
    ("Player Engagement Optimizer","High"),
    ("Game Loot Box Compliance Checker","High"),
    ("Game Revenue Analytics","High"),
    ("AI Game Difficulty Adjuster","High"),
    ("Steam Game Recommender","Medium"),
    ("Game Streaming Toolkit","High"),
    ("Guild & Clan Manager","Medium"),
    ("Game Monetization Optimizer","High"),
    ("Game Asset Generator (AI)","High"),
    ("Game Data Exporter","Medium"),
    ("Fantasy Esports Platform","High"),
    ("Game Coaching Platform","High"),
    ("Game Narrative Generator","High"),
    ("AR Gaming Experience Builder","High"),
    ("VR Game Launcher","High"),
    ("AI Game Tester","High"),
    ("Game Update Notification System","Low"),
    ("Cross-Platform Game Sync","High"),
    ("In-Game Survey Platform","Medium"),
    ("Game Security Scanner","High"),
    ("AI Speedrun Advisor","Medium"),
    ("Game Design Document Generator","Medium"),
    ("Game Soundtrack Generator","High"),
    ("Play-to-Earn Game Platform","High"),
    ("Game Clipping & Highlight Tool","High"),
    ("Competitive Rankings Platform","Medium"),
    ("Game Accessibility Checker","Medium"),
    ("Game Patent Search Tool","Medium"),
    ("Retro Game Emulator Hub","Medium"),
    ("Game Dev Learning Platform","Medium"),
]

def gamingtech_entries():
    entries = []
    for proj_name, complexity in GAMINGTECH_PROJECTS:
        kw = list(GAMINGTECH_KW)
        full_name = f"GamingTech {proj_name}"
        ov = (f'<h3>🎮 {proj_name}</h3><p>The global gaming market generates <b>$184 billion annually</b>, '
              f'overtaking both music and film combined. AI is transforming every layer — '
              f'from AI-driven NPCs to adaptive difficulty and procedural content generation. '
              f'This platform delivers {proj_name.lower()} capabilities, giving game developers '
              f'superpowers to build smarter, more engaging experiences. '
              f'The winning angle: show a live game interaction — an AI NPC responding dynamically, '
              f'a generated level, or a real-time player analytics dashboard. '
              f'Gaming judges are developers themselves; they appreciate technical depth, clean architecture, '
              f'and features that would take months to build from scratch. '
              f'Demo with a playable prototype whenever possible — it\'s the most memorable kind of presentation.</p>')
        ts = ('<h4>Frontend:</h4> Next.js 14 + Tailwind CSS + shadcn/ui (dashboard) + Phaser.js (2D game) or Three.js (3D).<br>'
              '<h4>Backend:</h4> Go (Fiber) for ultra-low latency game server APIs.<br>'
              '<h4>Database:</h4> PostgreSQL + Redis (player sessions/leaderboards) + ClickHouse for analytics.<br>'
              '<h4>Auth:</h4> Clerk with OAuth (Steam, Discord, Google).<br>'
              '<h4>AI:</h4> GPT-4o for NPC dialogue/narrative + Unity ML-Agents for game AI + Stable Diffusion for asset generation.<br>'
              '<h4>Deploy:</h4> Vercel (dashboard) + Railway (game server) + Agora SDK for real-time multiplayer.')
        ai = ('1. <b>Intelligent NPC:</b> GPT-4o with per-NPC system prompts + memory → NPCs remember player interactions and respond dynamically.<br>'
              '2. <b>Procedural Generation:</b> Perlin noise + WFC (Wave Function Collapse) algorithm → infinite unique levels + GPT-4o generates narrative context.<br>'
              '3. <b>Player Behavior ML:</b> Sequence model on game event logs → predict churn 7 days ahead with 82% accuracy → trigger retention intervention.<br>'
              '4. <b>Adaptive Difficulty:</b> Reinforcement learning agent adjusts enemy stats/spawn rates based on player performance in real time.<br>'
              '5. <b>Anti-Cheat:</b> Statistical anomaly detection on player action sequences → flag impossible inputs or superhuman performance.<br>'
              '6. <b>Offline Mode:</b> Local rule-based NPC behavior + pre-cached level seeds for demo without API connectivity.')
        mp = (f'You are a Principal Game Platform Engineer. Build "{full_name}" using Next.js 14, Go (Fiber), '
              f'PostgreSQL, Redis, and GPT-4o. Requirements: (1) Auth with Discord/Steam OAuth via Clerk. '
              f'(2) AI NPC system: define NPC personality + memory → GPT-4o handles dialogue in real time. '
              f'(3) Player analytics: real-time event ingestion → dashboard showing DAU, retention, churn risk. '
              f'(4) Leaderboard system with Redis sorted sets for sub-millisecond ranking. '
              f'(5) Live game event stream via WebSocket. '
              f'(6) Admin panel for live ops: push notifications, event configs, A/B tests. '
              f'Demo flow: Show a playable mini-game → interact with AI NPC (unique response) → '
              f'view analytics dashboard updating live → trigger a live event. '
              f'Use Redis for leaderboards and sessions, ClickHouse for analytics. Deploy Vercel + Railway.')
        db = ('Table players { id uuid [pk], username varchar, discord_id varchar, level int, xp int, coins int, created_at timestamp }\n'
              'Table game_sessions { id uuid [pk], player_id uuid [ref: > players.id], game_mode varchar, duration_secs int, score int, started_at timestamp, ended_at timestamp }\n'
              'Table game_events { id uuid [pk], session_id uuid, event_type varchar, payload jsonb, timestamp timestamp }\n'
              'Table npc_memories { id uuid [pk], npc_id varchar, player_id uuid, interaction_summary text, sentiment varchar, last_interaction timestamp }\n'
              'Table tournaments { id uuid [pk], name varchar, game_mode varchar, start_time timestamp, prize_pool float, status enum(upcoming,live,completed), brackets jsonb }')
        api = ('- POST /api/v1/auth/discord\n- GET /api/v1/players/{id}/profile\n'
               '- POST /api/v1/game-sessions/start\n- POST /api/v1/game-sessions/{id}/end\n'
               '- POST /api/v1/events/batch\n- GET /api/v1/leaderboard?mode=&limit=\n'
               '- POST /api/v1/ai/npc-dialogue\n- GET /api/v1/analytics/retention\n'
               '- GET /api/v1/analytics/churn-risk\n- POST /api/v1/tournaments\n'
               '- GET /api/v1/tournaments/{id}/brackets\n- POST /api/v1/live-ops/event\n'
               '- GET /api/v1/achievements?player_id=\n- POST /api/v1/report/player\n'
               '- WS /ws/game-events')
        win = ('<b>Judge Psychology:</b> Gaming judges want to play your demo, not just watch it. '
               'Make something interactive. Even a 2-minute playable mini-game beats a static dashboard every time.<br>'
               '<b>Demo Hook (0-30s):</b> Open a playable demo, interact with an AI NPC — ask it something unexpected. '
               'Watch it respond contextually with memory. Then pull up the analytics dashboard showing your test session data.<br>'
               '<b>Market Stat:</b> "Game studios lose 45% of players in the first week. Our AI churn predictor identifies at-risk players 7 days early, enabling targeted retention campaigns."<br>'
               '<b>Q&A Prep:</b> Know Unity ML-Agents vs GPT-4o NPCs tradeoffs, GDPR for player data (especially minors), loot box regulations by jurisdiction, and Elo vs Glicko-2 for matchmaking.')
        entries.append(entry(
            "GamingTech", full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            "Lead Game Backend Engineer", ["Go (Fiber)","Redis","WebSocket"],
            "Full-Stack AI Developer", ["Next.js 14","GPT-4o","Phaser.js"],
            ["Next.js 14","Go (Fiber)","GPT-4o"]
        ))
    return entries

# ── MediaTech / BioTech / SocialImpact / SpaceTech / DeepTech (50 each) ────
# Using parametric generation for the remaining 10 industries to keep it compact

INDUSTRY_SPECS = {
    "MediaTech": {
        "emoji": "🎬",
        "market": "$2.1 trillion by 2026",
        "kw": [
            "media","content","video","audio","podcast","streaming","youtube","tiktok","instagram",
            "news","journalism","publishing","editor","creator","influencer","production","post-production",
            "subtitle","caption","transcript","dubbing","voiceover","music","radio","broadcast",
            "ott","vod","content management","cms","drm","licensing","royalty","copyright media",
            "social media","viral","engagement rate","ctr","impressions","reach","analytics media",
            "seo","content strategy","editorial","newsroom","fact checking","media bias",
            "mediatech","media technology","content tech","media hackathon","media startup",
            "meda","contnet","vidoe","straeming","media app","build media tool",
            "create content platform","win media track","creator economy","ai content"
        ],
        "projects": [
            ("AI Video Subtitle Generator","High"),("Content Performance Analyzer","High"),
            ("AI Script Writer","High"),("Podcast Transcript & Summary Tool","Medium"),
            ("News Bias Detector","High"),("Creator Analytics Dashboard","High"),
            ("AI Thumbnail Generator","Medium"),("Content Moderation System","High"),
            ("OTT Streaming Analytics","High"),("AI Dubbing Platform","High"),
            ("Music Rights Clearance Tool","High"),("Newsroom AI Assistant","High"),
            ("Viral Content Predictor","High"),("AI Video Editor","High"),
            ("Social Listening Platform","High"),("Content Calendar AI","Medium"),
            ("Misinformation Detector","High"),("Influencer Vetting Tool","High"),
            ("Podcast Distribution Platform","Medium"),("Live Stream Analytics","High"),
            ("AI Sports Commentator","High"),("Content Repurposing AI","Medium"),
            ("Video SEO Optimizer","Medium"),("AI Music Composer","High"),
            ("Press Release Generator","Medium"),("Newsletter Personalization","High"),
            ("Media Rights Tracker","High"),("AI Image Caption Generator","Medium"),
            ("Audience Segmentation Tool","High"),("Content A/B Testing Platform","High"),
            ("AI Fact Checker","High"),("Multilingual Subtitle System","High"),
            ("Content Recommendation Engine","High"),("Digital Magazine Platform","Medium"),
            ("Interview Highlight Reel Maker","High"),("Creator Monetization Platform","High"),
            ("Podcast SEO Analyzer","Medium"),("AI Storyboard Generator","High"),
            ("Social Media Scheduler AI","Medium"),("Media Budget Optimizer","High"),
            ("AI Voice Cloning Tool","High"),("Documentary Research Assistant","High"),
            ("Content Archival System","Medium"),("Video Transcription API","High"),
            ("Journalist Source Verifier","High"),("Media Attribution Tracker","High"),
            ("AI Radio DJ","High"),("Gaming Stream Highlighter","High"),
            ("Fan Fiction Generator","Medium"),("Media Accessibility Tool","Medium"),
        ],
        "stack": ("Next.js 14","FastAPI","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + shadcn/ui + Video.js.<br><h4>Backend:</h4> FastAPI + Celery for video processing.<br><h4>Database:</h4> PostgreSQL + Redis + S3 for media.<br><h4>AI:</h4> GPT-4o + Whisper + DALL-E 3 + Stable Diffusion.<br><h4>Deploy:</h4> Vercel + Railway + Cloudflare Stream.',
        "roles": (["FastAPI","FFmpeg","Whisper"], ["Next.js 14","GPT-4o","Whisper"]),
    },
    "BioTech": {
        "emoji": "🧬",
        "market": "$727 billion by 2025",
        "kw": [
            "biotech","biology","genomics","genetics","dna","rna","protein","sequencing","crispr",
            "drug discovery","clinical trial","biomarker","assay","lab","laboratory","bioinformatics",
            "cell biology","molecular biology","pharmaceutical","pharma","fda approval","regulatory",
            "gene therapy","cancer biotech","oncology research","immunotherapy","vaccine development",
            "proteomics","metabolomics","microbiome","single cell","flow cytometry","pcr","elisa",
            "bioreactor","fermentation","biosensor","synthetic biology","dna synthesis","antibody",
            "clinical data","ehr biotech","patient recruitment","cohort study","randomized trial",
            "bitech","genomcs","dna app","biotech hackathon","biology startup","bio tech",
            "drug discovery ai","protein folding","alphafold","build biotech","win biotech track"
        ],
        "projects": [
            ("AI Drug Discovery Platform","High"),("Genomics Data Analyzer","High"),
            ("Clinical Trial Recruitment","High"),("Protein Structure Predictor","High"),
            ("Biomarker Discovery Tool","High"),("Lab Notebook Digitizer","Medium"),
            ("CRISPR Design Assistant","High"),("Bioinformatics Pipeline Builder","High"),
            ("Drug Interaction Predictor","High"),("Patient Cohort Builder","High"),
            ("Sequencing Data Visualizer","High"),("Regulatory Submission Assistant","High"),
            ("Antibody Design Tool","High"),("Microbiome Analyzer","High"),
            ("Clinical Data Harmonizer","High"),("Biosensor Dashboard","Medium"),
            ("Synthetic Biology Designer","High"),("Lab Inventory Manager","Medium"),
            ("Biobank Data Platform","High"),("Gene Expression Analyzer","High"),
            ("Drug Repurposing AI","High"),("Variant Annotation Tool","High"),
            ("Cell Line Tracker","Medium"),("Biotech IP Portfolio","High"),
            ("Preclinical Study Manager","High"),("AI Pathology Slide Analyzer","High"),
            ("Protein-Protein Interaction Mapper","High"),("Lab Protocol Generator","Medium"),
            ("ADMET Property Predictor","High"),("Side Effect Predictor","High"),
            ("Clinical Literature Summarizer","High"),("Bioequivalence Analyzer","High"),
            ("Fermentation Monitor","Medium"),("Single Cell RNA Analyzer","High"),
            ("Biosafety Compliance Checker","High"),("Lab Equipment Booking","Low"),
            ("Drug Manufacturing Tracker","High"),("EHR Data Extractor for Research","High"),
            ("AI Research Grant Writer","Medium"),("Biomarker Validation Platform","High"),
            ("Pharmacokinetics Simulator","High"),("Lab Result Normalizer","Medium"),
            ("Molecular Docking Visualizer","High"),("Digital PCR Analyzer","High"),
            ("Flow Cytometry Gating AI","High"),("Biotech Funding Tracker","Medium"),
            ("Comparative Genomics Tool","High"),("Lab Safety Incident Reporter","Medium"),
            ("Antibody Efficacy Predictor","High"),("Biotech Collaboration Network","Medium"),
        ],
        "stack": ("Next.js 14","FastAPI","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + BioCharts/D3.js.<br><h4>Backend:</h4> FastAPI + BioPython + Celery.<br><h4>Database:</h4> PostgreSQL + MongoDB for unstructured bio data.<br><h4>AI:</h4> GPT-4o + ESM-2 protein embeddings + AlphaFold API.<br><h4>Deploy:</h4> Vercel + Railway + GPU via Modal.',
        "roles": (["FastAPI","BioPython","AlphaFold"], ["Next.js 14","GPT-4o","D3.js"]),
    },
    "SocialImpact": {
        "emoji": "🤝",
        "market": "$3.7 trillion social enterprise economy",
        "kw": [
            "social impact","ngo","nonprofit","charity","donation","volunteer","community",
            "poverty","inequality","education access","healthcare access","clean water","sanitation",
            "gender equality","women empowerment","youth","disability","refugee","migration",
            "sdg","sustainable development goals","united nations","impact measurement","theory of change",
            "beneficiary","program evaluation","grant","fundraising","crowdfunding social",
            "microfinance","financial inclusion","underserved","marginalized","rural development",
            "disaster relief","humanitarian aid","food security","hunger","climate justice",
            "social enterprise","b corp","impact investing","esg social","csr","philanthropy",
            "socal impact","nonproft","chaity","donaton","social app","impact hackathon",
            "build social good","create nonprofit tool","win social track","tech for good","ai for good"
        ],
        "projects": [
            ("Donation Management Platform","High"),("Volunteer Matching System","High"),
            ("NGO Impact Measurement Tool","High"),("Community Resource Finder","Medium"),
            ("Disaster Relief Coordinator","High"),("Food Bank Management System","Medium"),
            ("Grant Application Assistant","High"),("Social Impact Dashboard","High"),
            ("Refugee Services Connector","High"),("Micro-Grant Distribution Platform","High"),
            ("SDG Progress Tracker","High"),("Crowdfunding for Social Good","High"),
            ("Disability Resource Directory","Medium"),("Homeless Services Mapper","Medium"),
            ("Community Health Worker App","Medium"),("Digital Literacy Platform","Medium"),
            ("Women Safety App","High"),("Civic Engagement Platform","Medium"),
            ("Social Enterprise Marketplace","High"),("Impact Investment Screener","High"),
            ("Youth Mentorship Platform","High"),("Environmental Justice Mapper","High"),
            ("Crisis Helpline AI","High"),("Rural Internet Access Planner","High"),
            ("Community Garden Organizer","Low"),("Elderly Care Connector","Medium"),
            ("Education Subsidy Tracker","High"),("Child Protection Reporting System","High"),
            ("Accessibility Services Finder","Medium"),("Clean Water Access Monitor","High"),
            ("Skills Training for Refugees","High"),("Social Bond Tracker","High"),
            ("Community Budget Planner","Medium"),("Impact Report Generator","High"),
            ("Peer Support Community Platform","Medium"),("Nonprofit Financial Transparency","High"),
            ("Human Trafficking Awareness Tool","High"),("AI Counseling for Crisis","High"),
            ("Community Resilience Scorer","High"),("Digital ID for Underserved","High"),
            ("Poverty Mapping Tool","High"),("Food Pantry Inventory System","Medium"),
            ("Social Service Case Manager","High"),("Community Poll Platform","Medium"),
            ("Maternal Health Tracker","Medium"),("GBV Incident Reporter","High"),
            ("Open Educational Resources Hub","Medium"),("Community Legal Aid Bot","High"),
            ("Urban Farming Coordinator","Medium"),("Carbon Offset for Communities","High"),
        ],
        "stack": ("Next.js 14","Node.js","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + shadcn/ui (accessible, WCAG AA).<br><h4>Backend:</h4> Node.js + Express + BullMQ.<br><h4>Database:</h4> PostgreSQL + PostGIS for mapping.<br><h4>AI:</h4> GPT-4o for content + Whisper for voice (low-literacy users).<br><h4>Deploy:</h4> Vercel + Railway — optimized for low-bandwidth.',
        "roles": (["Node.js","PostgreSQL","PostGIS"], ["Next.js 14","GPT-4o","Accessibility"]),
    },
    "SpaceTech": {
        "emoji": "🚀",
        "market": "$600 billion by 2030",
        "kw": [
            "space","satellite","rocket","launch","orbit","nasa","esa","spacex","asteroid",
            "telescope","astronomy","astrophysics","cosmos","galaxy","planet","moon","mars",
            "earth observation","remote sensing","sar","optical imagery","multispectral",
            "ground station","telemetry","spacecraft","propulsion","debris","iss","leo","geo",
            "cubesat","smallsat","constellation","downlink","uplink","attitude control",
            "mission planning","trajectory","simulation","orbital mechanics","astrodynamics",
            "space data","space weather","solar wind","radiation belt","gps","gnss",
            "spacetech","space technology","space hackathon","space startup","astrotech",
            "spce","saetllite","atsronomy","space app","build space tool","win space track",
            "satellite analytics","earth observation platform","space ai","astro ai"
        ],
        "projects": [
            ("Satellite Imagery Analyzer","High"),("Orbital Debris Tracker","High"),
            ("Space Mission Planner","High"),("Earth Observation Dashboard","High"),
            ("Cubesat Telemetry Monitor","High"),("Asteroid Tracking System","High"),
            ("Space Weather Forecaster","High"),("Launch Window Optimizer","High"),
            ("Ground Station Network Manager","High"),("Exoplanet Data Analyzer","High"),
            ("Space Debris Collision Predictor","High"),("Satellite Constellation Manager","High"),
            ("Remote Sensing Change Detector","High"),("Space Tourism Booking Platform","High"),
            ("Telescope Observation Scheduler","High"),("AI Astro Image Enhancer","High"),
            ("Space Data Marketplace","High"),("Lunar Resource Mapper","High"),
            ("Mars Mission Simulator","High"),("Space Radiation Monitor","High"),
            ("GNSS Signal Analyzer","High"),("SAR Image Processor","High"),
            ("Space Insurance Calculator","High"),("Planet Classification AI","High"),
            ("Night Sky AR Explorer","Medium"),("Space Crowdfunding Platform","Medium"),
            ("Atmospheric Entry Simulator","High"),("Spacecraft Power Manager","High"),
            ("Space Frequency Manager","High"),("Orbital Transfer Calculator","High"),
            ("Space Startup Directory","Low"),("Telescope Network Coordinator","High"),
            ("Spacewalk Planner","High"),("ISS Experiment Tracker","Medium"),
            ("Space Education Platform","Medium"),("AI Astrophotography Tool","Medium"),
            ("Space Policy Tracker","Medium"),("Rocket Propellant Calculator","High"),
            ("RF Interference Detector","High"),("Space Community Forum","Low"),
            ("Nanosatellite Design Tool","High"),("Space Manufacturing Monitor","High"),
            ("Space Archaeology Mapper","High"),("Astronaut Health Monitor","High"),
            ("Space Law Compliance Checker","High"),("Planetary Defense Simulator","High"),
            ("Space Energy Harvesting Planner","High"),("Interplanetary Communication Sim","High"),
            ("Space Economy Analytics","High"),("Open Space Data Portal","High"),
        ],
        "stack": ("Next.js 14","FastAPI","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + Cesium.js (3D globe) + Three.js.<br><h4>Backend:</h4> FastAPI + NumPy/SciPy for orbital math.<br><h4>Database:</h4> PostgreSQL + PostGIS + TimescaleDB.<br><h4>AI:</h4> GPT-4o + SAM (satellite image segmentation) + YOLOv8.<br><h4>Deploy:</h4> Vercel + Railway + NASA/ESA open data APIs.',
        "roles": (["FastAPI","Cesium.js","Orbital Mechanics"], ["Next.js 14","GPT-4o","SAM"]),
    },
    "DeepTech": {
        "emoji": "⚛️",
        "market": "$700 billion by 2025",
        "kw": [
            "deep tech","quantum","quantum computing","quantum algorithm","qubit","superposition",
            "entanglement","quantum cryptography","qkd","post-quantum","photonics","lidar sensor",
            "autonomous vehicle","self-driving","robotics","drone autonomy","computer vision",
            "neural interface","brain computer interface","bci","ar","vr","xr","mixed reality",
            "nanotechnology","advanced materials","graphene","metamaterial","3d printing","additive",
            "edge computing","embedded ai","tinyml","fpga","asic","chip design","semiconductor",
            "neuromorphic","digital twin","simulation","physics simulation","finite element",
            "deeptech","quantum app","robotics platform","deep technology","advanced tech",
            "qunatum","roboitcs","autnomous","computr vision","deeptech hackathon","deep tech startup",
            "build quantum","create robotics","win deeptech track","ai hardware","edge ai"
        ],
        "projects": [
            ("Quantum Algorithm Simulator","High"),("Computer Vision Pipeline Builder","High"),
            ("Robotics Control Dashboard","High"),("Digital Twin Platform","High"),
            ("Edge AI Model Deployer","High"),("AR/VR Experience Builder","High"),
            ("LiDAR Data Processor","High"),("Autonomous Drone Coordinator","High"),
            ("Neural Interface Visualizer","High"),("3D Printing Queue Manager","Medium"),
            ("Quantum Cryptography Demo","High"),("TinyML Model Optimizer","High"),
            ("FPGA Design Assistant","High"),("Physics Simulation Engine","High"),
            ("Advanced Materials Database","High"),("Post-Quantum Encryption Tool","High"),
            ("BCI Data Analyzer","High"),("Robotics Path Planner","High"),
            ("Semiconductor Yield Optimizer","High"),("Quantum Circuit Designer","High"),
            ("Computer Vision Annotation Tool","High"),("Embedded Systems Monitor","Medium"),
            ("Digital Twin Factory","High"),("AR Navigation System","High"),
            ("VR Training Simulator","High"),("LiDAR Point Cloud Viewer","High"),
            ("Neuromorphic Computing Sim","High"),("Photonics Circuit Designer","High"),
            ("Quantum Error Corrector","High"),("Drone Swarm Coordinator","High"),
            ("Edge Model Benchmark Tool","High"),("Haptic Feedback Simulator","High"),
            ("Quantum Random Number Generator","Medium"),("Autonomous Vehicle Sim","High"),
            ("AI Chip Performance Analyzer","High"),("Holographic Display Designer","High"),
            ("Smart Sensor Fusion System","High"),("Nano-Material Property Predictor","High"),
            ("Quantum Finance Optimizer","High"),("Robotics Safety Monitor","High"),
            ("Digital Twin Healthcare","High"),("AR Medical Imaging Viewer","High"),
            ("Quantum Drug Discovery","High"),("Deep Learning Hardware Optimizer","High"),
            ("Exoskeleton Control UI","High"),("Advanced Radar Analyzer","High"),
            ("Quantum Network Simulator","High"),("Brain Signal Decoder","High"),
            ("Ultra-Low-Latency Edge Router","High"),("Deep Tech Patent Analyzer","High"),
        ],
        "stack": ("Next.js 14","FastAPI","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + Three.js + WebGL.<br><h4>Backend:</h4> FastAPI + Qiskit (quantum) + OpenCV.<br><h4>Database:</h4> PostgreSQL + TimescaleDB + vector DB.<br><h4>AI:</h4> GPT-4o + YOLOv8 + TensorFlow Lite + custom simulation models.<br><h4>Deploy:</h4> Vercel + Railway + Modal Labs for GPU/quantum simulation.',
        "roles": (["FastAPI","Qiskit/OpenCV","Simulation"], ["Next.js 14","GPT-4o","Three.js"]),
    },
}

def parametric_entries(industry, spec):
    entries = []
    emoji = spec["emoji"]
    market = spec["market"]
    kw = list(spec["kw"])
    for proj_name, complexity in spec["projects"]:
        full_name = f"{industry} {proj_name}"
        ov = (f'<h3>{emoji} {proj_name}</h3><p>The {industry} market is valued at <b>{market}</b>. '
              f'This platform delivers {proj_name.lower()} capabilities using cutting-edge AI and modern cloud-native architecture. '
              f'The winning hackathon angle: show a live, working feature that solves a real problem in the first 30 seconds. '
              f'Judges in {industry} tracks value technical depth, real-world applicability, and measurable impact. '
              f'Built with production-ready security, scalable infrastructure, and AI-first design principles. '
              f'Integrates with leading {industry} APIs and data sources for maximum demo impact. '
              f'Show specific metrics: time saved, cost reduced, accuracy improved, or lives impacted. '
              f'The AI strategy uses RAG + GPT-4o for intelligent responses with domain-specific context.</p>')
        ts = spec["tech"]
        ai = (f'1. <b>Domain Data Ingestion:</b> Structured + unstructured {industry} data → normalized → stored with embeddings.<br>'
              f'2. <b>RAG Pipeline:</b> Domain knowledge base → text-embedding-3-large → Pinecone → GPT-4o with {industry}-specific system prompt.<br>'
              f'3. <b>Predictive ML:</b> XGBoost/RandomForest on structured domain data → key risk/opportunity prediction with confidence scores.<br>'
              f'4. <b>Computer Vision:</b> YOLOv8/SAM → domain-specific image analysis → structured output with action recommendations.<br>'
              f'5. <b>Anomaly Detection:</b> Isolation Forest on time-series data → alerts for critical deviations with root cause analysis.<br>'
              f'6. <b>Offline Fallback:</b> Pre-cached domain knowledge + local rule engine for reliable demo without API connectivity.')
        mp = (f'You are a Principal {industry} Engineer. Build "{full_name}" using Next.js 14, FastAPI, PostgreSQL, and GPT-4o. '
              f'Requirements: (1) Secure multi-role auth via Clerk. '
              f'(2) Core {industry} feature: {proj_name.lower()} with real-time data processing. '
              f'(3) RAG pipeline: ingest domain documents → embed → query GPT-4o for intelligent answers. '
              f'(4) Analytics dashboard with Recharts showing key {industry} metrics. '
              f'(5) AI assistant chat with {industry}-specific knowledge base. '
              f'(6) Export reports as PDF with professional formatting. '
              f'(7) Mobile-responsive dark/light mode UI with Framer Motion. '
              f'Demo flow: Login → see main dashboard → interact with core feature → get AI insight → export report. '
              f'Deploy on Vercel + Railway. Start with auth + database schema + core feature.')
        db = (f'Table users {{ id uuid [pk], email varchar, role varchar, org_id uuid, created_at timestamp }}\n'
              f'Table {industry.lower()}_records {{ id uuid [pk], user_id uuid [ref: > users.id], title varchar, data jsonb, status varchar, created_at timestamp }}\n'
              f'Table ai_analyses {{ id uuid [pk], record_id uuid, input_text text, output_text text, model varchar, tokens_used int, created_at timestamp }}\n'
              f'Table embeddings {{ id uuid [pk], source_id uuid, content text, embedding vector(1536), metadata jsonb, created_at timestamp }}\n'
              f'Table analytics_events {{ id uuid [pk], user_id uuid, event_type varchar, payload jsonb, timestamp timestamp }}')
        api = (f'- POST /api/v1/auth/register\n- POST /api/v1/auth/login\n'
               f'- GET /api/v1/{industry.lower()}/records\n- POST /api/v1/{industry.lower()}/records\n'
               f'- GET /api/v1/{industry.lower()}/records/{{id}}\n- PUT /api/v1/{industry.lower()}/records/{{id}}\n'
               f'- POST /api/v1/ai/analyze\n- POST /api/v1/ai/chat\n'
               f'- GET /api/v1/analytics/summary\n- GET /api/v1/analytics/trends\n'
               f'- POST /api/v1/search/semantic\n- POST /api/v1/reports/generate\n'
               f'- GET /api/v1/alerts\n- POST /api/v1/alerts/acknowledge\n'
               f'- WS /ws/live-updates')
        win = (f'<b>Judge Psychology:</b> {industry} judges look for domain expertise AND technical execution. '
               f'Show you understand the specific pain point, not just the technology.<br>'
               f'<b>Demo Hook (0-30s):</b> Trigger the most impressive AI feature immediately — real data, real AI response, real value. '
               f'Don\'t spend time on login flows or setup during the demo itself.<br>'
               f'<b>Market Stat:</b> "The {industry} market is worth {market}. Our solution targets a specific $X billion pain point within it."<br>'
               f'<b>Q&A Prep:</b> Know the top 3 competitors in {industry} space, the main regulatory frameworks, and your specific AI model\'s accuracy metrics.')
        r1_skills, r2_skills = spec["roles"]
        s1, s2, s3 = spec["stack"]
        entries.append(entry(
            industry, full_name, complexity, kw, ov, ts, ai, mp, db, api, win,
            f"Lead {industry} Backend Engineer", r1_skills,
            f"Full-Stack AI Developer", r2_skills,
            [s1, s2, s3]
        ))
    return entries

# ── E-commerce / PropTech / AdTech / FashionTech / DevTools ────────────────
INDUSTRY_SPECS_2 = {
    "E-commerce": {
        "emoji": "🛒",
        "market": "$8.1 trillion by 2026",
        "kw": [
            "ecommerce","online shopping","store","product","cart","checkout","payment ecom",
            "inventory ecom","order","fulfillment ecom","shipping ecom","return","review",
            "marketplace","seller","buyer","vendor","dropshipping","wholesale","retail",
            "amazon","shopify","woocommerce","magento","etsy","ebay","alibaba","b2b","b2c",
            "conversion rate","funnel","abandoned cart","customer lifetime value","clv",
            "recommendation engine","personalization ecom","search commerce","faceted search",
            "product catalog","sku","variant","pricing strategy","dynamic pricing",
            "loyalty ecom","referral","coupon","discount","flash sale","cross-sell","upsell",
            "ecomerce","shoping","prodcut","ordr","ecommerce app","shopping app",
            "ecommerce hackathon","online store builder","build ecommerce","win ecom track"
        ],
        "projects": [
            ("AI Product Recommendation Engine","High"),("Abandoned Cart Recovery System","High"),
            ("Dynamic Pricing Engine","High"),("E-commerce Analytics Dashboard","High"),
            ("AI Product Description Writer","Medium"),("Smart Search & Filter System","High"),
            ("Customer Lifetime Value Predictor","High"),("Inventory Forecasting System","High"),
            ("Fraud Detection for Orders","High"),("Seller Performance Analyzer","High"),
            ("Coupon & Loyalty Platform","Medium"),("Return Management System","Medium"),
            ("Visual Product Search","High"),("Competitive Price Monitor","High"),
            ("Cross-Sell/Upsell Engine","High"),("Review Sentiment Analyzer","High"),
            ("Flash Sale Manager","High"),("Subscription Commerce Platform","High"),
            ("Headless Commerce Builder","High"),("Dropshipping Automation","High"),
            ("B2B Procurement Platform","High"),("Marketplace Aggregator","High"),
            ("AI Chatbot for Shopping","High"),("Gift Recommendation Engine","High"),
            ("Size & Fit Recommender","High"),("Supply Chain Visibility","High"),
            ("Multi-Currency Checkout","High"),("Affiliate Marketing Tracker","High"),
            ("Live Commerce Platform","High"),("AR Product Viewer","High"),
            ("Customer Segmentation Tool","High"),("SEO Optimizer for Products","High"),
            ("Order Management System","Medium"),("Seller Onboarding Automation","Medium"),
            ("Social Commerce Platform","High"),("Product Catalog Manager","Medium"),
            ("Shipping Rate Calculator","Medium"),("Product Image Enhancer AI","Medium"),
            ("Wholesale Ordering Platform","High"),("E-commerce A/B Tester","High"),
            ("Chatbot Order Tracker","Medium"),("Tax Compliance Calculator","High"),
            ("Storefront Builder AI","High"),("Conversion Rate Optimizer","High"),
            ("E-commerce Financial Dashboard","High"),("Product Bundling Optimizer","High"),
            ("Customer Support Automation","High"),("Wishlist & Saved Items","Low"),
            ("Multi-Vendor Marketplace","High"),("Loyalty Points Exchange","Medium"),
        ],
        "stack": ("Next.js 14","Node.js","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + shadcn/ui + Stripe Elements.<br><h4>Backend:</h4> Node.js + BullMQ + Stripe/Shopify APIs.<br><h4>Database:</h4> PostgreSQL + Redis + Pinecone.<br><h4>AI:</h4> GPT-4o + CLIP (visual search) + Collaborative Filtering.<br><h4>Deploy:</h4> Vercel + Railway.',
        "roles": (["Node.js","PostgreSQL","Stripe API"], ["Next.js 14","GPT-4o","CLIP"]),
    },
    "PropTech": {
        "emoji": "🏠",
        "market": "$86 billion by 2030",
        "kw": [
            "property","real estate","realty","housing","apartment","rental","landlord","tenant",
            "mortgage","valuation","appraisal","listing","mls","zillow","property management",
            "proptech","building","construction","architecture","floor plan","interior design",
            "investment property","cap rate","noi","roi real estate","portfolio","reit",
            "commercial real estate","residential","office","retail property","industrial",
            "lease","contract real estate","inspection","hoa","maintenance","repair",
            "smart building","iot building","energy building","hvac","access control building",
            "proptech app","real estate app","housing app","proptech hackathon","real estate startup",
            "propty","ral estate","houing","morgage","build proptech","win proptech track",
            "property analytics","ai valuation","virtual tour","property matching"
        ],
        "projects": [
            ("AI Property Valuation Tool","High"),("Tenant Screening System","High"),
            ("Rental Management Platform","High"),("Smart Building Dashboard","High"),
            ("Property Investment Analyzer","High"),("Virtual Property Tour Builder","High"),
            ("Lease Management System","High"),("Building Maintenance Tracker","Medium"),
            ("Real Estate Market Predictor","High"),("Property Listing Optimizer","High"),
            ("HOA Management System","Medium"),("Commercial Lease Analyzer","High"),
            ("Property Portfolio Dashboard","High"),("Mortgage Calculator AI","Medium"),
            ("Real Estate CRM","High"),("Construction Project Manager","High"),
            ("Energy Efficiency Auditor","High"),("Short-Term Rental Manager","High"),
            ("Property Inspection App","Medium"),("Neighborhood Analytics Tool","High"),
            ("Real Estate Tokenization Platform","High"),("REIT Analytics Dashboard","High"),
            ("Co-Living Management System","Medium"),("Renovation Cost Estimator","Medium"),
            ("Property Tax Appeal Helper","High"),("Smart Lock Manager","Medium"),
            ("Real Estate Document Manager","High"),("Floor Plan Generator AI","High"),
            ("Property Risk Assessor","High"),("Green Building Scorer","High"),
            ("Real Estate Chatbot","Medium"),("Zoning Compliance Checker","High"),
            ("Property Crowdfunding Platform","High"),("Occupancy Optimizer","High"),
            ("Vacancy Predictor","High"),("Rental Yield Calculator","Medium"),
            ("Building Permit Tracker","Medium"),("Interior Design AI","High"),
            ("Real Estate Legal Assistant","High"),("Property Benchmark Tool","High"),
            ("Subletting Platform","Medium"),("Multi-Family Property Manager","High"),
            ("Real Estate Data Aggregator","High"),("Commercial Fit-Out Planner","High"),
            ("Property Alert System","Medium"),("Building Code Checker","High"),
            ("Smart Parking for Buildings","Medium"),("Real Estate Fund Manager","High"),
            ("AI Home Stager","High"),("Property Insurance Estimator","High"),
        ],
        "stack": ("Next.js 14","FastAPI","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + Mapbox GL JS + Three.js (3D tours).<br><h4>Backend:</h4> FastAPI + Celery.<br><h4>Database:</h4> PostgreSQL + PostGIS + Redis.<br><h4>AI:</h4> GPT-4o + DALL-E 3 (staging) + price regression models.<br><h4>Deploy:</h4> Vercel + Railway.',
        "roles": (["FastAPI","PostGIS","Price Models"], ["Next.js 14","GPT-4o","Mapbox"]),
    },
    "AdTech": {
        "emoji": "📊",
        "market": "$1.5 trillion by 2030",
        "kw": [
            "advertising","adtech","digital marketing","marketing","campaign","ad","banner","dsp",
            "ssp","programmatic","rtb","real-time bidding","cpm","cpc","cpa","roas","attribution",
            "audience targeting","retargeting","lookalike","contextual advertising","native ad",
            "social ads","google ads","facebook ads","meta ads","tiktok ads","display","search ads",
            "ad fraud","brand safety","viewability","ad verification","ias","doubleverify",
            "customer data platform","cdp","dmp","crm marketing","email marketing","sms marketing",
            "ab test marketing","personalization marketing","conversion","funnel marketing",
            "adtch","advertisng","markting","campign","ad app","adtech hackathon","marketing startup",
            "build ad platform","create marketing tool","win adtech track","marketing analytics"
        ],
        "projects": [
            ("Programmatic Ad Platform","High"),("Campaign Performance Analyzer","High"),
            ("Audience Segmentation Engine","High"),("Ad Fraud Detector","High"),
            ("Creative A/B Testing Platform","High"),("Customer Data Platform","High"),
            ("Attribution Modeling Tool","High"),("Ad Copy Generator AI","Medium"),
            ("ROAS Optimizer","High"),("Brand Safety Checker","High"),
            ("Influencer Marketing Platform","High"),("Email Marketing AI","High"),
            ("Lookalike Audience Builder","High"),("Contextual Targeting System","High"),
            ("Marketing Mix Modeler","High"),("Real-Time Bidding Dashboard","High"),
            ("SMS Marketing Platform","Medium"),("Ad Creative Analyzer","High"),
            ("Social Ad Manager","High"),("Conversion Rate Optimizer","High"),
            ("Customer Journey Mapper","High"),("Retargeting System","High"),
            ("Ad Spend Forecaster","High"),("Marketing Dashboard","High"),
            ("CDP Identity Resolution","High"),("Cookieless Targeting System","High"),
            ("Video Ad Analyzer","High"),("Push Notification Platform","Medium"),
            ("Affiliate Marketing Tracker","High"),("SEO + PPC Optimizer","High"),
            ("Landing Page Tester","High"),("Ad Placement Optimizer","High"),
            ("Content Marketing Analyzer","High"),("Podcast Ad Platform","High"),
            ("OOH Ad Tracker","High"),("Cross-Channel Attribution","High"),
            ("Demand Gen Platform","High"),("Ad Budget Allocator AI","High"),
            ("Brand Lift Measurer","High"),("Market Research AI","High"),
            ("Ad Agency Management Tool","High"),("Micro-Moment Targeting","High"),
            ("Privacy-First Ad Platform","High"),("Dynamic Creative Optimizer","High"),
            ("Ad Intelligence Platform","High"),("Account-Based Marketing Tool","High"),
            ("Ad Viewability Monitor","Medium"),("Marketing Compliance Checker","High"),
            ("Programmatic Guarantee Platform","High"),("CTV Ad Platform","High"),
        ],
        "stack": ("Next.js 14","Go (Fiber)","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + Recharts + D3.js.<br><h4>Backend:</h4> Go (Fiber) for high-throughput RTB + Kafka for event streams.<br><h4>Database:</h4> PostgreSQL + ClickHouse for analytics + Redis.<br><h4>AI:</h4> GPT-4o + BERT for brand safety + XGBoost for bid optimization.<br><h4>Deploy:</h4> Vercel + Railway + Kafka on Confluent.',
        "roles": (["Go (Fiber)","ClickHouse","Kafka"], ["Next.js 14","GPT-4o","XGBoost"]),
    },
    "FashionTech": {
        "emoji": "👗",
        "market": "$4.4 trillion fashion industry, $185B tech segment",
        "kw": [
            "fashion","clothing","apparel","style","outfit","wardrobe","trend","designer",
            "luxury","fast fashion","sustainable fashion","secondhand","thrift","vintage",
            "size fit","body measurement","virtual try-on","avatar fashion","3d fashion",
            "textile","fabric","material","supply chain fashion","manufacturing fashion",
            "brand fashion","retail fashion","e-commerce fashion","marketplace fashion",
            "personalization fashion","style ai","fashion recommendation","outfit planner",
            "fashion photography","model","runway","fashion week","lookbook",
            "fashiontech","fashion technology","fashion startup","fashion hackathon",
            "fashon","clothig","aparel","styel","fashion app","build fashion tool",
            "create style platform","win fashion track","fashion analytics","ai stylist"
        ],
        "projects": [
            ("AI Personal Stylist","High"),("Virtual Try-On Platform","High"),
            ("Sustainable Fashion Ranker","High"),("Fashion Trend Predictor","High"),
            ("Outfit Planner App","Medium"),("AI Fashion Photographer","High"),
            ("Size & Fit Recommender","High"),("Secondhand Clothing Marketplace","High"),
            ("Fashion Brand Analytics","High"),("Supply Chain Transparency","High"),
            ("Fashion Design AI Tool","High"),("Wardrobe Management App","Medium"),
            ("Fashion Rental Platform","High"),("AI Lookbook Generator","Medium"),
            ("Fashion Influencer Analytics","High"),("Fabric Material Database","Medium"),
            ("Fashion Carbon Calculator","High"),("3D Garment Visualizer","High"),
            ("Fashion NFT Platform","High"),("Luxury Authentication Tool","High"),
            ("Fashion Subscription Box","High"),("Capsule Wardrobe Planner","Medium"),
            ("Fashion Trend Report Generator","High"),("Sample Management System","Medium"),
            ("Fashion E-commerce Optimizer","High"),("Body Measurement Scanner","High"),
            ("Fashion Color Palette AI","Medium"),("Fashion Wholesale Platform","High"),
            ("AI Pattern Generator","High"),("Fashion Sustainability Scorer","High"),
            ("Vintage Item Authenticator","High"),("Fashion CRM System","High"),
            ("Fashion Review Analyzer","High"),("Fashion Week Scheduler","Medium"),
            ("Fashion Customization Platform","High"),("Textile Property Predictor","High"),
            ("Fashion SEO Optimizer","Medium"),("Fashion Chatbot Stylist","High"),
            ("Fashion Returns Reducer","High"),("Fashion Price Elasticity","High"),
            ("Fashion Data Marketplace","High"),("Streetwear Trend Tracker","High"),
            ("Fashion Collab Platform","Medium"),("Costume Designer AI","High"),
            ("Fashion School Platform","Medium"),("Fashion Brand Builder","High"),
            ("AI Fashion Critic","Medium"),("Fashion Marketing Optimizer","High"),
            ("Sustainable Fiber Tracker","High"),("Fashion Loyalty Platform","Medium"),
        ],
        "stack": ("Next.js 14","FastAPI","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + shadcn/ui + Three.js (3D try-on).<br><h4>Backend:</h4> FastAPI + Celery + Cloudinary for image processing.<br><h4>Database:</h4> PostgreSQL + Redis + Pinecone.<br><h4>AI:</h4> GPT-4o + CLIP (visual search) + DALL-E 3 (design generation).<br><h4>Deploy:</h4> Vercel + Railway + Cloudinary CDN.',
        "roles": (["FastAPI","PostgreSQL","CLIP"], ["Next.js 14","GPT-4o","DALL-E 3"]),
    },
    "DevTools": {
        "emoji": "🛠️",
        "market": "$26 billion developer tools market",
        "kw": [
            "developer tools","devtools","coding","programming","software development","ide",
            "api","sdk","cli","library","framework","package","npm","pip","git","github","gitlab",
            "ci/cd","pipeline","deployment","docker","kubernetes","cloud","devops","devsecops",
            "testing","unit test","integration test","e2e","coverage","linting","formatting",
            "code review","code quality","static analysis","profiling","debugging","logging",
            "monitoring","observability","tracing","metrics","alerting","on-call","incident",
            "documentation","readme","changelog","versioning","semver","release","open source",
            "developer experience","dx","api design","openapi","graphql","grpc","rest","webhook",
            "devtols","programing","codding","githb","devtools hackathon","developer startup",
            "build devtool","create dev tool","win devtools track","api platform","code ai","github copilot"
        ],
        "projects": [
            ("AI Code Review Assistant","High"),("API Documentation Generator","High"),
            ("CI/CD Pipeline Builder","High"),("Test Case Generator","High"),
            ("Code Quality Dashboard","High"),("Developer Onboarding Platform","Medium"),
            ("API Mock Server","Medium"),("Log Analysis Tool","High"),
            ("Incident Management System","High"),("Database Schema Visualizer","Medium"),
            ("AI Debugging Assistant","High"),("OpenAPI Spec Generator","High"),
            ("Dependency Vulnerability Scanner","High"),("Code Snippet Manager","Medium"),
            ("CLI Tool Builder","High"),("Webhook Testing Platform","Medium"),
            ("API Rate Limiter Manager","High"),("Performance Profiling Dashboard","High"),
            ("Feature Flag System","High"),("A/B Testing Developer SDK","High"),
            ("Observability Dashboard","High"),("Error Tracking System","High"),
            ("Code Search Engine","High"),("PR Review Automation","High"),
            ("Release Notes Generator","Medium"),("SDK Generator from OpenAPI","High"),
            ("Database Migration Tool","High"),("Environment Manager","Medium"),
            ("Developer Documentation AI","High"),("Changelog Generator","Medium"),
            ("API Analytics Dashboard","High"),("Load Testing Platform","High"),
            ("Secrets Manager","High"),("Code Complexity Analyzer","High"),
            ("GraphQL Explorer","Medium"),("Postman Alternative","High"),
            ("Developer Productivity Tracker","High"),("AI Commit Message Generator","Low"),
            ("Tech Debt Tracker","High"),("Architecture Decision Recorder","Medium"),
            ("SLA Monitor","High"),("Runbook Generator AI","Medium"),
            ("Developer Survey Platform","Low"),("On-Call Scheduler","Medium"),
            ("Container Registry Manager","High"),("Kubernetes Cost Optimizer","High"),
            ("Developer Community Platform","Medium"),("Code Translator (language to language)","High"),
            ("API Versioning Manager","High"),("AI Architecture Advisor","High"),
        ],
        "stack": ("Next.js 14","Go (Fiber)","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + Monaco Editor + shadcn/ui.<br><h4>Backend:</h4> Go (Fiber) + containerized workers.<br><h4>Database:</h4> PostgreSQL + Redis + ClickHouse for logs.<br><h4>AI:</h4> GPT-4o + Claude 3.5 + fine-tuned code models (CodeLlama).<br><h4>Deploy:</h4> Vercel + Railway + Docker.',
        "roles": (["Go (Fiber)","PostgreSQL","Docker"], ["Next.js 14","GPT-4o","Monaco Editor"]),
    },
}

# ── Remaining 10 industries ─────────────────────────────────────────────────
INDUSTRY_SPECS_3 = {
    "MentalHealthTech": {
        "emoji": "🧠",
        "market": "$17.5 billion digital mental health by 2030",
        "kw": [
            "mental health","therapy","counseling","psychology","psychiatry","anxiety","depression",
            "stress","burnout","mindfulness","meditation","mood tracking","emotional wellbeing",
            "cbt","cognitive behavioral therapy","dbt","dialectical behavior","exposure therapy",
            "ptsd","trauma","bipolar","schizophrenia","ocd","adhd","eating disorder","addiction",
            "substance abuse","recovery","peer support","crisis","suicide prevention","hotline",
            "teletherapy","online therapy","app therapy","wearable mental health","biofeedback",
            "sleep mental","journaling","gratitude","self care","resilience","wellness app",
            "mentalhealth","mentla health","thrapy","anxiity","depresion","mental health app",
            "mental health hackathon","mental health startup","build mental health","win mental track",
            "ai therapy","mental health chatbot","emotional support ai","wellbeing platform"
        ],
        "projects": [
            ("AI Mood Tracking App","Medium"),("Crisis Support Chatbot","High"),
            ("CBT Exercise Platform","High"),("Therapist Matching Platform","High"),
            ("Mental Health Journaling AI","Medium"),("Burnout Risk Predictor","High"),
            ("Mindfulness Meditation App","Medium"),("ADHD Management Tool","Medium"),
            ("Anxiety Management Coach","High"),("Depression Screening Tool","High"),
            ("Mental Health Analytics Dashboard","High"),("Peer Support Community","High"),
            ("Sleep Quality Optimizer","Medium"),("Therapy Session Note Taker","High"),
            ("Mental Health at Work Platform","High"),("Addiction Recovery Tracker","High"),
            ("Youth Mental Health App","Medium"),("Grief Support Platform","Medium"),
            ("Trauma-Informed Care Tool","High"),("Mental Health Outcomes Tracker","High"),
            ("Teletherapy Platform","High"),("Psychiatry Appointment Scheduler","Medium"),
            ("Eating Disorder Support App","High"),("PTSD Management System","High"),
            ("Mental Health Progress Report","Medium"),("Emotion Recognition AI","High"),
            ("Resilience Training Platform","Medium"),("Caregiver Support App","Medium"),
            ("Mental Health Policy Tracker","High"),("Self-Harm Prevention System","High"),
            ("School Mental Health Platform","High"),("OCD Therapy App","High"),
            ("Biofeedback Dashboard","High"),("Wearable Mental Health Monitor","High"),
            ("Mental Health Content Platform","Medium"),("AI Mindfulness Coach","High"),
            ("Group Therapy Manager","High"),("Mental Health Community Forum","Medium"),
            ("Medication Adherence Mental","Medium"),("Mental Health Story Generator","Medium"),
            ("Cultural Mental Health Adapter","High"),("Military PTSD Support","High"),
            ("Bipolar Mood Logger","Medium"),("Mental Health Research Platform","High"),
            ("Anxiety Trigger Identifier","High"),("Mental Health Benefits Manager","High"),
            ("Substance Abuse Recovery App","High"),("Child Mental Health Monitor","High"),
            ("Mental Health Companion Robot","High"),("Global Mental Health Atlas","High"),
        ],
        "stack": ("Next.js 14","FastAPI","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + calm color palette + accessibility-first design.<br><h4>Backend:</h4> FastAPI + HIPAA-compliant data handling.<br><h4>Database:</h4> PostgreSQL (encrypted) + Redis.<br><h4>AI:</h4> GPT-4o with safe messaging guidelines + Whisper for voice journaling.<br><h4>Deploy:</h4> Vercel + Railway — privacy-first infrastructure.',
        "roles": (["FastAPI","PostgreSQL","HIPAA Compliance"], ["Next.js 14","GPT-4o","Safe AI"]),
    },
    "WaterTech": {
        "emoji": "💧",
        "market": "$1.1 trillion global water industry",
        "kw": [
            "water","clean water","drinking water","sanitation","wastewater","water treatment",
            "water quality","contamination","pollution water","ph water","turbidity","tds",
            "water scarcity","drought","flood","irrigation water","groundwater","aquifer",
            "desalination","water purification","filtration","osmosis","membrane",
            "water utility","water supply","distribution network","pipe","leak detection",
            "smart water","water meter","iot water","water sensor","water monitoring",
            "sdg6","water access","water equity","rural water","handwashing","hygiene water",
            "watertech","water technology","water hackathon","water startup","hydro tech",
            "watr","cleean water","saniattion","water app","build water tool","win water track",
            "water analytics","water conservation","water footprint","water credit"
        ],
        "projects": [
            ("Water Quality Monitor","High"),("Leak Detection System","High"),
            ("Smart Water Meter Dashboard","Medium"),("Water Distribution Optimizer","High"),
            ("Drought Prediction System","High"),("Water Utility Analytics","High"),
            ("Irrigation Water Manager","High"),("Flood Early Warning System","High"),
            ("Water Treatment Controller","High"),("Water Scarcity Mapper","High"),
            ("Groundwater Level Tracker","High"),("Water Footprint Calculator","Medium"),
            ("Desalination Plant Monitor","High"),("Rural Water Access Planner","High"),
            ("Water Credit Platform","High"),("WASH Program Manager","Medium"),
            ("Water Recycling Optimizer","High"),("Water Testing Lab Tracker","Medium"),
            ("Wastewater Treatment AI","High"),("Water Policy Tracker","Medium"),
            ("Drinking Water Safety Alert","High"),("Water Conservation Game","Medium"),
            ("Smart Irrigation Controller","High"),("Water Billing System","Medium"),
            ("Aquifer Recharge Monitor","High"),("Industrial Water Auditor","High"),
            ("Water Risk Assessment Tool","High"),("Community Water System Manager","Medium"),
            ("Water Sampling Coordinator","Medium"),("Water Education Platform","Low"),
            ("Stormwater Management System","High"),("Water Infrastructure Inspector","High"),
            ("Sea Level Rise Modeler","High"),("Agricultural Water Scheduler","High"),
            ("Water Crisis Response Coordinator","High"),("Water Data Open Portal","High"),
            ("Rainwater Harvesting Planner","Medium"),("Water Equity Analyzer","High"),
            ("Water Startup Directory","Low"),("Watershed Management Platform","High"),
            ("Wetland Conservation Mapper","High"),("Water Tariff Optimizer","High"),
            ("Hydrology Simulation Tool","High"),("Dam Safety Monitor","High"),
            ("Water Demand Forecaster","High"),("Water-Energy Nexus Analyzer","High"),
            ("River Pollution Tracker","High"),("Ocean Acidification Monitor","High"),
            ("Water Literacy Assessment","Medium"),("Smart Reservoir Manager","High"),
        ],
        "stack": ("Next.js 14","FastAPI","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + Mapbox GL JS + Recharts.<br><h4>Backend:</h4> FastAPI + TimescaleDB + MQTT.<br><h4>Database:</h4> PostgreSQL + PostGIS + InfluxDB.<br><h4>AI:</h4> GPT-4o + anomaly detection models + satellite imagery analysis.<br><h4>Deploy:</h4> Vercel + Railway.',
        "roles": (["FastAPI","TimescaleDB","IoT/MQTT"], ["Next.js 14","GPT-4o","Mapbox"]),
    },
    "AccessibilityTech": {
        "emoji": "♿",
        "market": "$22 billion assistive technology market by 2025",
        "kw": [
            "accessibility","accessible","assistive technology","disability","inclusion","wcag",
            "screen reader","nvda","jaws","voiceover","braille","low vision","blind","deaf",
            "hearing impaired","sign language","asl","bsl","lip reading","captioning","alt text",
            "keyboard navigation","focus management","aria","semantic html","color contrast",
            "cognitive disability","learning disability","motor impairment","mobility aid",
            "wheelchair","prosthetic","augmentative communication","aac","text to speech",
            "speech to text","voice control","eye tracking","switch access","head mouse",
            "autism","down syndrome","cerebral palsy","dyslexia","dyscalculia","adhd access",
            "accessibilty","accessable","disabilty","inclsuion","accessibility app","a11y",
            "accessibility hackathon","build accessible","win accessibility track","inclusive design"
        ],
        "projects": [
            ("Web Accessibility Checker","High"),("Sign Language Translator AI","High"),
            ("Screen Reader Enhancement AI","High"),("Captioning & Subtitle Generator","High"),
            ("AAC Communication App","High"),("Blind Navigation Assistant","High"),
            ("Cognitive Load Reducer","High"),("Color Blindness Simulator","Medium"),
            ("Voice Control Interface Builder","High"),("Accessibility Audit Platform","High"),
            ("Dyslexia Reading Assistant","High"),("Deaf Community Platform","High"),
            ("Wheelchair Navigation App","Medium"),("Autism Learning Support App","High"),
            ("Eye Tracking Interface","High"),("Braille Converter","High"),
            ("WCAG Compliance Checker","High"),("Inclusive Game Designer","High"),
            ("Speech Therapy App","High"),("Visual Description AI","High"),
            ("Tactile Map Generator","High"),("Assistive Tech Marketplace","Medium"),
            ("Disability Employment Platform","High"),("Easy-Read Content Generator","High"),
            ("Senior-Friendly App Builder","Medium"),("Hearing Aid App Integration","High"),
            ("Mental Accessibility Toolkit","High"),("Emergency Alert for Deaf","High"),
            ("Inclusive Form Builder","High"),("Accessibility Testing Automation","High"),
            ("Alt Text Generator AI","Medium"),("Accessible PDF Creator","Medium"),
            ("Inclusive Hiring Platform","High"),("Disability Data Aggregator","High"),
            ("Accessible E-Learning Platform","High"),("Motor Impairment Control Mapper","High"),
            ("Down Syndrome Learning App","High"),("Prosthetics Data Monitor","High"),
            ("Inclusive Travel Planner","Medium"),("ADHD Focus Timer","Low"),
            ("Cerebral Palsy Communication Aid","High"),("Accessible Banking App","High"),
            ("Disability Community Network","Medium"),("Independent Living AI","High"),
            ("Medical Interpreter Sign","High"),("Emotional Support Companion","High"),
            ("Accessibility Legal Checker","High"),("Inclusive Design Advisor","Medium"),
            ("Disability Sports App","Medium"),("Universal Design Assessment","High"),
        ],
        "stack": ("Next.js 14","FastAPI","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind — WCAG 2.1 AA compliant, screen-reader optimized.<br><h4>Backend:</h4> FastAPI + Whisper for voice.<br><h4>Database:</h4> PostgreSQL + Redis.<br><h4>AI:</h4> GPT-4o + Whisper + MediaPipe (hand/eye tracking) + DALL-E 3.<br><h4>Deploy:</h4> Vercel + Railway.',
        "roles": (["FastAPI","PostgreSQL","WCAG/ARIA"], ["Next.js 14","GPT-4o","Accessibility"]),
    },
    "ClimateFinance": {
        "emoji": "💹",
        "market": "$4.8 trillion needed annually for climate transition",
        "kw": [
            "climate finance","green finance","sustainable finance","impact investing","esg investing",
            "green bond","blue bond","sustainability bond","social bond","transition bond",
            "carbon market","voluntary carbon market","compliance carbon","eu ets","california cap",
            "tcfd","sfdr","eu taxonomy","paris agreement","net zero finance","climate risk",
            "physical risk","transition risk","stranded assets","climate stress test",
            "nature finance","biodiversity finance","water finance","food system finance",
            "blended finance","development finance","mdb","world bank","adb","afdb",
            "climate venture capital","cleantech vc","impact fund","greenwashing",
            "climateFinanc","grean bond","carboon market","climate app","climate finance hackathon",
            "build climate finance","win climate finance track","carbon pricing","net zero portfolio"
        ],
        "projects": [
            ("Green Bond Analytics Platform","High"),("Carbon Credit Exchange","High"),
            ("Climate Risk Stress Tester","High"),("ESG Portfolio Optimizer","High"),
            ("TCFD Report Generator","High"),("Net Zero Portfolio Tracker","High"),
            ("Nature-Based Finance Platform","High"),("Climate VC Deal Flow Tracker","High"),
            ("Carbon Pricing Modeler","High"),("Climate Disclosure Platform","High"),
            ("Green Taxonomy Compliance Tool","High"),("Physical Risk Modeler","High"),
            ("Transition Risk Analyzer","High"),("Stranded Asset Identifier","High"),
            ("Blended Finance Orchestrator","High"),("Impact Measurement Platform","High"),
            ("Climate Data Aggregator","High"),("Greenwashing Detector","High"),
            ("Carbon Offset Verifier","High"),("Climate Bond Screener","High"),
            ("Biodiversity Credit Platform","High"),("Water Credit Tracker","High"),
            ("Sovereign Climate Risk Scorer","High"),("Climate Fund Manager","High"),
            ("Climate Insurance Modeler","High"),("Scope 3 Finance Analyzer","High"),
            ("Climate Scenario Planner","High"),("Green Loan Originator","High"),
            ("SDG Bond Tracker","High"),("Climate Finance Gap Analyzer","High"),
            ("SFDR Compliance Dashboard","High"),("EU Taxonomy Mapper","High"),
            ("Climate KPI Dashboard","High"),("Real Assets Climate Scorer","High"),
            ("Sustainable Supply Finance","High"),("Nature Capital Valuer","High"),
            ("Climate Finance Education","Medium"),("Paris-Aligned Portfolio Tool","High"),
            ("Science-Based Target Tracker","High"),("Climate Finance Literacy App","Medium"),
            ("Carbon Accounting for Banks","High"),("MDB Loan Tracker","High"),
            ("Just Transition Finance Tool","High"),("Climate Loss & Damage Fund","High"),
            ("Adaptation Finance Tracker","High"),("Climate Crowdfunding Platform","High"),
            ("Clean Energy Investment Hub","High"),("Environmental Bond Registry","High"),
            ("Climate Fund Performance","High"),("Forestry Investment Platform","High"),
        ],
        "stack": ("Next.js 14","FastAPI","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + Recharts + shadcn/ui.<br><h4>Backend:</h4> FastAPI + Celery + financial data pipelines.<br><h4>Database:</h4> PostgreSQL + TimescaleDB + Pinecone.<br><h4>AI:</h4> GPT-4o for report generation + XGBoost for risk models + NLP for disclosure analysis.<br><h4>Deploy:</h4> Vercel + Railway.',
        "roles": (["FastAPI","PostgreSQL","Climate Risk Models"], ["Next.js 14","GPT-4o","Recharts"]),
    },
    "SupplyChainTech": {
        "emoji": "⛓️",
        "market": "$37 billion supply chain management software",
        "kw": [
            "supply chain","procurement","sourcing","vendor","supplier","purchase order","rfq",
            "inventory","warehouse","fulfillment","distribution","manufacturing","production",
            "bom","bill of materials","mrp","erp supply","sap","oracle scm","microsoft dynamics",
            "demand planning","s&op","forecasting supply","lead time","safety stock","reorder point",
            "supplier risk","dual sourcing","nearshoring","reshoring","geopolitical risk",
            "traceability","blockchain supply","farm to fork","conflict minerals","esg supply",
            "customs","trade compliance","tariff","hs code","incoterms","freight forwarder",
            "supply chain disruption","covid supply","resilience supply chain","visibility",
            "supplychaintech","suply chain","procurment","vendoor","supply chain hackathon",
            "build supply chain","create procurement system","win supply chain track","scm platform"
        ],
        "projects": [
            ("Supply Chain Visibility Platform","High"),("Supplier Risk Analyzer","High"),
            ("Demand Forecasting Engine","High"),("Procurement Automation System","High"),
            ("Inventory Optimization Tool","High"),("Supply Chain Digital Twin","High"),
            ("Supplier Onboarding Platform","High"),("BOM Management System","High"),
            ("S&OP Planning Dashboard","High"),("Trade Compliance Checker","High"),
            ("Supply Chain ESG Tracker","High"),("Cold Chain Visibility","High"),
            ("Raw Material Price Tracker","High"),("Supplier Diversity Platform","High"),
            ("Contract Manufacturing Manager","High"),("Reverse Logistics Platform","Medium"),
            ("Supply Chain Finance Platform","High"),("Carbon Scope 3 Supply Tracker","High"),
            ("Customs Documentation AI","High"),("Supply Chain Disruption Predictor","High"),
            ("Vendor Performance Scorer","High"),("Warehouse Slotting Optimizer","High"),
            ("Multi-Tier Supplier Mapper","High"),("Supply Chain Collaboration Hub","High"),
            ("Factory Capacity Planner","High"),("Quality Management System","High"),
            ("Packaging Optimization Tool","Medium"),("Supply Chain KPI Dashboard","High"),
            ("Purchase Order Automation","Medium"),("Spend Analytics Platform","High"),
            ("Supplier Audit Manager","High"),("Product Recall Coordinator","High"),
            ("Container Space Optimizer","High"),("Supply Chain ML Forecaster","High"),
            ("Tariff Impact Analyzer","High"),("Supply Chain Chatbot AI","High"),
            ("Just-in-Time Optimizer","High"),("Circular Supply Chain Planner","High"),
            ("Conflict Minerals Tracker","High"),("Supply Chain Risk Dashboard","High"),
            ("Order-to-Cash Automation","High"),("Procure-to-Pay Platform","High"),
            ("Smart Receiving System","Medium"),("Supply Chain Cost Analyzer","High"),
            ("Network Design Optimizer","High"),("Inventory Audit Automation","Medium"),
            ("Cross-Dock Planner","High"),("Nearshoring Assessment Tool","High"),
            ("Supply Chain Talent Platform","High"),("Manufacturing Analytics Hub","High"),
        ],
        "stack": ("Next.js 14","Go (Fiber)","GPT-4o"),
        "tech": '<h4>Frontend:</h4> Next.js 14 + Tailwind + Recharts + Mapbox.<br><h4>Backend:</h4> Go (Fiber) + Kafka for event streaming.<br><h4>Database:</h4> PostgreSQL + Redis + TimescaleDB.<br><h4>AI:</h4> GPT-4o + Prophet for forecasting + XGBoost for risk scoring.<br><h4>Deploy:</h4> Vercel + Railway + Kafka on Confluent.',
        "roles": (["Go (Fiber)","PostgreSQL","Kafka"], ["Next.js 14","GPT-4o","Prophet"]),
    },
}

# ── Main generation script ──────────────────────────────────────────────────
import sys

def generate_all_new_entries():
    new_entries = []

    print("Generating HealthTech (50)...", flush=True)
    new_entries.extend(healthtech_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating EdTech (50)...", flush=True)
    new_entries.extend(edtech_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating FinTech (50)...", flush=True)
    new_entries.extend(fintech_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating SmartCity (50)...", flush=True)
    new_entries.extend(smartcity_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating AgriTech (50)...", flush=True)
    new_entries.extend(agritech_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating CyberSecurity (50)...", flush=True)
    new_entries.extend(cybersecurity_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating GreenTech (50)...", flush=True)
    new_entries.extend(greentech_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating Logistics (50)...", flush=True)
    new_entries.extend(logistics_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating AITools (50)...", flush=True)
    new_entries.extend(aitools_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating HRTech (50)...", flush=True)
    new_entries.extend(hrtech_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating LegalTech (50)...", flush=True)
    new_entries.extend(legaltech_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating FoodTech (50)...", flush=True)
    new_entries.extend(foodtech_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating SportsTech (50)...", flush=True)
    new_entries.extend(sportstech_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating Web3 (50)...", flush=True)
    new_entries.extend(web3_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print("Generating GamingTech (50)...", flush=True)
    new_entries.extend(gamingtech_entries())
    print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    # Parametric industries group 1
    for industry, spec in INDUSTRY_SPECS.items():
        print(f"Generating {industry} (50)...", flush=True)
        new_entries.extend(parametric_entries(industry, spec))
        print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    # Parametric industries group 2
    for industry, spec in INDUSTRY_SPECS_2.items():
        print(f"Generating {industry} (50)...", flush=True)
        new_entries.extend(parametric_entries(industry, spec))
        print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    # Parametric industries group 3
    for industry, spec in INDUSTRY_SPECS_3.items():
        print(f"Generating {industry} (50)...", flush=True)
        new_entries.extend(parametric_entries(industry, spec))
        print(f"  Done. Total so far: {len(new_entries)}", flush=True)

    print(f"\nTotal new entries generated: {len(new_entries)}", flush=True)
    return new_entries


if __name__ == "__main__":
    print("=== Step 1: Reading existing offline_data_1000.js ===", flush=True)
    with open(r'd:\RAR Hackathon\offline_data_1000.js', 'r', encoding='utf-8') as f:
        existing_content = f.read()

    # Strip the closing "];" from end
    closing = existing_content.rfind('];')
    base_content = existing_content[:closing].rstrip()

    print("=== Step 2: Generating new entries ===", flush=True)
    new_entries = generate_all_new_entries()

    print("=== Step 3: Writing offline_data_v3.js ===", flush=True)
    out_path = r'd:\RAR Hackathon\offline_data_v3.js'

    with open(out_path, 'w', encoding='utf-8') as f:
        # Write header with existing entries
        f.write('window.OFFLINE_KNOWLEDGE_BASE = [\n')

        # Parse existing entries from the base content
        # The base content starts with "window.OFFLINE_KNOWLEDGE_BASE = [\n"
        prefix = 'window.OFFLINE_KNOWLEDGE_BASE = ['
        existing_array_content = existing_content[len(prefix):closing].strip()

        # Write existing array content (without the wrapping brackets)
        f.write(existing_array_content)
        f.write(',\n')

        # Write new entries
        total = len(new_entries)
        for i, e in enumerate(new_entries):
            json_str = json.dumps(e, ensure_ascii=False, indent=2)
            f.write(json_str)
            if i < total - 1:
                f.write(',\n')
            else:
                f.write('\n')
            if (i + 1) % 100 == 0:
                print(f"  Written {i+1}/{total} new entries...", flush=True)

        f.write('];\n')

    print(f"=== Done! File written to {out_path} ===", flush=True)

    # Quick validation
    with open(out_path, 'r', encoding='utf-8') as f:
        final_content = f.read()
    size_mb = len(final_content) / (1024*1024)
    print(f"File size: {size_mb:.1f} MB", flush=True)
    print(f"Contains 'window.OFFLINE_KNOWLEDGE_BASE': {('window.OFFLINE_KNOWLEDGE_BASE' in final_content)}", flush=True)
