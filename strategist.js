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



      if (now - latest.timestamp < 86400000) {



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



            renderStrategyJSON(fallbackResult);



            saveToHistory(problem, fallbackResult);



            



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



  async function callGeminiStrategist(apiKey, problem, ctx, searchData = null) {



    let researchContext = "";



    if (searchData) {



      researchContext = "CRITICAL RESEARCH DATA (From Serper.dev Deep Search):\n" +



        searchData.aggregatedSnippets + "\n\nPEOPLE ALSO ASK:\n" +



        searchData.aggregatedPAA.map(p => p.question).join(", ");



    }







    const systemPrompt = `You are a world-class AI Hackathon Strategist. Analyze the problem and return ONLY a valid JSON object � no markdown, no code blocks, no explanation, no trailing text.







User Problem Statement: "${problem}"



Context: Theme: ${ctx.theme}, Stack: ${ctx.stack}, Time: ${ctx.time}, Team: ${ctx.team}



${researchContext}







RULES:



- Return ONLY raw JSON. No markdown fences. No commentary before or after.



- All string values MUST be single-line. Escape newlines as \\n inside strings.



- Keep each string value under 200 characters.







Return this exact JSON structure with all fields filled:



{"problem_analysis":{"refined_problem":"...","target_users":["..."],"core_pain_points":["..."],"market_gap":"...","winning_product_direction":"..."},"research_insights":{"existing_solution_patterns":["..."],"common_weaknesses":["..."],"emerging_opportunities":["..."],"useful_tools_apis":[{"name":"...","type":"...","why_it_matters":"..."}]},"best_addons":[{"addon_name":"...","category":"...","what_it_does":"...","why_it_improves_the_solution":"...","hackathon_value":"...","implementation_difficulty":"Easy","estimated_build_time":"2h","recommended_stack":"...","apis_or_tools":["..."],"demo_impact_score":9,"judge_wow_score":9}],"top_5_priority_addons":[{"rank":1,"addon_name":"...","reason":"..."}],"feature_ideas":{"must_have_features":["..."],"nice_to_have_features":["..."],"future_scope":["..."]},"prompt_pack":{"master_build_prompt":"...","frontend_ui_prompt":"...","backend_api_prompt":"...","database_prompt":"...","ai_integration_prompt":"...","pitch_demo_prompt":"..."},"judge_strategy":{"wow_factor":"...","best_demo_flow":["..."],"business_angle":"...","social_or_market_impact":"...","one_line_winning_pitch":"..."},"prd":{"project_name":"...","vision":"...","user_personas":["..."],"core_features":[{"feature":"...","priority":"P0","description":"..."}],"technical_requirements":{"frontend":"...","backend":"...","database":"...","integrations":["..."]},"data_models":[{"model_name":"...","fields":["..."]}],"api_endpoints":[{"method":"POST","path":"/api/...","description":"..."}],"security_considerations":["..."],"scalability_plan":["..."],"success_metrics":["..."],"roadmap":["..."]}}`;







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



    let retries = 3, delay = 2000, response, lastError = "";



    let selectedModel = 'gemini-2.5-flash';



    while (retries > 0) {



      try {



        response = await fetch(



          `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,



          {



            method: 'POST',



            headers: { 'Content-Type': 'application/json' },



            body: JSON.stringify({



              contents: [{ parts: [{ text: systemPrompt }] }],



              // NOTE: google_search tool is intentionally REMOVED.



              // It conflicts with responseMimeType:application/json and causes



              // Gemini to inject citation text that breaks JSON parsing.



              generationConfig: {



                temperature: 0.3,



                maxOutputTokens: 8192,



                responseMimeType: "application/json"



              }



            })



          }



        );



        if (response.status === 429) {



          const errData = await response.json().catch(() => ({}));



          lastError = errData.error?.message || "Quota Exceeded";



          if (selectedModel === 'gemini-2.0-flash') {



            console.warn("Gemini 2.0 Flash quota exceeded. Switching to stable Gemini 1.5 Flash fallback...");



            showToast("[API Warning] Gemini 2.0 Quota reached. Switching to stable Gemini 1.5 Flash fallback...");



            selectedModel = 'gemini-1.5-flash';



            await new Promise(r => setTimeout(r, 1000));



            continue;



          }



          throw new Error("High Demand");



        }



        if (response.status === 503) {



          const errData = await response.json().catch(() => ({}));



          lastError = errData.error?.message || "Model Overloaded";



          throw new Error("High Demand");



        }



        if (!response.ok) {



          const errData = await response.json().catch(() => ({}));



          throw new Error(errData.error?.message || "API Network Error");



        }



        break;



      } catch (err) {



        if (err.message === "High Demand") {



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







    const data = await response.json();



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



  function generateFallbackJSON(problem, ctx) {



    const text = problem.toLowerCase();







    // Search the extended 1000-item offline knowledge base first



    const extKb = (typeof window !== 'undefined' && window.OFFLINE_KNOWLEDGE_BASE) ? window.OFFLINE_KNOWLEDGE_BASE : [];



    



    // Improved scoring match



    let matched = null;



    let highestScore = 0;







    extKb.forEach(item => {



      let score = 0;



      item.keywords.forEach(kw => {



        if (text.includes(kw.toLowerCase())) score += 2;



      });



      if (item.result && item.result.industry && text.includes(item.result.industry.toLowerCase())) {



        score += 3;



      }



      if (score > highestScore) {



        highestScore = score;



        matched = item;



      }



    });



    



    let domainTech   = matched ? matched.result.techstack   : 'Next.js + Node.js + Supabase';



    let domainAI     = matched ? matched.result.ai_strategy : 'Use Gemini 2.0 Flash for real-time analysis and content generation.';



    let domainIndustry = matched ? matched.result.industry  : 'General Tech';



    let domainSecret = matched ? matched.result.win_secret  : 'Focus on extreme UI polish and a flawless live demo moment.';



    let domainMegaPrompt = matched ? matched.result.mega_prompt : 'Act as a Senior Full Stack Engineer. Build a sleek modern web application using Next.js and Tailwind CSS with dark mode, animations, and Supabase for auth and data.';



    let domainAPIs   = matched ? matched.result.api_endpoints.split('\\n') : ['POST /api/v1/auth/login', 'GET /api/v1/dashboard', 'POST /api/v1/ai/process'];



    let domainDB     = matched ? matched.result.database_schema : 'Table Users { id uuid [pk], email varchar }\\nTable Projects { id uuid [pk], user_id uuid, data jsonb }';







    



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



        "refined_problem": "A streamlined, intelligent solution targeting: " + problem.substring(0, 80) + "...",



        "target_users": ["Primary Stakeholders", "End Consumers", "System Admins"],



        "core_pain_points": ["Manual processes causing inefficiency", "Lack of real-time insights", "Poor UX in legacy tools"],



        "market_gap": matched ? domainSecret : marketGap,



        "winning_product_direction": "An AI-first, mobile-responsive web app with real-time data sync for " + domainIndustry + "."



      },



      "research_insights": {



        "existing_solution_patterns": insights,



        "common_weaknesses": ["No offline support", "Clunky UI/UX", "High latency"],



        "emerging_opportunities": ["Edge AI processing", "Automated RAG workflows", "Voice-first interfaces"],



        "useful_tools_apis": [



          {"name": "Supabase", "type": "Backend/DB", "why_it_matters": "Instant real-time Postgres and Auth."},



          {"name": "Groq", "type": "LLM API", "why_it_matters": "Blazing fast inference for demo magic."},



          {"name": "Vercel AI SDK", "type": "AI Toolkit", "why_it_matters": "Streaming LLM responses with 3 lines of code."}



        ]



      },



      "best_addons": addons,



      "top_5_priority_addons": [



        {"rank": 1, "addon_name": addons[0].addon_name, "reason": "Fastest way to integrate AI for a live demo."},



        {"rank": 2, "addon_name": addons[1].addon_name, "reason": "Highest technical wow factor for judges."}



      ],



      "feature_ideas": {



        "must_have_features": ["User Authentication", "Core Data Input Form", "AI Result Dashboard"],



        "nice_to_have_features": ["Dark/Light Mode Toggle", "Export to PDF", "Real-time notifications"],



        "future_scope": ["Native iOS/Android App", "Enterprise SSO integration", "API marketplace"]



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



        "business_angle": "B2B SaaS model with tiered pricing based on usage. Target " + domainIndustry + " teams of 5-50 people.",



        "social_or_market_impact": "Significantly reduces wasted hours and improves accessibility across the " + domainIndustry + " market.",



        "one_line_winning_pitch": "We're turning a 5-hour " + domainIndustry + " headache into a 5-second automated delight — powered by AI."



      },



      "prd": {



        "project_name": "AI " + domainIndustry + " Platform",



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



});



