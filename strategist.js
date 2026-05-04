// strategist.js

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Theme (Reused from app_v2.js logic)
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  if(themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = body.getAttribute('data-theme') === 'light';
      if (isDark) {
        body.removeAttribute('data-theme');
        document.getElementById('moonIcon').style.display = 'block';
        document.getElementById('sunIcon').style.display = 'none';
      } else {
        body.setAttribute('data-theme', 'light');
        document.getElementById('moonIcon').style.display = 'none';
        document.getElementById('sunIcon').style.display = 'block';
      }
    });
  }

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if(hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  // Strategist Core Logic
  const stratProblem = document.getElementById('stratProblem');
  const stratCharCount = document.getElementById('stratCharCount');
  const stratGenerateBtn = document.getElementById('stratGenerateBtn');
  const stratBtnText = document.getElementById('stratBtnText');
  const stratBtnLoading = document.getElementById('stratBtnLoading');
  
  const ctxTheme = document.getElementById('ctxTheme');
  const ctxStack = document.getElementById('ctxStack');
  const ctxTime = document.getElementById('ctxTime');
  const ctxTeam = document.getElementById('ctxTeam');
  
  let currentMode = 'complete';

  // API Key Management
  const apiKeyBanner = document.getElementById('apiKeyBanner');
  const openApiKeyModal = document.getElementById('openApiKeyModal');
  const stratApiModal = document.getElementById('stratApiModal');
  const stratCloseModal = document.getElementById('stratCloseModal');
  const stratSaveKey = document.getElementById('stratSaveKey');
  const stratApiKeyInput = document.getElementById('stratApiKeyInput');

  function checkApiKey() {
    const key = localStorage.getItem('gemini_api_key');
    if (key) {
      apiKeyBanner.classList.add('success');
      apiKeyBanner.innerHTML = `
        <div class="api-key-banner-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span><strong>Gemini AI Active</strong>. Live web search and deep analysis enabled.</span>
        </div>
        <button class="btn-ghost btn-sm" id="clearApiKeyBtn" style="color:#ef4444;">Clear Key</button>
      `;
      document.getElementById('clearApiKeyBtn').addEventListener('click', () => {
        localStorage.removeItem('gemini_api_key');
        location.reload();
      });
    }
  }

  checkApiKey();

  if(openApiKeyModal) {
    openApiKeyModal.addEventListener('click', () => stratApiModal.style.display = 'flex');
  }
  if(stratCloseModal) {
    stratCloseModal.addEventListener('click', () => stratApiModal.style.display = 'none');
  }
  if(stratSaveKey) {
    stratSaveKey.addEventListener('click', () => {
      const key = stratApiKeyInput.value.trim();
      if(key) {
        localStorage.setItem('gemini_api_key', key);
        stratApiModal.style.display = 'none';
        checkApiKey();
        showToast('Gemini API Key saved locally!');
      }
    });
  }

  // Input Handling
  if(stratProblem) {
    stratProblem.addEventListener('input', () => {
      const count = stratProblem.value.length;
      stratCharCount.textContent = count + " / 3000 characters";
      stratGenerateBtn.disabled = count < 20;
    });
  }

  document.querySelectorAll('.example-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      stratProblem.value = chip.getAttribute('data-strat');
      stratProblem.dispatchEvent(new Event('input'));
    });
  });

  document.querySelectorAll('.mode-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.mode-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentMode = pill.getAttribute('data-stratmode');
    });
  });

  // Global var to store latest JSON result
  let latestAnalysisJson = null;

  // Generate Action
  if(stratGenerateBtn) {
    stratGenerateBtn.addEventListener('click', async () => {
      const problem = stratProblem.value;
      if (problem.length < 20) return;

      // UI State
      stratGenerateBtn.disabled = true;
      stratBtnText.style.display = 'none';
      stratBtnLoading.style.display = 'flex';
      document.getElementById('stratOutput').style.display = 'none';
      
      const overlay = document.getElementById('stratOverlay');
      overlay.style.display = 'flex';
      
      const apiKey = localStorage.getItem('gemini_api_key');
      
      // Build Context
      const context = {
        theme: ctxTheme.value || 'Not specified',
        stack: ctxStack.value || 'Not specified',
        time: ctxTime.value || 'Not specified',
        team: ctxTeam.value || 'Not specified',
        mode: currentMode
      };

      try {
        if (apiKey) {
          // Live API Call Phase
          simulateProgressUI(true);
          const result = await callGeminiStrategist(apiKey, problem, context);
          
          if(result && typeof result === 'object' && result.problem_analysis) {
             latestAnalysisJson = result;
             renderStrategyJSON(result);
             completeProgressUI();
          } else {
             throw new Error("Invalid JSON returned from AI");
          }
        } else {
          // Offline Fallback Phase
          simulateProgressUI(false);
          setTimeout(() => {
            const fallbackResult = generateFallbackJSON(problem, context);
            latestAnalysisJson = fallbackResult;
            renderStrategyJSON(fallbackResult);
            
            // Add a clear warning that this is offline data
            const pitchBanner = document.getElementById('stratPitchBanner');
            const warningHtml = `<div style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; border-radius: 8px; padding: 10px; margin-bottom: 15px; font-size: 0.9rem; color: #fca5a5;">
              <strong>⚠️ OFFLINE SIMULATION MODE:</strong> The output below is a generic simulation because no API Key was provided. To get LIVE Web Search results (like real GitHub repos and dynamic market research), please click "Set API Key" at the top of the page.
            </div>`;
            pitchBanner.insertAdjacentHTML('beforebegin', warningHtml);
            
            completeProgressUI();
          }, 3500); // simulate delay
        }
      } catch (err) {
        console.error("Analysis failed:", err);
        showToast("Error: " + err.message);
        overlay.style.display = 'none';
        resetBtnState();
      }
    });
  }

  function simulateProgressUI(isLive) {
    const steps = ['sstep1', 'sstep2', 'sstep3', 'sstep4', 'sstep5'];
    const bar = document.getElementById('stratProgressBar');
    const label = document.getElementById('stratProgressLabel');
    
    // Reset
    steps.forEach(id => {
      const el = document.getElementById(id);
      el.classList.remove('active', 'completed');
      el.querySelector('.step-dot').innerHTML = '';
    });
    bar.style.width = '0%';
    
    let current = 0;
    const intervalTime = isLive ? 2000 : 700; // Fake progress speed
    
    window.stratProgressInterval = setInterval(() => {
      if (current > 0) {
        const prev = document.getElementById(steps[current-1]);
        prev.classList.remove('active');
        prev.classList.add('completed');
        prev.querySelector('.step-dot').innerHTML = '✓';
      }
      
      if (current < steps.length) {
        const curr = document.getElementById(steps[current]);
        curr.classList.add('active');
        curr.querySelector('.step-dot').innerHTML = '•';
        
        bar.style.width = ((current + 1) * 20) + '%';
        if(isLive && current === 1) label.innerText = "Querying live search for competitors...";
        if(isLive && current === 3) label.innerText = "Generating JSON object...";
        
        current++;
      } else {
        clearInterval(window.stratProgressInterval);
      }
    }, intervalTime);
  }

  function completeProgressUI() {
    clearInterval(window.stratProgressInterval);
    document.getElementById('stratProgressBar').style.width = '100%';
    
    setTimeout(() => {
      document.getElementById('stratOverlay').style.display = 'none';
      const output = document.getElementById('stratOutput');
      output.style.display = 'block';
      output.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      resetBtnState();
      showToast('Strategic Analysis Complete!');
    }, 500);
  }

  function resetBtnState() {
    stratGenerateBtn.disabled = false;
    stratBtnText.style.display = 'flex';
    stratBtnLoading.style.display = 'none';
  }

  // --- API CALL FUNCTION ---
  async function callGeminiStrategist(apiKey, problem, ctx) {
    const systemPrompt = `You are an elite Hackathon Solution Strategist, Product Architect, and Prompt Engineer.
    
    User Problem Statement: "${problem}"
    Context:
    - Theme: ${ctx.theme}
    - Stack: ${ctx.stack}
    - Time Limit: ${ctx.time}
    - Team: ${ctx.team}
    
    Analyze the problem deeply. YOU MUST use the Google Search tool to research the current market, find REAL GitHub repositories, and discover active APIs related to the problem. Do not hallucinate repos; find real ones.
    Generate the absolute BEST, most innovative, and demo-friendly add-ons based on live internet data. 
    Write master-level prompts for Cursor/Bolt.new.
    
    You MUST output valid JSON ONLY, strictly matching this exact schema:
    {
      "problem_analysis": {
        "refined_problem": "...",
        "target_users": ["...", "..."],
        "core_pain_points": ["...", "..."],
        "market_gap": "...",
        "winning_product_direction": "..."
      },
      "research_insights": {
        "existing_solution_patterns": ["..."],
        "common_weaknesses": ["..."],
        "emerging_opportunities": ["..."],
        "useful_tools_apis": [ { "name": "...", "type": "...", "why_it_matters": "..." } ]
      },
      "best_addons": [
        {
          "addon_name": "...",
          "category": "AI",
          "what_it_does": "...",
          "why_it_improves_the_solution": "...",
          "hackathon_value": "...",
          "implementation_difficulty": "Easy",
          "estimated_build_time": "...",
          "recommended_stack": "...",
          "apis_or_tools": ["..."],
          "demo_impact_score": 9,
          "judge_wow_score": 9
        }
        // exactly 10 high-quality addons
      ],
      "top_5_priority_addons": [ { "rank": 1, "addon_name": "...", "reason": "..." } ],
      "feature_ideas": {
        "must_have_features": ["..."],
        "nice_to_have_features": ["..."],
        "future_scope": ["..."]
      },
      "prompt_pack": {
        "master_build_prompt": "...",
        "frontend_ui_prompt": "...",
        "backend_api_prompt": "...",
        "database_prompt": "...",
        "ai_integration_prompt": "...",
        "pitch_demo_prompt": "..."
      },
      "judge_strategy": {
        "wow_factor": "...",
        "best_demo_flow": ["...", "..."],
        "business_angle": "...",
        "social_or_market_impact": "...",
        "one_line_winning_pitch": "..."
      }
    }`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        tools: [{ googleSearch: {} }]
      })
    });
    
    if(!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "API Network Error");
    }
    
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    try {
      return JSON.parse(text);
    } catch(e) {
      // Fallback regex extraction if model wraps in markdown
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if(jsonMatch) return JSON.parse(jsonMatch[0]);
      throw e;
    }
  }

  // --- RENDER JSON TO UI ---
  function renderStrategyJSON(data) {
    const contentBox = document.getElementById('stratContent');
    const pitchBanner = document.getElementById('stratPitchBanner');
    
    // Set Pitch Banner
    pitchBanner.innerText = `"${data.judge_strategy.one_line_winning_pitch}"`;

    // Build Tabs HTML
    const htmlMap = {
      analysis: buildAnalysisHTML(data.problem_analysis),
      research: buildResearchHTML(data.research_insights),
      addons: buildAddonsHTML(data.best_addons),
      priority: buildPriorityHTML(data.top_5_priority_addons, data.best_addons),
      features: buildFeaturesHTML(data.feature_ideas),
      prompts: buildPromptsHTML(data.prompt_pack),
      judge: buildJudgeHTML(data.judge_strategy)
    };

    contentBox.innerHTML = '';
    
    Object.keys(htmlMap).forEach(key => {
      const section = document.createElement('div');
      section.className = `output-section ${key === 'analysis' ? 'active' : ''}`;
      section.id = `stab-${key}`;
      section.innerHTML = htmlMap[key];
      contentBox.appendChild(section);
    });

    // Handle Tab Clicks
    const tabs = document.querySelectorAll('#stratTabs .tab-btn');
    tabs.forEach(tab => {
      // Remove old listeners by cloning
      const newTab = tab.cloneNode(true);
      tab.parentNode.replaceChild(newTab, tab);
      
      newTab.addEventListener('click', () => {
        document.querySelectorAll('#stratTabs .tab-btn').forEach(t => t.classList.remove('active'));
        newTab.classList.add('active');
        const targetId = `stab-${newTab.getAttribute('data-stab')}`;
        document.querySelectorAll('#stratContent .output-section').forEach(s => s.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
      });
    });

    // Copy prompt buttons
    document.querySelectorAll('.copy-prompt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const textToCopy = e.target.closest('.prompt-box').querySelector('.prompt-body').innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
          const orig = e.target.innerHTML;
          e.target.innerHTML = 'Copied!';
          setTimeout(() => e.target.innerHTML = orig, 2000);
        });
      });
    });
  }

  // --- HTML BUILDERS ---
  function buildAnalysisHTML(data) {
    return `
      <h3>🎯 Problem Refinement & Direction</h3>
      <div class="strat-addon-card" style="margin-bottom: 1.5rem; border-color: var(--accent-primary);">
        <h4 style="color:var(--accent-primary); margin-bottom:0.5rem;">Winning Product Direction</h4>
        <p style="font-size:1.1rem; font-weight:500;">${data.winning_product_direction}</p>
      </div>
      
      <div class="card-grid">
        <div class="info-card">
          <h4>Refined Problem</h4>
          <p>${data.refined_problem}</p>
        </div>
        <div class="info-card">
          <h4>Market Gap Opportunity</h4>
          <p>${data.market_gap}</p>
        </div>
      </div>

      <h4 style="margin-top:2rem; margin-bottom:1rem;">Core Pain Points Addressed</h4>
      <ul style="padding-left:1.5rem;">
        ${data.core_pain_points.map(p => `<li style="margin-bottom:0.5rem;">${p}</li>`).join('')}
      </ul>
      <h4 style="margin-top:1.5rem; margin-bottom:1rem;">Target Users</h4>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        ${data.target_users.map(u => `<span class="badge" style="background:rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.2); padding:6px 12px;">${u}</span>`).join('')}
      </div>
    `;
  }

  function buildResearchHTML(data) {
    return `
      <h3>🔬 Market Research & Integrations</h3>
      <div class="card-grid">
        <div class="info-card">
          <h4>Common Weaknesses in Current Solutions</h4>
          <ul style="padding-left:1.5rem; margin-top:0.5rem;">
            ${data.common_weaknesses.map(w => `<li style="color:#ef4444; margin-bottom:0.5rem;">${w}</li>`).join('')}
          </ul>
        </div>
        <div class="info-card">
          <h4>Emerging Opportunities</h4>
          <ul style="padding-left:1.5rem; margin-top:0.5rem;">
            ${data.emerging_opportunities.map(o => `<li style="color:#10b981; margin-bottom:0.5rem;">${o}</li>`).join('')}
          </ul>
        </div>
      </div>

      <h4 style="margin-top:2rem; margin-bottom:1rem;">Recommended APIs & SDKs to Integrate</h4>
      <div class="strat-card-list">
        ${data.useful_tools_apis.map(tool => `
          <div class="info-card" style="background:rgba(0,0,0,0.3);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
              <h5 style="margin:0; font-size:1.1rem; color:var(--accent-secondary);">${tool.name}</h5>
              <span class="meta-chip">${tool.type}</span>
            </div>
            <p style="font-size:0.85rem;">${tool.why_it_matters}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  function buildAddonsHTML(addons) {
    if(!addons || !addons.length) return `<p>No addons generated.</p>`;
    
    return `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h3>🧩 10 High-Impact Add-ons</h3>
        <span style="font-size:0.85rem; color:var(--text-muted);">Features that make judges say WOW</span>
      </div>
      
      <div class="strat-card-list">
        ${addons.map(addon => `
          <div class="strat-addon-card">
            <span class="addon-badge">${addon.implementation_difficulty}</span>
            <div class="addon-cat">${addon.category}</div>
            <h4 class="addon-title">${addon.addon_name}</h4>
            <p class="addon-desc"><strong>What it does:</strong> ${addon.what_it_does}</p>
            <p class="addon-desc"><strong>Why it wins:</strong> ${addon.hackathon_value}</p>
            
            <div class="score-row">
              <span class="score-label">Judge Wow</span>
              <div class="score-bar-bg"><div class="score-bar-fill" style="width:${(addon.judge_wow_score/10)*100}%"></div></div>
              <span class="score-value">${addon.judge_wow_score}/10</span>
            </div>
            <div class="score-row">
              <span class="score-label">Demo Impact</span>
              <div class="score-bar-bg"><div class="score-bar-fill" style="width:${(addon.demo_impact_score/10)*100}%"></div></div>
              <span class="score-value">${addon.demo_impact_score}/10</span>
            </div>

            <div class="addon-meta">
              <span class="meta-chip">⏱️ ${addon.estimated_build_time}</span>
              ${addon.apis_or_tools ? addon.apis_or_tools.map(t => `<span class="meta-chip">🔌 ${t}</span>`).join('') : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function buildPriorityHTML(top5, allAddons) {
    if(!top5 || !top5.length) return `<p>Data missing</p>`;
    
    return `
      <h3>⚡ Top 5 Priority Build List</h3>
      <p style="margin-bottom:2rem; color:var(--text-secondary);">If you only have time to build a few things, build these. They offer the highest ROI for your demo.</p>
      
      <div style="display:flex; flex-direction:column; gap:1rem;">
        ${top5.map(item => {
          // Find full details if possible
          const fullData = allAddons ? allAddons.find(a => a.addon_name === item.addon_name) : null;
          return `
          <div class="info-card" style="display:flex; gap:1.5rem; align-items:center; background:linear-gradient(to right, rgba(255,255,255,0.05), transparent);">
            <div style="font-size:2.5rem; font-weight:800; color:var(--accent-primary); opacity:0.8; line-height:1;">#${item.rank}</div>
            <div>
              <h4 style="margin-bottom:0.25rem; font-size:1.2rem;">${item.addon_name}</h4>
              <p style="color:var(--text-secondary); font-size:0.9rem;"><strong>Strategy:</strong> ${item.reason}</p>
              ${fullData ? `<p style="font-size:0.8rem; margin-top:0.5rem; color:#10b981;">Stack: ${fullData.recommended_stack}</p>` : ''}
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function buildFeaturesHTML(data) {
    return `
      <h3>✅ Feature Priority Matrix</h3>
      <div class="card-grid" style="grid-template-columns: 1fr 1fr 1fr; margin-top:1.5rem;">
        
        <div class="info-card" style="border-top: 4px solid #ef4444;">
          <h4>Must Have (MVP)</h4>
          <ul style="padding-left:1.5rem; margin-top:1rem; font-size:0.9rem;">
            ${data.must_have_features.map(f => `<li style="margin-bottom:0.5rem;">${f}</li>`).join('')}
          </ul>
        </div>
        
        <div class="info-card" style="border-top: 4px solid #a78bfa;">
          <h4>Nice to Have (If Time Permits)</h4>
          <ul style="padding-left:1.5rem; margin-top:1rem; font-size:0.9rem;">
            ${data.nice_to_have_features.map(f => `<li style="margin-bottom:0.5rem;">${f}</li>`).join('')}
          </ul>
        </div>
        
        <div class="info-card" style="border-top: 4px solid #64748b;">
          <h4>Future Scope (Mention in Pitch)</h4>
          <ul style="padding-left:1.5rem; margin-top:1rem; font-size:0.9rem; color:var(--text-secondary);">
            ${data.future_scope.map(f => `<li style="margin-bottom:0.5rem;">${f}</li>`).join('')}
          </ul>
        </div>

      </div>
    `;
  }

  function buildPromptsHTML(prompts) {
    const keys = [
      { id: 'master_build_prompt', title: '🚀 Master AI Build Prompt (Bolt.new / Cursor)' },
      { id: 'frontend_ui_prompt', title: '🎨 Frontend & UI/UX Prompt' },
      { id: 'backend_api_prompt', title: '⚙️ Backend & API Prompt' },
      { id: 'database_prompt', title: '🗄️ Database Schema Prompt' },
      { id: 'ai_integration_prompt', title: '🧠 AI Logic / Integration Prompt' },
      { id: 'pitch_demo_prompt', title: '🎤 Pitch & Demo Script Prompt' }
    ];

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <h3>🔥 AI Generation Prompt Pack</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary);">Copy these exactly into your AI coding assistants.</p>
      </div>

      ${keys.map(k => {
        if(!prompts[k.id]) return '';
        return `
        <div class="prompt-box">
          <div class="prompt-header">
            <h4>${k.title}</h4>
            <button class="btn-outline btn-sm copy-prompt-btn" style="padding:0.25rem 0.75rem; font-size:0.75rem;">Copy</button>
          </div>
          <div class="prompt-body">${prompts[k.id]}</div>
        </div>
        `;
      }).join('')}
    `;
  }

  function buildJudgeHTML(data) {
    return `
      <h3>🏆 Judge Presentation Strategy</h3>
      
      <div class="info-card" style="background:rgba(167, 139, 250, 0.1); border-color:var(--accent-primary); margin-bottom:1.5rem;">
        <h4 style="color:var(--accent-primary);">The "Wow Factor"</h4>
        <p style="font-size:1.05rem;">${data.wow_factor}</p>
      </div>

      <div class="card-grid" style="margin-bottom:1.5rem;">
        <div class="info-card">
          <h4>💼 Business Viability Angle</h4>
          <p>${data.business_angle}</p>
        </div>
        <div class="info-card">
          <h4>🌍 Market / Social Impact</h4>
          <p>${data.social_or_market_impact}</p>
        </div>
      </div>

      <h4>Optimal Demo Flow (2 Minutes)</h4>
      <div style="background:rgba(0,0,0,0.3); border-radius:12px; padding:1.5rem; margin-top:1rem; border:1px solid rgba(255,255,255,0.05);">
        <ol style="margin:0; padding-left:1.5rem;">
          ${data.best_demo_flow.map(step => `<li style="margin-bottom:1rem; line-height:1.5;">${step}</li>`).join('')}
        </ol>
      </div>
    `;
  }

  // Fallback JSON Generator (Hardcoded intelligent response if no API key)
  function generateFallbackJSON(problem, ctx) {
    const text = problem.toLowerCase();
    
    // Default Web3 / Gen Tech Addons
    let addons = [
      {
        "addon_name": "Magic One-Click Summary",
        "category": "AI",
        "what_it_does": "Instantly summarizes complex data into actionable insights using an LLM.",
        "why_it_improves_the_solution": "Shows immediate AI value without complex user flows.",
        "hackathon_value": "Highly demo-able. Looks like magic on screen.",
        "implementation_difficulty": "Easy",
        "estimated_build_time": "1 hour",
        "recommended_stack": "Next.js API route + OpenAI SDK",
        "apis_or_tools": ["OpenAI / Gemini"],
        "demo_impact_score": 9,
        "judge_wow_score": 8
      },
      {
        "addon_name": "Real-time Collaboration Cursor",
        "category": "Collaboration",
        "what_it_does": "Shows multiple users interacting on the same screen (like Figma).",
        "why_it_improves_the_solution": "Proves the app is enterprise-ready and scalable.",
        "hackathon_value": "Judges love multiplayer features. It guarantees high technical scores.",
        "implementation_difficulty": "Medium",
        "estimated_build_time": "2 hours",
        "recommended_stack": "Liveblocks or Supabase Presence",
        "apis_or_tools": ["Liveblocks"],
        "demo_impact_score": 10,
        "judge_wow_score": 9
      }
    ];
    let insights = ["Basic CRUD dashboards", "Siloed data systems"];
    let marketGap = "Current solutions lack predictive AI capabilities and seamless modern integrations.";

    if (text.includes('health') || text.includes('med')) {
      addons[0] = {
        "addon_name": "Symptom Checker Chatbot",
        "category": "AI",
        "what_it_does": "Conversational AI that triages symptoms before showing results.",
        "why_it_improves_the_solution": "Modernizes the patient intake experience.",
        "hackathon_value": "Judges love healthcare bots. Easy to demo.",
        "implementation_difficulty": "Medium",
        "estimated_build_time": "3 hours",
        "recommended_stack": "Gemini API + React Chat Component",
        "apis_or_tools": ["Gemini 2.0"],
        "demo_impact_score": 9,
        "judge_wow_score": 9
      };
      marketGap = "Healthcare systems are usually too hard for elderly users to navigate.";
      insights = ["Complex hospital portals", "WebMD generic searches"];
    } else if (text.includes('fin') || text.includes('money') || text.includes('crypto')) {
      addons[0] = {
        "addon_name": "Real-time Transaction Simulator",
        "category": "FinTech",
        "what_it_does": "Shows live mock money transfers across the screen.",
        "why_it_improves_the_solution": "Makes the financial app feel alive.",
        "hackathon_value": "Dynamic visuals always score higher.",
        "implementation_difficulty": "Hard",
        "estimated_build_time": "4 hours",
        "recommended_stack": "WebSockets + Framer Motion",
        "apis_or_tools": ["Plaid API (Mock)"],
        "demo_impact_score": 10,
        "judge_wow_score": 9
      };
      marketGap = "Financial apps often lack real-time transparent tracking.";
      insights = ["Legacy banking apps", "Complex crypto exchanges"];
    }

    return {
      "problem_analysis": {
        "refined_problem": "A streamlined, intelligent solution targeting: " + problem.substring(0, 50) + "...",
        "target_users": ["Primary Stakeholders", "End Consumers", "System Admins"],
        "core_pain_points": ["Manual data entry and inefficiency", "Lack of real-time insights", "Poor user experience in legacy tools"],
        "market_gap": marketGap,
        "winning_product_direction": "An AI-first, mobile-responsive web app with real-time data synchronization."
      },
      "research_insights": {
        "existing_solution_patterns": insights,
        "common_weaknesses": ["No offline support", "Clunky UI/UX", "High latency"],
        "emerging_opportunities": ["Edge AI processing", "Automated RAG workflows"],
        "useful_tools_apis": [
          {"name": "Supabase", "type": "Backend/DB", "why_it_matters": "Instant real-time Postgres and Auth."},
          {"name": "Groq", "type": "LLM API", "why_it_matters": "Blazing fast inference for demo magic."}
        ]
      },
      "best_addons": addons,
      "top_5_priority_addons": [
        {"rank": 1, "addon_name": addons[0].addon_name, "reason": "Fastest way to integrate AI."},
        {"rank": 2, "addon_name": addons[1].addon_name, "reason": "Highest technical wow factor."}
      ],
      "feature_ideas": {
        "must_have_features": ["User Authentication", "Core Data Input Form", "Result Dashboard"],
        "nice_to_have_features": ["Dark/Light Mode Toggle", "Export to PDF"],
        "future_scope": ["Native iOS/Android App", "Enterprise SSO integration"]
      },
      "prompt_pack": {
        "master_build_prompt": "Act as an expert Next.js and Tailwind developer. Build a modern web application for: " + problem + ". Use shadcn/ui components, Framer Motion for animations, and a dark theme. Create the entire UI layout including a sidebar navigation, a hero dashboard, and a settings page.",
        "frontend_ui_prompt": "Create a responsive, glassmorphism-styled dashboard using React and Tailwind CSS.",
        "backend_api_prompt": "Write a Node.js Express server with robust error handling for this idea.",
        "database_prompt": "Generate a Prisma schema file supporting Users, Posts, and Analytics.",
        "ai_integration_prompt": "Write a TypeScript function that calls the Gemini API to analyze text.",
        "pitch_demo_prompt": "Write a 2-minute energetic hackathon pitch script."
      },
      "judge_strategy": {
        "wow_factor": "The moment the data automatically formats and visualizes itself in real-time.",
        "best_demo_flow": [
          "Start at the problem: Show how annoying the manual process is.",
          "Introduce the solution: Log in and show the clean dashboard.",
          "The Magic Trick: Perform the core AI action live.",
          "The Future: Show the analytics page and end on the business model."
        ],
        "business_angle": "B2B SaaS model with tiered pricing based on API usage.",
        "social_or_market_impact": "Significantly reduces wasted hours and improves accessibility.",
        "one_line_winning_pitch": "We're turning a 5-hour manual headache into a 5-second automated delight."
      }
    };
  }

  // Export & Utility functions
  const stratCopyJson = document.getElementById('stratCopyJson');
  if(stratCopyJson) {
    stratCopyJson.addEventListener('click', () => {
      if(latestAnalysisJson) {
        navigator.clipboard.writeText(JSON.stringify(latestAnalysisJson, null, 2))
          .then(() => showToast('JSON Copied to Clipboard!'));
      }
    });
  }

  const stratExportPDF = document.getElementById('stratExportPDF');
  if(stratExportPDF) {
    stratExportPDF.addEventListener('click', () => {
      showToast("Preparing PDF export...");
      const content = document.getElementById('stratContent').cloneNode(true);
      // Simplify styling for PDF
      content.style.background = 'white';
      content.style.color = 'black';
      content.style.padding = '20px';
      
      const opt = {
        margin:       0.5,
        filename:     'Hackathon_Strategy.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      if(typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(content).save().then(() => showToast("PDF Downloaded!"));
      } else {
        showToast("PDF Library not loaded.");
      }
    });
  }

  const stratReanalyze = document.getElementById('stratReanalyze');
  if(stratReanalyze) {
    stratReanalyze.addEventListener('click', () => {
      document.getElementById('stratOutput').style.display = 'none';
      stratGenerateBtn.click();
    });
  }

  // Toast utility
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
});
