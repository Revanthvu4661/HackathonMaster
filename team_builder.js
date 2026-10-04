document.addEventListener('DOMContentLoaded', () => {

  // Global Logic Handled by theme.js

  // --- Team Builder Specific Logic ---

  

  // Elements

  const tbIdea = document.getElementById('tbIdea');
  // latestTeamData declared at the top of the file

  const tbCharCount = document.getElementById('tbCharCount');

  const tbGenerateBtn = document.getElementById('tbGenerateBtn');

  const tbBtnText = document.getElementById('tbBtnText');

  const tbBtnLoading = document.getElementById('tbBtnLoading');

  const ctxSize = document.getElementById('tbTeamSize');

  const ctxSkills = document.getElementById('tbMySkills');

  const ctxDomain = document.getElementById('tbDomain');

  const ctxDuration = document.getElementById('tbDuration');

  // AI access: Gemini runs through the signed-in user's account (the key lives on the server, see js/api.js).
  const apiKeyBanner = document.getElementById('tbApiKeyBanner');
  const canUseAI = () => !!(window.callGemini && window.canUseAI && window.canUseAI());

  function checkApiKey() {
    const live = canUseAI();
    apiKeyBanner.classList.toggle('success', live);
    apiKeyBanner.style.border = live ? '1px solid var(--accent-primary)' : '';
    apiKeyBanner.innerHTML = `
      <div class="api-key-banner-left">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${live ? '#10b981' : '#f59e0b'}" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span><strong>Status:</strong> ${live ? '<span style="color:#10b981;">Gemini AI Active (your account)</span>' : '<span style="color:#f59e0b;">Offline mode: sign in for live Gemini AI</span>'}</span>
      </div>
      ${live ? '' : '<div style="display:flex; gap:0.5rem;"><button class="btn-primary btn-sm" id="tbSignInBtn">Sign in</button></div>'}
    `;
    const signIn = document.getElementById('tbSignInBtn');
    if (signIn) signIn.addEventListener('click', () => { const b = document.querySelector('.rar-auth-btn'); if (b) b.click(); });
  }

  checkApiKey();
  window.addEventListener('rar:auth', checkApiKey);   // js/auth-ui.js fires this when the user signs in or out

  // Input Handling

  if(tbIdea) {

    tbIdea.addEventListener('input', () => {

      const count = tbIdea.value.length;

      tbCharCount.textContent = count + " / 2000 characters";

      tbGenerateBtn.disabled = count < 20;

    });

  }

  document.querySelectorAll('.example-chip').forEach(chip => {

    chip.addEventListener('click', () => {

      tbIdea.value = chip.getAttribute('data-idea');

      tbIdea.dispatchEvent(new Event('input'));

    });

  });

  // --- History Management ---

  const historySidebar = document.getElementById('historySidebar');

  const historyToggle = document.getElementById('historyToggle');

  const closeHistory = document.getElementById('closeHistory');

  const historyList = document.getElementById('historyList');

  const historyBadge = document.getElementById('historyBadge');

  let tbHistory = JSON.parse(localStorage.getItem('tb_history') || '[]');

  window.updateTbHistoryUI = updateTbHistoryUI;

  function updateTbHistoryUI() {

    if (historyList) {

      if (tbHistory.length === 0) {

        historyList.innerHTML = `

          <div class="history-empty">

            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.3; margin-bottom:1rem;"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>

            <p>No recent teams found.</p>

          </div>

        `;

        historyBadge.style.display = 'none';

      } else {

        historyBadge.style.display = 'flex';

        historyBadge.textContent = tbHistory.length;

        historyList.innerHTML = tbHistory.map((item, index) => `

          <div class="history-item" data-index="${index}">

            <div class="history-item-title">${item.idea.substring(0, 60)}${item.idea.length > 60 ? '...' : ''}</div>

            <div class="history-item-meta">

              <span class="history-item-tag">${item.domain || 'Auto'}</span>

              <span class="history-item-date">${new Date(item.timestamp).toLocaleDateString()}</span>

            </div>

          </div>

        `).join('');

        document.querySelectorAll('.history-item').forEach(item => {

          item.addEventListener('click', () => {

            const index = item.getAttribute('data-index');

            const savedData = tbHistory[index];

            loadSavedTeam(savedData);

            historySidebar.classList.remove('open');

          });

        });

      }

    }

  }

  function saveTbToHistory(idea, result, domain) {

    const newItem = {

      idea: idea,

      result: result,

      domain: domain || 'Auto',

      timestamp: new Date().getTime()

    };

    tbHistory = tbHistory.filter(h => h.idea !== idea);

    tbHistory.unshift(newItem);

    if (tbHistory.length > 10) tbHistory.pop();

    if (window.HistoryManager) { window.HistoryManager.saveTeamBuilderResult(idea, result, domain); } else { localStorage.setItem('tb_history', JSON.stringify(tbHistory)); }

    localStorage.setItem('latest_tb_result', JSON.stringify(newItem));

    updateTbHistoryUI();

  }

  window.loadSavedTeam = loadSavedTeam;

  function loadSavedTeam(data) {

    tbIdea.value = data.idea;

    tbIdea.dispatchEvent(new Event('input'));

    latestTeamData = data.result;

    renderTeamBuilderJSON(data.result);

    document.getElementById('tbOutput').style.display = 'block';

    document.getElementById('tbOutput').scrollIntoView({ behavior: 'smooth' });

    showToast('Loaded from history');

  }

  if (historyToggle) {

    historyToggle.addEventListener('click', () => historySidebar.classList.add('open'));

  }

  if (closeHistory) {

    closeHistory.addEventListener('click', () => historySidebar.classList.remove('open'));

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

  // --- Auto-Restore Latest Team ---

  const latestTbStr = localStorage.getItem('latest_tb_result');

  if (latestTbStr) {

    try {

      const latest = JSON.parse(latestTbStr);

      const now = new Date().getTime();

      if (true) {

        loadSavedTeam(latest);

      }

    } catch (e) {

      console.error("Failed to auto-restore latest team builder result", e);

    }

  }

  updateTbHistoryUI();

  // Action

  let latestTeamData = null;

  if(tbGenerateBtn) {

    tbGenerateBtn.addEventListener('click', async () => {

      const idea = tbIdea.value;

      if (idea.length < 20) return;

      tbGenerateBtn.disabled = true;

      tbBtnText.style.display = 'none';

      tbBtnLoading.style.display = 'flex';

      document.getElementById('tbOutput').style.display = 'none';

      

      const overlay = document.getElementById('tbOverlay');

      overlay.style.display = 'flex';

      

      if (window.waitForAuth) await window.waitForAuth();   // let Firebase restore the session before deciding live vs offline
      const useAI = canUseAI();

      const context = {

        size: ctxSize.value || '2',

        skills: ctxSkills.value || 'None specified',

        domain: ctxDomain.value || 'Auto',

        duration: ctxDuration.value || '24 hours'

      };

      try {

        if (useAI) {

          simulateProgressUI(true);

          const result = await callGeminiTeamBuilder(idea, context);

          latestTeamData = result;

          renderTeamBuilderJSON(result, true);

          saveTbToHistory(idea, result, context.domain);

          completeProgressUI();

        } else {

          simulateProgressUI(false);

          setTimeout(() => {

            const fallbackResult = getFallbackTeamJSON(idea, context);

            latestTeamData = fallbackResult;

            renderTeamBuilderJSON(fallbackResult, false);

            saveTbToHistory(idea, fallbackResult, context.domain);

            completeProgressUI();

          }, 3500);

        }

      } catch (err) {

        console.error("Team Builder failed:", err);

        showToast("Live API failed. Falling back to simulation.");

        const fallbackResult = getFallbackTeamJSON(idea, context);

        latestTeamData = fallbackResult;

        renderTeamBuilderJSON(fallbackResult, false);

        saveTbToHistory(idea, fallbackResult, context.domain);

        completeProgressUI();

      }

    });

  }

  function simulateProgressUI(isLive) {

    const steps = ['tbstep1', 'tbstep2', 'tbstep3', 'tbstep4', 'tbstep5'];

    const bar = document.getElementById('tbProgressBar');

    const label = document.getElementById('tbProgressLabel');

    

    steps.forEach(id => {

      const el = document.getElementById(id);

      el.classList.remove('active', 'completed');

      el.querySelector('.step-dot').innerHTML = '';

    });

    bar.style.width = '0%';

    

    let current = 0;

    const intervalTime = isLive ? 1500 : 700;

    

    window.tbProgressInterval = setInterval(() => {

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

        if(isLive && current === 2) label.innerText = "Analyzing team combinations...";

        current++;

      } else {

        clearInterval(window.tbProgressInterval);

      }

    }, intervalTime);

  }

  function completeProgressUI() {

    clearInterval(window.tbProgressInterval);

    document.getElementById('tbProgressBar').style.width = '100%';

    setTimeout(() => {

      document.getElementById('tbOverlay').style.display = 'none';

      const output = document.getElementById('tbOutput');

      output.style.display = 'block';

      output.scrollIntoView({ behavior: 'smooth', block: 'start' });

      

      tbGenerateBtn.disabled = false;

      tbBtnText.style.display = 'flex';

      tbBtnLoading.style.display = 'none';

      showToast('Team Intelligence Complete!');

    }, 500);

  }

  // Toast Function 

  function showToast(message) {

    const toast = document.getElementById('toast');

    if(toast) {

        toast.innerText = message;

        toast.style.display = 'block';

        toast.style.opacity = '1';

        setTimeout(() => {

            toast.style.opacity = '0';

            setTimeout(() => toast.style.display = 'none', 300);

        }, 3000);

    }

  }

  // --- API CALL FUNCTION ---

  async function callGeminiTeamBuilder(idea, ctx) {

    const systemPrompt = `You are an expert technical recruiter and hackathon strategist.

Given the hackathon idea, team size, current skills, and duration, output a JSON structure defining the optimal team composition.

Idea: "${idea}"

Size: ${ctx.size}

User Skills: ${ctx.skills}

Domain: ${ctx.domain}

Duration: ${ctx.duration}

STRICT JSON ONLY. No markdown outside the JSON block.

SCHEMA:

{

  "project_summary": { "name": "...", "complexity": "Low/Medium/High", "core_stack": ["..."] },

  "roles": [

    { 

      "title": "Frontend Lead", 

      "type": "Engineering", 

      "priority": "Critical", 

      "description": "...", 

      "primary_skills": ["..."], 

      "responsibilities": ["..."] 

    }

  ],

  "skills_map": [

    { "domain": "Frontend", "required_skills": [{"name": "React", "level": "Expert"}] }

  ],

  "task_timeline": [

    { "phase": "Ideation (0-2h)", "tasks": ["..."], "roles_involved": ["Frontend Lead"] }

  ],

  "collaboration": {

    "tools": [{"name": "GitHub", "use": "Code repo"}],

    "protocols": ["..."]

  },

  "solo_strategy": {

    "is_solo": true,

    "warning": "...",

    "ai_tools": [{"name": "Cursor", "use": "..."}]

  }

}`;

    let data;
    try {
      // Falls back 2.5 -> 2.0 on 429 / network / 5xx (same behaviour as before, now through the server).
      data = await callGeminiWithFallback(
        [{ parts: [{ text: systemPrompt }] }],
        { temperature: 0.4, maxOutputTokens: 8192 },
        { onFallback: () => showToast("[API Warning] Gemini 2.5 busy. Switching to Gemini 2.0 Flash...") });
    } catch (err) {
      throw new Error((err && err.message) || "API Network Error");
    }

    const text = data.candidates[0].content.parts[0].text;

    const jsonMatch = text.match(/\{[\s\S]*\}/);

    const repairJson = (str) => {

      let res = str.trim();

      let inString = false;

      let escapeNext = false;

      let sanitized = '';

      for (let i = 0; i < res.length; i++) {

        const char = res[i];

        if (escapeNext) { sanitized += char; escapeNext = false; continue; }

        if (char === '\\') { escapeNext = true; sanitized += char; continue; }

        if (char === '"') { inString = !inString; sanitized += char; continue; }

        if (inString && char === '\n') { sanitized += '\\n'; continue; }

        if (inString && char === '\t') { sanitized += '\\t'; continue; }

        if (inString && char === '\r') { sanitized += '\\r'; continue; }

        sanitized += char;

      }

      res = sanitized;

      if (inString) res += '"';

      let braceCount = 0;

      let bracketCount = 0;

      for (let i = 0; i < res.length; i++) {

        if (res[i] === '{') braceCount++;

        else if (res[i] === '}') braceCount--;

        else if (res[i] === '[') bracketCount++;

        else if (res[i] === ']') bracketCount--;

      }

      while (bracketCount > 0) { res += ']'; bracketCount--; }

      while (braceCount > 0) { res += '}'; braceCount--; }

      return res;

    };

    if (jsonMatch) {

      try {

        return JSON.parse(repairJson(jsonMatch[0]));

      } catch (e) {

        console.warn("JSON parse failed even after repair", e);

      }

    }

    return JSON.parse(repairJson(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()));

  }

  // --- RENDER LOGIC ---

  function renderTeamBuilderJSON(data, isLive) {

    const summaryBanner = document.getElementById('tbSummaryBanner');

    summaryBanner.innerHTML = '';

    

    if(!isLive) {

        summaryBanner.innerHTML += `<div class="tb-offline-badge">⚠️ Offline Simulation (sign in for live AI)</div>`;

    }

    summaryBanner.innerHTML += `

      <div class="tb-summary-icon">🎯</div>

      <div class="tb-summary-text">

        <h3>${data.project_summary.name || "Project Blueprint"}</h3>

        <p>Complexity: ${data.project_summary.complexity}</p>

      </div>

      <div class="tb-summary-chips">

        ${data.project_summary.core_stack.map(s => `<span class="tb-chip blue">${s}</span>`).join('')}

      </div>

    `;

    const htmlMap = {

      roles: buildRolesHTML(data.roles),

      skills: buildSkillsHTML(data.skills_map),

      tasks: buildTasksHTML(data.task_timeline),

      collab: buildCollabHTML(data.collaboration),

      solo: buildSoloHTML(data.solo_strategy)

    };

    const contentBox = document.getElementById('tbContent');

    contentBox.innerHTML = '';

    

    Object.keys(htmlMap).forEach(key => {

      const section = document.createElement('div');

      section.className = `output-section ${key === 'roles' ? 'active' : ''}`;

      section.id = `tbtab-${key}`;

      section.innerHTML = htmlMap[key];

      contentBox.appendChild(section);

    });

    const tabs = document.querySelectorAll('#tbTabs .tab-btn');

    tabs.forEach(tab => {

      const newTab = tab.cloneNode(true);

      tab.parentNode.replaceChild(newTab, tab);

      newTab.addEventListener('click', () => {

        const tabType = newTab.getAttribute('data-tbtab');

        document.querySelectorAll('#tbTabs .tab-btn').forEach(t => t.classList.remove('active'));

        newTab.classList.add('active');

        document.querySelectorAll('#tbContent .output-section').forEach(s => s.classList.remove('active'));

        document.getElementById(`tbtab-${tabType}`).classList.add('active');

      });

    });

  }

  function getPriorityColor(p) {

      if(p.includes('Critical')) return ['#ef4444', '#b91c1c'];

      if(p.includes('High')) return ['#f59e0b', '#d97706'];

      if(p.includes('Medium')) return ['#a78bfa', '#7c3aed'];

      return ['#64748b', '#475569'];

  }

  function buildRolesHTML(roles) {

    return `<div class="tb-roles-grid">

      ${roles.map(r => {

        const pClass = r.priority.toLowerCase();

        const colors = getPriorityColor(r.priority);

        return `<div class="tb-role-card" style="--role-color-a:${colors[0]}; --role-color-b:${colors[1]}">

          <div class="tb-role-header">

            <div class="tb-role-avatar">${r.title[0]}</div>

            <div class="tb-role-meta">

              <h4 class="tb-role-title">${r.title}</h4>

              <span class="tb-role-type">${r.type}</span>

            </div>

          </div>

          <span class="tb-role-priority ${pClass}">${r.priority}</span>

          <p class="tb-role-desc">${r.description}</p>

          <div class="tb-role-section-title">Required Skills</div>

          <div class="tb-skills-cloud">

            ${r.primary_skills.map(s => `<span class="tb-skill-tag primary">${s}</span>`).join('')}

          </div>

          <div class="tb-role-section-title">Key Responsibilities</div>

          <ul class="tb-resp-list">

            ${r.responsibilities.map(resp => `<li>${resp}</li>`).join('')}

          </ul>

        </div>`;

      }).join('')}

    </div>`;

  }

  function buildSkillsHTML(map) {

    return `<div class="tb-skills-map">

      ${map.map(d => `<div class="tb-skill-domain">

        <div class="tb-skill-domain-header">

          <div class="tb-skill-domain-icon">🧠</div>

          <h4>${d.domain}</h4>

        </div>

        ${d.required_skills.map(s => {

           let fill = 50;

           if(s.level==='Expert') fill=90;

           else if(s.level==='Intermediate') fill=60;

           else if(s.level==='Beginner') fill=30;

           return `<div class="tb-skill-bar-item">

             <div class="tb-skill-bar-top">

               <span class="tb-skill-bar-name">${s.name}</span>

               <span class="tb-skill-bar-level">${s.level}</span>

             </div>

             <div class="tb-skill-bar-bg"><div class="tb-skill-bar-fill" style="width:${fill}%"></div></div>

           </div>`;

        }).join('')}

      </div>`).join('')}

    </div>`;

  }

  function buildTasksHTML(timeline) {

    return `<div class="tb-timeline">

      ${timeline.map(t => `<div class="tb-timeline-item">

        <div class="tb-timeline-dot">⏱️</div>

        <div class="tb-timeline-content">

          <div class="tb-timeline-phase">${t.phase}</div>

          <h4 class="tb-timeline-title">Key Actions</h4>

          <ul class="tb-timeline-tasks">

            ${t.tasks.map(task => `<li>${task}</li>`).join('')}

          </ul>

          <div class="tb-timeline-roles-row">

            ${t.roles_involved.map(r => `<span class="tb-timeline-role-badge">${r}</span>`).join('')}

          </div>

        </div>

      </div>`).join('')}

    </div>`;

  }

  function buildCollabHTML(c) {

    return `<div class="tb-collab-grid">

      <div class="tb-collab-card">

        <h4><span style="font-size:1.2rem">🛠️</span> Tool Stack</h4>

        <div class="tb-tool-list">

          ${c.tools.map(t => `<div class="tb-tool-item">

            <div class="tb-tool-icon">🔧</div>

            <div class="tb-tool-info"><strong>${t.name}</strong><span>${t.use}</span></div>

          </div>`).join('')}

        </div>

      </div>

      <div class="tb-collab-card">

        <h4><span style="font-size:1.2rem">📜</span> Team Protocols</h4>

        <ul class="tb-protocol-list">

          ${c.protocols.map((p, i) => `<li><span class="num">${i+1}</span>${p}</li>`).join('')}

        </ul>

      </div>

    </div>`;

  }

  function buildSoloHTML(s) {

    if(!s || !s.warning) return '<p>No solo strategy generated.</p>';

    return `<div class="tb-solo-section">

      <div class="tb-solo-warning"><strong>Heads up:</strong> ${s.warning}</div>

      <div class="tb-solo-cards">

        <div class="tb-solo-card">

          <h4>🤖 AI Multipliers</h4>

          <ul class="tb-ai-tools-list">

             ${s.ai_tools.map(a => `<li><strong>${a.name}</strong><span>${a.use}</span></li>`).join('')}

          </ul>

        </div>

      </div>

    </div>`;

  }

  function getFallbackTeamJSON(idea, ctx) {

    const text = idea.toLowerCase();

    const extKb = [
      ...(typeof window !== 'undefined' && window.OFFLINE_KNOWLEDGE_BASE           ? window.OFFLINE_KNOWLEDGE_BASE           : []),
      ...(typeof window !== 'undefined' && window.OFFLINE_KNOWLEDGE_BASE_EXTENDED  ? window.OFFLINE_KNOWLEDGE_BASE_EXTENDED  : []),
      ...(typeof window !== 'undefined' && window.OFFLINE_KNOWLEDGE_BASE_REALWORLD ? window.OFFLINE_KNOWLEDGE_BASE_REALWORLD : []),
      ...(typeof window !== 'undefined' && window.OFFLINE_KNOWLEDGE_BASE_MODULES   ? window.OFFLINE_KNOWLEDGE_BASE_MODULES   : []),
    ];

    const promptWords   = text.split(/\W+/).filter(w => w.length > 3);
    const promptWordSet = new Set(promptWords);

    let bestMatch    = null;
    let highestScore = -1;

    extKb.forEach(item => {
      if (!item.keywords) return;
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
      if (item.result && item.result.industry) {
        const ind = item.result.industry.toLowerCase();
        if (text.includes(ind)) raw += 5;
        else if (ind.split(/\W+/).some(w => w.length > 3 && text.includes(w))) raw += 2;
      }
      if (raw === 0) return;
      const normalized = raw / Math.sqrt(item.keywords.length);
      if (normalized > highestScore) { highestScore = normalized; bestMatch = item; }
    });

    if (highestScore < 1.5) bestMatch = null;

    if (bestMatch && bestMatch.team_result) {

        // Customize the match based on user context

        const result = JSON.parse(JSON.stringify(bestMatch.team_result));
        // Override project name + stack with problem-specific values
        const _stopW = new Set(['with','that','this','from','have','will','build','make','create','using','based','into','help','want','need','give','show','able','user','users','people','system','platform','application','solution','tool','data','online','simple','easy','good','best','app','website','web','for','and','the','your']);
        const _probW = idea.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !_stopW.has(w));
        const _cap   = _probW.length > 0 ? (_probW[0].charAt(0).toUpperCase() + _probW[0].slice(1, 9).toLowerCase()) : '';
        const _sfxs  = ['AI','Hub','Sync','Flow','Link','Wave','Core','Lab','Pro'];
        const _sfx   = _sfxs[idea.length % _sfxs.length];
        if (_cap) result.project_summary.name = (_probW.length > 1 ? _cap + ' ' + (_probW[1].charAt(0).toUpperCase() + _probW[1].slice(1,7).toLowerCase()) : _cap + _sfx) + ' (Team Blueprint)';
        // Override stack if idea mentions a specific tech
        if (/mobile|flutter|react native|android|ios/i.test(idea))       result.project_summary.core_stack = ['React Native', 'Node.js', 'Supabase'];
        else if (/blockchain|web3|solidity|ethereum|crypto/i.test(idea))  result.project_summary.core_stack = ['React', 'Solidity', 'IPFS', 'Hardhat'];
        else if (/python|fastapi|flask|django|ml|machine learning/i.test(idea)) result.project_summary.core_stack = ['React', 'FastAPI (Python)', 'PostgreSQL'];
        else if (/flutter/i.test(idea))                                   result.project_summary.core_stack = ['Flutter', 'Firebase', 'Gemini AI'];

        result.solo_strategy.is_solo = ctx.size === 'solo';

        if(result.solo_strategy.is_solo) {

          result.solo_strategy.warning = "You are handling this project solo. Focus on MVP and leverage AI multipliers.";

        }

        return result;

    }

    // Domain-aware team fallback
    const _tStopW = new Set(['with','that','this','from','have','will','build','make','create','using','into','help','want','need','user','people','system','platform','application','solution','tool','data','online','good','best','app','web']);
    const _tWords = idea.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !_tStopW.has(w));
    const _kw = _tWords[0] || 'project';
    const _kw2 = _tWords[1] || '';
    const _projName = (_kw.charAt(0).toUpperCase() + _kw.slice(1,9)) + (_kw2 ? ' ' + (_kw2.charAt(0).toUpperCase() + _kw2.slice(1,7)) : ' AI') + ' Platform';
    const t = idea.toLowerCase();

    // Detect domain for role customization
    let _roles, _stack, _domain;
    if (/mental health|therapy|depression|anxiety|wellbeing|mindfulness/i.test(idea)) {
      _domain='Mental HealthTech'; _stack=['React','Node.js + Express','Supabase','Gemini AI'];
      _roles=[{title:'Full-Stack Wellness Engineer',type:'Engineering',priority:'Critical',description:'Builds the core platform with mood tracking, journal, and AI sentiment features.',primary_skills:['React','Node.js','Supabase','Gemini API'],responsibilities:['Core app architecture','Mood journal + AI integration','Auth and data privacy']},{title:'Conversational AI Designer',type:'AI / Product',priority:'Critical',description:'Designs CBT-style chatbot flows and emotion detection prompts.',primary_skills:['Prompt Engineering','Gemini API','Conversation UX'],responsibilities:['AI chatbot dialogue','Emotion prompt tuning','Safe messaging guidelines']},{title:'Clinical UX Designer',type:'Design',priority:'High',description:'Creates a calming, accessible UI that builds trust with vulnerable users.',primary_skills:['Figma','Accessibility (WCAG)','Trauma-informed design'],responsibilities:['UI wireframes and components','Accessibility audit','User testing with target audience']},{title:'Backend + Data Engineer',type:'Engineering',priority:'High',description:'Manages anonymous data pipelines, encryption, and crisis alert systems.',primary_skills:['PostgreSQL','Supabase RLS','Twilio API'],responsibilities:['Data encryption at rest','Crisis alert pipeline','Audit logs and compliance']}];
    } else if (/health|medical|patient|hospital|clinic|doctor|telemedicine/i.test(idea)) {
      _domain='HealthTech'; _stack=['React','Node.js','PostgreSQL','Gemini AI'];
      _roles=[{title:'Lead HealthTech Engineer',type:'Engineering',priority:'Critical',description:'Builds the core patient data platform with secure FHIR-compatible architecture.',primary_skills:['Node.js','PostgreSQL','REST API Design','HIPAA awareness'],responsibilities:['System architecture','API design','Data security']},{title:'AI/ML Integration Specialist',type:'Engineering',priority:'Critical',description:'Integrates Gemini AI for symptom triage, chatbot, and medical Q&A.',primary_skills:['Gemini API','Prompt Engineering','NLP'],responsibilities:['AI symptom checker','Medical chatbot flows','Model accuracy testing']},{title:'Healthcare UX Designer',type:'Design',priority:'High',description:'Designs clear, accessible patient-facing flows for non-technical users.',primary_skills:['Figma','Accessibility','Patient journey mapping'],responsibilities:['Patient UI/UX','Elderly-friendly design','Prototype testing']},{title:'Data & API Integrations Engineer',type:'Engineering',priority:'Medium',description:'Connects external health APIs (Maps for clinics, OpenFDA for drugs).',primary_skills:['API Integration','OpenFDA','Google Maps API'],responsibilities:['External API connections','Clinic locator feature','Data validation']}];
    } else if (/blockchain|web3|crypto|defi|nft|ethereum|solana/i.test(idea)) {
      _domain='Web3 / DeFi'; _stack=['React','Solidity','Ethers.js','IPFS'];
      _roles=[{title:'Smart Contract Engineer',type:'Blockchain',priority:'Critical',description:'Writes, tests, and deploys Solidity smart contracts with security-first approach.',primary_skills:['Solidity','Hardhat','OpenZeppelin','Security auditing'],responsibilities:['Contract architecture','Security review','Deployment scripts']},{title:'Web3 Frontend Developer',type:'Engineering',priority:'Critical',description:'Builds the dApp UI with wallet connection and on-chain interactions.',primary_skills:['React','Ethers.js','Wagmi','MetaMask integration'],responsibilities:['Wallet connect UI','Transaction UX','On-chain data display']},{title:'DeFi Protocol Designer',type:'Product / Research',priority:'High',description:'Designs tokenomics, yield mechanics, and protocol incentive structures.',primary_skills:['DeFi protocol design','Tokenomics','Chainlink oracles'],responsibilities:['Protocol specification','Yield strategy','Economic modelling']},{title:'UX / Frontend Polish',type:'Design',priority:'Medium',description:'Ensures the dApp feels as polished as Web2 to lower adoption friction.',primary_skills:['Figma','Tailwind CSS','Animation'],responsibilities:['UI components','Loading states','Responsive design']}];
    } else if (/fintech|payment|banking|loan|budget|finance|money|expense/i.test(idea)) {
      _domain='FinTech'; _stack=['Next.js','Node.js + Fastify','PostgreSQL','Plaid API'];
      _roles=[{title:'FinTech Backend Engineer',type:'Engineering',priority:'Critical',description:'Builds secure financial data pipelines with bank-grade encryption and Plaid integration.',primary_skills:['Node.js','PostgreSQL','Plaid API','JWT auth'],responsibilities:['Financial data API','Bank connection layer','Security hardening']},{title:'AI Financial Analyst',type:'AI / Data',priority:'Critical',description:'Builds AI-powered spending insights, anomaly detection, and CFO recommendations.',primary_skills:['Gemini AI','Python / data analysis','Prompt engineering'],responsibilities:['AI insight engine','Spending anomaly detector','Advice generation']},{title:'Financial UX Designer',type:'Design',priority:'High',description:'Designs clear, trustworthy financial dashboards that simplify complex data.',primary_skills:['Figma','Data visualisation','Trust-building UX'],responsibilities:['Dashboard design','Chart components','Onboarding flow']},{title:'Frontend Engineer',type:'Engineering',priority:'High',description:'Implements the Next.js dashboard with real-time charts and smooth interactions.',primary_skills:['Next.js 14','Recharts / Chart.js','Tailwind CSS'],responsibilities:['Dashboard UI','Real-time data refresh','PDF export']}];
    } else if (/education|learning|student|school|teacher|edtech|tutor|course/i.test(idea)) {
      _domain='EdTech'; _stack=['React','Node.js','Supabase','Gemini AI'];
      _roles=[{title:'EdTech Platform Engineer',type:'Engineering',priority:'Critical',description:'Builds the adaptive learning engine, quiz system, and real-time progress tracking.',primary_skills:['React','Node.js','Supabase','WebSockets'],responsibilities:['Learning platform core','Quiz engine','Progress dashboard']},{title:'AI Tutor Designer',type:'AI / Education',priority:'Critical',description:'Designs Socratic AI tutor prompts and adaptive difficulty algorithms.',primary_skills:['Prompt Engineering','Gemini API','Learning science'],responsibilities:['AI tutor flows','Adaptive difficulty','Learning outcome metrics']},{title:'UI/UX Designer (Student-Focused)',type:'Design',priority:'High',description:'Creates engaging, game-like UI that keeps students motivated and on-task.',primary_skills:['Figma','Gamification patterns','Child-friendly design'],responsibilities:['UI components','Gamification elements','A/B testing design']},{title:'Curriculum & Content Specialist',type:'Product',priority:'Medium',description:'Structures curriculum content and assessment rubrics for the AI to deliver.',primary_skills:['Curriculum design','Assessment theory','Khan Academy API'],responsibilities:['Content structure','Quiz question bank','Learning path maps']}];
    } else if (/sustainability|carbon|green|eco|climate|renewable|environment/i.test(idea)) {
      _domain='GreenTech'; _stack=['React','Node.js','PostgreSQL','Carbon Interface API'];
      _roles=[{title:'GreenTech Full-Stack Engineer',type:'Engineering',priority:'Critical',description:'Builds carbon tracking pipelines and the main sustainability dashboard.',primary_skills:['React','Node.js','Carbon Interface API','PostgreSQL'],responsibilities:['Carbon data pipeline','Dashboard build','API integrations']},{title:'Computer Vision / AI Engineer',type:'Engineering',priority:'Critical',description:'Implements the product carbon scanner using Gemini Vision API.',primary_skills:['Gemini Vision API','Computer Vision','React camera integration'],responsibilities:['Camera integration','Product scanning flow','Vision API prompting']},{title:'Sustainability UX Designer',type:'Design',priority:'High',description:'Creates gamified, rewarding UX that makes green choices feel fun and social.',primary_skills:['Figma','Gamification','Data visualisation'],responsibilities:['Dashboard UI','Gamification components','Impact visualisations']},{title:'Data & Integrations Engineer',type:'Engineering',priority:'Medium',description:'Connects external sustainability APIs and builds the rewards tracking system.',primary_skills:['API Integration','Open Food Facts','Reward system logic'],responsibilities:['External API connections','Rewards engine','ESG report generation']}];
    } else {
      // General intelligent default
      _domain='General Tech'; _stack=['Next.js 14','Node.js + Express','Supabase','Gemini AI'];
      _roles=[{title:'Full-Stack Lead Engineer',type:'Engineering',priority:'Critical',description:'Leads architecture and builds the core features of the platform end-to-end.',primary_skills:['Next.js 14','Node.js','Supabase','System design'],responsibilities:['App architecture','Core API','Auth and deployment']},{title:'AI Integration Engineer',type:'Engineering',priority:'Critical',description:'Integrates Gemini AI and builds all intelligent, demo-worthy features.',primary_skills:['Gemini API','Prompt Engineering','LLM workflows'],responsibilities:['AI feature build','Prompt tuning','Streaming responses']},{title:'UI/UX Designer + Frontend',type:'Design / Engineering',priority:'High',description:'Designs and implements a premium dark-mode UI that impresses judges immediately.',primary_skills:['Figma','Tailwind CSS','Framer Motion'],responsibilities:['Component design','UI polish','Responsive layout']},{title:'Data Engineer + DevOps',type:'Engineering',priority:'Medium',description:'Manages database schema, data flows, and deployment pipeline.',primary_skills:['Supabase','PostgreSQL','Vercel / Railway','CI/CD'],responsibilities:['DB schema design','Data seeding','Deployment pipeline']}];
    }

    const _isSolo = ctx.size === 'solo';
    return {
      project_summary: { name: _projName, complexity: 'High', core_stack: _stack },
      roles: _roles,
      skills_map: [
        { domain:'Engineering', required_skills: _stack.map(s => ({ name: s, level: 'Expert' })) },
        { domain:'AI Integration', required_skills: [{ name:'Gemini API', level:'Expert' }, { name:'Prompt Engineering', level:'High' }] },
        { domain:'Design', required_skills: [{ name:'Figma', level:'High' }, { name:'Tailwind CSS', level:'Intermediate' }] }
      ],
      task_timeline: [
        { phase:'0-4h: Foundation', tasks:['Repo and env setup','Auth scaffolding','DB schema'], roles_involved:[_roles[0].title] },
        { phase:'4-12h: Core Build', tasks:['Main feature implementation','UI components','API connections'], roles_involved:[_roles[0].title, _roles.length > 2 ? _roles[2].title : _roles[0].title] },
        { phase:'12-20h: AI + Polish', tasks:['AI feature integration','UI polish','Edge case handling'], roles_involved:_roles.map(r => r.title) },
        { phase:'20-24h: Demo Prep', tasks:['Demo flow rehearsal','Bug fixes','Pitch deck'], roles_involved:_roles.map(r => r.title) }
      ],
      collaboration: { communication:'Discord for async + 30-min check-ins every 4 hours', version_control:'Git with feature branches, PR review before merge', decision_making:'Driver model — one owner per feature area with shared final review' },
      solo_strategy: { is_solo: _isSolo, warning: _isSolo ? 'You are handling this solo. Cut scope to 1 AI feature + clean UI. Use Cursor AI and Gemini API to multiply your output.' : null, ai_multipliers: ['Cursor AI for 10x coding speed','Gemini API for instant AI features','v0.dev for instant UI components','Supabase for zero-config backend'], mvp_scope: ['Single core AI feature that clearly demonstrates the value prop','Clean auth and data persistence','Polished landing + demo flow'] }
    };
  }

});

