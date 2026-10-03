/* js/navbar.js — single source of truth for the site navbar.
 *
 * Include as the FIRST <script> in <body>, after <div id="navbar-placeholder"></div>:
 *     <div id="navbar-placeholder"></div>
 *     <script src="js/navbar.js"></script>
 * Styles live in styles/design-system.css (section 8, Navbar). Load that file in <head>.
 *
 * This file: injects the markup, marks the current page, and runs the dropdowns.
 * theme.js (already on every page) keeps owning the theme toggle (localStorage 'rar_theme'), the
 * hamburger open/close, the scroll state, and the History button is bound by history_manager.js.
 * Those elements keep their ids (#themeToggle, #hamburger, #mobileMenu, .history-nav-trigger), so
 * binding them a second time here would make each click fire twice and cancel itself out.
 */
(function (W, D) {
  'use strict';
  if (D.getElementById('navbar')) return;   // already injected / page still has a hardcoded navbar

  var TOOLS = [
    ['compare.html', 'Compare Stacks'],
    ['features.html', 'AI Tools'],
    ['team_builder.html', 'Team Builder']
  ];
  var DISCOVER = [
    ['hackathons.html', 'Live Hackathons'],
    ['hackathon_universe.html', 'Past Winners'],
    ['showcase.html', 'Showcase'],
    ['repos.html', 'Repos']
  ];
  var PRIMARY = [
    ['index.html', 'Home'],
    ['strategist.html', 'Strategist'],
    ['checklist.html', 'Checklist'],
    ['countdown.html', 'Sprint Timer']
  ];

  var ICON_MOON = '<svg id="moonIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var ICON_SUN = '<svg id="sunIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  var ICON_HIST = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>';

  function links(list, cls) {
    return list.map(function (p) { return '<a href="' + p[0] + '" class="' + cls + '">' + p[1] + '</a>'; }).join('');
  }
  function dropdown(label, list) {
    return '<div class="nav-dropdown">' +
      '<button type="button" class="nav-link nav-dropdown-toggle" aria-haspopup="true" aria-expanded="false">' +
        label + ' <span class="nav-chevron" aria-hidden="true">▾</span></button>' +
      '<div class="nav-dropdown-menu">' + links(list, 'nav-dropdown-item nav-link') + '</div></div>';
  }

  var NAV =
    '<nav class="navbar ds-nav" id="navbar" aria-label="Main">' +
      '<div class="nav-inner ds-nav-inner">' +
        '<a href="index.html" class="nav-brand">' +
          '<img src="logo.png" alt="" class="nav-logo brand-logo">' +
          '<span class="nav-brand-text brand-name">RAR Hackathon Helper</span></a>' +
        '<div class="nav-links" id="navLinks">' +
          links(PRIMARY, 'nav-link') + dropdown('Tools', TOOLS) + dropdown('Discover', DISCOVER) +
        '</div>' +
        '<div class="nav-actions">' +
          '<button type="button" class="btn-ghost" id="themeToggle" aria-label="Toggle theme">' + ICON_MOON + ICON_SUN + '</button>' +
          '<button type="button" class="btn-ghost history-nav-trigger" title="View recent solutions" aria-label="View recent solutions">' +
            ICON_HIST + '<span class="nav-action-label">History</span></button>' +
          '<button type="button" class="nav-hamburger hamburger" id="hamburger" aria-label="Open menu" aria-controls="mobileMenu">' +
            '<span></span><span></span><span></span></button>' +
        '</div>' +
      '</div>' +
    '</nav>' +
    '<div class="nav-mobile-overlay mobile-menu" id="mobileMenu"><div class="nav-mobile-inner">' +
      links(PRIMARY, 'nav-mobile-link mobile-link') +
      '<div class="nav-mobile-divider">Tools</div>' + links(TOOLS, 'nav-mobile-link mobile-link') +
      '<div class="nav-mobile-divider">Discover</div>' + links(DISCOVER, 'nav-mobile-link mobile-link') +
    '</div></div>';

  /* ---------- inject ---------- */
  var host = D.getElementById('navbar-placeholder');
  if (host) { host.insertAdjacentHTML('afterend', NAV); host.remove(); }
  else { D.body.insertAdjacentHTML('afterbegin', NAV); }

  var nav = D.getElementById('navbar');

  /* ---------- active page ---------- */
  // '/', '/index', '/hackathons.html?x=1' -> 'index.html' | 'hackathons.html'
  function currentFile() {
    var seg = (W.location.pathname.split('/').pop() || '').toLowerCase();
    if (!seg) return 'index.html';
    return seg.indexOf('.') === -1 ? seg + '.html' : seg;
  }
  var file = currentFile();
  // 'index.html' -> Home, 'compare|features|team_builder' -> Tools, 'hackathons|universe|showcase|repos' -> Discover.
  // 404, offline, generator and anything else match no link, so nothing is highlighted.
  D.querySelectorAll('#navbar a[href], #mobileMenu a[href]').forEach(function (a) {
    if ((a.getAttribute('href') || '').toLowerCase() !== file || a.classList.contains('nav-brand')) return;
    a.classList.add('active');
    a.setAttribute('aria-current', 'page');
    var dd = a.closest('.nav-dropdown');
    if (dd) dd.querySelector('.nav-dropdown-toggle').classList.add('active');   // highlight the parent too
  });

  /* ---------- dropdowns ---------- */
  function setOpen(dd, open) {
    dd.classList.toggle('open', open);
    dd.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', String(open));
  }
  function closeAll(except) {
    nav.querySelectorAll('.nav-dropdown.open').forEach(function (dd) { if (dd !== except) setOpen(dd, false); });
  }

  nav.querySelectorAll('.nav-dropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var dd = btn.closest('.nav-dropdown'), willOpen = !dd.classList.contains('open');
      closeAll(dd);
      setOpen(dd, willOpen);
    });
  });
  D.addEventListener('click', function (e) { if (!e.target.closest('.nav-dropdown')) closeAll(); });   // click outside
  D.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = nav.querySelector('.nav-dropdown.open');
    if (open) { closeAll(); open.querySelector('.nav-dropdown-toggle').focus(); }
  });
  nav.addEventListener('focusout', function (e) {   // tabbing away closes the menu
    var dd = e.target.closest && e.target.closest('.nav-dropdown');
    if (dd && !dd.contains(e.relatedTarget)) setOpen(dd, false);
  });
  W.addEventListener('resize', function () { closeAll(); });
})(window, document);
