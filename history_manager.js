document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('historySidebar');
  const closeBtn = document.getElementById('closeHistory');
  const toggleBtn = document.getElementById('historyToggle');
  const badges = document.querySelectorAll('#historyBadge');
  const historyList = document.getElementById('historyList');

  // Load histories
  function getUnifiedHistory() {
    const stratRaw = JSON.parse(localStorage.getItem('strat_history') || '[]');
    const tbRaw = JSON.parse(localStorage.getItem('tb_history') || '[]');
    
    // Add type and unify
    const stratItems = stratRaw.map(item => ({
      ...item,
      type: 'strategist',
      title: item.problem,
      displayTitle: item.problem.substring(0, 60) + (item.problem.length > 60 ? '...' : ''),
      badgeText: 'Solution',
      badgeClass: 'badge-strat'
    }));

    const tbItems = tbRaw.map(item => ({
      ...item,
      type: 'teambuilder',
      title: item.idea,
      displayTitle: item.idea.substring(0, 60) + (item.idea.length > 60 ? '...' : ''),
      badgeText: 'Team',
      badgeClass: 'badge-tb'
    }));

    const unified = [...stratItems, ...tbItems];
    // Sort descending by timestamp
    unified.sort((a, b) => b.timestamp - a.timestamp);
    return unified;
  }

  function updateSidebarUI() {
    if (!historyList) return;
    const historyData = getUnifiedHistory();

    // Update badges
    const totalCount = historyData.length;
    badges.forEach(b => {
      if (totalCount > 0) {
        b.style.display = 'flex';
        b.textContent = totalCount;
      } else {
        b.style.display = 'none';
      }
    });

    if (totalCount === 0) {
      historyList.innerHTML = `
        <div class="history-empty" style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:3rem 1.5rem;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="opacity:0.3; margin-bottom:1rem;"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
          <p style="color:var(--text-muted); font-size:0.9rem;">No recent history found.</p>
        </div>
      `;
      return;
    }

    historyList.innerHTML = historyData.map((item, index) => `
      <div class="history-item" data-index="${index}" data-type="${item.type}">
        <div class="history-item-main">
          <div class="history-item-title" title="${item.title.replace(/"/g, '&quot;')}">${item.displayTitle}</div>
          <div class="history-item-meta">
            <span class="history-item-tag ${item.badgeClass}">${item.badgeText}</span>
            <span class="history-item-date">${new Date(item.timestamp).toLocaleDateString()}</span>
          </div>
        </div>
        <button class="history-delete-btn" data-index="${index}" title="Delete this item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </div>
    `).join('');

    // Wire up clicks on items
    document.querySelectorAll('.history-item').forEach(itemEl => {
      itemEl.addEventListener('click', (e) => {
        // Prevent click if clicking the delete button
        if (e.target.closest('.history-delete-btn')) return;

        const index = itemEl.getAttribute('data-index');
        const item = historyData[index];
        loadHistoryItem(item);
      });
    });

    // Wire up delete buttons
    document.querySelectorAll('.history-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = btn.getAttribute('data-index');
        const item = historyData[index];
        deleteHistoryItem(item);
      });
    });
  }

  function loadHistoryItem(item) {
    if (sidebar) sidebar.classList.remove('open');

    if (item.type === 'strategist') {
      const isStrategistPage = window.location.pathname.includes('strategist.html');
      const isChecklistPage = window.location.pathname.includes('checklist.html');

      if (isStrategistPage) {
        if (typeof window.loadSavedSolution === 'function') {
          window.loadSavedSolution(item);
        }
      } else if (isChecklistPage) {
        localStorage.setItem('activeChecklist', JSON.stringify(item.result));
        localStorage.setItem('latest_strat_result', JSON.stringify(item));
        if (typeof window.loadSavedSolution === 'function') {
          window.loadSavedSolution(item);
        } else {
          window.location.reload();
        }
      } else {
        localStorage.setItem('latest_strat_result', JSON.stringify(item));
        window.location.href = 'strategist.html';
      }
    } else if (item.type === 'teambuilder') {
      const isTeamBuilderPage = window.location.pathname.includes('team_builder.html');

      if (isTeamBuilderPage) {
        if (typeof window.loadSavedTeam === 'function') {
          window.loadSavedTeam(item);
        }
      } else {
        localStorage.setItem('latest_tb_result', JSON.stringify(item));
        window.location.href = 'team_builder.html';
      }
    }
  }

  function deleteHistoryItem(item) {
    if (item.type === 'strategist') {
      let stratHistory = JSON.parse(localStorage.getItem('strat_history') || '[]');
      stratHistory = stratHistory.filter(h => h.problem !== item.problem || h.timestamp !== item.timestamp);
      localStorage.setItem('strat_history', JSON.stringify(stratHistory));

      // Clear latest result if we deleted the current active one
      const latest = JSON.parse(localStorage.getItem('latest_strat_result') || '{}');
      if (latest.timestamp === item.timestamp) {
        localStorage.removeItem('latest_strat_result');
      }
    } else if (item.type === 'teambuilder') {
      let tbHistory = JSON.parse(localStorage.getItem('tb_history') || '[]');
      tbHistory = tbHistory.filter(h => h.idea !== item.idea || h.timestamp !== item.timestamp);
      localStorage.setItem('tb_history', JSON.stringify(tbHistory));

      const latest = JSON.parse(localStorage.getItem('latest_tb_result') || '{}');
      if (latest.timestamp === item.timestamp) {
        localStorage.removeItem('latest_tb_result');
      }
    }

    showToast('Item deleted from history');
    updateSidebarUI();
    
    // Notify loaded page states to update themselves
    if (typeof window.updateHistoryUI === 'function') window.updateHistoryUI();
    if (typeof window.updateTbHistoryUI === 'function') window.updateTbHistoryUI();
  }

  // Bind close buttons
  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => sidebar.classList.add('open'));
  }

  // Handle Nav History Click
  document.querySelectorAll('.history-nav-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (sidebar) sidebar.classList.add('open');
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu) mobileMenu.classList.remove('active');
    });
  });

  // Close on backdrop click
  document.addEventListener('click', (e) => {
    if (sidebar && sidebar.classList.contains('open')) {
      const isClickInside = sidebar.contains(e.target);
      const isToggleClick = toggleBtn && (toggleBtn === e.target || toggleBtn.contains(e.target));
      const isNavClick = Array.from(document.querySelectorAll('.history-nav-trigger')).some(nav => nav === e.target || nav.contains(e.target));

      if (!isClickInside && !isToggleClick && !isNavClick) {
        sidebar.classList.remove('open');
      }
    }
  });

  // Global methods for local pages to save items
  window.HistoryManager = {
    saveStrategistResult: function(problem, result, context, industry) {
      const newItem = {
        problem: problem,
        result: result,
        context: context || null,
        industry: industry || result.problem_analysis?.industry || result.industry || 'General',
        timestamp: new Date().getTime()
      };
      let list = JSON.parse(localStorage.getItem('strat_history') || '[]');
      list = list.filter(h => h.problem !== problem);
      list.unshift(newItem);
      if (list.length > 10) list.pop();
      localStorage.setItem('strat_history', JSON.stringify(list));
      localStorage.setItem('latest_strat_result', JSON.stringify(newItem));
      updateSidebarUI();
    },

    saveTeamBuilderResult: function(idea, result, domain) {
      const newItem = {
        idea: idea,
        result: result,
        domain: domain || 'Auto',
        timestamp: new Date().getTime()
      };
      let list = JSON.parse(localStorage.getItem('tb_history') || '[]');
      list = list.filter(h => h.idea !== idea);
      list.unshift(newItem);
      if (list.length > 10) list.pop();
      localStorage.setItem('tb_history', JSON.stringify(list));
      localStorage.setItem('latest_tb_result', JSON.stringify(newItem));
      updateSidebarUI();
    },

    updateUI: updateSidebarUI
  };

  // Toast helper inside module
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.innerHTML = `<span>${message}</span>`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }

  // Initial draw
  updateSidebarUI();
});
