// team_builder.js

document.addEventListener('DOMContentLoaded', () => {
  // Common UI elements like theme toggle
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

  // --- Team Builder Specific Logic ---
  
  // Elements
  const tbIdea = document.getElementById('tbIdea');
  const tbCharCount = document.getElementById('tbCharCount');
  const tbGenerateBtn = document.getElementById('tbGenerateBtn');
  const tbBtnText = document.getElementById('tbBtnText');
  const tbBtnLoading = document.getElementById('tbBtnLoading');

  const ctxSize = document.getElementById('tbTeamSize');
  const ctxSkills = document.getElementById('tbMySkills');
  const ctxDomain = document.getElementById('tbDomain');
  const ctxDuration = document.getElementById('tbDuration');

  // API Key Management
  const apiKeyBanner = document.getElementById('tbApiKeyBanner');
  const openApiKeyModal = document.getElementById('tbOpenApiKeyModal');
  const tbApiModal = document.getElementById('tbApiModal');
  const tbCloseModal = document.getElementById('tbCloseModal');
  const tbSaveKey = document.getElementById('tbSaveKey');
  const tbApiKeyInput = document.getElementById('tbApiKeyInput');

  function checkApiKey() {
    const key = localStorage.getItem('gemini_api_key');
    if (key) {
      apiKeyBanner.classList.add('success');
      apiKeyBanner.innerHTML = `
        <div class="api-key-banner-left">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span><strong>Status:</strong> <span style="color:#10b981;">Gemini AI Active</span></span>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn-outline btn-sm" id="tbOpenApiKeyModal">Settings</button>
          <button class="btn-ghost btn-sm" id="clearApiKeyBtn" style="color:#ef4444;">Clear</button>
        </div>
      `;
      document.getElementById('clearApiKeyBtn').addEventListener('click', () => {
        localStorage.removeItem('gemini_api_key');
        location.reload();
      });
      document.getElementById('tbOpenApiKeyModal').addEventListener('click', () => tbApiModal.style.display = 'flex');
    }
  }

  checkApiKey();

  if(openApiKeyModal) openApiKeyModal.addEventListener('click', () => tbApiModal.style.display = 'flex');
  if(tbCloseModal) tbCloseModal.addEventListener('click', () => tbApiModal.style.display = 'none');
  if(tbSaveKey) {
    tbSaveKey.addEventListener('click', () => {
      const key = tbApiKeyInput.value.trim();
      if(key) localStorage.setItem('gemini_api_key', key);
      tbApiModal.style.display = 'none';
      checkApiKey();
      showToast('API Key saved locally!');
    });
  }

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
      
      const apiKey = localStorage.getItem('gemini_api_key');
      const context = {
        size: ctxSize.value || '2',
        skills: ctxSkills.value || 'None specified',
        domain: ctxDomain.value || 'Auto',
        duration: ctxDuration.value || '24 hours'
      };

      try {
        if (apiKey) {
          simulateProgressUI(true);
          const result = await callGeminiTeamBuilder(apiKey, idea, context);
          latestTeamData = result;
          renderTeamBuilderJSON(result, true);
          completeProgressUI();
        } else {
          simulateProgressUI(false);
          setTimeout(() => {
            const fallbackResult = getFallbackTeamJSON(idea, context);
            latestTeamData = fallbackResult;
            renderTeamBuilderJSON(fallbackResult, false);
            completeProgressUI();
          }, 3500);
        }
      } catch (err) {
        console.error("Team Builder failed:", err);
        showToast("Live API failed. Falling back to simulation.");
        const fallbackResult = getFallbackTeamJSON(idea, context);
        latestTeamData = fallbackResult;
        renderTeamBuilderJSON(fallbackResult, false);
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
  async function callGeminiTeamBuilder(apiKey, idea, ctx) {
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 8192 }
      })
    });

    if (!response.ok) throw new Error("API Network Error");
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return JSON.parse(text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
  }

  // --- RENDER LOGIC ---
  function renderTeamBuilderJSON(data, isLive) {
    const summaryBanner = document.getElementById('tbSummaryBanner');
    summaryBanner.innerHTML = '';
    
    if(!isLive) {
        summaryBanner.innerHTML += `<div class="tb-offline-badge">⚠️ Offline Simulation (No API Key)</div>`;
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
    return {
      "project_summary": {
        "name": "Generated Project Outline",
        "complexity": "Medium",
        "core_stack": ["React", "Node.js", "AI API"]
      },
      "roles": [
        {
          "title": "Full Stack Dev",
          "type": "Engineering",
          "priority": "Critical",
          "description": "Handles the core application logic and UI.",
          "primary_skills": ["JavaScript", "React", "Node.js"],
          "responsibilities": ["Setup repo", "Build UI", "Connect API"]
        },
        {
          "title": "AI/Data Engineer",
          "type": "Engineering",
          "priority": "High",
          "description": "Integrates AI models and manages data flow.",
          "primary_skills": ["Python", "Prompt Engineering"],
          "responsibilities": ["Prompt design", "Model integration"]
        }
      ],
      "skills_map": [
        {
          "domain": "Frontend",
          "required_skills": [{"name": "React", "level": "Expert"}, {"name": "CSS", "level": "Intermediate"}]
        },
        {
          "domain": "Backend",
          "required_skills": [{"name": "Node.js", "level": "Intermediate"}]
        }
      ],
      "task_timeline": [
        {
          "phase": "0-4h Setup",
          "tasks": ["Repo init", "Environment setup", "Basic UI scaffold"],
          "roles_involved": ["Full Stack Dev", "AI/Data Engineer"]
        },
        {
          "phase": "4-16h Build",
          "tasks": ["Implement core features", "Integrate AI model"],
          "roles_involved": ["Full Stack Dev", "AI/Data Engineer"]
        }
      ],
      "collaboration": {
        "tools": [{"name": "GitHub", "use": "Source control"}, {"name": "Discord", "use": "Communication"}],
        "protocols": ["Commit early", "Communicate blockers immediately"]
      },
      "solo_strategy": {
        "is_solo": ctx.size === "solo",
        "warning": "You are doing everything alone. Leverage AI coding assistants to maximize output.",
        "ai_tools": [{"name": "Cursor/Bolt", "use": "Code generation"}]
      }
    };
  }

});
