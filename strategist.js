document.addEventListener('DOMContentLoaded', () => {

  // Global Logic Handled by theme.js

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

  // [RAR-FIX-5] Multi-turn conversation history (last 6 exchanges)
  let conversationHistory = [];
  let currentProblemContext = '';

  // AI access. Gemini now runs through the signed-in user's account (the key lives on the server, see js/api.js).
  // Only the optional Serper (web search) key is still stored in this browser.
  const apiKeyBanner = document.getElementById('apiKeyBanner');
  const stratApiModal = document.getElementById('stratApiModal');
  const stratCloseModal = document.getElementById('stratCloseModal');
  const stratSaveKey = document.getElementById('stratSaveKey');
  const serperApiKeyInput = document.getElementById('serperApiKeyInput');

  // Live AI = signed in. Otherwise the offline engine runs, exactly like the old "no API key" case.
  const canUseAI = () => !!(window.callGemini && window.isSignedIn && window.isSignedIn());

  function checkApiKey() {
    const serperKey = localStorage.getItem('serper_api_key');
    const live = canUseAI();
    apiKeyBanner.classList.toggle('success', live);
    apiKeyBanner.style.border = live ? '1px solid var(--accent-primary)' : '';
    apiKeyBanner.innerHTML = `
      <div class="api-key-banner-left">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${live ? '#10b981' : '#f59e0b'}" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>
          <strong>Status:</strong>
          ${live ? '<span style="color:#10b981;">Gemini AI Active (your account)</span>' : '<span style="color:#f59e0b;">Offline mode: sign in for live Gemini AI</span>'}
          |
          ${serperKey ? '<span style="color:#10b981;">Deep Search Active</span>' : '<span style="color:#f59e0b;">Deep Search Inactive</span>'}
        </span>
      </div>
      <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
        ${live ? '' : '<button class="btn-primary btn-sm" id="stratSignInBtn">Sign in</button>'}
        <button class="btn-outline btn-sm" id="openApiKeyModal">Search settings</button>
        ${serperKey ? '<button class="btn-ghost btn-sm" id="clearApiKeyBtn" style="color:#ef4444;">Remove search key</button>' : ''}
      </div>
    `;
    const signIn = document.getElementById('stratSignInBtn');
    if (signIn) signIn.addEventListener('click', () => { const b = document.querySelector('.rar-auth-btn'); if (b) b.click(); });
    document.getElementById('openApiKeyModal').addEventListener('click', () => stratApiModal.style.display = 'flex');
    const clearBtn = document.getElementById('clearApiKeyBtn');
    if (clearBtn) clearBtn.addEventListener('click', () => { localStorage.removeItem('serper_api_key'); checkApiKey(); });
  }

  checkApiKey();
  window.addEventListener('rar:auth', checkApiKey);   // js/auth-ui.js fires this when the user signs in or out

  if(stratCloseModal) {
    stratCloseModal.addEventListener('click', () => stratApiModal.style.display = 'none');
  }

  if(stratSaveKey) {
    stratSaveKey.addEventListener('click', () => {
      const sKey = serperApiKeyInput.value.trim();
      if(sKey) localStorage.setItem('serper_api_key', sKey);
      stratApiModal.style.display = 'none';
      checkApiKey();
      showToast('Search settings saved locally!');
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

  // --- History Management ---

  const historySidebar = document.getElementById('historySidebar');

  const historyToggle = document.getElementById('historyToggle');

  const closeHistory = document.getElementById('closeHistory');

  const historyList = document.getElementById('historyList');

  const historyBadge = document.getElementById('historyBadge');

  let history = JSON.parse(localStorage.getItem('strat_history') || '[]');

  window.updateHistoryUI = updateHistoryUI;

  function updateHistoryUI() {

    if (historyList) {

      if (history.length === 0) {

        historyList.innerHTML = `

          <div class="history-empty">

            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.3; margin-bottom:1rem;"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>

            <p>No recent solutions found.</p>

          </div>

        `;

        historyBadge.style.display = 'none';

      } else {

        historyBadge.style.display = 'flex';

        historyBadge.textContent = history.length;

        historyList.innerHTML = history.map((item, index) => `

          <div class="history-item" data-index="${index}">

            <div class="history-item-title">${item.problem.substring(0, 60)}${item.problem.length > 60 ? '...' : ''}</div>

            <div class="history-item-meta">

              <span class="history-item-tag">${item.industry || 'General'}</span>

              <span class="history-item-date">${new Date(item.timestamp).toLocaleDateString()}</span>

            </div>

          </div>

        `).join('');

        // Add listeners to items

        document.querySelectorAll('.history-item').forEach(item => {

          item.addEventListener('click', () => {

            const index = item.getAttribute('data-index');

            const savedData = history[index];

            loadSavedSolution(savedData);

            historySidebar.classList.remove('open');

          });

        });

      }

    }

  }

  function saveToHistory(problem, result) {

    const newItem = {

      problem: problem,

      result: result,

      context: {

        theme: ctxTheme ? ctxTheme.value : '',

        stack: ctxStack ? ctxStack.value : '',

        time: ctxTime ? ctxTime.value : '',

        team: ctxTeam ? ctxTeam.value : '',

        mode: currentMode

      },

      industry: result.problem_analysis?.industry || result.industry || 'General',

      timestamp: new Date().getTime()

    };

    

    // Remove duplicates of the same problem

    history = history.filter(h => h.problem !== problem);

    

    // Add to beginning

    history.unshift(newItem);

    

    // Keep only last 10

    if (history.length > 10) history.pop();

    

    if (window.HistoryManager) { window.HistoryManager.saveStrategistResult(problem, result, { theme: ctxTheme ? ctxTheme.value : '', stack: ctxStack ? ctxStack.value : '', time: ctxTime ? ctxTime.value : '', team: ctxTeam ? ctxTeam.value : '', mode: currentMode }); } else { localStorage.setItem('strat_history', JSON.stringify(history)); }

    localStorage.setItem('latest_strat_result', JSON.stringify(newItem));

    // [Firebase] additive: analytics + cloud save. Both no-op when signed out or Firebase is unavailable.
    try {
      if (window.trackEvent) trackEvent('strategy_generated', { problem_length: problem.length });
      if (window.DB) DB.saveStrategy(DB.uid(), newItem).then(function (id) { if (id && window.trackEvent) trackEvent('strategy_saved'); });
    } catch (e) { /* never block the UI */ }

    updateHistoryUI();

  }

  window.loadSavedSolution = loadSavedSolution;

  function loadSavedSolution(data) {

    stratProblem.value = data.problem;

    stratProblem.dispatchEvent(new Event('input'));

    

    // Restore optional context fields if available

    if (data.context) {

      if (ctxTheme && data.context.theme) ctxTheme.value = data.context.theme;

      if (ctxStack && data.context.stack) ctxStack.value = data.context.stack;

      if (ctxTime && data.context.time) ctxTime.value = data.context.time;

      if (ctxTeam && data.context.team) ctxTeam.value = data.context.team;

      if (data.context.mode) {

        currentMode = data.context.mode;

        document.querySelectorAll('.mode-pill').forEach(pill => {

          if (pill.getAttribute('data-stratmode') === currentMode) {

            pill.classList.add('active');

          } else {

            pill.classList.remove('active');

          }

        });

      }

    }

    

    // Re-render the output with saved data (Fixed: Pass data.result as a single argument)

    renderStrategyJSON(data.result);

    

    // Show output area

    document.getElementById('stratOutput').style.display = 'block';

    document.getElementById('stratOutput').scrollIntoView({ behavior: 'smooth' });

    showToast('Loaded from history');

  }

  if (historyToggle) {

    historyToggle.addEventListener('click', () => {

      historySidebar.classList.add('open');

    });

  }

  // Handle Nav History Click

  document.querySelectorAll('.history-nav-trigger').forEach(trigger => {

    trigger.addEventListener('click', (e) => {

      e.preventDefault();

      historySidebar.classList.add('open');

      const mobileMenu = document.getElementById('mobileMenu');

      if(mobileMenu) mobileMenu.classList.remove('active');

    });

  });

  // Initial UI Update

  updateHistoryUI();

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

  // --- Auto-Restore Latest Result ---

  const latestStr = localStorage.getItem('latest_strat_result');

  if (latestStr) {

    try {

      const latest = JSON.parse(latestStr);

      // Only restore if not older than 1 hour (to keep it fresh)

      const now = new Date().getTime();

      if (true) {

        loadSavedSolution(latest);

      }

    } catch (e) {

      console.error("Failed to auto-restore latest strategist result", e);

    }

  }

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

      

      if (window.waitForAuth) await window.waitForAuth();   // let Firebase restore the session before deciding live vs offline
      const useAI = canUseAI();
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

        if (useAI) {

          // Live API Call Phase

          simulateProgressUI(true);

          

          let searchData = null;

          if (serperKey) {

            document.getElementById('stratProgressLabel').innerText = "Running Deep Search (Serper.dev)...";

            searchData = await window.SerperProvider.deepResearch(problem, serperKey);

          }

          const result = await callGeminiStrategist(problem, context, searchData);

          

          if(result && typeof result === 'object' && result.problem_analysis) {

             latestAnalysisJson = result;
             currentProblemContext = problem;

             renderStrategyJSON(result);

             saveToHistory(problem, result);

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
            currentProblemContext = problem;

            renderStrategyJSON(fallbackResult);

            saveToHistory(problem, fallbackResult);

            

            // Add a clear warning that this is offline data

            const pitchBanner = document.getElementById('stratPitchBanner');

            const warningHtml = `<div style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; border-radius: 8px; padding: 10px; margin-bottom: 15px; font-size: 0.9rem; color: #fca5a5;">

              <strong>⚠️ OFFLINE SIMULATION MODE:</strong> The output below is a generic simulation because you are not signed in. To get LIVE AI results (dynamic market research, tailored strategy), please sign in using the button at the top of the page.

            </div>`;

            pitchBanner.insertAdjacentHTML('beforebegin', warningHtml);

            

            completeProgressUI();

          }, 3500); // simulate delay

        }

      } catch (err) {

        console.error("Analysis failed:", err);

        showToast("Live API failed. Falling back to intelligent simulation.");

        

        const fallbackResult = generateFallbackJSON(problem, context);

        latestAnalysisJson = fallbackResult;

        renderStrategyJSON(fallbackResult);

        saveToHistory(problem, fallbackResult);

        

        const pitchBanner = document.getElementById('stratPitchBanner');

        const warningHtml = `<div style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; border-radius: 8px; padding: 10px; margin-bottom: 15px; font-size: 0.9rem; color: #fca5a5;">

          <strong>⚠️ LIVE API ERROR (${err.message.substring(0, 50)}...):</strong> The AI failed to return valid data. The output below is an offline simulation.

        </div>`;

        pitchBanner.insertAdjacentHTML('beforebegin', warningHtml);

        

        completeProgressUI();

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

  async function callGeminiStrategist(problem, ctx, searchData = null) {

    let researchContext = "";

    if (searchData) {

      researchContext = "CRITICAL RESEARCH DATA (From Serper.dev Deep Search):\n" +

        searchData.aggregatedSnippets + "\n\nPEOPLE ALSO ASK:\n" +

        searchData.aggregatedPAA.map(p => p.question).join(", ");

    }

    // [RAR-FIX-6] Hackathon-specific system prompt
    const systemPrompt = `You are RAR, the world's most advanced hackathon AI assistant created by Revanth Sai Sankar. You specialize in winning hackathon strategies, tech stack selection, MVP scoping, pitch preparation, team coordination, and judge psychology. You know every major hackathon (SIH, HackWithInfy, MLH, Devfolio, ETHIndia, Smart India Hackathon, HackMIT, HackWithGoogle, etc.) and their judging criteria. Always give actionable, time-boxed advice. Never give generic advice — every recommendation must be specific to the user's stack, time, and team size. Return ONLY a valid JSON object� no markdown, no code blocks, no explanation, no trailing text.

User Problem Statement: "${problem}"

Context: Theme: ${ctx.theme}, Stack: ${ctx.stack}, Time: ${ctx.time}, Team: ${ctx.team}

${researchContext}

RULES:

- Return ONLY raw JSON. No markdown fences. No commentary before or after.

- All string values MUST be single-line. Escape newlines as \\n inside strings.

- Keep each string value under 200 characters.

Return this exact JSON structure with all fields filled:

{"problem_analysis":{"refined_problem":"...","target_users":["..."],"core_pain_points":["..."],"market_gap":"...","winning_product_direction":"..."},"research_insights":{"existing_solution_patterns":["..."],"common_weaknesses":["..."],"emerging_opportunities":["..."],"useful_tools_apis":[{"name":"...","type":"...","why_it_matters":"..."}]},"best_addons":[{"addon_name":"...","category":"...","what_it_does":"...","why_it_improves_the_solution":"...","hackathon_value":"...","implementation_difficulty":"Easy","estimated_build_time":"2h","recommended_stack":"...","apis_or_tools":["..."],"demo_impact_score":9,"judge_wow_score":9}],"top_5_priority_addons":[{"rank":1,"addon_name":"...","reason":"..."}],"feature_ideas":{"must_have_features":["..."],"nice_to_have_features":["..."],"future_scope":["..."]},"prompt_pack":{"master_build_prompt":"...","frontend_ui_prompt":"...","backend_api_prompt":"...","database_prompt":"...","ai_integration_prompt":"...","pitch_demo_prompt":"..."},"judge_strategy":{"wow_factor":"...","best_demo_flow":["..."],"business_angle":"...","social_or_market_impact":"...","one_line_winning_pitch":"..."},"prd":{"project_name":"...","vision":"...","user_personas":["..."],"core_features":[{"feature":"...","priority":"P0","description":"..."}],"technical_requirements":{"frontend":"...","backend":"...","database":"...","integrations":["..."]},"data_models":[{"model_name":"...","fields":["..."]}],"api_endpoints":[{"method":"POST","path":"/api/...","description":"..."}],"security_considerations":["..."],"scalability_plan":["..."],"success_metrics":["..."],"roadmap":["..."]}}` ;

    // -- Robust JSON repair ---------------------------------------------------

    const repairJson = (raw) => {

      let s = raw.trim();

      // 1. Strip markdown fences

      s = s.replace(/^` + "``" + `(?:json)?\s*/i, '').replace(/\s*` + "``" + `\s*$/i, '').trim();

      // 2. Normalise smart/curly quotes

      s = s.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")

           .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"');

      // 3. Remove BOM

      s = s.replace(/^\uFEFF/, '');

      // 4. Walk the string escaping bare control chars inside JSON strings

      let out = '', inStr = false, esc = false;

      for (let i = 0; i < s.length; i++) {

        const ch = s[i], code = s.charCodeAt(i);

        if (esc) { out += ch; esc = false; continue; }

        if (ch === '\\') { esc = true; out += ch; continue; }

        if (ch === '"') { inStr = !inStr; out += ch; continue; }

        if (inStr) {

          if (code === 0x0A) { out += '\\n'; continue; }

          if (code === 0x0D) { out += '\\r'; continue; }

          if (code === 0x09) { out += '\\t'; continue; }

          if (code < 0x20) { out += '\\u' + code.toString(16).padStart(4,'0'); continue; }

        }

        out += ch;

      }

      s = out;

      // 5. Close unterminated string

      if (inStr) s += '"';

      // 6. Remove trailing commas before } or ]

      s = s.replace(/,\s*([}\]])/g, '$1');

      // 7. Balance braces/brackets

      let braces = 0, brackets = 0;

      for (const ch of s) {

        if (ch === '{') braces++;

        else if (ch === '}') braces--;

        else if (ch === '[') brackets++;

        else if (ch === ']') brackets--;

      }

      while (brackets > 0) { s += ']'; brackets--; }

      while (braces > 0) { s += '}'; braces--; }

      return s;

    };

    // -- Multi-strategy parse -------------------------------------------------

    const tryParse = (text) => {

      try { return JSON.parse(text); } catch (_) {}

      const m = text.match(/\{[\s\S]*\}/);

      if (m) {

        try { return JSON.parse(repairJson(m[0])); } catch (_) {}

      }

      try { return JSON.parse(repairJson(text)); } catch (_) {}

      if (m) {

        let partial = m[0];

        const lastComma = partial.lastIndexOf(',');

        if (lastComma > partial.length * 0.5) {

          try { return JSON.parse(repairJson(partial.substring(0, lastComma))); } catch (_) {}

        }

      }

      return null;

    };

    // -- Retry loop with exponential backoff and stable model fallback --------

    let retries = 3, delay = 2000, data, lastError = "";

    let selectedModel = 'gemini-2.5-flash';

    while (retries > 0) {

      try {

        // NOTE: google_search tool is intentionally REMOVED.
        // It conflicts with responseMimeType:application/json and causes
        // Gemini to inject citation text that breaks JSON parsing.
        data = await callGemini(selectedModel, [{ parts: [{ text: systemPrompt }] }], {
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: "application/json"
        });

        break;

      } catch (err) {

        // 429 = busy / rate limited, 502 / 504 = upstream error or timeout: wait and retry. Anything else is final.
        if (err.status === 429 || err.status === 502 || err.status === 504) {

          lastError = err.message || "Model Overloaded";

          if (err.status === 429 && selectedModel === 'gemini-2.5-flash') {

            console.warn("Gemini 2.5 Flash is busy. Switching to Gemini 2.0 Flash...");

            showToast("[API Warning] Gemini 2.5 busy. Switching to Gemini 2.0 Flash...");

            selectedModel = 'gemini-2.0-flash';

            await new Promise(r => setTimeout(r, 1000));

            continue;

          }

          retries--;

          if (retries === 0) throw new Error(lastError);

          showToast(`Model busy, retrying in ${delay/1000}s... (${retries} left)`);

          await new Promise(r => setTimeout(r, delay));

          delay *= 2;

        } else {

          throw err;

        }

      }

    }

    if (!data) throw new Error(lastError || "API Network Error");

    const candidate = data.candidates?.[0];

    if (!candidate) throw new Error("No response candidates returned from API.");

    const allText = (candidate.content?.parts || [])

      .filter(p => p.text).map(p => p.text).join('');

    if (!allText) throw new Error("API returned an empty response. Please try again.");

    const parsed = tryParse(allText);

    if (parsed) return parsed;

    console.error("All JSON parse strategies failed. Raw API text:", allText.substring(0, 800));

    throw new Error("JSON parse failed after all repair attempts. Please try again.");

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

      prd: buildPRDHTML(data.prd || {}),

      architecture: buildArchitectureHTML(data)

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

        const tabType = newTab.getAttribute('data-stab');

        document.querySelectorAll('#stratTabs .tab-btn').forEach(t => t.classList.remove('active'));

        newTab.classList.add('active');

        

        const targetId = `stab-${tabType}`;

        document.querySelectorAll('#stratContent .output-section').forEach(s => s.classList.remove('active'));

        document.getElementById(targetId).classList.add('active');

        // Re-init Mermaid if switching to architecture tab

        if (tabType === 'architecture' && window.mermaid) {

          setTimeout(() => {

            try {

              const diag = document.getElementById('arch-diag');

              if (diag && diag.getAttribute('data-diagram')) {

                // Reset the content to the original Mermaid definition before rendering

                diag.innerHTML = diag.getAttribute('data-diagram');

                diag.removeAttribute('data-processed');

                mermaid.init(undefined, diag);

              }

            } catch (e) {

              console.error("Mermaid tab-switch init failed:", e);

            }

          }, 50);

        }

      });

    });

    // Initialize/Render Mermaid Diagrams

    if (window.mermaid) {

      setTimeout(() => {

        try {

          // Re-render Mermaid diagrams

          mermaid.init(undefined, ".mermaid");

        } catch (e) {

          console.error("Mermaid init failed:", e);

        }

      }, 200);

    }

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

    // [RAR-FIX-20] Show export button after strategy renders
    const exportBtn2 = document.getElementById('exportSessionBtn');
    if (exportBtn2) exportBtn2.style.display = 'flex';

    // [RAR-FIX-5] Show follow-up chat after strategy renders
    const chatSection = document.getElementById('stratChat');
    if (chatSection) {
      chatSection.style.display = 'block';
      conversationHistory = [];
      document.getElementById('chatMessages').innerHTML = '';
      document.getElementById('chatContextBadge').style.display = 'none';
      initChatHandlers();
    }

  }

  // [RAR-FIX-5] Chat handler for multi-turn conversation
  function initChatHandlers() {
    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const badge = document.getElementById('chatContextBadge');

    // Clone to remove old listeners
    const newBtn = chatSend.cloneNode(true);
    chatSend.parentNode.replaceChild(newBtn, chatSend);
    const newInput = chatInput.cloneNode(true);
    chatInput.parentNode.replaceChild(newInput, chatInput);

    async function sendChat() {
      const q = newInput.value.trim();
      if (!q) return;
      newInput.value = '';

      // Add user message
      conversationHistory.push({ role: 'user', text: q });
      const userBubble = document.createElement('div');
      userBubble.style.cssText = 'align-self:flex-end;background:rgba(167,139,250,0.2);border:1px solid rgba(167,139,250,0.35);color:var(--text-primary);padding:10px 14px;border-radius:12px 12px 4px 12px;max-width:80%;font-size:0.88rem;';
      userBubble.textContent = q;
      chatMessages.appendChild(userBubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Typing indicator
      const typingBubble = document.createElement('div');
      typingBubble.style.cssText = 'align-self:flex-start;background:rgba(255,255,255,0.05);border:1px solid var(--border-color);color:var(--text-muted);padding:10px 14px;border-radius:12px 12px 12px 4px;font-size:0.85rem;';
      typingBubble.innerHTML = '<span style="opacity:0.7">RAR is thinking...</span>';
      chatMessages.appendChild(typingBubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      let answer = '';
      if (window.waitForAuth) await window.waitForAuth();
      if (canUseAI()) {
        // Build context: problem + last 6 messages
        const last6 = conversationHistory.slice(-6);
        const ctxBlock = last6.slice(0,-1).map(m => `${m.role === 'user' ? 'User' : 'RAR'}: ${m.text}`).join('\n');
        const prompt = `You are RAR, the world's most advanced hackathon AI assistant created by Revanth Sai Sankar. The user already got a full hackathon strategy for this problem: "${currentProblemContext}"\n\nConversation so far:\n${ctxBlock}\n\nUser now asks: ${q}\n\nGive a specific, actionable answer. Use emojis for sections. Keep it concise and hackathon-focused.`;
        try {
          const json = await callGemini('gemini-2.0-flash', [{ parts: [{ text: prompt }] }], { temperature: 0.7, maxOutputTokens: 1024 });
          answer = json.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response.';
        } catch(e) { answer = (e && e.status === 429) ? 'You are sending requests too quickly. Wait a minute and try again.' : 'Failed to reach AI. Please try again.'; }
      } else {
        answer = '⚠️ Sign in to enable live follow-up chat. Offline mode does not support follow-up questions.';
      }

      conversationHistory.push({ role: 'assistant', text: answer });
      typingBubble.style.color = 'var(--text-primary)';
      typingBubble.innerHTML = answer.replace(/\n/g, '<br>');
      chatMessages.scrollTop = chatMessages.scrollHeight;

      if (conversationHistory.length >= 2) {
        badge.style.display = 'inline-flex';
      }
    }

    newBtn.addEventListener('click', sendChat);
    newInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
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

        <button class="btn-primary btn-sm" id="downloadPrdBtn">Download PDF</button>

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

        <section style="margin-bottom:2.5rem;">

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

        ${prd.data_models ? `

        <section style="margin-bottom:2.5rem;">

          <h4 style="color:var(--accent-primary); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.5rem; margin-bottom:1rem;">7. DATA MODELS</h4>

          <div style="display:flex; flex-wrap:wrap; gap:1.5rem; margin-top:1rem;">

            ${prd.data_models.map(model => `

              <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:1.5rem; flex:1; min-width:250px;">

                <h5 style="color:var(--text-primary); margin-bottom:0.5rem;">${model.model_name}</h5>

                <ul style="padding-left:1.5rem; color:var(--text-secondary); font-size:0.9rem;">

                  ${model.fields.map(f => `<li>${f}</li>`).join('')}

                </ul>

              </div>

            `).join('')}

          </div>

        </section>` : ''}

        ${prd.api_endpoints ? `

        <section style="margin-bottom:2.5rem;">

          <h4 style="color:var(--accent-primary); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.5rem; margin-bottom:1rem;">8. API ENDPOINTS</h4>

          <table style="width:100%; border-collapse:collapse; margin-top:1rem; font-size:0.9rem;">

            <thead>

              <tr style="background:rgba(255,255,255,0.05); text-align:left;">

                <th style="padding:10px; border:1px solid rgba(255,255,255,0.1);">Method</th>

                <th style="padding:10px; border:1px solid rgba(255,255,255,0.1);">Endpoint</th>

                <th style="padding:10px; border:1px solid rgba(255,255,255,0.1);">Description</th>

              </tr>

            </thead>

            <tbody>

              ${prd.api_endpoints.map(api => `

                <tr>

                  <td style="padding:10px; border:1px solid rgba(255,255,255,0.1); font-weight:bold; color:${api.method === 'GET' ? '#34d399' : api.method === 'POST' ? '#60a5fa' : '#fbbf24'};">${api.method}</td>

                  <td style="padding:10px; border:1px solid rgba(255,255,255,0.1); font-family:monospace;">${api.path}</td>

                  <td style="padding:10px; border:1px solid rgba(255,255,255,0.1);">${api.description}</td>

                </tr>

              `).join('')}

            </tbody>

          </table>

        </section>` : ''}

        ${prd.security_considerations ? `

        <section style="margin-bottom:2.5rem;">

          <h4 style="color:var(--accent-primary); border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0.5rem; margin-bottom:1rem;">9. SECURITY & SCALABILITY</h4>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-top:1rem;">

            <div style="background:rgba(255,255,255,0.02); border-radius:12px; padding:1.5rem;">

              <h5 style="margin-bottom:0.5rem;">Security</h5>

              <ul style="padding-left:1.5rem; font-size:0.9rem; color:var(--text-secondary);">

                ${prd.security_considerations.map(s => `<li>${s}</li>`).join('')}

              </ul>

            </div>

            ${prd.scalability_plan ? `

            <div style="background:rgba(255,255,255,0.02); border-radius:12px; padding:1.5rem;">

              <h5 style="margin-bottom:0.5rem;">Scalability</h5>

              <ul style="padding-left:1.5rem; font-size:0.9rem; color:var(--text-secondary);">

                ${prd.scalability_plan.map(s => `<li>${s}</li>`).join('')}

              </ul>

            </div>

            ` : ''}

          </div>

        </section>` : ''}

      </div>

    `;

  }

  function buildArchitectureHTML(data) {

    const prd = data.prd || {};

    const tech = prd.technical_requirements || {};

    const frontend = tech.frontend || "Frontend App";

    const backend = tech.backend || "Backend API";

    const database = tech.database || "Database";

    const integrations = tech.integrations || [];

    // Clean names for Mermaid (remove special characters that might break syntax)

    const clean = (str) => str.replace(/[\[\]\(\)\{\}]/g, '').trim();

    let mermaidDef = `graph TD

    User((User/Client)) --> FE[${clean(frontend)}]

    FE --> BE[${clean(backend)}]

    BE --> DB[( ${clean(database)} )]

    `;

    integrations.forEach((int, index) => {

      mermaidDef += `    BE --> INT${index}[${clean(int)}]\n`;

    });

    return `

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem;">

        <h3>🏗️ System Architecture Diagram</h3>

      </div>

      <div class="info-card" style="background: rgba(0,0,0,0.3); padding: 3rem; border-radius: 20px; text-align: center; overflow-x: auto; border: 1px solid rgba(255,255,255,0.05); min-height: 300px; display: flex; align-items: center; justify-content: center;">

        <div class="mermaid" id="arch-diag" data-diagram="${mermaidDef.replace(/"/g, '&quot;')}">

${mermaidDef}

        </div>

      </div>

      <div style="margin-top: 2rem;">

        <h4 style="margin-bottom: 1rem; color: var(--accent-primary);">Architecture Breakdown</h4>

        <div class="card-grid">

          <div class="info-card">

            <h5 style="color:var(--accent-secondary); margin-bottom:0.5rem;">Frontend Layer</h5>

            <p style="font-size:0.9rem;">${frontend}</p>

          </div>

          <div class="info-card">

            <h5 style="color:var(--accent-secondary); margin-bottom:0.5rem;">Logic Layer</h5>

            <p style="font-size:0.9rem;">${backend}</p>

          </div>

          <div class="info-card">

            <h5 style="color:var(--accent-secondary); margin-bottom:0.5rem;">Data Layer</h5>

            <p style="font-size:0.9rem;">${database}</p>

          </div>

        </div>

      </div>

    `;

  }

  // Fallback JSON Generator — uses 100-item offline knowledge base

  // [RAR-FIX-4] Semantic alias expansion
  const SEMANTIC_ALIASES = {
    'blockchain': ['crypto','web3','defi','token','ethereum'],
    'crypto': ['blockchain','web3','defi','nft'],
    'nft': ['blockchain','crypto','web3'],
    'ai': ['machine learning','ml','deep learning','neural','llm','nlp'],
    'ml': ['machine learning','ai','deep learning','data science'],
    'iot': ['internet of things','sensor','hardware','embedded'],
    'ar': ['augmented reality','mixed reality','xr'],
    'vr': ['virtual reality','metaverse'],
    'healthcare': ['health','medical','doctor','hospital','patient'],
    'fintech': ['finance','payment','banking','money'],
    'edtech': ['education','learning','student','school'],
    'sustainability': ['climate','green','carbon','environment','eco'],
    'logistics': ['supply chain','shipping','delivery','warehouse'],
    'cybersecurity': ['security','hacking','privacy','vulnerability'],
    'ecommerce': ['shopping','retail','marketplace','sell'],
  };

  function expandWithAliases(text) {
    let expanded = text;
    Object.entries(SEMANTIC_ALIASES).forEach(([key, aliases]) => {
      if (text.includes(key)) aliases.forEach(a => { if (!expanded.includes(a)) expanded += ' ' + a; });
      aliases.forEach(a => { if (text.includes(a) && !expanded.includes(key)) expanded += ' ' + key; });
    });
    return expanded;
  }

  function generateFallbackJSON(problem, ctx) {

    const text = expandWithAliases(problem.toLowerCase());

    // Search the extended 1000-item offline knowledge base first

    const extKb = [
      ...(typeof window !== 'undefined' && window.OFFLINE_KNOWLEDGE_BASE           ? window.OFFLINE_KNOWLEDGE_BASE           : []),
      ...(typeof window !== 'undefined' && window.OFFLINE_KNOWLEDGE_BASE_EXTENDED  ? window.OFFLINE_KNOWLEDGE_BASE_EXTENDED  : []),
      ...(typeof window !== 'undefined' && window.OFFLINE_KNOWLEDGE_BASE_REALWORLD ? window.OFFLINE_KNOWLEDGE_BASE_REALWORLD : []),
      ...(typeof window !== 'undefined' && window.OFFLINE_KNOWLEDGE_BASE_MODULES   ? window.OFFLINE_KNOWLEDGE_BASE_MODULES   : []),
    ];

    const promptWords   = text.split(/\W+/).filter(w => w.length > 3);
    const promptWordSet = new Set(promptWords);

    let matched      = null;
    let highestScore = -1;

    extKb.forEach(item => {
      if (!item.keywords || !item.result) return;
      let raw = 0;
      item.keywords.map(k => k.toLowerCase()).forEach(kw => {
        if (text.includes(kw)) {
          raw += kw.split(/\s+/).length > 1 ? 6 : 3;
        } else {
          kw.split(/\W+/).filter(w => w.length > 3).forEach(w => {
            if (promptWordSet.has(w)) raw += 1;
            else if (w.length > 4 && promptWords.some(pw => pw.slice(0,5) === w.slice(0,5))) raw += 0.5;
          });
        }
      });
      if (item.result.industry) {
        const ind = item.result.industry.toLowerCase();
        if (text.includes(ind)) raw += 5;
        else if (ind.split(/\W+/).some(w => w.length > 3 && text.includes(w))) raw += 2;
      }
      if (raw === 0) return;
      const normalized = raw / Math.sqrt(item.keywords.length);
      if (normalized > highestScore) { highestScore = normalized; matched = item; }
    });

    if (highestScore < 1.5) matched = null;

    // ── Phase-1: domain-aware content assembly ─────────────────────────────
    function _getDomainPack(t, prob) {
      const PACKS = [
        { key:'mental', ind:'Mental HealthTech',
          terms:['mental health','therapy','depression','anxiety','mindfulness','meditation','counseling','wellbeing','stress','burnout','mood','psychiatric'],
          users:['People struggling with stress and anxiety','Mental health advocates and practitioners','Therapists, counselors, and coaches'],
          pain:['Affordable licensed therapy is inaccessible for most people','Stigma around mental health prevents early help-seeking','Generic wellness apps lack real clinical intelligence'],
          must:['AI mood journal with real-time sentiment analysis','Anonymous peer support forum','Guided CBT exercises and breathing tools'],
          ntoh:['Therapist matching engine','Crisis hotline quick-connect','Weekly emotional wellbeing reports'],
          fs:['Wearable integration for passive mood detection','Group therapy virtual rooms','Insurance billing integration'],
          addons:[{n:'Emotion Detector',c:'AI',d:'Analyses journal text with Gemini sentiment AI and shows detected emotional state live on screen',why:'Watching AI read your mood in real time is the most dramatically impressive demo moment possible',diff:'Medium',t:'2h',s:'Gemini API + React',imp:9,wow:10}],
          gap:'No app combines genuine AI emotional intelligence with clinical-grade CBT guidance at an accessible consumer price',
          ops:['Emotion-aware AI companions','Personalised CBT conversational flows','Burnout prevention dashboards for workplaces'],
          apis:[{name:'Gemini AI',type:'NLP / Sentiment',why:'Detect emotion and generate CBT-style responses'},{name:'Supabase',type:'Realtime DB',why:'Anonymous mood logs and peer posts with RLS'},{name:'Twilio',type:'SMS',why:'Crisis alert system for at-risk users'}],
          ins:['BetterHelp / Talkspace (expensive, no AI personalisation)','Generic meditation apps with no clinical intelligence'],
          pitch:'We turn a 5-minute journal entry into a personalised mental health action plan — AI-powered, accessible to anyone with a phone.',
          biz:'B2C freemium with premium therapy matching; B2B wellness packages for universities and employers.'
        },
        { key:'health', ind:'HealthTech',
          terms:['health','medical','patient','hospital','clinic','doctor','nurse','disease','diagnosis','pharma','telemedicine','telehealth','ehr'],
          users:['Patients and caregivers managing ongoing health journeys','Healthcare professionals and clinicians','Hospital administrators and operations teams'],
          pain:['Patient data is scattered across disconnected systems with no unified view','Manual appointment scheduling causes costly delays and missed care','Zero real-time visibility into patient health status between visits'],
          must:['Unified patient profile and full medical history','Smart appointment scheduling with automated reminders','AI symptom checker and triage assistant'],
          ntoh:['Wearable device integration','Prescription refill tracker','Telehealth video consultation module'],
          fs:['Predictive readmission risk scoring','EHR deep integration via FHIR standard','Pharmacy partnership marketplace'],
          addons:[{n:'Symptom Checker Chatbot',c:'AI',d:'Conversational AI triages symptoms step-by-step and routes patients to the right care level',why:'Live healthcare AI triage demo is compelling for judges and instantly understood as life-changing',diff:'Medium',t:'3h',s:'Gemini API + React Chat UI',imp:9,wow:9}],
          gap:'Healthcare is deeply fragmented — no single AI-first platform gives patients clarity from first symptom all the way to care',
          ops:['Predictive AI diagnostics from wearable data','Personalised care plan auto-generation','Voice-first interface for elderly patients'],
          apis:[{name:'OpenFDA API',type:'Medical Data',why:'Drug interactions and device safety information'},{name:'Google Maps API',type:'Location',why:'Find nearest clinic or specialist by specialty'},{name:'Gemini AI',type:'NLP',why:'Symptom analysis and patient Q&A chatbot'}],
          ins:['Fragmented hospital portals with no cross-system data','WebMD and generic symptom search with zero personalisation'],
          pitch:'We reduce the terrifying "what do I do?" moment in a health crisis — giving any patient instant AI triage and a clear path to care.',
          biz:'B2B SaaS for clinics and hospital groups; B2C premium health-insights subscription.'
        },
        { key:'crypto', ind:'Web3 / DeFi',
          terms:['crypto','blockchain','defi','nft','web3','ethereum','solana','wallet','token','dao','smart contract'],
          users:['Crypto investors and active DeFi traders','Web3 protocol developers and smart contract auditors','Mainstream users entering crypto for the first time'],
          pain:['DeFi interfaces are impossibly complex for non-technical users','No unified cross-chain portfolio view with real-time P&L','Gas fee volatility silently destroys small transactions'],
          must:['Multi-chain wallet and portfolio dashboard','Real-time DeFi yield tracking and risk analytics','Smart contract interaction UI with gas estimator'],
          ntoh:['NFT portfolio tracker with floor-price alerts','DAO governance voting interface','Tax report generator'],
          fs:['Intent-based natural language trading','AI wallet risk-score advisor','Cross-chain bridge aggregator'],
          addons:[{n:'Gas Fee Optimizer',c:'Web3',d:'Predicts optimal transaction timing to minimise gas costs using historical on-chain patterns',why:'Web3 judges love on-chain cost savings — demo a live tx simulation and watch the room react',diff:'Medium',t:'3h',s:'Ethers.js + Chainlink Data Feeds',imp:9,wow:10}],
          gap:'The entire DeFi ecosystem is inaccessible to 99% of people — beautiful UX and AI guidance could change that overnight',
          ops:['Natural language to on-chain action execution','AI wallet risk scoring and portfolio rebalancing','Cross-chain liquidity aggregation for best prices'],
          apis:[{name:'Alchemy',type:'Blockchain RPC',why:'Fast, reliable on-chain data at scale'},{name:'Chainlink',type:'Oracle',why:'Real-world price feeds for DeFi protocols'},{name:'0x Protocol',type:'DEX Aggregator',why:'Best-execution token swap routing'}],
          ins:['Existing DeFi dashboards are developer-only tools (Zapper, DeBank)','CEXs charge high fees with no DeFi or self-custody access'],
          pitch:'We built the Bloomberg Terminal for Web3 — every asset, yield, and risk in one AI-powered dashboard, simple enough for first-time crypto users.',
          biz:'0.1% swap aggregation fee; premium analytics subscription for power traders.'
        },
        { key:'fintech', ind:'FinTech',
          terms:['fintech','payment','banking','loan','lending','insurance','trading','invoice','payroll','budget','saving','expense','personal finance','money management'],
          users:['Individuals and families managing personal finances','Financial advisors and wealth managers','Banks, fintechs, and financial institutions'],
          pain:['No single app gives a complete real-time picture of total financial health','Manual budgeting is consistently abandoned within weeks','Legacy tools show data but never give clear actionable advice'],
          must:['Multi-account financial aggregator dashboard','AI spending anomaly detector and insights engine','Budget goal tracker with visual progress'],
          ntoh:['Bill negotiation AI assistant','Subscription waste detector and canceller','Automated smart savings rules'],
          fs:['AI personal CFO with proactive recommendations','Predictive cash-flow forecasting','Credit score improvement roadmap'],
          addons:[{n:'Transaction Anomaly Detector',c:'AI',d:'Flags unusual spending patterns in real time using ML — explains why it is suspicious and what to do',why:'Live AI + money detection demo takes seconds to understand and impresses every judge immediately',diff:'Medium',t:'2h',s:'Plaid API + Gemini AI',imp:10,wow:9}],
          gap:'Financial apps show data but never tell users what to actually DO — personalised AI advice is the completely missing layer',
          ops:['Conversational AI personal CFO chatbot','Subscription waste auto-cancellation engine','Predictive cash-flow crisis alerts before they happen'],
          apis:[{name:'Plaid API',type:'Open Banking',why:'Secure bank transaction aggregation across institutions'},{name:'Stripe',type:'Payments',why:'In-app financial actions and subscriptions'},{name:'Gemini AI',type:'NLP',why:'Natural language financial insights and personalised advice'}],
          ins:['Mint / YNAB (data visualisation only, no AI advice layer)','Bank apps (siloed, no cross-institution or AI view)'],
          pitch:"We turned everyone's phone into a personal CFO — AI that spots financial problems before they happen and shows the exact path to fix them.",
          biz:'B2C freemium with premium AI advice subscription; B2B API licensing to banks and fintechs.'
        },
        { key:'edtech', ind:'EdTech',
          terms:['education','learning','student','school','teacher','course','tutoring','quiz','classroom','university','edtech','e-learning','study','curriculum'],
          users:['Students from K-12 through university level','Teachers, educators, and course creators','Parents and school administrators'],
          pain:['Generic one-size content fails to match individual student learning pace','Students have no intelligent help available outside classroom hours','Teachers lack real-time insight into which students are struggling'],
          must:['Adaptive quiz and assessment engine that adjusts to performance','AI personal tutor chatbot using Socratic teaching method','Live progress dashboard for both students and teachers'],
          ntoh:['Gamified XP points and achievement badge system','Parent-teacher real-time communication portal','Peer study group matching'],
          fs:['Personalised AI-generated learning path builder','AR/VR immersive lesson experience builder','Employer-linked verified skills certification'],
          addons:[{n:'AI Tutor Chatbot',c:'AI',d:'Explains concepts step-by-step using the Socratic method — asks guiding questions instead of just giving answers',why:'Live demo of AI that actually teaches rather than just answers is unforgettable to every judge',diff:'Easy',t:'2h',s:'Gemini API + React Chat UI',imp:10,wow:10}],
          gap:'Most EdTech is passive content consumption — no product provides genuine real-time AI adaptive teaching at scale',
          ops:['Truly personalised AI-driven learning paths based on gaps','Gamified daily learning streaks with social sharing','Early-warning system for academically at-risk students'],
          apis:[{name:'Gemini AI',type:'NLP',why:'Adaptive tutoring and Socratic question generation'},{name:'Khan Academy API',type:'Educational Content',why:'Access to free world-class curriculum library'},{name:'Supabase',type:'Realtime DB',why:'Live classroom collaboration and progress sync'}],
          ins:['Khan Academy (world-class content but one-size, no adaptive AI)','Duolingo (gamified but narrow language domain, no depth)'],
          pitch:'We give every student a personal Einstein — AI that adapts to their exact pace and explains the same concept 10 different ways until it clicks.',
          biz:'B2C student subscription; B2B school-district licensing at per-student annual pricing.'
        },
        { key:'green', ind:'GreenTech / Sustainability',
          terms:['carbon','sustainability','green','climate','renewable','solar','emission','waste','recycling','eco','environment','net zero','clean energy'],
          users:['Eco-conscious individual consumers wanting to reduce impact','Corporate sustainability and ESG reporting teams','Government bodies and environmental NGOs'],
          pain:['No easy way for individuals to accurately measure their daily carbon footprint','Supply chains have zero end-to-end carbon transparency or accountability','Sustainable behaviours are not incentivised, gamified, or socially rewarding enough'],
          must:['Personal carbon footprint calculator with daily tracking','Green action streak and reward system','Company ESG dashboard and automated reporting'],
          ntoh:['AI product sustainability scanner via camera','Green marketplace for eco-friendly alternatives','Carbon credit purchase and trading module'],
          fs:['Satellite-based supply chain carbon monitoring','AI consumption pattern predictor','Municipal carbon reporting for governments'],
          addons:[{n:'Product Carbon Scanner',c:'Computer Vision',d:'User points camera at any product — AI estimates its full lifecycle carbon footprint and rates its sustainability',why:'Watching AI scan a grocery item and instantly show its carbon impact is a visual knockout moment for judges',diff:'Hard',t:'4h',s:'Gemini Vision API + React',imp:10,wow:10}],
          gap:'Sustainability tools either preach at users or are corporate-only — no platform makes green living fun, social, and genuinely rewarding for everyday people',
          ops:['AI-first product carbon footprint scanner','Corporate Scope 3 emissions automated tracker','Gamified green community challenges with real rewards'],
          apis:[{name:'Carbon Interface API',type:'Carbon Data',why:'Accurate lifecycle carbon emissions calculations'},{name:'Open Food Facts',type:'Product Data',why:'Ingredient and sustainability data for food'},{name:'Gemini Vision',type:'Computer Vision',why:'Product barcode and packaging scanning'}],
          ins:['Generic carbon footprint calculators (annual, not real-time, not fun)','Corporate ESG tools (complex, expensive, no consumer engagement)'],
          pitch:'We turned saving the planet into a game — every eco-choice earns real rewards, and our AI shows your exact CO2 impact in real time.',
          biz:'B2C freemium with premium tracking; B2B ESG reporting SaaS for enterprises.'
        },
        { key:'agri', ind:'AgriTech',
          terms:['agriculture','farm','crop','farmer','soil','irrigation','harvest','livestock','agri','food production','farming','plant disease'],
          users:['Smallholder farmers and agricultural cooperatives','Agri supply chain companies and buyers','Government agriculture ministries and development NGOs'],
          pain:['Farmers lack real-time actionable weather and soil health data','Crop diseases are detected too late — after significant yield loss','Small farmers have no direct market access and lose 30-40% of value to middlemen'],
          must:['Crop disease detector using phone camera with AI identification','Hyper-local weather and soil health dashboard','Direct farmer-to-buyer marketplace with fair pricing'],
          ntoh:['AI yield prediction tool','Government subsidy and scheme tracker','Voice-first SMS interface for low-literacy farmers'],
          fs:['Satellite imagery-based crop health monitoring','Drone integration for precision spraying','Blockchain-verified produce supply chain'],
          addons:[{n:'Crop Disease Detector',c:'Computer Vision',d:'Farmer points phone camera at a diseased leaf — AI identifies disease, severity, and recommends treatment in seconds',why:'Hardware + live AI + immediate life-improving value = highest possible hackathon demo impact score',diff:'Medium',t:'3h',s:'Gemini Vision API + React',imp:10,wow:10}],
          gap:'Farmers are completely disconnected from the data and markets that could prevent 40% of annual global crop loss',
          ops:['AI yield prediction from satellite and ground sensor data','Voice-first SMS for rural farmers without smartphones','Blockchain traceability for premium organic produce markets'],
          apis:[{name:'OpenWeatherMap',type:'Weather',why:'Hyper-local farm weather forecasts and alerts'},{name:'Gemini Vision',type:'Computer Vision',why:'Crop disease identification from photographs'},{name:'Twilio',type:'SMS',why:'Reach rural farmers via SMS and voice alerts'}],
          ins:['Manual crop scouting by agronomists (slow, expensive, not scalable)','Government agriculture hotlines (overloaded, delayed, generic)'],
          pitch:'We give every smallholder farmer a precision agriculture superpower — AI crop diagnosis, market prices, and hyper-local weather, all on a basic phone.',
          biz:'Low-cost monthly subscription for farmers; premium data licensing to agri-corporates and governments.'
        },
        { key:'ecom', ind:'E-Commerce',
          terms:['ecommerce','shop','marketplace','product','seller','buyer','cart','checkout','retail','inventory','online store','dropship'],
          users:['Online shoppers and deal-seeking consumers','SMB sellers and independent store owners','Logistics and fulfilment operations managers'],
          pain:['Product discovery is still primitive keyword-search — completely failing to understand buyer intent','Sellers lack real-time analytics on why specific products succeed or fail','The returns process is expensive, slow, and destroys customer loyalty'],
          must:['AI-powered visual and conversational product search','Seller performance analytics dashboard with actionable insights','Smart returns and exchange management portal'],
          ntoh:['AI personal shopper recommendation chatbot','Demand forecasting tool for inventory planning','Dynamic real-time pricing engine'],
          fs:['Full conversational commerce (chat to complete purchase)','AR try-before-you-buy feature for fashion and home','Supplier discovery marketplace'],
          addons:[{n:'Visual Search',c:'Computer Vision',d:'Customer uploads any photo — AI instantly finds visually identical or similar products across the entire catalogue',why:'Photo-to-product demo is visually spectacular, immediately understood, and shows clear AI value to all judges',diff:'Medium',t:'3h',s:'Gemini Vision API + Algolia',imp:10,wow:10}],
          gap:'E-commerce product discovery is still a 2004 text search box when AI that understands visual intent could transform conversion',
          ops:['Conversational AI personal shopper with purchase completion','Predictive demand forecasting for SMB inventory','Social commerce — buy directly from social media posts'],
          apis:[{name:'Gemini Vision',type:'Computer Vision',why:'Visual product matching from uploaded images'},{name:'Algolia',type:'Search',why:'Sub-millisecond intelligent product search'},{name:'Stripe',type:'Payments',why:'Seamless one-click checkout processing'}],
          ins:['Amazon (overwhelming choice, no personalisation, no visual search)','Etsy (manual keyword search only, no AI discovery)'],
          pitch:'We killed the search bar — point your camera at anything and our AI finds the perfect match across 10 million products in under a second.',
          biz:'2.5% transaction fee; premium seller analytics and forecasting SaaS subscription.'
        },
        { key:'logistics', ind:'Logistics / Supply Chain',
          terms:['supply chain','logistics','shipping','delivery','warehouse','cargo','fleet','route','tracking','last mile','dispatch'],
          users:['Logistics managers and fleet operations teams','E-commerce businesses needing fulfilment','End customers tracking their deliveries in real time'],
          pain:['Real-time shipment visibility is completely absent for most businesses','Route planning is manual and wastes 25% of fuel','Customer delivery ETAs are wrong 40% of the time — destroying trust'],
          must:['Real-time GPS shipment tracking dashboard with live map','AI-powered multi-stop route optimiser','Predictive ETA engine with automated SMS notifications'],
          ntoh:['Warehouse inventory and slotting management','Multi-carrier rate comparison and booking','Shipment carbon footprint tracker'],
          fs:['Autonomous drone last-mile delivery routing','Predictive vehicle maintenance alerts','Digital trade documentation via blockchain'],
          addons:[{n:'AI Route Optimiser',c:'AI Routing',d:'Calculates the optimal multi-stop delivery route factoring real-time traffic, driver hours, and vehicle load',why:'Live map showing AI re-routing drivers around traffic in real time is one of the most compelling visual demos imaginable',diff:'Medium',t:'3h',s:'Google Maps API + OR-Tools',imp:9,wow:9}],
          gap:'Last-mile delivery still relies on driver intuition — AI route optimisation could cut fuel costs 30% and delivery time 20% from day one',
          ops:['Real-time traffic-adaptive dynamic routing','Carbon-footprint-aware green route selection','Predictive maintenance to prevent costly vehicle breakdowns'],
          apis:[{name:'Google Maps Platform',type:'Maps + Routing',why:'Real-time traffic data and multi-stop route planning'},{name:'Twilio',type:'SMS',why:'Automated customer delivery status notifications'},{name:'HERE Routing API',type:'Advanced Routing',why:'Logistics-optimised multi-stop route calculation'}],
          ins:['Manual route planning via spreadsheets and printouts','Legacy TMS systems — expensive, no real-time AI'],
          pitch:'We cut last-mile delivery cost by 30% — AI re-routes every driver in real time so packages arrive faster, cheaper, and greener.',
          biz:'Per-shipment API pricing; B2B SaaS for enterprise logistics teams and 3PLs.'
        },
        { key:'hr', ind:'HR Tech',
          terms:['hiring','recruitment','resume','job','career','employee','talent','onboarding','interview','workforce','recruiter','hr tech'],
          users:['HR managers and talent acquisition teams','Job seekers and career changers','Hiring managers and team leads'],
          pain:['Manual resume screening takes 40+ hours per open role','Unconscious bias systematically affects hiring decisions','Slow processes cause top candidates to accept competing offers first'],
          must:['AI resume screener with explainable skills scoring','Bias-detection scanner for job descriptions and feedback','Automated interview scheduling with calendar integration'],
          ntoh:['Candidate pipeline analytics dashboard','AI-generated interview question bank','Onboarding task manager for new hires'],
          fs:['AI video interview assessment','Automated reference checking pipeline','Alumni talent network for boomerang hires'],
          addons:[{n:'Bias Detector',c:'AI Ethics',d:'Scans job descriptions and interview feedback for biased language — flags it and suggests inclusive rewrites',why:'DEI plus AI is a top hackathon theme — ethical tech demos consistently score highest for social impact criteria',diff:'Easy',t:'1.5h',s:'Gemini API',imp:8,wow:9}],
          gap:'Hiring is still 80% manual, subjective, and slow — AI can cut time-to-hire from 6 weeks to 6 days while improving diversity',
          ops:['Skills-based hiring replacing CV keyword filtering','AI video interview assessment for async screening','Passive talent pool builder for future pipeline'],
          apis:[{name:'Gemini AI',type:'NLP',why:'Resume parsing, skills scoring, and bias detection'},{name:'Cal.com API',type:'Scheduling',why:'Automated interview slot booking'},{name:'LinkedIn API',type:'Professional Data',why:'Candidate profile enrichment and verification'}],
          ins:['Greenhouse / Lever (ATS tools — complex, expensive, no AI)','LinkedIn Jobs (high volume, no quality signal, keyword matching only)'],
          pitch:'We cut time-to-hire from 6 weeks to 6 days — AI screens 500 resumes in 10 minutes and ranks candidates by actual skills, not keyword luck.',
          biz:'Per-successful-hire fee; monthly SaaS for enterprise ATS replacement.'
        },
        { key:'proptech', ind:'PropTech',
          terms:['real estate','property','rent','house','apartment','tenant','landlord','mortgage','realty','smart home','housing market'],
          users:['Home buyers and renters on their property search journey','Real estate agents, brokers, and property managers','Property investors and portfolio landlords'],
          pain:['Property search is still primitive keyword and filter boxes — missing buyer intent and lifestyle fit','Virtual tours are low quality and non-interactive','Paperwork and contracts take weeks and are opaque and intimidating'],
          must:['AI-powered natural language property match engine','Interactive 3D virtual tour integration','Digital contract drafting and e-signature management'],
          ntoh:['AI mortgage pre-qualification advisor','Investment ROI and rental yield predictor','AR home staging visualiser'],
          fs:['Conversational property concierge','Predictive neighbourhood price forecasting','Blockchain-verified property title records'],
          addons:[{n:'AI Property Concierge',c:'AI',d:'User describes dream home in plain English — AI finds top 5 matches, explains why each fits, and schedules viewings',why:'Conversational property search demo is immediately understood and impressive to judges of all backgrounds',diff:'Easy',t:'2h',s:'Gemini API + Mapbox GL',imp:9,wow:8}],
          gap:'Real estate property search has not fundamentally changed in 20 years — AI understanding of intent rather than keyword filters is entirely untapped',
          ops:['Conversational AI property matching understanding lifestyle and commute','AR-powered home renovation visualisation','Blockchain deed and ownership verification'],
          apis:[{name:'Mapbox',type:'Maps',why:'Interactive property maps with neighbourhood data overlays'},{name:'Zillow API',type:'Property Data',why:'Property listings, valuations, and market trend data'},{name:'DocuSign API',type:'E-Signature',why:'Legally binding digital contract signing'}],
          ins:['Zillow / Rightmove (keyword and filter search only, no AI understanding)','Manual broker-led search (slow, biased toward higher-commission properties)'],
          pitch:'We built a real-estate agent that never sleeps — describe your dream home in 10 seconds, and our AI finds it, books the viewing, and drafts the offer.',
          biz:'0.5% transaction commission on completed sales; B2B SaaS for agencies and brokerages.'
        },
        { key:'security', ind:'CyberSecurity',
          terms:['security','cybersecurity','hacking','vulnerability','encryption','privacy','threat','malware','phishing','fraud detection','data breach','zero trust'],
          users:['Security engineers and SOC analysts','SMBs with limited IT security budgets','End users concerned about their digital privacy'],
          pain:['Security alert fatigue causes real threats to be missed daily','Enterprise-grade security tools are priced out of reach for SMBs','Phishing attacks evolve faster than employee security training'],
          must:['Real-time threat detection and incident response dashboard','AI phishing email and message analyser','Automated vulnerability scanner for web applications'],
          ntoh:['Employee security phishing simulation','Dark web credential leak monitor','Zero-trust access policy manager'],
          fs:['AI insider threat and anomaly detection','Automated compliance report generation','Bug bounty programme management'],
          addons:[{n:'Live Phishing Simulator',c:'Security',d:'Sends realistic fake phishing emails to employees and tracks who clicks, opens attachments, or submits credentials — with automatic personalised training',why:'Catching real employees in a live demo is the single most jaw-dropping security demonstration possible',diff:'Hard',t:'4h',s:'Nodemailer + React + Gemini AI',imp:9,wow:10}],
          gap:'Cybersecurity is enterprise-only — SMBs are wide open and largely unaware, a massive underserved market with urgent need',
          ops:['AI anomaly detection for insider threats','Automated penetration testing and security posture scoring','Privacy-first decentralised identity management'],
          apis:[{name:'VirusTotal API',type:'Threat Intelligence',why:'File and URL malware and threat scanning'},{name:'Shodan API',type:'Network Recon',why:'Discover exposed devices and internet-facing services'},{name:'Gemini AI',type:'NLP',why:'Phishing text analysis and social engineering detection'}],
          ins:['Enterprise SIEMs like Splunk ($500k/year, too complex for SMBs)','Consumer password managers (no active threat detection)'],
          pitch:'We give SMBs the same AI security operations centre as Fortune 500 companies — 5 minutes setup, 1% of the enterprise cost.',
          biz:'Monthly SaaS subscription tiered by company headcount; enterprise incident response retainer add-on.'
        },
        { key:'devtools', ind:'Developer Tooling',
          terms:['developer tool','devtools','api platform','sdk','cli','code review','testing','ci/cd','monitoring','debugging','engineer','pull request','repository'],
          users:['Software developers and frontend/backend engineers','Engineering team leads and staff engineers','DevOps, SRE, and platform engineering teams'],
          pain:['Code review is a slow human bottleneck — typically takes 2-3 days per PR','Debugging production incidents requires hours of log archaeology','Onboarding new developers to a large codebase takes weeks of tribal knowledge transfer'],
          must:['AI-powered pull request reviewer with bug and security detection','Automated production log analyser with root-cause explanation','Interactive developer onboarding knowledge base with codebase Q&A'],
          ntoh:['Natural language to SQL or API query converter','Automated API documentation generator','Test coverage gap detector with auto-generated test suggestions'],
          fs:['AI pair programmer integrated into IDE','Automated incident postmortem generator','Dependency vulnerability scanner and upgrade advisor'],
          addons:[{n:'AI PR Reviewer',c:'AI Code Analysis',d:'Automatically reviews every pull request for bugs, security vulnerabilities, complexity, and style — in under 10 seconds',why:'A live demo reviewing real code and finding a real bug is the ultimate developer-judge moment — wins the room immediately',diff:'Medium',t:'3h',s:'Gemini AI + GitHub API',imp:10,wow:10}],
          gap:'Code review is the single largest bottleneck in software delivery — AI can handle 80% of reviews in seconds, freeing engineers for creative work',
          ops:['AI pair programming for real-time in-editor suggestions','Automated incident analysis from observability data','Natural language codebase Q&A ("how does auth work in this repo?")'],
          apis:[{name:'GitHub API',type:'Version Control',why:'PR data, code diffs, and repository context'},{name:'Gemini AI',type:'Code Analysis',why:'Intelligent code review, explanation, and security scanning'},{name:'OpenTelemetry',type:'Observability',why:'Performance traces and structured logs for AI analysis'}],
          ins:['Manual code review (slow, inconsistent, blocks velocity)','Basic linting (syntax only — no logic or security understanding)'],
          pitch:'We cut code review time by 80% — AI reviews every PR for bugs, security holes, and complexity in 5 seconds, so engineers only review what truly matters.',
          biz:'Per-seat developer SaaS; enterprise GitHub App integration with SSO and custom rulesets.'
        },
        { key:'iot', ind:'IoT / Smart City',
          terms:['iot','smart city','smart home','sensor','connected device','edge computing','smart grid','wearable','autonomous','raspberry pi','arduino'],
          users:['Smart city planners and municipality engineers','IoT device manufacturers and solution integrators','Homeowners and building managers with smart infrastructure'],
          pain:['IoT devices from different vendors cannot communicate or share data','Raw sensor data streams are collected but never converted into actionable intelligence','Consumer IoT devices have critical security vulnerabilities with no patch management'],
          must:['Unified multi-vendor device management dashboard','Real-time sensor analytics with automated alerting','Device security health monitoring and patch tracker'],
          ntoh:['Digital twin city visualisation','Predictive maintenance failure alerts','Energy consumption optimisation engine'],
          fs:['AI-coordinated smart traffic signal optimisation','Edge AI inference for real-time autonomous decisions','Citizen-facing real-time city services portal'],
          addons:[{n:'Live Sensor Map',c:'IoT Visualisation',d:'Real-time map showing every connected device, sensor readings, and alerts — updating every second',why:'A live pulsing map of real sensor data is the single most visually arresting demo moment in any IoT hackathon',diff:'Medium',t:'3h',s:'MQTT + Mapbox + React + InfluxDB',imp:10,wow:10}],
          gap:'IoT data is collected but almost never converted into real-time automated decisions — the intelligence orchestration layer is completely missing',
          ops:['Predictive asset maintenance triggered by sensor anomaly patterns','AI-coordinated smart traffic flow optimisation','Participatory citizen sensing to crowdsource real-time city data'],
          apis:[{name:'MQTT Protocol',type:'IoT Messaging',why:'Lightweight real-time device communication at scale'},{name:'InfluxDB',type:'Time-Series DB',why:'High-throughput sensor data storage and querying'},{name:'Mapbox',type:'Mapping',why:'Real-time device and sensor location visualisation'}],
          ins:['Siloed single-vendor dashboards requiring a separate app per device brand','Legacy SCADA systems — 1990s technology, no cloud, no AI'],
          pitch:'We connect every sensor in the city into a single intelligent brain — turning raw IoT data into automated decisions that save energy, prevent failures, and protect lives.',
          biz:'Per-device monthly licensing; government smart-city enterprise contracts; premium analytics API for urban planners.'
        },
        { key:'productivity', ind:'Productivity',
          terms:['productivity','task','todo','project management','kanban','workflow automation','meeting','focus','remote work','team collaboration','async'],
          users:['Knowledge workers and individual contributors drowning in meetings','Remote and hybrid team managers dealing with coordination overhead','Operations leads and project managers running cross-functional work'],
          pain:['Meeting overload destroys deep focus — average knowledge worker has 6+ hours of meetings per week','Task management tools create more admin overhead than the work they manage','Async communication creates endless message-checking loops and context switching'],
          must:['AI meeting summariser with action item and owner extraction','Smart task prioritisation engine based on deadlines and impact','Focus time blocker and deep work calendar scheduler'],
          ntoh:['Cross-tool task aggregator connecting Jira, Notion, and Linear','Automated weekly personal review and goal tracker','Team health and early burnout warning system'],
          fs:['AI chief-of-staff for executive workflow orchestration','Natural language project planning','Proactive deadline management nudge engine'],
          addons:[{n:'AI Meeting Summariser',c:'AI Voice',d:'Records any meeting, transcribes live, and auto-generates a structured summary with action items, owners, and deadlines posted to Slack in seconds',why:'Every judge has been in a terrible meeting — this demo creates instant visceral understanding of the pain and the solution',diff:'Medium',t:'3h',s:'Whisper API + Gemini AI + Slack API',imp:10,wow:9}],
          gap:'The average knowledge worker wastes 30% of their working day on productivity theatre — no tool has cracked making AI truly assistive rather than another app to manage',
          ops:['AI-first async communication that eliminates status-update meetings','Automated project health and deadline risk scoring','Personalised energy-aware work scheduling'],
          apis:[{name:'OpenAI Whisper',type:'Speech-to-Text',why:'Real-time and batch meeting transcription'},{name:'Gemini AI',type:'NLP',why:'Meeting summary and action item extraction'},{name:'Google Calendar API',type:'Scheduling',why:'Deep focus time protection and meeting load analysis'}],
          ins:['Notion / Confluence (powerful but people spend more time organising than working)','Slack / Teams (real-time chat that creates constant interruption anxiety)'],
          pitch:'We give every person their focus time back — AI handles the meetings, follow-ups, and scheduling, so you only do the work that actually matters.',
          biz:'B2C individual subscription; B2B team plan with per-seat pricing and deep Slack and Jira integration.'
        }
      ];
      const tl = (typeof t === 'string') ? t : '';
      let pack = PACKS.find(p => p.terms.some(term => tl.includes(term)));
      if (!pack) {
        if      (tl.includes('learn') || tl.includes('teach') || tl.includes('study'))  pack = PACKS.find(p=>p.key==='edtech');
        else if (tl.includes('pay') || tl.includes('bank') || tl.includes('fund'))       pack = PACKS.find(p=>p.key==='fintech');
        else if (tl.includes('track') || tl.includes('manage'))                          pack = PACKS.find(p=>p.key==='productivity');
        else                                                                               pack = PACKS.find(p=>p.key==='health');
      }
      const stopW = new Set(['with','that','this','from','have','will','build','make','create','using','based','into','help','want','need','give','show','allow','which','able','user','users','people','system','platform','application','solution','tool','data','online','simple','easy','better','good','best','app','website','web']);
      const probWords = (typeof prob === 'string') ? prob.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !stopW.has(w)) : [];
      const PFXS = {mental:['Mind','Calm','Bloom','Aura','Thrive'],health:['Medi','Vital','Pulse','CurePath'],fintech:['Flow','Vault','Ledger','Nexus'],crypto:['Chain','Vault','Block','DeFi'],edtech:['Spark','Lumi','Nova','EduAI'],green:['Terra','Leaf','Sustain','EcoAI'],agri:['Agro','CropAI','FarmSmart','Harvest'],ecom:['Cart','Bolt','Market','Sellar'],logistics:['Route','Fleet','Cargo','Track'],hr:['Hire','Talent','Match','Crew'],proptech:['Nest','Haven','HomeAI','Key'],security:['Shield','Guard','Cipher','Armor'],devtools:['Forge','Build','Deploy','Stack'],iot:['Mesh','Sync','EdgeAI','Node'],productivity:['Flow','Focus','Sprint','Clarity']};
      const SFXS = ['AI','Hub','Sync','Flow','Link','Wave','Base','Core','Lab','Pro','Net','Pulse'];
      const pfxList = PFXS[pack.key] || ['Smart','Neo','Nova','Apex'];
      const pfx = pfxList[prob.length % pfxList.length];
      const sfx = SFXS[(prob.length + 5) % SFXS.length];
      let projectName;
      if (probWords.length > 0) {
        const kw = probWords[0];
        const cap = kw.charAt(0).toUpperCase() + kw.slice(1, 9).toLowerCase();
        projectName = prob.length % 2 === 0 ? cap + sfx : pfx + cap;
      } else { projectName = pfx + sfx; }
      const baseAddons = pack.addons.map(a => ({
        addon_name: a.n, category: a.c, what_it_does: a.d,
        why_it_improves_the_solution: a.why, hackathon_value: a.why,
        implementation_difficulty: a.diff, estimated_build_time: a.t,
        recommended_stack: a.s, apis_or_tools: [a.s.split(' ')[0]],
        demo_impact_score: a.imp, judge_wow_score: a.wow
      }));
      baseAddons.push({ addon_name:'Real-time Collaboration Layer', category:'Collaboration', what_it_does:'Multiple users interact with the same data simultaneously with live cursor presence (like Figma).', why_it_improves_the_solution:'Instantly proves enterprise-readiness and team-oriented design.', hackathon_value:'Multiplayer features are technical showstoppers — judges score high for this.', implementation_difficulty:'Medium', estimated_build_time:'2 hours', recommended_stack:'Supabase Realtime or Liveblocks', apis_or_tools:['Liveblocks'], demo_impact_score:9, judge_wow_score:9 });
      return {
        industry: pack.ind, targetUsers: pack.users, painPoints: pack.pain,
        mustHave: pack.must, niceToHave: pack.ntoh, futureScope: pack.fs,
        addons: baseAddons, insights: pack.ins, marketGap: pack.gap,
        opportunities: pack.ops, projectName,
        apis: pack.apis.map(a => ({ name: a.name, type: a.type, why_it_matters: a.why })),
        pitch: pack.pitch, businessAngle: pack.biz,
        topAddons: [
          { rank:1, addon_name: baseAddons[0].addon_name, reason:'Highest demo impact — the AI feature judges will remember.' },
          { rank:2, addon_name: baseAddons[1].addon_name, reason:'Fastest way to show enterprise-ready multi-user capability.' }
        ]
      };
    }
    const _pack = _getDomainPack(text, problem);
    // ── end Phase-1 ─────────────────────────────────────────────────────────

    let domainTech   = matched ? matched.result.techstack   : 'Next.js + Node.js + Supabase';

    let domainAI     = matched ? matched.result.ai_strategy : 'Use Gemini 2.0 Flash for real-time analysis and content generation.';

    let domainIndustry = matched ? matched.result.industry  : 'General Tech';

    let domainSecret = matched ? matched.result.win_secret  : 'Focus on extreme UI polish and a flawless live demo moment.';

    let domainMegaPrompt = matched ? matched.result.mega_prompt : 'Act as a Senior Full Stack Engineer. Build a sleek modern web application using Next.js and Tailwind CSS with dark mode, animations, and Supabase for auth and data.';

    let domainAPIs   = matched ? matched.result.api_endpoints.split('\\n') : ['POST /api/v1/auth/login', 'GET /api/v1/dashboard', 'POST /api/v1/ai/process'];

    let domainDB     = matched ? matched.result.database_schema : 'Table Users { id uuid [pk], email varchar }\\nTable Projects { id uuid [pk], user_id uuid, data jsonb }';

    

        const addons    = _pack.addons;
    const insights   = _pack.insights;
    const marketGap  = _pack.marketGap;

        return {

      "problem_analysis": {

        "refined_problem": "A streamlined, intelligent solution targeting: " + problem.substring(0, 80) + "...",

        "target_users": _pack.targetUsers,

        "core_pain_points": _pack.painPoints,

        "market_gap": matched ? domainSecret : marketGap,

        "winning_product_direction": "An AI-first, mobile-responsive web app with real-time data sync for " + domainIndustry + "."

      },

      "research_insights": {

        "existing_solution_patterns": insights,

        "common_weaknesses": ["No offline support", "Clunky UI/UX", "High latency"],

        "emerging_opportunities": _pack.opportunities,

        "useful_tools_apis": _pack.apis

      },

      "best_addons": addons,

      "top_5_priority_addons": _pack.topAddons,

      "feature_ideas": {

        "must_have_features": _pack.mustHave,

        "nice_to_have_features": _pack.niceToHave,

        "future_scope": _pack.futureScope

      },

      "prompt_pack": {

        "master_build_prompt": domainMegaPrompt,

        "frontend_ui_prompt": "Create a responsive, glassmorphism-styled dashboard using React and Tailwind CSS for a " + domainIndustry + " app. Include a sidebar nav, stats cards, and a main content area with animated charts.",

        "backend_api_prompt": "Write a Node.js Express server for a " + domainIndustry + " app. Include endpoints: " + domainAPIs.join(', ') + ". Add JWT auth, input validation, and robust error handling.",

        "database_prompt": "Design a database schema for a " + domainIndustry + " application. Schema: " + domainDB,

        "ai_integration_prompt": domainAI + " Write a TypeScript function that calls this AI model and streams the response back to the client.",

        "pitch_demo_prompt": "Write a 2-minute energetic hackathon pitch for a " + domainIndustry + " app. Start with the problem, show the magic moment, briefly explain the tech stack, and close on the business opportunity."

      },

      "judge_strategy": {

        "wow_factor": "The moment the AI analyzes the input and returns a structured, actionable result in under 2 seconds for " + domainIndustry + ".",

        "best_demo_flow": [

          "Start at the problem: Show how painful the current process is.",

          "Introduce the solution: Log in and reveal the clean AI-powered dashboard.",

          "The Magic Trick: Perform the core AI action live — watch results appear instantly.",

          "Show breadth: Quickly tab through the other key features.",

          "The Future: Show the analytics page and close on the business model."

        ],

        "business_angle": _pack.businessAngle,

        "social_or_market_impact": "Significantly reduces wasted hours and improves accessibility across the " + domainIndustry + " market.",

        "one_line_winning_pitch": _pack.pitch

      },

      "prd": {

        "project_name": _pack.projectName,

        "vision": "To build an intelligent, scalable " + domainIndustry + " platform that saves time, reduces errors, and delights users.",

        "user_personas": ["Tech-savvy professionals in " + domainIndustry, "Non-technical end consumers", "Platform administrators"],

        "core_features": [

          { "feature": "AI Analysis Engine", "priority": "P0", "description": "Core intelligence to process inputs for " + domainIndustry + "." },

          { "feature": "Real-time Dashboard", "priority": "P0", "description": "Interactive UI to view AI results and domain metrics instantly." },

          { "feature": "Export and Share", "priority": "P1", "description": "Export reports as PDF or share via a link." }

        ],

        "technical_requirements": {

          "frontend": domainTech.split(' + ')[0] + " + Tailwind CSS + Framer Motion",

          "backend": domainTech.split(' + ')[1] || "Node.js Express",

          "database": domainTech.split(' + ')[2] || "Supabase (PostgreSQL)",

          "integrations": ["Gemini API", "GitHub API", "Stripe"]

        },

        "data_models": [

          { "model_name": "User", "fields": ["id: uuid", "email: varchar", "role: enum", "created_at: timestamp"] },

          { "model_name": "Project", "fields": ["id: uuid", "user_id: uuid (FK)", "title: varchar", "data: jsonb"] }

        ],

        "api_endpoints": domainAPIs.map(ep => {

          const parts = ep.trim().split(' ');

          return { "method": parts[0] || "GET", "path": parts[1] || "/api/v1/data", "description": "Core endpoint for " + domainIndustry + " operations." };

        }),

        "security_considerations": ["JWT auth with refresh tokens", "Input sanitization", "Rate limiting"],

        "scalability_plan": ["Docker containerization", "CDN for static assets", "DB read replicas for analytics"],

        "success_metrics": ["100 signups in first week", "Core action < 3 seconds", "Judge score > 8/10"],

        "roadmap": ["MVP Launch (Hackathon)", "Beta with 50 users", "V1.0 Public Release", "Enterprise rollout"]

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

  // [RAR-FIX-20] Export Session — complete PDF with all sections
  const exportBtn = document.getElementById('exportSessionBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      if (typeof html2pdf === 'undefined') { showToast('PDF library not loaded.'); return; }

      exportBtn.textContent = '⏳ Building PDF...';
      exportBtn.disabled = true;

      const d = latestAnalysisJson || {};
      const projectName = d.prd?.project_name || 'Hackathon Strategy';
      const problem = currentProblemContext || '';
      const pitch = d.judge_strategy?.one_line_winning_pitch || '';
      const judgeStrat = d.judge_strategy || {};
      const addons = d.best_addons || [];
      const features = d.feature_ideas || {};
      const prd = d.prd || {};
      const techReq = prd.technical_requirements || {};
      const winSecret = d.win_secret || '';
      const apiEndpoints = d.api_endpoints || '';
      const dbSchema = d.database_schema || '';
      const aiStrategy = d.ai_strategy || '';
      const demoFlow = d.best_demo_flow || [];
      const megaPrompt = d.mega_prompt || '';
      const targetUsers = d.target_users || [];
      const painPoints = d.core_pain_points || [];
      const techstack = d.techstack || '';

      // Helper: render a section only when it has content
      const sec = (emoji, title, html) => html ? `
        <div style="margin-top:1.6rem;page-break-inside:avoid;">
          <h2 style="color:#6d28d9;font-size:1rem;font-weight:700;margin:0 0 0.5rem;padding-bottom:0.3rem;border-bottom:2px solid #ede9fe;display:flex;align-items:center;gap:0.4rem;">
            <span>${emoji}</span> ${title}
          </h2>
          ${html}
        </div>` : '';

      const li = (label, val) => val ? `<li style="margin-bottom:5px;"><strong style="color:#374151;">${label}:</strong> ${val}</li>` : '';
      const pill = (text, color) => `<span style="display:inline-block;background:${color}22;color:${color};border:1px solid ${color}55;border-radius:20px;padding:2px 10px;font-size:0.72rem;font-weight:600;margin:2px;">${text}</span>`;

      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position:absolute; left:-9999px; top:0;
        width:760px; padding:32px 40px;
        background:#ffffff; color:#1f2937;
        font-family:Arial,Helvetica,sans-serif;
        font-size:13px; line-height:1.65;
      `;

      wrapper.innerHTML = `
        <!-- HEADER -->
        <div style="text-align:center;padding-bottom:1.2rem;margin-bottom:1.5rem;border-bottom:3px solid #7c3aed;">
          <div style="font-size:0.7rem;color:#7c3aed;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.3rem;">RAR Hackathon Helper</div>
          <h1 style="margin:0;font-size:1.8rem;font-weight:800;color:#1f2937;">${projectName}</h1>
          <p style="margin:0.4rem 0 0;color:#6b7280;font-size:0.78rem;">Strategy Export &nbsp;·&nbsp; ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
        </div>

        ${problem ? `
        <div style="background:#f5f3ff;border-left:4px solid #7c3aed;padding:0.75rem 1rem;border-radius:0 8px 8px 0;margin-bottom:1rem;page-break-inside:avoid;">
          <div style="font-size:0.7rem;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.3rem;">Problem Statement</div>
          <div style="color:#374151;">${problem}</div>
        </div>` : ''}

        ${pitch ? `
        <div style="background:#f0fdf4;border-left:4px solid #059669;padding:0.75rem 1rem;border-radius:0 8px 8px 0;margin-bottom:1rem;page-break-inside:avoid;">
          <div style="font-size:0.7rem;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.3rem;">One-Line Winning Pitch</div>
          <div style="color:#065f46;font-style:italic;font-size:0.95rem;">"${pitch}"</div>
        </div>` : ''}

        ${sec('🎯','Judge Strategy', judgeStrat.wow_factor ? `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;">
            ${judgeStrat.wow_factor ? `<div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;padding:0.6rem 0.8rem;"><div style="font-size:0.68rem;font-weight:700;color:#7c3aed;margin-bottom:0.2rem;">WOW FACTOR</div><div>${judgeStrat.wow_factor}</div></div>` : ''}
            ${judgeStrat.business_angle ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:0.6rem 0.8rem;"><div style="font-size:0.68rem;font-weight:700;color:#1d4ed8;margin-bottom:0.2rem;">BUSINESS ANGLE</div><div>${judgeStrat.business_angle}</div></div>` : ''}
            ${judgeStrat.social_or_market_impact ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:0.6rem 0.8rem;grid-column:1/-1;"><div style="font-size:0.68rem;font-weight:700;color:#059669;margin-bottom:0.2rem;">MARKET IMPACT</div><div>${judgeStrat.social_or_market_impact}</div></div>` : ''}
          </div>` : '')}

        ${sec('⚡','Top Add-ons to Win', addons.length ? `
          <ol style="margin:0;padding-left:1.2rem;">
            ${addons.slice(0,6).map(a => `<li style="margin-bottom:0.5rem;"><strong>${a.addon_name||''}</strong> — ${a.what_it_does||''} <span style="color:#6b7280;font-size:0.8rem;">(${a.implementation_difficulty||''}, ${a.estimated_build_time||''})</span></li>`).join('')}
          </ol>` : '')}

        ${sec('✅','Must-Have Features', (features.must_have_features||[]).length ? `
          <ul style="margin:0;padding-left:1.2rem;">
            ${(features.must_have_features||[]).map(f=>`<li style="margin-bottom:4px;">${f}</li>`).join('')}
          </ul>` : '')}

        ${sec('💡','Nice-to-Have Features', (features.nice_to_have_features||[]).length ? `
          <ul style="margin:0;padding-left:1.2rem;color:#374151;">
            ${(features.nice_to_have_features||[]).map(f=>`<li style="margin-bottom:4px;">${f}</li>`).join('')}
          </ul>` : '')}

        ${sec('🛠️','Recommended Tech Stack', (techstack || techReq.frontend) ? `
          <ul style="margin:0;padding-left:1.2rem;">
            ${techstack ? `<li style="margin-bottom:4px;"><strong>Stack:</strong> ${techstack}</li>` : ''}
            ${li('Frontend', techReq.frontend)}
            ${li('Backend', techReq.backend)}
            ${li('Database', techReq.database)}
            ${(techReq.integrations||[]).length ? `<li style="margin-bottom:4px;"><strong>Integrations:</strong> ${techReq.integrations.join(', ')}</li>` : ''}
            ${li('AI/ML', techReq.ai_ml)}
            ${li('Auth', techReq.auth)}
            ${li('Deployment', techReq.deployment)}
          </ul>` : '')}

        ${sec('🎯','Target Users', targetUsers.length ? `
          <ul style="margin:0;padding-left:1.2rem;">
            ${targetUsers.map(u=>`<li style="margin-bottom:4px;">${typeof u==='object'?(u.persona||u.user||JSON.stringify(u)):u}</li>`).join('')}
          </ul>` : '')}

        ${sec('😤','Core Pain Points', painPoints.length ? `
          <ul style="margin:0;padding-left:1.2rem;">
            ${painPoints.map(p=>`<li style="margin-bottom:4px;">${typeof p==='object'?(p.pain||p.problem||JSON.stringify(p)):p}</li>`).join('')}
          </ul>` : '')}

        ${sec('🔌','API Strategy', apiEndpoints ? `
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:0.75rem 1rem;font-size:0.8rem;white-space:pre-wrap;word-break:break-word;">${apiEndpoints}</div>` : '')}

        ${sec('🗄️','Database Schema', dbSchema ? `
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:0.75rem 1rem;font-size:0.8rem;white-space:pre-wrap;word-break:break-word;">${dbSchema}</div>` : '')}

        ${sec('🤖','AI Strategy', aiStrategy ? `
          <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;padding:0.75rem 1rem;">${aiStrategy}</div>` : '')}

        ${sec('🏆','Win Secrets', winSecret ? `
          <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:0.75rem 1rem;border-radius:0 8px 8px 0;">${winSecret}</div>` : '')}

        ${sec('🎬','Best Demo Flow', demoFlow.length ? `
          <ol style="margin:0;padding-left:1.2rem;">
            ${demoFlow.map(s=>`<li style="margin-bottom:6px;">${typeof s==='object'?(s.step||s.description||JSON.stringify(s)):s}</li>`).join('')}
          </ol>` : '')}

        ${megaPrompt ? `
        <div style="margin-top:1.6rem;page-break-before:always;">
          <h2 style="color:#6d28d9;font-size:1rem;font-weight:700;margin:0 0 0.5rem;padding-bottom:0.3rem;border-bottom:2px solid #ede9fe;">⚡ Mega Prompt for AI Tools</h2>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:0.75rem 1rem;font-size:0.75rem;line-height:1.7;white-space:pre-wrap;word-break:break-word;max-height:none;">${megaPrompt}</div>
        </div>` : ''}

        <!-- FOOTER -->
        <div style="margin-top:2rem;padding-top:0.75rem;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;font-size:0.68rem;color:#9ca3af;">
          <span>Generated by RAR Hackathon Helper</span>
          <span>hackathon-master-frontend.onrender.com</span>
          <span>Created by Alapati Revanth Sai Sankar</span>
        </div>
      `;

      document.body.appendChild(wrapper);

      try {
        await html2pdf().set({
          margin: [8, 10, 8, 10],
          filename: `${projectName.replace(/[^a-z0-9]/gi,'_')}_Strategy.pdf`,
          image: { type: 'jpeg', quality: 0.97 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: 760,
            windowWidth: 840
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
          pagebreak: { mode: ['css', 'legacy'], avoid: ['h2', 'li', '.avoid-break'] }
        }).from(wrapper).save();
        showToast('PDF exported!');
      } catch(err) {
        console.error('PDF export error:', err);
        showToast('PDF export failed — try again.');
      } finally {
        document.body.removeChild(wrapper);
        exportBtn.innerHTML = '&#x2B07; Export PDF';
        exportBtn.disabled = false;
      }
    });
  }

  // [RAR-FIX-7] Pitch Deck Generator
  document.body.addEventListener('click', async (e) => {
    if (e.target.id === 'stratPitchBtn') {
      const pitchPanel = document.getElementById('pitchPanel');
      const pitchOutput = document.getElementById('pitchOutput');
      pitchPanel.style.display = 'block';
      pitchOutput.innerHTML = '<div style="text-align:center;padding:3rem 0;color:var(--text-muted);">⏳ Generating your pitch script...</div>';

      const problem = currentProblemContext || stratProblem?.value?.trim() || 'an innovative hackathon project';
      const projectName = latestAnalysisJson?.prd?.project_name || 'Our Project';
      const pitch = latestAnalysisJson?.judge_strategy?.one_line_winning_pitch || '';
      const impact = latestAnalysisJson?.problem_analysis?.market_gap || '';

      if (window.waitForAuth) await window.waitForAuth();
      if (!canUseAI()) {
        pitchOutput.innerHTML = '<p style="color:#ef4444;">⚠️ Please sign in to generate a pitch script.</p>';
        return;
      }

      const prompt = `You are RAR, a hackathon pitch expert. Generate a 5-slide pitch script for this project.

Project: ${projectName}
Problem: ${problem}
One-line pitch: ${pitch}
Market gap: ${impact}

Return a JSON array with exactly 5 slides. Each slide:
{"slide": 1, "title": "...", "bullets": ["...","...","..."], "script": "30-second speaking script here", "emoji": "..."}

Slides must be: 1-Problem, 2-Solution, 3-Demo, 4-Market Opportunity, 5-The Ask/Call to Action.
Return ONLY valid JSON array, no markdown.`;

      try {
        const json = await callGemini('gemini-2.0-flash', [{ parts: [{ text: prompt }] }], { temperature: 0.6, maxOutputTokens: 2048, responseMimeType: 'application/json' });
        let raw = json.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        raw = raw.replace(/^```json?\s*/i,'').replace(/```\s*$/,'').trim();
        const slides = JSON.parse(raw);
        pitchOutput.innerHTML = slides.map((s,i) => `
          <div style="background:rgba(255,255,255,0.04);border:1px solid var(--border-color);border-radius:12px;padding:1.25rem;margin-bottom:1rem;">
            <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.75rem;">
              <span style="background:rgba(167,139,250,0.2);color:#a78bfa;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">${s.slide}</span>
              <span style="font-size:1.3rem;">${s.emoji||'📊'}</span>
              <h4 style="margin:0;font-size:1rem;">${s.title}</h4>
            </div>
            <ul style="padding-left:1.25rem;margin:0 0 0.75rem 0;">${(s.bullets||[]).map(b=>`<li style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:4px;">${b}</li>`).join('')}</ul>
            <div style="background:rgba(6,182,212,0.08);border-left:3px solid #06b6d4;padding:0.6rem 0.8rem;border-radius:0 6px 6px 0;font-size:0.82rem;color:#67e8f9;font-style:italic;">${s.script}</div>
          </div>`).join('');
      } catch(err) {
        pitchOutput.innerHTML = `<p style="color:#ef4444;">Failed to generate pitch: ${err.message}</p>`;
      }
    }

    if (e.target.id === 'pitchPanelClose') document.getElementById('pitchPanel').style.display = 'none';

    if (e.target.id === 'pitchCopy') {
      const txt = document.getElementById('pitchOutput').innerText;
      navigator.clipboard.writeText(txt).then(() => showToast('Pitch copied!'));
    }

    if (e.target.id === 'pitchDownloadPdf') {
      if (typeof html2pdf !== 'undefined') {
        showToast('Generating PDF...');
        html2pdf().set({ margin:0.5, filename:'Pitch_Script.pdf', html2canvas:{scale:2}, jsPDF:{unit:'in',format:'a4',orientation:'portrait'} })
          .from(document.getElementById('pitchOutput')).save().then(() => showToast('PDF Downloaded!'));
      } else { showToast('PDF library not loaded.'); }
    }
  });

  // [RAR-FIX-8] Judge Scoring Simulator
  document.body.addEventListener('click', async (e) => {
    if (e.target.id === 'stratJudgeBtn') {
      const judgePanel = document.getElementById('judgePanel');
      const judgeOutput = document.getElementById('judgeOutput');
      judgePanel.style.display = 'block';
      judgeOutput.innerHTML = '<div style="text-align:center;padding:3rem 0;color:var(--text-muted);">⏳ Simulating judge evaluation...</div>';

      const problem = currentProblemContext || stratProblem?.value?.trim() || 'hackathon project';
      const projectName = latestAnalysisJson?.prd?.project_name || 'Project';
      const vision = latestAnalysisJson?.prd?.vision || '';

      if (window.waitForAuth) await window.waitForAuth();
      if (!canUseAI()) {
        judgeOutput.innerHTML = '<p style="color:#ef4444;">⚠️ Please sign in to simulate judge scoring.</p>';
        return;
      }

      const prompt = `You are a hackathon judge panel. Score this project fairly.
Project: ${projectName}
Description: ${problem}
Vision: ${vision}

Return JSON: {"scores":{"innovation":{"score":85,"feedback":"..."},"technical":{"score":80,"feedback":"..."},"impact":{"score":90,"feedback":"..."},"presentation":{"score":75,"feedback":"..."}},"total":82,"verdict":"...","improvements":["...","...","..."]}
Scores out of 100. Total = average. Return ONLY valid JSON.`;

      try {
        const json = await callGemini('gemini-2.0-flash', [{ parts: [{ text: prompt }] }], { temperature: 0.4, maxOutputTokens: 1024, responseMimeType: 'application/json' });
        let raw = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        raw = raw.replace(/^```json?\s*/i,'').replace(/```\s*$/,'').trim();
        const d = JSON.parse(raw);
        const cats = [
          { key:'innovation', label:'Innovation', emoji:'💡', weight:25, color:'#a78bfa' },
          { key:'technical', label:'Technical Complexity', emoji:'⚙️', weight:25, color:'#06b6d4' },
          { key:'impact', label:'Impact', emoji:'🌍', weight:25, color:'#10b981' },
          { key:'presentation', label:'Presentation', emoji:'🎤', weight:25, color:'#f59e0b' },
        ];
        judgeOutput.innerHTML = `
          <div style="text-align:center;margin-bottom:1.5rem;">
            <div style="font-size:3rem;font-weight:800;color:${d.total>=80?'#10b981':d.total>=60?'#f59e0b':'#ef4444'};">${d.total}</div>
            <div style="font-size:0.85rem;color:var(--text-muted);">/ 100 Total Score</div>
            <div style="margin-top:0.5rem;font-size:0.9rem;color:var(--text-primary);font-style:italic;">"${d.verdict}"</div>
          </div>
          ${cats.map(c => {
            const s = d.scores[c.key] || {};
            const pct = s.score || 0;
            return `<div style="margin-bottom:1rem;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span>${c.emoji} ${c.label} <span style="font-size:0.75rem;color:var(--text-muted);">(${c.weight}%)</span></span>
                <span style="font-weight:700;color:${c.color};">${pct}/100</span>
              </div>
              <div style="background:rgba(255,255,255,0.06);border-radius:6px;height:8px;overflow:hidden;margin-bottom:4px;">
                <div style="height:100%;width:${pct}%;background:${c.color};border-radius:6px;transition:width 0.8s ease;"></div>
              </div>
              <p style="font-size:0.78rem;color:var(--text-muted);margin:0;">${s.feedback||''}</p>
            </div>`;
          }).join('')}
          <div style="margin-top:1.5rem;background:rgba(167,139,250,0.08);border:1px solid rgba(167,139,250,0.2);border-radius:10px;padding:1rem;">
            <h4 style="margin:0 0 0.6rem 0;font-size:0.9rem;color:#a78bfa;">🚀 3 Ways to Improve Your Score</h4>
            <ol style="padding-left:1.25rem;margin:0;">${(d.improvements||[]).map(imp=>`<li style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:4px;">${imp}</li>`).join('')}</ol>
          </div>`;
      } catch(err) {
        judgeOutput.innerHTML = `<p style="color:#ef4444;">Failed: ${err.message}</p>`;
      }
    }

    if (e.target.id === 'judgePanelClose') document.getElementById('judgePanel').style.display = 'none';
  });

});

