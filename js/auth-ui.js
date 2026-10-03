/* js/auth-ui.js
 * Self-contained sign-in UI. Include the script, nothing else is needed (it injects its own CSS and DOM).
 * Requires js/firebase.js (and js/db.js for cloud sync) to be loaded first.
 *
 * Placement (never overlaps the navbar):
 *   - pages with .nav-actions: a compact button inside the navbar, before the hamburger (>=960px)
 *   - small screens: a row at the top of the mobile menu overlay
 *   - pages without a navbar (404, offline...): a fixed button in the top-right corner
 * If Firebase didn't load (offline / blocked) this file does nothing and the site works as before.
 */
(function (W, D) {
  'use strict';
  if (W.__rarAuthUI) return;
  W.__rarAuthUI = true;
  if (!W.RAR_FIREBASE_READY || !W.auth) return;

  var auth = W.auth, user = null, mode = 'login', busy = false;
  var triggers = [];   // every rendered trigger button, refreshed on auth changes

  /* ---------- tiny DOM helper ---------- */
  function h(tag, attrs, kids) {
    var el = D.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') el.textContent = attrs[k];
      else if (k === 'class') el.className = attrs[k];
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? D.createTextNode(c) : c); });
    return el;
  }

  /* ---------- styles (tokens only; falls back to the legacy tokens on un-migrated pages) ---------- */
  var css = [
    ':root{--rar-surface:var(--ds-surface,var(--bg-card));--rar-surface2:var(--ds-surface-2,var(--bg-card-hover));--rar-border:var(--ds-border,var(--border-color));',
    '--rar-text:var(--ds-text,var(--text-primary));--rar-text2:var(--ds-text-2,var(--text-secondary));--rar-primary:var(--ds-primary,var(--accent-primary));',
    '--rar-primary-h:var(--ds-primary-hover,var(--accent-primary));--rar-on:var(--ds-on-primary,white);--rar-danger:var(--ds-danger,var(--error))}',
    '.rar-auth-wrap{position:relative;display:inline-flex}',
    '.rar-auth-btn{display:inline-flex;align-items:center;gap:8px;min-height:44px;min-width:44px;padding:0 12px;background:transparent;color:var(--rar-text2);',
    'border:1px solid transparent;border-radius:6px;font:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:color 150ms ease,background-color 150ms ease,border-color 150ms ease}',
    '.rar-auth-btn:hover{color:var(--rar-text);background:rgba(124,58,237,.08)}',
    '.rar-auth-btn:focus-visible,.rar-dlg button:focus-visible,.rar-dlg input:focus-visible{outline:2px solid var(--rar-primary);outline-offset:2px}',
    '.rar-avatar{width:28px;height:28px;border-radius:50%;object-fit:cover;flex:none;background:var(--rar-surface2);display:inline-flex;align-items:center;justify-content:center;color:var(--rar-text);font-size:12px;font-weight:600}',
    '.rar-auth-label{display:none;max-width:14ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '@media(min-width:1280px){.rar-auth-nav .rar-auth-label{display:inline}}',
    '.rar-auth-mobile{display:none}',
    '.rar-auth-mobile .rar-auth-label{display:inline;max-width:24ch}',
    '.rar-auth-nav{display:none}',
    '@media(min-width:960px){.rar-auth-nav{display:inline-flex}}',
    '@media(max-width:959px){.rar-auth-mobile{display:flex;width:100%;padding:8px 0 16px;border-bottom:1px solid var(--rar-border);margin-bottom:8px}.rar-auth-mobile .rar-auth-btn{width:100%;justify-content:flex-start;color:var(--rar-text);font-size:1.125rem}}',
    '.rar-auth-float{position:fixed;top:12px;right:12px;z-index:1500;display:inline-flex}',
    '.rar-auth-float .rar-auth-btn{background:var(--rar-surface);border-color:var(--rar-border);color:var(--rar-text)}',
    '.rar-auth-label.rar-always{display:inline}',
    '.rar-menu{position:absolute;top:calc(100% + 8px);right:0;min-width:220px;padding:8px;display:flex;flex-direction:column;gap:4px;background:var(--rar-surface2);border:1px solid var(--rar-border);border-radius:8px;z-index:1600}',
    '.rar-auth-mobile .rar-menu{position:static;margin-top:8px;width:100%}',
    '.rar-menu[hidden]{display:none}',
    '.rar-menu-who{padding:8px;color:var(--rar-text);font-size:14px;overflow-wrap:anywhere}',
    '.rar-menu-who small{display:block;color:var(--rar-text2);font-size:12px}',
    '.rar-menu button{min-height:40px;padding:0 8px;text-align:left;background:transparent;color:var(--rar-text);border:0;border-radius:6px;font:inherit;font-size:14px;cursor:pointer}',
    '.rar-menu button:hover{background:rgba(124,58,237,.08)}',
    '.rar-dlg{width:min(400px,calc(100vw - 32px));padding:24px;background:var(--rar-surface2);color:var(--rar-text);border:1px solid var(--rar-border);border-radius:12px}',
    '.rar-dlg::backdrop{background:rgba(0,0,0,.6)}',
    '.rar-dlg h2{font-size:1.25rem;margin:0 0 4px;font-weight:600}',
    '.rar-dlg p{margin:0 0 16px;color:var(--rar-text2);font-size:14px}',
    '.rar-dlg form{display:grid;gap:12px}',
    '.rar-dlg label{display:grid;gap:4px;font-size:13px;color:var(--rar-text2)}',
    '.rar-dlg input{min-height:44px;padding:0 12px;background:var(--rar-surface);color:var(--rar-text);border:1px solid var(--rar-border);border-radius:6px;font:inherit}',
    '.rar-dlg input:focus{outline:none;border-color:var(--rar-primary);box-shadow:0 0 0 3px rgba(124,58,237,.15)}',
    '.rar-btn{min-height:44px;padding:0 16px;border-radius:6px;border:1px solid var(--rar-border);background:transparent;color:var(--rar-text);font:inherit;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:background-color 150ms ease,border-color 150ms ease}',
    '.rar-btn:hover{border-color:var(--rar-primary);background:rgba(124,58,237,.08)}',
    '.rar-btn-primary{background:var(--rar-primary);border-color:var(--rar-primary);color:var(--rar-on)}',
    '.rar-btn-primary:hover{background:var(--rar-primary-h);border-color:var(--rar-primary-h)}',
    '.rar-btn[disabled]{opacity:.6;cursor:progress}',
    '.rar-or{display:flex;align-items:center;gap:12px;color:var(--rar-text2);font-size:12px;margin:4px 0}',
    '.rar-or::before,.rar-or::after{content:"";flex:1;height:1px;background:var(--rar-border)}',
    '.rar-link{background:none;border:0;padding:0;color:var(--rar-text2);font:inherit;font-size:13px;text-decoration:underline;cursor:pointer;min-height:32px}',
    '.rar-link:hover{color:var(--rar-text)}',
    '.rar-err{color:var(--rar-danger);font-size:13px;min-height:1em}',
    '.rar-row{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px}',
    '.rar-close{position:absolute;top:8px;right:8px;min-width:44px;min-height:44px;background:transparent;border:0;color:var(--rar-text2);font-size:20px;cursor:pointer}',
    '.rar-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);max-width:calc(100vw - 32px);display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--rar-surface2);border:1px solid var(--rar-primary);border-radius:8px;color:var(--rar-text);font-size:14px;z-index:3000}',
    '@media(prefers-reduced-motion:reduce){.rar-auth-btn,.rar-btn{transition:none}}'
  ].join('');

  /* ---------- helpers ---------- */
  function initials(u) {
    var n = (u.displayName || u.email || '?').trim();
    return n.charAt(0).toUpperCase();
  }
  function shortName(u) { return u.displayName || (u.email ? u.email.split('@')[0] : 'Account'); }

  function toast(msg, actionLabel, action) {
    var t = h('div', { class: 'rar-toast', role: 'status' }, [h('span', { text: msg })]);
    if (actionLabel) t.appendChild(h('button', { class: 'rar-btn', type: 'button', text: actionLabel, onclick: function () { t.remove(); action(); } }));
    D.body.appendChild(t);
    setTimeout(function () { t.remove(); }, actionLabel ? 12000 : 3500);
  }

  var ERRORS = {
    'auth/invalid-email': 'That email address looks invalid.',
    'auth/user-not-found': 'No account with that email. Create one instead.',
    'auth/wrong-password': 'Wrong password. Try again or reset it.',
    'auth/invalid-credential': 'Email or password is incorrect.',
    'auth/email-already-in-use': 'That email already has an account. Sign in instead.',
    'auth/weak-password': 'Use a password with at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Wait a minute and try again.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/popup-closed-by-user': '',
    'auth/cancelled-popup-request': '',
    'auth/unauthorized-domain': 'This site is not in Firebase "Authorized domains" yet. Add it in the Firebase console.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled in the Firebase console.'
  };
  function errText(e) {
    var c = e && e.code;
    return c in ERRORS ? ERRORS[c] : 'Sign-in failed. Please try again.';
  }

  /* ---------- trigger buttons ---------- */
  var menuOpenFor = null;

  function makeTrigger(kind) {   // kind: 'nav' | 'mobile' | 'float'
    var wrap = h('div', { class: 'rar-auth-wrap rar-auth-' + kind });
    var btn = h('button', { type: 'button', class: 'rar-auth-btn', 'aria-haspopup': 'true' });
    var menu = h('div', { class: 'rar-menu', hidden: true, role: 'menu' });
    wrap.appendChild(btn); wrap.appendChild(menu);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!user) { openDialog(); return; }
      var open = menu.hidden;
      closeMenus();
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      menuOpenFor = open ? menu : null;
    });
    triggers.push({ wrap: wrap, btn: btn, menu: menu, kind: kind });
    return wrap;
  }

  function closeMenus() {
    triggers.forEach(function (t) { t.menu.hidden = true; t.btn.setAttribute('aria-expanded', 'false'); });
    menuOpenFor = null;
  }

  function refresh() {
    triggers.forEach(function (t) {
      t.btn.textContent = '';
      if (user) {
        var av = user.photoURL
          ? h('img', { class: 'rar-avatar', src: user.photoURL, alt: '', referrerpolicy: 'no-referrer' })
          : h('span', { class: 'rar-avatar', 'aria-hidden': 'true', text: initials(user) });
        t.btn.appendChild(av);
        t.btn.appendChild(h('span', { class: 'rar-auth-label', text: shortName(user) }));
        t.btn.setAttribute('aria-label', 'Account menu for ' + shortName(user));
        t.menu.textContent = '';
        t.menu.appendChild(h('div', { class: 'rar-menu-who' }, [shortName(user), h('small', { text: user.email || '' })]));
        t.menu.appendChild(h('button', { type: 'button', role: 'menuitem', text: 'Sign out', onclick: signOut }));
      } else {
        t.btn.appendChild(h('span', { class: 'rar-avatar', 'aria-hidden': 'true', text: '☺' }));
        t.btn.appendChild(h('span', { class: 'rar-auth-label rar-always', text: 'Sign in' }));
        t.btn.setAttribute('aria-label', 'Sign in');
        t.menu.hidden = true;
      }
    });
  }

  function mount() {
    var navActions = D.querySelector('.nav-actions');
    var mobileInner = D.querySelector('#mobileMenu .nav-mobile-inner, #mobileMenu');
    if (navActions) {
      var anchor = navActions.querySelector('#hamburger');
      navActions.insertBefore(makeTrigger('nav'), anchor || null);
      if (mobileInner) mobileInner.insertBefore(makeTrigger('mobile'), mobileInner.firstChild);
    } else {
      D.body.appendChild(makeTrigger('float'));
    }
    refresh();
  }

  /* ---------- dialog ---------- */
  var dlg, form, nameField, nameInput, emailInput, passInput, errEl, submitBtn, googleBtn, titleEl, subEl, toggleBtn, forgotBtn;

  function buildDialog() {
    titleEl = h('h2', { id: 'rarAuthTitle' });
    subEl = h('p');
    googleBtn = h('button', { type: 'button', class: 'rar-btn rar-btn-primary', onclick: googleSignIn }, [
      h('span', { 'aria-hidden': 'true', text: 'G' }), 'Continue with Google'
    ]);
    nameInput = h('input', { type: 'text', autocomplete: 'name', placeholder: 'Your name' });
    nameField = h('label', {}, ['Name', nameInput]);
    emailInput = h('input', { type: 'email', required: true, autocomplete: 'email', placeholder: 'you@example.com' });
    passInput = h('input', { type: 'password', required: true, minlength: '6', autocomplete: 'current-password', placeholder: 'At least 6 characters' });
    errEl = h('div', { class: 'rar-err', role: 'alert', 'aria-live': 'polite' });
    submitBtn = h('button', { type: 'submit', class: 'rar-btn' });
    toggleBtn = h('button', { type: 'button', class: 'rar-link', onclick: function () { setMode(mode === 'login' ? 'register' : 'login'); } });
    forgotBtn = h('button', { type: 'button', class: 'rar-link', text: 'Forgot password?', onclick: resetPassword });
    form = h('form', { novalidate: false, onsubmit: emailSubmit }, [
      nameField, h('label', {}, ['Email', emailInput]), h('label', {}, ['Password', passInput]), errEl, submitBtn,
      h('div', { class: 'rar-row' }, [toggleBtn, forgotBtn])
    ]);
    dlg = h('dialog', { class: 'rar-dlg', 'aria-labelledby': 'rarAuthTitle' }, [
      h('button', { type: 'button', class: 'rar-close', 'aria-label': 'Close', text: '×', onclick: function () { dlg.close(); } }),
      titleEl, subEl, googleBtn, h('div', { class: 'rar-or', text: 'or' }), form
    ]);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });   // click on backdrop
    D.body.appendChild(dlg);
  }

  function setMode(m) {
    mode = m; errEl.textContent = '';
    var reg = m === 'register';
    titleEl.textContent = reg ? 'Create your account' : 'Sign in';
    subEl.textContent = 'Save your strategies and history across devices.';
    nameField.style.display = reg ? '' : 'none';
    passInput.autocomplete = reg ? 'new-password' : 'current-password';
    submitBtn.textContent = reg ? 'Create account' : 'Sign in with email';
    toggleBtn.textContent = reg ? 'I already have an account' : 'Create an account';
    forgotBtn.style.display = reg ? 'none' : '';
  }

  function openDialog() {
    if (!dlg) buildDialog();
    closeMenus(); setMode('login'); form.reset();
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    googleBtn.focus();
  }

  function setBusy(b) {
    busy = b;
    [googleBtn, submitBtn].forEach(function (x) { if (x) x.disabled = b; });
  }

  function trackLogin(method, isNew) { if (W.trackEvent) W.trackEvent(isNew ? 'sign_up' : 'login', { method: method }); }

  function googleSignIn() {
    if (busy) return;
    errEl.textContent = ''; setBusy(true);
    var provider = new W.firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(function (cred) { trackLogin('google', cred.additionalUserInfo && cred.additionalUserInfo.isNewUser); dlg.close(); })
      .catch(function (e) {
        if (e && e.code === 'auth/popup-blocked') { auth.signInWithRedirect(provider); return; }
        errEl.textContent = errText(e);
      })
      .then(function () { setBusy(false); });
  }

  function emailSubmit(ev) {
    ev.preventDefault();
    if (busy) return;
    var email = emailInput.value.trim(), pass = passInput.value, reg = mode === 'register';
    errEl.textContent = ''; setBusy(true);
    var p = reg
      ? auth.createUserWithEmailAndPassword(email, pass).then(function (cred) {
          var name = nameInput.value.trim() || email.split('@')[0];
          return cred.user.updateProfile({ displayName: name }).then(function () {
            user = auth.currentUser; refresh();
            return writeUserDoc(cred.user, { displayName: name });
          }).then(function () { trackLogin('password', true); });
        })
      : auth.signInWithEmailAndPassword(email, pass).then(function () { trackLogin('password', false); });
    p.then(function () { dlg.close(); })
     .catch(function (e) { errEl.textContent = errText(e); })
     .then(function () { setBusy(false); });
  }

  function resetPassword() {
    var email = emailInput.value.trim();
    if (!email) { errEl.textContent = 'Enter your email above first, then choose "Forgot password?".'; emailInput.focus(); return; }
    auth.sendPasswordResetEmail(email)
      .then(function () { errEl.textContent = ''; toast('Password reset email sent to ' + email); dlg.close(); })
      .catch(function (e) { errEl.textContent = errText(e); });
  }

  function signOut() {
    closeMenus();
    auth.signOut().then(function () { toast('Signed out. Your data stays on this device.'); });
  }

  /* ---------- users/{uid} profile doc (created on first login) ---------- */
  function writeUserDoc(u, extra) {
    if (!W.db) return Promise.resolve();
    var ref = W.db.collection('users').doc(u.uid);
    var f = W.firebase.firestore.FieldValue;
    return ref.set(Object.assign({
      displayName: u.displayName || null, email: u.email || null, photoURL: u.photoURL || null, updatedAt: f.serverTimestamp()
    }, extra || {}), { merge: true });
  }
  function ensureUserDoc(u) {
    if (!W.db) return Promise.resolve();
    var ref = W.db.collection('users').doc(u.uid);
    return ref.get().then(function (snap) {
      if (snap.exists) return;
      return ref.set({
        displayName: u.displayName || null, email: u.email || null, photoURL: u.photoURL || null,
        createdAt: W.firebase.firestore.FieldValue.serverTimestamp()
      });
    }).catch(function (e) { console.warn('[RAR auth] could not write users/' + u.uid + ' (deploy firestore.rules?)', e && e.message); });
  }

  /* ---------- auth state ---------- */
  function onAuth(u) {
    user = u; refresh();
    try { W.dispatchEvent(new CustomEvent('rar:auth', { detail: { user: u } })); } catch (e) { /* ignore */ }
    if (u) {
      ensureUserDoc(u);
      if (W.DB) {
        W.DB.syncOnLogin(u.uid).then(function (pulled) {
          if (pulled > 0) toast('Loaded ' + pulled + ' item' + (pulled === 1 ? '' : 's') + ' from your account.', 'Reload', function () { W.location.reload(); });
        });
      }
    } else if (W.DB) {
      W.DB.onLogout();
    }
  }

  function init() {
    var style = D.createElement('style'); style.textContent = css; D.head.appendChild(style);
    mount();
    D.addEventListener('click', function (e) { if (menuOpenFor && !e.target.closest('.rar-auth-wrap')) closeMenus(); });
    D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpenFor) closeMenus(); });
    auth.getRedirectResult().catch(function () { /* surfaced via onAuthStateChanged */ });
    auth.onAuthStateChanged(onAuth);
  }

  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', init); else init();
})(window, document);
