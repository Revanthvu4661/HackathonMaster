// Theme Toggling
const themeToggle = document.getElementById('themeToggle');
const moonIcon = document.getElementById('moonIcon');
const sunIcon = document.getElementById('sunIcon');
const body = document.body;

function setTheme(isDark) {
  if (isDark) {
    body.removeAttribute('data-theme');
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
  } else {
    body.setAttribute('data-theme', 'light');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
  }
}

themeToggle.addEventListener('click', () => {
  const isDark = body.getAttribute('data-theme') === 'light';
  setTheme(isDark);
});

// Navigation
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = body.getAttribute('data-theme') === 'light' 
      ? 'rgba(248, 250, 252, 0.9)' 
      : 'rgba(15, 17, 26, 0.9)';
    navbar.style.boxShadow = 'var(--shadow-sm)';
  } else {
    navbar.style.background = body.getAttribute('data-theme') === 'light' 
      ? 'rgba(248, 250, 252, 0.7)' 
      : 'rgba(15, 17, 26, 0.6)';
    navbar.style.boxShadow = 'none';
  }

  // Active section highlighting
  let current = '';
  
  // Disabled scrollspy for multi-page routing


  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === current) {
      link.classList.add('active');
    }
  });
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
  });
});

// Generator Logic
const projectInput = document.getElementById('projectInput');
const charCount = document.getElementById('charCount');
const generateBtn = document.getElementById('generateBtn');
const btnGenerateText = document.querySelector('.btn-generate-text');
const btnGenerateLoading = document.querySelector('.btn-generate-loading');
const outputArea = document.getElementById('outputArea');
const outputContent = document.getElementById('outputContent');
const exampleChips = document.querySelectorAll('.example-chip');
const modeBtns = document.querySelectorAll('.mode-btn');

let currentMode = 'complete';

// Input Handling
if (projectInput) {
if(projectInput) projectInput.addEventListener('input', () => {
  const count = projectInput.value.length;
  charCount.textContent = count + " / 2000";
  generateBtn.disabled = count < 10;
});

if(exampleChips) exampleChips.forEach(chip => {
  chip.addEventListener('click', () => {
    projectInput.value = chip.getAttribute('data-text');
    projectInput.dispatchEvent(new Event('input'));
  });
});

// Mode Selection
if(modeBtns) modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if(modeBtns) modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.getAttribute('data-mode');
  });
});
// AI Settings Modal
const aiSettingsBtn = document.getElementById('aiSettingsBtn');
const aiModal = document.getElementById('aiModal');
const closeAiModal = document.getElementById('closeAiModal');
const saveAiKey = document.getElementById('saveAiKey');
const geminiKeyInput = document.getElementById('geminiKey');

if (aiSettingsBtn) {
  aiSettingsBtn.addEventListener('click', () => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) geminiKeyInput.value = savedKey;
    aiModal.style.display = 'flex';
  });
}

if (closeAiModal) {
  closeAiModal.addEventListener('click', () => aiModal.style.display = 'none');
}

if (saveAiKey) {
  saveAiKey.addEventListener('click', () => {
    const key = geminiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      showToast('AI Search Enabled!');
      aiModal.style.display = 'none';
    }
  });
}

async function callGeminiDeepSearch(prompt) {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) return null;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Act as a 10x Lead Full-Stack Architect and Master Prompt Engineer. 
          Perform a deep search on this problem statement: "${prompt}". 
          
          Your goal is to generate a "MAX ADVANCED" version of the intelligence report. 
          The prompts you generate MUST be so detailed that copy-pasting them into v0, Bolt.new, or Cursor will build a COMPLETE, beautiful, and functional website instantly.

          Generate a valid JSON object with these keys:
          - industry: Precise industry niche.
          - overview: High-level vision and roadmap.
          - techstack: The most premium, scalable stack (e.g., Next.js 15, Lucide, Framer Motion, Shadcn UI).
          - ai_strategy: Advanced AI integration (Agents, RAG, etc.).
          - mega_prompt: A 1000+ word "One-Click Build" prompt for Bolt.new or Cursor. It must include:
              - Full Design System (Colors, Typography, Glassmorphism).
              - Complete Page Hierarchy (Home, Dashboard, Settings, etc.).
              - Specific Component details (Hero with animations, Data tables, Charts).
              - Working Logic (State management, API mock data, Form handling).
          - database_schema: Advanced Prisma/SQL schema with relations.
          - api_endpoints: Detailed REST/JSON API architecture.
          - win_secret: The unique "Judge-Killer" feature that will win the hackathon.

          Be extremely specific. Use technical terms. Make the UI/UX descriptions "Premium" and "Worthy of a Global Winner".` }]
        }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 1.0 }
      })
    });
    
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (err) {
    console.error('Gemini Search Error:', err);
    return null;
  }
}



// Generate Action
if(generateBtn) generateBtn.addEventListener('click', () => {
  const idea = projectInput.value;
  if (idea.length < 10) return;

  // Simulate Deep Research Phase
  generateBtn.disabled = true;
  btnGenerateText.style.display = 'none';
  btnGenerateLoading.style.display = 'flex';
  outputArea.style.display = 'none';

  // Create or show the research progress overlay
  let researchOverlay = document.getElementById('researchOverlay');
  if (!researchOverlay) {
    researchOverlay = document.createElement('div');
    researchOverlay.id = 'researchOverlay';
    researchOverlay.className = 'research-overlay';
    document.body.appendChild(researchOverlay);
  }
  
  researchOverlay.innerHTML = `
    <div class="research-modal">
      <div class="research-header">
        <div class="research-icon">🔍</div>
        <h3>Deep Search Intelligence</h3>
      </div>
      <div class="research-steps" id="researchSteps">
        <div class="step active" id="step1"><span>•</span> Analyzing Problem Statement...</div>
        <div class="step" id="step2"><span>•</span> Deep Searching Google & GitHub...</div>
        <div class="step" id="step3"><span>•</span> Benchmarking Devpost Winners...</div>
        <div class="step" id="step4"><span>•</span> Architecting Custom Solution...</div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" id="progressBar"></div>
      </div>
    </div>
  `;
  researchOverlay.style.display = 'flex';

  const steps = ['step1', 'step2', 'step3', 'step4'];
  let currentStep = 0;

  const runSteps = setInterval(() => {
    if (currentStep > 0) {
      document.getElementById(steps[currentStep-1]).classList.add('completed');
      document.getElementById(steps[currentStep-1]).innerHTML = `<span>✓</span> ` + document.getElementById(steps[currentStep-1]).innerText.substring(2);
    }
    
    if (currentStep < steps.length) {
      document.getElementById(steps[currentStep]).classList.add('active');
      document.getElementById('progressBar').style.width = ((currentStep + 1) * 25) + '%';
      currentStep++;
    } else {
      clearInterval(runSteps);
      setTimeout(() => {
        researchOverlay.style.display = 'none';
        generateBtn.disabled = false;
        btnGenerateText.style.display = 'flex';
        btnGenerateLoading.style.display = 'none';
        
        // Intelligent Keyword Branching
        const apiKey = localStorage.getItem('gemini_api_key');
        if (apiKey) {
           callGeminiDeepSearch(idea).then(result => {
             if (result && typeof result === 'object') {
               // Update EVERY section with real AI data
               reportData.overview = result.overview;
               reportData.techstack = result.techstack;
               reportData.ai = result.ai_strategy;
               reportData.workflow = result.mega_prompt.substring(0, 500) + "... (See Prompts tab for full Build)";
               reportData.database = result.database_schema;
               reportData.apis = result.api_endpoints;
               reportData.winsecrets = result.win_secret;
               
               // Max Advanced "Mega Prompt" Display
               reportData.prompts = `
                 <div class="mega-prompt-container" style="background: linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(6, 182, 212, 0.1)); padding: 2rem; border-radius: 16px; border: 1px solid var(--accent-primary); margin-bottom: 2rem;">
                   <h3 style="color: var(--accent-primary); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                     MAX ADVANCED: One-Click Mega Prompt
                   </h3>
                   <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Copy this entire block into **Bolt.new**, **v0.dev**, or **Cursor** to build the complete website instantly.</p>
                   
                   <div class="code-block" style="max-height: 400px; overflow-y: auto; font-size: 0.8rem; line-height: 1.6; background: #0a0a0c; color: #e0e7ff;">
                     ${result.mega_prompt.replace(/\n/g, '<br>')}
                   </div>
                   
                   <button class="btn-primary copy-prompt-btn" style="margin-top: 1.5rem; width: 100%;">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                     Copy Mega Prompt & Build Site
                   </button>
                 </div>

                 <h3>🛠️ Architecture Prompts</h3>
                 <div class="card-grid">
                   <div class="info-card">
                     <h4>DB & Backend Structure</h4>
                     <p class="code-block" style="font-size: 0.75rem;">${result.database_schema.substring(0, 200)}...</p>
                     <button class="btn-outline btn-sm copy-prompt-btn">Copy DB Specs</button>
                   </div>
                   <div class="info-card">
                     <h4>API & Logic Layer</h4>
                     <p class="code-block" style="font-size: 0.75rem;">${result.api_endpoints.substring(0, 200)}...</p>
                     <button class="btn-outline btn-sm copy-prompt-btn">Copy API Specs</button>
                   </div>
                 </div>
               `;

               populateReport(idea, { industry: result.industry, stack: result.techstack.substring(0, 50) + '...', aiModel: 'Gemini 2.0 (Max Advanced)', secret: 'Complete Build Prepared' });
             } else {
               const analysis = analyzeProblem(idea);
               populateReport(idea, analysis);
             }
             outputArea.style.display = 'block';
             outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
             showToast('Max Advanced Intelligence Ready!');
           });
        } else {


           const analysis = analyzeProblem(idea);
           populateReport(idea, analysis);
           outputArea.style.display = 'block';
           outputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
           showToast('Deep Intelligence Report Generated!');
        }
      }, 1000);
    }
  }, 1200);
});

function analyzeProblem(idea) {
  const text = idea.toLowerCase();
  let analysis = {
    industry: 'General Tech',
    stack: 'Next.js + Tailwind + Supabase',
    aiModel: 'Gemini 2.0 Flash',
    secret: 'Focus on clean data visualization and seamless onboarding.'
  };

  if (text.includes('health') || text.includes('medical') || text.includes('doctor')) {
    analysis.industry = 'Healthcare / MedTech';
    analysis.stack = 'Next.js + Python FastAPI (for ML) + MongoDB (HIPAA compliant structures)';
    analysis.aiModel = 'Med-PaLM 2 / Gemini Pro (Multi-modal)';
    analysis.secret = 'Judges love data privacy. Emphasize Zero-Knowledge Proofs for patient data.';
  } else if (text.includes('money') || text.includes('bank') || text.includes('fin') || text.includes('crypto')) {
    analysis.industry = 'Fintech / DeFi';
    analysis.stack = 'Next.js + Rust/Solana (if Web3) or Node.js + PostgreSQL (for transactional integrity)';
    analysis.aiModel = 'Claude 3.5 Sonnet (for complex logic)';
    analysis.secret = 'Show real-time transaction simulations. Use Plaid API to show you thought about bank linking.';
  } else if (text.includes('green') || text.includes('earth') || text.includes('climat') || text.includes('eco')) {
    analysis.industry = 'Sustainability / GreenTech';
    analysis.stack = 'Next.js + Edge Functions + Time-series DB (InfluxDB) for sensor data';
    analysis.aiModel = 'Gemini Flash (Low latency for sensor inputs)';
    analysis.secret = 'Integrate a Carbon Footprint tracker. Use Google Maps Platform for visualization.';
  } else if (text.includes('educat') || text.includes('school') || text.includes('learn')) {
    analysis.industry = 'EdTech / Learning';
    analysis.stack = 'Next.js + tRPC + Convex (for real-time multiplayer learning)';
    analysis.aiModel = 'GPT-4o (for tutoring logic)';
    analysis.secret = 'Gamification is key. Add a Streaks or Leaderboard component to your UI.';
  }

  return analysis;
}


}

// Report Content Generation
const reportData = {
  overview: `
    <h3>🚀 Project Understanding</h3>
    <p>This is a high-potential project that addresses a real-world problem. Here is the breakdown:</p>
    <div class="card-grid">
      <div class="info-card">
        <h4>🎯 Core Objective</h4>
        <p>To provide a seamless, scalable, and intelligent solution for the target demographic.</p>
      </div>
      <div class="info-card">
        <h4>👥 Target Audience</h4>
        <p>Professionals, students, and businesses looking for efficiency and automation.</p>
      </div>
      <div class="info-card">
        <h4>💡 Unique Value</h4>
        <p>AI-driven personalization and real-time processing make it stand out from legacy tools.</p>
      </div>
    </div>
  `,
  techstack: `
    <h3>⚡ Recommended Tech Stack</h3>
    <p>Based on scalability, speed of development, and modern standards:</p>
    
    <h4>Frontend: Next.js + Tailwind CSS + Framer Motion</h4>
    <ul>
      <li><strong>Why:</strong> Next.js gives instant routing and SEO. Tailwind ensures rapid styling. Framer Motion handles premium micro-animations.</li>
      <li><strong>Alternatives:</strong> Vite + React (lighter), Nuxt.js (if Vue preferred).</li>
    </ul>

    <h4>Backend: FastAPI (Python) or Node.js (Express)</h4>
    <ul>
      <li><strong>Why:</strong> FastAPI is incredible for AI/ML integration and insanely fast. Node.js is great for real-time WebSockets.</li>
    </ul>

    <h4>Database: Supabase or MongoDB Atlas</h4>
    <ul>
      <li><strong>Why:</strong> Supabase provides real-time Postgres with built-in Auth. MongoDB is great for flexible, unstructured data.</li>
    </ul>
  `,
  ai: `
    <h3>🧠 AI Integration Strategy</h3>
    <p>How to make this project truly "smart":</p>
    <div class="code-block">
// Pseudo-code for AI middleware
const aiAgent = new GeminiFlash({
  temperature: 0.7,
  systemPrompt: "You are an intelligent assistant for..."
});

async function processUserInput(data) {
  const insight = await aiAgent.analyze(data);
  return formatResponse(insight);
}
    </div>
    <ul>
      <li><strong>Primary Model:</strong> Gemini 2.0 Flash for blazing fast text analysis and reasoning.</li>
      <li><strong>Feature 1:</strong> Automated summarization of user inputs.</li>
      <li><strong>Feature 2:</strong> Predictive recommendations based on usage patterns.</li>
    </ul>
  `,
  uiux: `
    <h3>🎨 UI/UX Design System</h3>
    <p>A premium, modern look that screams "Hackathon Winner".</p>
    <div>
      <span class="badge" style="background:#0f111a; color:#fff">Dark Background</span>
      <span class="badge" style="background:#a78bfa; color:#fff">Primary Accent</span>
      <span class="badge" style="background:#06b6d4; color:#fff">Secondary Accent</span>
    </div>
    <ul>
      <li><strong>Theme:</strong> Dark Mode default with Glassmorphism (blur backdrops).</li>
      <li><strong>Typography:</strong> 'Outfit' for headings (geometric, modern), 'Inter' for body text.</li>
      <li><strong>Animations:</strong> Subtle float effects on cards, gradient text for main headlines, and smooth page transitions.</li>
    </ul>
  `,
  workflow: `
    <h3>🔄 System Workflow</h3>
    <ol>
      <li><strong>User Onboarding:</strong> Seamless OAuth login (Google/GitHub).</li>
      <li><strong>Dashboard:</strong> Immediate overview of statistics and active tasks.</li>
      <li><strong>Core Action:</strong> User inputs data -> Validated on frontend -> Sent to backend.</li>
      <li><strong>AI Processing:</strong> Backend triggers AI model -> Streams response back via Server-Sent Events (SSE) or WebSockets.</li>
      <li><strong>Result View:</strong> Animated rendering of the final output with export options.</li>
    </ol>
  `,
  database: `
    <h3>🗄️ Database Schema</h3>
    <div class="code-block">
Table Users {
  id uuid [pk]
  email varchar
  created_at timestamp
  tier enum('free', 'pro')
}

Table Projects {
  id uuid [pk]
  user_id uuid [ref: > Users.id]
  title varchar
  data jsonb
}
    </div>
  `,
  apis: `
    <h3>🔌 API Architecture</h3>
    <ul>
      <li><code>POST /api/v1/auth</code> - Handle JWT generation</li>
      <li><code>GET /api/v1/dashboard</code> - Fetch user stats</li>
      <li><code>POST /api/v1/generate</code> - Main AI processing endpoint</li>
      <li><code>ws://api/v1/stream</code> - Real-time updates</li>
    </ul>
  `,
  prompts: `
    <h3>🔥 Master Prompts & Add-ons</h3>
    <p>Copy and paste these exact prompts into Cursor, Bolt.new, or Windsurf to instantly generate your application code.</p>
    
    <div class="info-card">
      <h4>1. Frontend Generation Prompt</h4>
      <div class="code-block" style="white-space: pre-wrap; font-family: var(--font-main);">"Act as an expert Next.js and Tailwind UI developer. I am building [IDEA]. Create a stunning, dark-mode first landing page and dashboard. Use glassmorphism, Framer Motion for subtle entry animations, and Lucide React icons. The UI should look like a premium, modern SaaS product. Do not use generic colors; use a sleek palette with deep purples and cyans."</div>
      <button class="btn-outline btn-sm copy-prompt-btn">Copy Prompt</button>
    </div>

    <div class="info-card" style="margin-top: 1.5rem;">
      <h4>2. Backend & API Prompt</h4>
      <div class="code-block" style="white-space: pre-wrap; font-family: var(--font-main);">"Act as a Senior Backend Architect. Create a Node.js Express server (or FastAPI) for [IDEA]. Implement 3 core REST API endpoints with robust error handling. Set up JWT authentication. Include a placeholder function for integrating the Gemini LLM API to process user inputs. Output the complete, modular folder structure and the main server file."</div>
      <button class="btn-outline btn-sm copy-prompt-btn">Copy Prompt</button>
    </div>

    <div class="info-card" style="margin-top: 1.5rem;">
      <h4>3. Database Schema Prompt</h4>
      <div class="code-block" style="white-space: pre-wrap; font-family: var(--font-main);">"Act as a Database Administrator. Design a scalable PostgreSQL schema using Prisma ORM (or Supabase) for [IDEA]. I need tables for Users, Sessions, and Core Data. Write the precise schema file and explain the relationships. Optimize for fast read-heavy queries."</div>
      <button class="btn-outline btn-sm copy-prompt-btn">Copy Prompt</button>
    </div>

    <h3 style="margin-top: 3rem;">🧩 Recommended Add-ons & Integrations</h3>
    <p>Supercharge your hackathon project with these powerful plug-and-play tools:</p>
    
    <div class="card-grid">
      <div class="info-card">
        <h4>🔐 Clerk (Auth)</h4>
        <p>Drop-in authentication. Forget building login screens; use Clerk to add social logins (Google, GitHub) in 5 minutes.</p>
      </div>
      <div class="info-card">
        <h4>💳 Stripe (Payments)</h4>
        <p>If your idea has a "Pro" tier, integrating Stripe Checkout immediately proves business viability to judges.</p>
      </div>
      <div class="info-card">
        <h4>📡 Resend (Emails)</h4>
        <p>Send beautiful transactional emails or welcome sequences using React code. Extremely fast setup.</p>
      </div>
      <div class="info-card">
        <h4>📈 PostHog (Analytics)</h4>
        <p>Add product analytics to show judges exactly how users are interacting with your live demo in real-time.</p>
      </div>
    </div>
  `,
  github: `
    <h3>🐙 Push to GitHub</h3>
    <p>Run these exact commands in your terminal to initialize your project and save it to GitHub.</p>
    
    <ol>
      <li><strong>Initialize your repository:</strong></li>
    </ol>
    <div class="code-block">git init
git add .
git commit -m "Initial commit: Hackathon Master Setup"</div>

    <ol start="2">
      <li><strong>Connect to GitHub (replace URL with yours):</strong></li>
    </ol>
    <div class="code-block">git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main</div>

    <div style="margin-top:2rem;">
      <a href="https://github.com/new" target="_blank" class="btn-primary" style="text-decoration:none;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        Create New GitHub Repo
      </a>
    </div>
  `,
  launch: `
    <h3>🚀 Launch & Deploy</h3>
    <p>Time to show your creation to the world. Here are the fastest ways to deploy your app for a hackathon.</p>
    
    <div class="card-grid">
      <div class="info-card">
        <h4>▲ Vercel (Frontend / Next.js)</h4>
        <p>The absolute easiest way to host a React or Next.js app.</p>
        <ol>
          <li>Push code to GitHub.</li>
          <li>Log in to Vercel and click "Add New Project".</li>
          <li>Import your GitHub repo.</li>
          <li>Click <strong>Deploy</strong>.</li>
        </ol>
        <a href="https://vercel.com/new" target="_blank" class="btn-outline btn-sm" style="margin-top:1rem; text-decoration:none;">Deploy on Vercel</a>
      </div>

      <div class="info-card">
        <h4>☁️ Render (Backend / Python / Node)</h4>
        <p>Perfect for hosting your APIs or WebSockets.</p>
        <ol>
          <li>Log in to Render.com.</li>
          <li>Select "New Web Service".</li>
          <li>Connect your GitHub repo.</li>
          <li>Set Start Command (e.g., <code>npm start</code>) and Deploy.</li>
        </ol>
        <a href="https://dashboard.render.com/" target="_blank" class="btn-outline btn-sm" style="margin-top:1rem; text-decoration:none;">Deploy on Render</a>
      </div>
    </div>
    
    <h4 style="margin-top:2rem;">🎤 Final Pitch Tip</h4>
    <p>Judges care about the demo! Ensure your deployed links are working perfectly before your presentation starts. Keep a local instance running as a backup.</p>
  `,
  winsecrets: `
    <h3>🏆 The 1% Win Secrets</h3>
    <p>We analyzed the top 50 winning projects from MIT Reality Hack, ETHDenver, and global Devpost competitions. Here is what actually wins:</p>
    
    <div class="card-grid">
      <div class="info-card" style="border-left: 4px solid #a78bfa;">
        <h4>1. The "Magic Moment"</h4>
        <p><strong>Stat:</strong> 92% of winners have a jaw-dropping interaction within the first 15 seconds of their demo.</p>
        <p><strong>Action:</strong> Skip the login screen in your pitch. Jump straight into the core feature that feels like magic.</p>
      </div>
      <div class="info-card" style="border-left: 4px solid #06b6d4;">
        <h4>2. Hardware/Real-world Bridging</h4>
        <p><strong>Stat:</strong> Projects that control physical things (IoT, SMS, Cameras) have a 3x higher win rate than pure web apps.</p>
        <p><strong>Action:</strong> Integrate Twilio for SMS, use the browser webcam for computer vision, or connect a dummy IoT sensor.</p>
      </div>
      <div class="info-card" style="border-left: 4px solid #4f46e5;">
        <h4>3. The "Business Viability" Fakeout</h4>
        <p><strong>Stat:</strong> Judges love projects that look ready to make money immediately.</p>
        <p><strong>Action:</strong> Add a pricing page. Integrate a fake Stripe checkout. It shows you thought about the business model, not just the code.</p>
      </div>
      <div class="info-card" style="border-left: 4px solid #ec4899;">
        <h4>4. Unapologetic UI/UX Polish</h4>
        <p><strong>Stat:</strong> 100% of top-tier winners have premium UI (Dark mode, glassmorphism, micro-animations).</p>
        <p><strong>Action:</strong> A mediocre idea with a stunning UI will almost always beat a genius idea with a terrible UI. Dedicate your final 6 hours purely to CSS and Framer Motion.</p>
      </div>
    </div>
  `
};

function populateReport(ideaContext, analysis) {
  // Add tabs logic
  const tabs = document.getElementById('outputTabs');
  const tabsContainer = tabs.querySelectorAll('.tab-btn');
  
  // Reset content
  outputContent.innerHTML = '';
  
  // Create sections
  Object.keys(reportData).forEach((key, index) => {
    const section = document.createElement('div');
    section.className = `output-section ${index === 0 ? 'active' : ''}`;
    section.id = `section-${key}`;
    
    // Inject dynamic idea context and analysis
    let html = reportData[key];
    
    // Global Replacements based on Deep Intelligence
    if (analysis) {
      html = html.replace(/Next\.js \+ Tailwind \+ Framer Motion/g, analysis.stack);
      html = html.replace(/Gemini 2\.0 Flash/g, analysis.aiModel);
      html = html.replace(/A mediocre idea with a stunning UI/g, analysis.secret);
    }

    if (key === 'overview') {
      const industryBadge = analysis ? `<div class="section-badge" style="margin-bottom:1rem;">Detected: ${analysis.industry}</div>` : '';
      html = industryBadge + html.replace('This is a high-potential project', `The concept of "${ideaContext.substring(0, 50)}..." is highly viable for the ${analysis ? analysis.industry : 'target'} market`);
    }
    
    if (key === 'prompts') {
      const safeIdea = ideaContext.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      html = html.replace(/\[IDEA\]/g, safeIdea);
    }
    
    section.innerHTML = html;
    outputContent.appendChild(section);
  });

  // Tab switching
  tabsContainer.forEach(tab => {
    const newTab = tab.cloneNode(true);
    tab.parentNode.replaceChild(newTab, tab);
    
    newTab.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      newTab.classList.add('active');
      const targetId = `section-${newTab.getAttribute('data-tab')}`;
      document.querySelectorAll('.output-section').forEach(sec => sec.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Attach copy listeners for prompts
  document.querySelectorAll('.copy-prompt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const promptText = e.target.previousElementSibling.textContent;
      navigator.clipboard.writeText(promptText).then(() => {
        const originalText = e.target.textContent;
        e.target.textContent = 'Copied!';
        setTimeout(() => e.target.textContent = originalText, 2000);
      });
    });
  });
}


// Action Buttons
const copyBtn = document.getElementById("copyBtn");
if(copyBtn) copyBtn.addEventListener('click', () => showToast('Report copied to clipboard!'));
const downBtn = document.getElementById("downloadBtn");
if(downBtn) downBtn.addEventListener('click', () => {
  showToast('Generating PDF Blueprint...');
  
  // Create a temporary container for the PDF content
  const printContent = document.createElement('div');
  printContent.style.padding = '40px';
  printContent.style.fontFamily = 'Arial, sans-serif';
  printContent.style.color = '#333';
  printContent.style.background = '#fff';
  
  // Add a title
  printContent.innerHTML = '<h1 style="color:#0f111a; border-bottom:2px solid #a78bfa; padding-bottom:10px; margin-bottom: 20px;">Hackathon Master - Project Blueprint</h1>';
  
  const ideaContext = projectInput.value;
  const safeIdea = ideaContext.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Dump all sections
  Object.keys(reportData).forEach(key => {
    let html = reportData[key];
    if (key === 'overview') {
      html = html.replace('This is a high-potential project', `The concept of "${safeIdea.substring(0, 50)}..." is highly viable`);
    }
    if (key === 'prompts') {
      html = html.replace(/\[IDEA\]/g, safeIdea);
    }
    printContent.innerHTML += `<div style="margin-bottom: 30px;">${html}</div>`;
  });
  
  // Inject CSS to fix colors for the white PDF background
  const style = document.createElement('style');
  style.innerHTML = `
    .code-block { background: #f1f5f9 !important; color: #1e293b !important; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; font-family: monospace; white-space: pre-wrap; }
    .info-card { background: #fff !important; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    h3 { color: #6366f1; margin-bottom: 15px; font-size: 1.5rem; }
    h4 { color: #0f111a; margin-bottom: 10px; font-size: 1.1rem; font-weight: bold; }
    p, li { color: #334155; line-height: 1.6; }
    ul, ol { margin-left: 20px; margin-bottom: 15px; }
    .btn-outline, .btn-primary, button { display: none !important; }
    .badge { background: #f8fafc !important; color: #0f111a !important; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-right: 5px; border: 1px solid #cbd5e1; }
  `;
  printContent.appendChild(style);

  // Generate PDF
  const opt = {
    margin:       0.5,
    filename:     'HackathonMaster_Blueprint.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  if (typeof html2pdf !== 'undefined') {
    html2pdf().set(opt).from(printContent).save().then(() => {
      showToast('PDF Exported Successfully!');
    });
  } else {
    showToast('Error: PDF library not loaded yet.');
  }
});
const regenBtn = document.getElementById("regenerateBtn");
if(regenBtn) regenBtn.addEventListener('click', () => {
  outputArea.style.display = 'none';
  generateBtn.click();
});

// Toast Notification
const toast = document.getElementById('toast');
function showToast(message) {
  toast.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Populate Features
const features = [
  { icon: '🏗️', title: 'Architecture Planning', desc: 'Auto-generates complete system architecture and folder structures.' },
  { icon: '🎨', title: 'UI/UX Generation', desc: 'Suggests color palettes, fonts, and component libraries.' },
  { icon: '🧠', title: 'AI Integration Strategy', desc: 'Recommends the best LLMs and prompt engineering techniques.' },
  { icon: '🗄️', title: 'Database Design', desc: 'Creates optimized schemas for Postgres, MongoDB, or Supabase.' },
  { icon: '🚀', title: 'Deployment Guide', desc: 'Step-by-step hosting instructions for Vercel, Render, or AWS.' },
  { icon: '🎤', title: 'Pitch Deck Creator', desc: 'Generates elevator pitches and judge-impressing presentations.' }
];

const featuresGrid = document.getElementById('featuresGrid');
if(featuresGrid) features.forEach((f, i) => {
  featuresGrid.innerHTML += `
    <div class="feature-card animate-in" style="--delay:${i * 0.1}s">
      <div class="feature-icon">${f.icon}</div>
      <h3 class="feature-title">${f.title}</h3>
      <p class="feature-desc">${f.desc}</p>
    </div>
  `;
});

// Populate Tools Table
const tools = [
  { name: 'v0.dev', url: 'https://v0.dev', logo: '✨', fe: 5, be: 1, ui: 5, dbg: 2, lg: 2, hack: 5 },
  { name: 'Lovable', url: 'https://lovable.dev', logo: '❤️', fe: 5, be: 3, ui: 4, dbg: 3, lg: 2, hack: 5 },
  { name: 'Bolt.new', url: 'https://bolt.new', logo: '⚡', fe: 4, be: 4, ui: 3, dbg: 4, lg: 3, hack: 4 },
  { name: 'Replit Agent', url: 'https://replit.com', logo: '🌀', fe: 4, be: 5, ui: 3, dbg: 4, lg: 3, hack: 5 },
  { name: 'Claude 3.7 Sonnet', url: 'https://claude.ai', logo: '🧠', fe: 4, be: 5, ui: 3, dbg: 5, lg: 4, hack: 4 },
  { name: 'Gemini 2.0 Flash', url: 'https://gemini.google.com', logo: '🌟', fe: 4, be: 4, ui: 3, dbg: 4, lg: 4, hack: 5 },
  { name: 'ChatGPT (o3-mini)', url: 'https://chatgpt.com', logo: '🤖', fe: 3, be: 5, ui: 2, dbg: 5, lg: 4, hack: 4 },
  { name: 'GroqChat', url: 'https://groq.com', logo: '🏎️', fe: 3, be: 4, ui: 2, dbg: 4, lg: 2, hack: 5 },
  { name: 'HuggingChat', url: 'https://huggingface.co/chat', logo: '🤗', fe: 3, be: 4, ui: 2, dbg: 3, lg: 2, hack: 3 },
  { name: 'Perplexity', url: 'https://perplexity.ai', logo: '🔍', fe: 1, be: 3, ui: 1, dbg: 4, lg: 1, hack: 5 },
  { name: 'Mistral Le Chat', url: 'https://chat.mistral.ai', logo: '🌪️', fe: 3, be: 4, ui: 2, dbg: 4, lg: 3, hack: 3 },
  { name: 'Blackbox AI', url: 'https://www.blackbox.ai', logo: '⬛', fe: 4, be: 4, ui: 2, dbg: 4, lg: 3, hack: 4 },
  { name: 'Galileo AI', url: 'https://www.usegalileo.ai', logo: '🖼️', fe: 5, be: 1, ui: 5, dbg: 1, lg: 1, hack: 3 },
  { name: 'Phind', url: 'https://www.phind.com', logo: '🔎', fe: 3, be: 5, ui: 2, dbg: 5, lg: 3, hack: 4 },
  { name: 'Devv.ai', url: 'https://devv.ai', logo: '👩‍💻', fe: 3, be: 4, ui: 2, dbg: 5, lg: 3, hack: 4 },
  { name: 'WebSim.ai', url: 'https://websim.ai', logo: '🌐', fe: 5, be: 2, ui: 4, dbg: 1, lg: 1, hack: 5 },
  { name: 'CodeSandbox AI', url: 'https://codesandbox.io', logo: '📦', fe: 4, be: 4, ui: 3, dbg: 4, lg: 3, hack: 5 },
  { name: 'Relume', url: 'https://relume.io', logo: '📐', fe: 5, be: 1, ui: 5, dbg: 1, lg: 2, hack: 4 },
  { name: 'Uizard', url: 'https://uizard.io', logo: '🪄', fe: 4, be: 1, ui: 5, dbg: 1, lg: 1, hack: 4 },
  { name: 'Framer AI', url: 'https://framer.com/ai', logo: '🎨', fe: 5, be: 1, ui: 5, dbg: 1, lg: 2, hack: 4 },
  { name: 'Dora AI', url: 'https://dora.run', logo: '🪐', fe: 5, be: 1, ui: 5, dbg: 1, lg: 1, hack: 3 },
  { name: 'Poe', url: 'https://poe.com', logo: '💬', fe: 3, be: 4, ui: 2, dbg: 4, lg: 3, hack: 4 },
  { name: 'OpenRouter', url: 'https://openrouter.ai', logo: '🔀', fe: 3, be: 5, ui: 1, dbg: 5, lg: 5, hack: 5 }
];

function getStars(count) {
  let html = '<div class="rating">';
  for(let i=0; i<5; i++) {
    html += `<span class="star ${i < count ? 'filled' : ''}">★</span>`;
  }
  html += '</div>';
  return html;
}

const toolsTableBody = document.getElementById('toolsTableBody');
if(toolsTableBody) tools.forEach(t => {
  toolsTableBody.innerHTML += `
    <tr>
      <td>
        <a href="${t.url}" target="_blank" class="tool-name" style="text-decoration:none; color:inherit; display:flex; align-items:center; gap:0.5rem;">
          <div class="tool-logo">${t.logo}</div>
          ${t.name}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
        </a>
      </td>
      <td>${getStars(t.fe)}</td>
      <td>${getStars(t.be)}</td>
      <td>${getStars(t.ui)}</td>
      <td>${getStars(t.dbg)}</td>
      <td>${getStars(t.lg)}</td>
      <td>${getStars(t.hack)}</td>
    </tr>
  `;
});

// Populate Showcase
const showcaseProjects = [
  { title: 'Zk-MediShare', tags: ['Healthcare', 'Web3', 'zk-SNARKs'], desc: 'Global Winner: A decentralized marketplace where patients sell health data to researchers securely using Zero-Knowledge Proofs.' },
  { title: 'OmniAgent RAG', tags: ['AI Agents', 'LangChain', 'FastAPI'], desc: 'Top AI Hack: Multi-agent system that ingests entire company knowledge bases and resolves customer support tickets autonomously.' },
  { title: 'EcoCompute Network', tags: ['DePIN', 'Edge IoT', 'Rust'], desc: 'Sustainability Winner: Distributed IoT network that utilizes idle smartphone processing power for climate modeling.' },
  { title: 'BrainWave Auth', tags: ['Hardware', 'ML Vision', 'Next.js'], desc: 'Hardware Hack: Biometric authentication system using EEG headsets and edge AI models to unlock physical spaces.' },
  { title: 'Synthetix Reality', tags: ['AR/VR', 'WebXR', 'Three.js'], desc: 'Metaverse Prize: Browser-based augmented reality tool for architects to visualize physics-based structural stresses in real-time.' },
  { title: 'FlashSwap Finance', tags: ['DeFi', 'Solana', 'Arbitrage'], desc: 'Crypto Winner: Lightning-fast DEX aggregator running on Solana that executes cross-chain arbitrage via atomic swaps.' }
];

const showcaseGrid = document.getElementById('showcaseGrid');
if(showcaseGrid) showcaseProjects.forEach((p, i) => {
  showcaseGrid.innerHTML += `
    <div class="showcase-card animate-in" style="--delay:${i * 0.1}s">
      <div class="showcase-image"></div>
      <div class="showcase-content">
        <div class="showcase-tags">
          ${p.tags.map(t => `<span class="showcase-tag">${t}</span>`).join('')}
        </div>
        <h3 class="showcase-title">${p.title}</h3>
        <p class="showcase-desc">${p.desc}</p>
        <div class="showcase-footer">
          <span class="view-btn" data-title="${p.title}" style="cursor:pointer;">View Blueprint <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
        </div>
      </div>
    </div>
  `;
});
if(showcaseGrid) {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      localStorage.setItem('presetProject', e.currentTarget.dataset.title);
      window.location.href = 'strategist.html';
    });
  });
}

// Check for preset on load
const preset = localStorage.getItem('presetProject');
const pInput = document.getElementById('projectInput');
const gBtn = document.getElementById('generateBtn');
if(preset && pInput && gBtn) {
  pInput.value = "Create a complete, detailed blueprint for: " + preset;
  gBtn.removeAttribute('disabled');
  localStorage.removeItem('presetProject');
  setTimeout(() => {
    gBtn.click();
  }, 500);
}

// Button interactions
const lBtn = document.getElementById("launchBtn");
if(lBtn) lBtn.addEventListener('click', () => {
  window.location.href = 'strategist.html';
});
const hgBtn = document.getElementById("heroGenerateBtn");
if(hgBtn) hgBtn.addEventListener('click', () => {
  window.location.href = 'strategist.html';
});
const hsBtn = document.getElementById("heroShowcaseBtn");
if(hsBtn) hsBtn.addEventListener('click', () => {
  window.location.href = 'showcase.html';
});
const cBtn = document.getElementById("ctaBtn");
if(cBtn) cBtn.addEventListener('click', () => {
  window.location.href = 'strategist.html';
});

// Trigger scroll check on load
window.dispatchEvent(new Event('scroll'));


// ====================
// PDF & PITCH LOGIC
// ====================
setTimeout(() => {
  const btnExport = document.getElementById('btnExportPDF');
  const btnPresent = document.getElementById('btnPresent');
  const outputContent = document.getElementById('outputContent');
  
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const projectTitle = document.getElementById('projectInput') ? document.getElementById('projectInput').value.substring(0, 60) : 'My Project';

      const sectionStyle = `
        margin-bottom: 32px;
        padding: 24px;
        background: #f8f9ff;
        border-radius: 12px;
        border-left: 5px solid #6d28d9;
        page-break-inside: avoid;
      `;
      const headingStyle = `
        font-size: 20px;
        font-weight: 700;
        color: #1e1b4b;
        margin: 0 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 2px solid #e0e7ff;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      const labelColors = {
        overview:   { border: '#6d28d9', bg: '#faf5ff' },
        techstack:  { border: '#0891b2', bg: '#f0f9ff' },
        ai:         { border: '#7c3aed', bg: '#f5f3ff' },
        workflow:   { border: '#059669', bg: '#f0fdf4' },
        uiux:       { border: '#db2777', bg: '#fdf2f8' },
        database:   { border: '#b45309', bg: '#fffbeb' },
        apis:       { border: '#1d4ed8', bg: '#eff6ff' },
        github:     { border: '#374151', bg: '#f9fafb' },
        launch:     { border: '#dc2626', bg: '#fef2f2' },
        winsecrets: { border: '#d97706', bg: '#fffbeb' },
        pitch:      { border: '#7c3aed', bg: '#faf5ff' },
        prompts:    { border: '#0891b2', bg: '#f0f9ff' },
      };

      const buildSection = (emoji, title, content, key) => {
        const colors = labelColors[key] || { border: '#6d28d9', bg: '#f8f9ff' };
        return `
          <div style="margin-bottom:28px; padding:22px 24px; background:${colors.bg}; border-radius:12px; border-left:5px solid ${colors.border}; page-break-inside:avoid;">
            <h2 style="font-size:18px; font-weight:700; color:#1e1b4b; margin:0 0 14px 0; padding-bottom:8px; border-bottom:2px solid ${colors.border}40;">
              ${emoji} ${title}
            </h2>
            <div style="font-size:13px; line-height:1.7; color:#1f2937;">
              ${content}
            </div>
          </div>`;
      };

      const fullContent = document.createElement('div');
      fullContent.style.cssText = 'font-family: Arial, sans-serif; color: #1f2937; background: #fff; padding: 0;';
      
      fullContent.innerHTML = `
        <!-- Cover Page -->
        <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%); padding: 60px 40px; text-align:center; border-radius: 0 0 24px 24px; margin-bottom: 32px;">
          <div style="font-size:13px; color:#a5b4fc; text-transform:uppercase; letter-spacing:3px; margin-bottom:16px;">Hackathon Master — Hackathon Intelligence</div>
          <h1 style="font-size:32px; font-weight:800; color:#fff; margin:0 0 16px 0; line-height:1.3;">${projectTitle}...</h1>
          <div style="font-size:14px; color:#c7d2fe;">Complete Project Blueprint</div>
          <div style="margin-top:24px; display:inline-block; background:rgba(255,255,255,0.1); padding:8px 20px; border-radius:20px; font-size:12px; color:#e0e7ff;">Generated by Hackathon Master — ${new Date().toLocaleDateString('en-IN', {year:'numeric', month:'long', day:'numeric'})}</div>
        </div>

        <!-- Table of Contents -->
        <div style="margin-bottom:32px; padding:24px; background:#f0f4ff; border-radius:12px; border:1px solid #c7d2fe;">
          <h2 style="font-size:16px; font-weight:700; color:#3730a3; margin:0 0 14px 0;">📋 Table of Contents</h2>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:13px; color:#4338ca;">
            <div>1. Project Overview</div><div>2. Recommended Tech Stack</div>
            <div>3. AI Integration Strategy</div><div>4. System Workflow</div>
            <div>5. UI/UX Design System</div><div>6. Database Schema</div>
            <div>7. API Architecture</div><div>8. GitHub Push Guide</div>
            <div>9. Launch & Deployment</div><div>10. Win Secrets</div>
            <div>11. Pitch Deck</div><div>12. Master Prompts</div>
          </div>
        </div>

        ${buildSection('📋', 'Project Overview', reportData.overview, 'overview')}
        ${buildSection('⚡', 'Recommended Tech Stack', reportData.techstack, 'techstack')}
        ${buildSection('🧠', 'AI Integration Strategy', reportData.ai, 'ai')}
        ${buildSection('🔄', 'System Workflow', reportData.workflow, 'workflow')}
        ${buildSection('🎨', 'UI/UX Design System', reportData.uiux, 'uiux')}
        ${buildSection('🗄️', 'Database Schema', reportData.database, 'database')}
        ${buildSection('🔌', 'API Architecture', reportData.apis, 'apis')}
        ${buildSection('🐙', 'GitHub Push Guide', reportData.github, 'github')}
        ${buildSection('🚀', 'Launch & Deployment', reportData.launch, 'launch')}
        ${buildSection('🏆', 'Win Secrets & Strategy', reportData.winsecrets, 'winsecrets')}
        ${buildSection('🎤', 'Pitch Deck', reportData.pitch, 'pitch')}
        ${buildSection('🔥', 'Master Prompts & Add-ons', reportData.prompts, 'prompts')}

        <!-- Footer -->
        <div style="text-align:center; padding:20px; font-size:11px; color:#9ca3af; border-top:1px solid #e5e7eb; margin-top:12px;">
          Generated by Hackathon Master — AI Hackathon Intelligence Platform • Win Every Hackathon
        </div>
      `;

      const opt = {
        margin: [0.4, 0.4, 0.4, 0.4],
        filename: 'HackathonMaster_Blueprint.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      // Show loading state
      btnExport.innerText = '⏳ Generating PDF...';
      btnExport.disabled = true;

      html2pdf().set(opt).from(fullContent).save().then(() => {
        btnExport.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Export as PDF`;
        btnExport.disabled = false;
      });
    });
  }

  // PITCH DECK LOGIC
  const pitchModal = document.getElementById('pitchModal');
  const closePitch = document.getElementById('closePitch');
  const prevSlide = document.getElementById('prevSlide');
  const nextSlide = document.getElementById('nextSlide');
  const slideContent = document.getElementById('slideContent');
  const slideCounter = document.getElementById('slideCounter');
  let currentSlide = 0;
  let slides = [];

  if (btnPresent && pitchModal) {
    btnPresent.addEventListener('click', () => {
      // Create slides from reportData
      slides = [
        { title: "The Problem & Solution", html: reportData.overview.replace(/<[^>]+>/g, ' ').substring(0, 300) + "..." },
        { title: "The Tech Stack", html: "<h1 style='color:#06b6d4;'>Architecture</h1>" + reportData.techstack.substring(0, 250) + "..." },
        { title: "AI Magic", html: "<h1 style='color:#a78bfa;'>Intelligence</h1>" + reportData.ai.substring(0, 250) + "..." },
        { title: "Business Model & Go To Market", html: "<h1 style='color:#10b981;'>Execution</h1>" + reportData.pitch.substring(0, 300) + "..." }
      ];
      
      currentSlide = 0;
      updateSlide();
      pitchModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
    
    closePitch.addEventListener('click', () => {
      pitchModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    
    nextSlide.addEventListener('click', () => {
      if(currentSlide < slides.length - 1) { currentSlide++; updateSlide(); }
    });
    
    prevSlide.addEventListener('click', () => {
      if(currentSlide > 0) { currentSlide--; updateSlide(); }
    });
    
    function updateSlide() {
      slideContent.innerHTML = slides[currentSlide].html;
      slideCounter.innerText = (currentSlide + 1) + " / " + slides.length;
    }
  }
}, 1000); // give DOM time to load
