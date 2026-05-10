/**
 * RAR Hackathon Helper — Global Theme & Nav Manager
 * =====================================================
 * Handles:
 *  1. Dark/Light theme with localStorage persistence (applied to <html>)
 *  2. Sun/Moon icon sync across all pages
 *  3. Active nav-link highlighting based on current pathname
 */

(function () {
  'use strict';

  /* ─── 1. THEME INIT (runs immediately, before paint) ─── */
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('rar_theme') || 'dark';
  if (savedTheme === 'light') {
    html.setAttribute('data-theme', 'light');
  } else {
    html.removeAttribute('data-theme');
  }

  /* ─── 2. AFTER DOM READY ─── */
  document.addEventListener('DOMContentLoaded', () => {

    /* --- Theme toggle button wiring --- */
    const themeToggle = document.getElementById('themeToggle');
    const moonIcon    = document.getElementById('moonIcon');
    const sunIcon     = document.getElementById('sunIcon');

    function syncIcons() {
      const isLight = html.getAttribute('data-theme') === 'light';
      if (moonIcon) moonIcon.style.display = isLight ? 'none'  : 'block';
      if (sunIcon)  sunIcon.style.display  = isLight ? 'block' : 'none';
    }

    syncIcons(); // initial sync

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const isLight = html.getAttribute('data-theme') === 'light';
        if (isLight) {
          html.removeAttribute('data-theme');
          localStorage.setItem('rar_theme', 'dark');
        } else {
          html.setAttribute('data-theme', 'light');
          localStorage.setItem('rar_theme', 'light');
        }
        syncIcons();
        // Re-apply navbar background in case scroll listener already set it
        updateNavbarBg();
      });
    }

    /* --- Navbar scroll shrink + background --- */
    const navbar = document.getElementById('navbar');
    function updateNavbarBg() {
      if (!navbar) return;
      const isLight  = html.getAttribute('data-theme') === 'light';
      const scrolled = window.scrollY > 50;
      navbar.classList.toggle('scrolled', scrolled);
      if (scrolled) {
        navbar.style.background = isLight
          ? 'rgba(248, 250, 252, 0.97)'
          : 'rgba(15, 17, 26, 0.97)';
        navbar.style.boxShadow = 'var(--shadow-sm)';
      } else {
        navbar.style.background = isLight
          ? 'rgba(248, 250, 252, 0.7)'
          : 'rgba(15, 17, 26, 0.6)';
        navbar.style.boxShadow = 'none';
      }
    }
    window.addEventListener('scroll', updateNavbarBg, { passive: true });
    updateNavbarBg();

    /* ─── 3. ACTIVE NAV LINK HIGHLIGHTING ─── */
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    // Normalise: bare "/" or "" → "index.html"
    const activePage = currentFile === '' ? 'index.html' : currentFile;

    document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
      const href = (link.getAttribute('href') || '').split('/').pop();
      link.classList.toggle('active', href === activePage);
    });

    /* --- Hamburger / mobile menu --- */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
      });

      document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
        });
      });
    }

    /* --- "Launch App" / "Generate" shortcut buttons on index --- */
    const launchBtn = document.getElementById('launchBtn');
    const ctaBtn    = document.getElementById('ctaBtn');

    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        window.location.href = 'strategist.html';
      });
    }
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        window.location.href = 'strategist.html';
      });
    }
  });
})();
