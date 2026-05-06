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
  const serperApiKeyInput = document.getElementById('serperApiKeyInput');

  function checkApiKey() {
    const key = localStorage.getItem('gemini_api_key');
    const serperKey = localStorage.getItem('serper_api_key');
    
    if (key || serperKey) {
      apiKeyBanner.classList.add('success');
      apiKeyBanner.style.border = '1px solid var(--accent-primary)';
      
      let statusHtml = `
        <div class="api-key-banner-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>
            <strong>Status:</strong> 
            ${key ? '<span style="color:#10b981;">Gemini AI Active</span>' : '<span style="color:#f59e0b;">Gemini Missing (Using Offline Mode)</span>'} 
            | 
            ${serperKey ? '<span style="color:#10b981;">Deep Search Active</span>' : '<span style="color:#f59e0b;">Deep Search Inactive</span>'}
          </span>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn-outline btn-sm" id="openApiKeyModal">Settings</button>
          <button class="btn-ghost btn-sm" id="clearApiKeyBtn" style="color:#ef4444;">Clear All</button>
        </div>
      `;
      
      apiKeyBanner.innerHTML = statusHtml;
      
      document.getElementById('clearApiKeyBtn').addEventListener('click', () => {
        localStorage.removeItem('gemini_api_key');
        localStorage.removeItem('serper_api_key');
        location.reload();
      });
      
      document.getElementById('openApiKeyModal').addEventListener('click', () => stratApiModal.style.display = 'flex');
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
      const sKey = serperApiKeyInput.value.trim();
      
      if(key) localStorage.setItem('gemini_api_key', key);
      if(sKey) localStorage.setItem('serper_api_key', sKey);
      
      stratApiModal.style.display = 'none';
      checkApiKey();
      showToast('API Settings saved locally!');
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

  // Check for preset project from other pages
  const preset = localStorage.getItem('presetProject');
  if (preset && stratProblem) {
    stratProblem.value = preset;
    // Trigger input event to update char count and button state
    stratProblem.dispatchEvent(new Event('input'));
    localStorage.removeItem('presetProject');
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
      const serperKey = localStorage.getItem('serper_api_key');
      
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
          
          let searchData = null;
          if (serperKey) {
            document.getElementById('stratProgressLabel').innerText = "Running Deep Search (Serper.dev)...";
            searchData = await window.SerperProvider.deepResearch(problem, serperKey);
          }

          const result = await callGeminiStrategist(apiKey, problem, context, searchData);
          
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
  async function callGeminiStrategist(apiKey, problem, ctx, searchData = null) {
    let researchContext = "";
    if (searchData) {
      researchContext = `
      CRITICAL RESEARCH DATA (From Serper.dev Deep Search):
      ${searchData.aggregatedSnippets}
      
      PEOPLE ALSO ASK:
      ${searchData.aggregatedPAA.map(p => p.question).join(", ")}
      `;
    }

    const systemPrompt = `You are a world-class AI Hackathon Strategist and Intelligent Search Engine. Provide high-quality, structured, and concise outputs while minimizing token usage.

    User Problem Statement: "${problem}"
    Context: Theme: ${ctx.theme}, Stack: ${ctx.stack}, Time: ${ctx.time}, Team: ${ctx.team}
    
    ${researchContext}

    INSTRUCTIONS:
    1. UNDERSTAND: Refine problem in 1-2 lines.
    2. CORE SOLUTION: Direct implementation-focused approach.
    3. SMART BREAKDOWN: Divide into Frontend, Backend, AI Integration, Database.
    4. ADD-ONS: MAX 5 ONLY. High-impact, non-generic.
    5. EXECUTION: Max 6 steps.
    6. WINNING EDGE: 3 bullet points.

    STRICT RULES:
    - JSON ONLY. No emojis, no fluff, no storytelling. 
    - NO MULTILINE STRINGS. You MUST escape all newlines as \\n inside strings.
    - Under 600 words total. Bullet points preferred.
    
    SCHEMA:
    {
      "problem_analysis": {
        "refined_problem": "...",
        "target_users": ["..."],
        "core_pain_points": ["..."],
        "market_gap": "...",
        "winning_product_direction": "..."
      },
      "research_insights": {
        "existing_solution_patterns": ["..."],
        "common_weaknesses": ["..."],
        "emerging_opportunities": ["..."],
        "useful_tools_apis": [{ "name": "...", "type": "...", "why_it_matters": "..." }]
      },
      "best_addons": [
        { "addon_name": "...", "category": "...", "what_it_does": "...", "why_it_improves_the_solution": "...", "hackathon_value": "...", "implementation_difficulty": "...", "estimated_build_time": "...", "recommended_stack": "...", "apis_or_tools": ["..."], "demo_impact_score": 9, "judge_wow_score": 9 }
      ],
      "top_5_priority_addons": [
        { "rank": 1, "addon_name": "...", "reason": "..." }
      ],
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
        "best_demo_flow": ["..."],
        "business_angle": "...",
        "social_or_market_impact": "...",
        "one_line_winning_pitch": "..."
      },
      "prd": {
        "project_name": "...",
        "vision": "...",
        "user_personas": ["..."],
        "core_features": [{ "feature": "...", "priority": "P0", "description": "..." }],
        "technical_requirements": { "frontend": "...", "backend": "...", "database": "...", "integrations": ["..."] },
        "success_metrics": ["..."],
        "roadmap": ["..."]
      }
    }`;

    // Retry logic for Gemini API (Exponential Backoff)
    let retries = 3;
    let delay = 2000;
    let response;
    let lastError = "";

    while (retries > 0) {
      try {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            tools: searchData ? [] : [{ google_search: {} }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 8192, responseMimeType: "application/json" }
          })
        });

        if (response.status === 429 || response.status === 503) {
          const errData = await response.json().catch(() => ({}));
          lastError = errData.error?.message || "Model Overloaded";
          throw new Error("High Demand");
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error?.message || "API Network Error");
        }

        // If we reach here, response is OK
        break; 
      } catch (err) {
        if (err.message === "High Demand") {
          retries--;
          if (retries === 0) throw new Error(lastError);
          showToast(`Model busy, retrying in ${delay/1000}s... (${retries} attempts left)`);
          await new Promise(res => setTimeout(res, delay));
          delay *= 2;
        } else {
          throw err;
        }
      }
    }
    
    const data = await response.json();
    
    // When Google Search grounding is active, the response may contain multiple parts.
    // We must gather ALL text parts and concatenate them instead of assuming parts[0] has text.
    const candidate = data.candidates[0];
    if (!candidate) throw new Error("No response candidates returned from API.");
    
    const allText = (candidate.content?.parts || [])
      .filter(p => p.text)
      .map(p => p.text)
      .join('');
    
    if (!allText) throw new Error("API returned an empty response. Please try again.");
    
    // Extract JSON from the full text (model may wrap in markdown code blocks)
    const jsonMatch = allText.match(/\{[\s\S]*\}/);
    
    // Function to safely escape unescaped newlines/tabs inside JSON string literals
    const sanitizeJsonString = (str) => {
      let inString = false;
      let escapeNext = false;
      let res = '';
      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (escapeNext) { res += char; escapeNext = false; continue; }
        if (char === '\\') { escapeNext = true; res += char; continue; }
        if (char === '"') { inString = !inString; res += char; continue; }
        if (inString && char === '\n') { res += '\\n'; continue; }
        if (inString && char === '\t') { res += '\\t'; continue; }
        if (inString && char === '\r') { res += '\\r'; continue; }
        res += char;
      }
      return res;
    };

    if (jsonMatch) {
      try {
        const sanitized = sanitizeJsonString(jsonMatch[0]);
        return JSON.parse(sanitized);
      } catch (e) {
        console.warn("Regex matched but JSON parse failed, falling back to clean text", e);
      }
    }
    
    // Try direct parse as last resort, stripping markdown if present
    const cleanText = allText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(sanitizeJsonString(cleanText));
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
      judge: buildJudgeHTML(data.judge_strategy),
      prd: buildPRDHTML(data.prd || {})
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

    // PRD Download Handling
    const downloadPrdBtn = document.getElementById('downloadPrdBtn');
    if(downloadPrdBtn) {
      downloadPrdBtn.addEventListener('click', () => {
        showToast("Generating PRD File...");
        
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '0';
        tempDiv.style.top = '0';
        tempDiv.style.width = '800px'; 
        tempDiv.style.zIndex = '-9999';
        tempDiv.style.background = 'white';
        document.body.appendChild(tempDiv);

        const prdElement = document.getElementById('prdDoc').cloneNode(true);
        prdElement.style.padding = '60px';
        prdElement.style.background = 'white';
        prdElement.style.boxShadow = 'none';
        prdElement.style.border = 'none';
        tempDiv.appendChild(prdElement);
        
        // Final styling for clean PDF export
        prdElement.querySelectorAll('h1').forEach(h => {
          h.style.color = '#a78bfa';
          h.style.fontSize = '36px';
        });
        prdElement.querySelectorAll('h4').forEach(h => {
          h.style.color = '#a78bfa';
          h.style.borderBottom = '2px solid #f1f5f9';
          h.style.paddingBottom = '10px';
          h.style.marginTop = '40px';
        });

        prdElement.querySelectorAll('table').forEach(t => {
           t.style.pageBreakInside = 'avoid';
           t.querySelectorAll('th').forEach(th => th.style.background = '#f8fafc');
        });

        const opt = {
          margin:       0,
          filename:     'Product_Requirements_Document.pdf',
          image:        { type: 'jpeg', quality: 1.0 },
          html2canvas:  { scale: 2, width: 800 },
          jsPDF:        { unit: 'px', format: [800, 1050], orientation: 'portrait' }
        };

        if(typeof html2pdf !== 'undefined') {
          html2pdf().set(opt).from(prdElement).save().then(() => {
            showToast("PRD Downloaded!");
            document.body.removeChild(tempDiv);
          });
        } else {
          showToast("PDF Library not loaded.");
          document.body.removeChild(tempDiv);
        }
      });
    }
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

  function buildPRDHTML(prd) {
    if(!prd || !prd.project_name) return `<p>PRD data not available.</p>`;
    
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem;">
        <h3>📄 Product Requirements Document (PRD)</h3>
        <button class="btn-primary" id="downloadPrdBtn" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.5rem;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          DOWNLOAD THE PRD FILE
        </button>
      </div>

      <div id="prdDoc" style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:20px; padding:3rem; color:var(--text-primary); line-height:1.6; max-width:900px; margin:0 auto; box-shadow:var(--shadow-lg);">
        <div style="text-align:center; border-bottom:2px solid var(--accent-primary); padding-bottom:2rem; margin-bottom:3rem;">
          <h1 style="font-size:2.5rem; margin-bottom:0.5rem;">${prd.project_name}</h1>
          <p style="color:var(--text-secondary); font-size:1.1rem;">Product Requirements Document (PRD)</p>
          <p style="font-size:0.9rem; margin-top:1rem; opacity:0.7;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <section style="margin-bottom:2.5rem;">
          <h4 style="color:var(--accent-primary); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.5rem; margin-bottom:1rem;">1. PRODUCT VISION</h4>
          <p>${prd.vision}</p>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h4 style="color:var(--accent-primary); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.5rem; margin-bottom:1rem;">2. USER PERSONAS</h4>
          <ul style="padding-left:1.5rem;">
            ${prd.user_personas.map(u => `<li style="margin-bottom:0.5rem;">${u}</li>`).join('')}
          </ul>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h4 style="color:var(--accent-primary); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.5rem; margin-bottom:1rem;">3. CORE FEATURES (MVP)</h4>
          <table style="width:100%; border-collapse:collapse; margin-top:1rem;">
            <thead>
              <tr style="background:rgba(255,255,255,0.05); text-align:left;">
                <th style="padding:12px; border:1px solid rgba(255,255,255,0.1);">Feature</th>
                <th style="padding:12px; border:1px solid rgba(255,255,255,0.1);">Priority</th>
                <th style="padding:12px; border:1px solid rgba(255,255,255,0.1);">Description</th>
              </tr>
            </thead>
            <tbody>
              ${prd.core_features.map(f => `
                <tr>
                  <td style="padding:12px; border:1px solid rgba(255,255,255,0.1); font-weight:600;">${f.feature}</td>
                  <td style="padding:12px; border:1px solid rgba(255,255,255,0.1);"><span style="padding:2px 8px; border-radius:4px; font-size:0.75rem; background:${f.priority === 'P0' ? '#ef4444' : '#f59e0b'}; color:white;">${f.priority}</span></td>
                  <td style="padding:12px; border:1px solid rgba(255,255,255,0.1); font-size:0.9rem;">${f.description}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h4 style="color:var(--accent-primary); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.5rem; margin-bottom:1rem;">4. TECHNICAL REQUIREMENTS</h4>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:1rem;">
            <div>
              <p><strong>Frontend:</strong> ${prd.technical_requirements.frontend}</p>
              <p><strong>Backend:</strong> ${prd.technical_requirements.backend}</p>
            </div>
            <div>
              <p><strong>Database:</strong> ${prd.technical_requirements.database}</p>
              <p><strong>Integrations:</strong> ${prd.technical_requirements.integrations.join(', ')}</p>
            </div>
          </div>
        </section>

        <section style="margin-bottom:2.5rem;">
          <h4 style="color:var(--accent-primary); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.5rem; margin-bottom:1rem;">5. SUCCESS METRICS</h4>
          <ul style="padding-left:1.5rem;">
            ${prd.success_metrics.map(m => `<li style="margin-bottom:0.5rem;">${m}</li>`).join('')}
          </ul>
        </section>

        <section>
          <h4 style="color:var(--accent-primary); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.5rem; margin-bottom:1rem;">6. DEVELOPMENT ROADMAP</h4>
          <ul style="list-style:none; padding:0;">
            ${prd.roadmap.map((step, i) => `
              <li style="display:flex; gap:1rem; margin-bottom:1rem;">
                <span style="min-width:24px; height:24px; background:var(--accent-primary); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700;">${i+1}</span>
                <span>${step}</span>
              </li>
            `).join('')}
          </ul>
        </section>
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
      },
      "prd": {
        "project_name": "Hackathon Master Solution",
        "vision": "To build an intelligent, scalable platform that solves the user's problem using cutting-edge AI.",
        "user_personas": ["Developers", "Hackathon Participants", "Judges"],
        "core_features": [
          { "feature": "AI Strategy Engine", "priority": "P0", "description": "Core intelligence to analyze problem statements." },
          { "feature": "Real-time Dashboard", "priority": "P0", "description": "Interactive UI to view results instantly." }
        ],
        "technical_requirements": {
          "frontend": "Next.js + Tailwind CSS",
          "backend": "Supabase / Node.js",
          "database": "PostgreSQL",
          "integrations": ["Gemini API", "GitHub API"]
        },
        "success_metrics": ["User adoption rate", "Time saved per project"],
        "roadmap": ["MVP Launch", "Beta Testing", "Full Release"]
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
      showToast("Preparing PDF Report...");
      
      const tempDiv = document.createElement('div');
      tempDiv.id = 'temp-pdf-export-div';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px'; 
      tempDiv.style.background = 'white';
      tempDiv.style.zIndex = '-1000';
      document.body.appendChild(tempDiv);

      const pdfContainer = document.createElement('div');
      pdfContainer.style.background = 'white';
      pdfContainer.style.color = '#1e293b';
      pdfContainer.style.fontFamily = "'Inter', sans-serif";
      pdfContainer.style.width = '100%';
      tempDiv.appendChild(pdfContainer);
      
      // COVER PAGE
      const coverPage = document.createElement('div');
      coverPage.style.padding = '80px 60px';
      coverPage.style.textAlign = 'center';
      coverPage.style.minHeight = '1050px'; // Exact page height
      coverPage.style.display = 'flex';
      coverPage.style.flexDirection = 'column';
      coverPage.style.justifyContent = 'center';
      coverPage.style.boxSizing = 'border-box';
      coverPage.innerHTML = `
        <div style="margin-bottom: 40px;">
          <span style="font-size: 36px; font-weight: 800; letter-spacing: -1px; color: #0f172a;">Hackathon<span style="color: #a78bfa;">Master</span></span>
        </div>
        <h1 style="font-size: 44px; font-weight: 800; color: #1e293b; margin-bottom: 20px; line-height: 1.2;">Strategic Intelligence Report</h1>
        <div style="width: 80px; height: 4px; background: #a78bfa; margin: 0 auto 30px;"></div>
        <p style="font-size: 18px; color: #64748b; max-width: 500px; margin: 0 auto 60px;">A comprehensive AI-driven breakdown of solution strategy, market research, and technical implementation.</p>
        
        <div style="background: #f8fafc; border-radius: 16px; padding: 35px; border: 1px solid #e2e8f0; width: 100%; max-width: 600px; margin: 0 auto;">
          <h3 style="margin-top: 0; font-size: 13px; color: #a78bfa; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-bottom: 12px;">The Winning Pitch</h3>
          <p style="font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.4; margin: 0;">${document.getElementById('stratPitchBanner').innerText}</p>
        </div>

        <div style="margin-top: 60px; font-size: 14px; color: #94a3b8;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
      `;
      pdfContainer.appendChild(coverPage);

      const originalContent = document.getElementById('stratContent');
      const sections = originalContent.querySelectorAll('.output-section');
      
      sections.forEach((section, index) => {
        // Force a page break before every section
        const pageBreak = document.createElement('div');
        pageBreak.style.height = '0px';
        pageBreak.style.pageBreakBefore = 'always';
        pdfContainer.appendChild(pageBreak);

        const sectionClone = section.cloneNode(true);
        sectionClone.style.display = 'block';
        sectionClone.style.padding = '50px 60px';
        sectionClone.style.width = '100%';
        sectionClone.style.boxSizing = 'border-box';
        sectionClone.style.color = '#1e293b'; // Force dark text
        
        // Headers
        sectionClone.querySelectorAll('h3, h4, h2').forEach(h => {
          h.style.color = '#0f172a';
          h.style.borderBottom = '1px solid #f1f5f9';
          h.style.paddingBottom = '12px';
          h.style.marginBottom = '25px';
        });

        // Cards and Content - FORCE VISIBILITY
        sectionClone.querySelectorAll('.info-card, .strat-addon-card, .prompt-box, .prd-section, .feature-card, .judge-card').forEach(card => {
          card.style.background = '#ffffff';
          card.style.color = '#1e293b';
          card.style.border = '1px solid #e2e8f0';
          card.style.borderRadius = '12px';
          card.style.padding = '20px';
          card.style.marginBottom = '20px';
          card.style.pageBreakInside = 'avoid';
          card.style.boxShadow = 'none';
        });

        // Ensure all spans/p/li are dark
        sectionClone.querySelectorAll('span, p, li, div').forEach(el => {
          if (!el.classList.contains('badge') && !el.classList.contains('tag')) {
             el.style.color = '#334155';
          }
        });

        // Prompt text
        sectionClone.querySelectorAll('.prompt-body').forEach(pb => {
          pb.style.background = '#f8fafc';
          pb.style.color = '#334155';
          pb.style.padding = '15px';
          pb.style.borderRadius = '8px';
          pb.style.fontSize = '12px';
          pb.style.border = '1px solid #e2e8f0';
          pb.style.whiteSpace = 'pre-wrap';
          pb.style.overflowWrap = 'break-word';
        });

        // Clean up buttons
        sectionClone.querySelectorAll('button').forEach(b => b.remove());
        
        pdfContainer.appendChild(sectionClone);
      });

      const opt = {
        margin:       0,
        filename:     'Hackathon_Master_Full_Report.pdf',
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          width: 800,
          scrollY: 0,
          windowWidth: 800,
          backgroundColor: '#ffffff'
        },
        jsPDF:        { unit: 'px', format: [800, 1050], orientation: 'portrait' }
      };
      
      if(typeof html2pdf !== 'undefined') {
        html2pdf().set(opt).from(pdfContainer).save().then(() => {
          showToast("Report Downloaded!");
          if(document.body.contains(tempDiv)) document.body.removeChild(tempDiv);
        }).catch(err => {
          console.error("PDF Export Error:", err);
          showToast("Export failed.");
          if(document.body.contains(tempDiv)) document.body.removeChild(tempDiv);
        });
      } else {
        showToast("PDF Library not loaded.");
        document.body.removeChild(tempDiv);
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
