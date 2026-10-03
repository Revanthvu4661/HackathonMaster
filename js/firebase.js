/* js/firebase.js
 * Initialises Firebase (compat SDK v10, loaded by <script> tags) and exposes
 * window.app, window.auth, window.db, window.analytics.
 *
 * Load AFTER the four gstatic compat scripts and BEFORE db.js / auth-ui.js.
 * If the SDK is missing (offline, ad-blocker, CDN down) every global stays null
 * and RAR_FIREBASE_READY is false, so the rest of the site keeps working locally.
 *
 * Note: a Firebase web apiKey is an identifier, not a secret. Access is enforced by
 * firestore.rules and the "Authorized domains" list in the Firebase console.
 */
(function (W) {
  'use strict';

  var firebaseConfig = {
    apiKey: 'AIzaSyDFnojCUi1CON39R-C4adqT9IDWEU38Z-M',
    authDomain: 'hackathon-master-9e890.firebaseapp.com',
    projectId: 'hackathon-master-9e890',
    storageBucket: 'hackathon-master-9e890.firebasestorage.app',
    messagingSenderId: '614578031142',
    appId: '1:614578031142:web:1587516249dab3a4f4b4e7',
    measurementId: 'G-44VL0ZKMQE'
  };

  W.app = null;
  W.auth = null;
  W.db = null;
  W.analytics = null;
  W.RAR_FIREBASE_READY = false;

  try {
    if (typeof W.firebase === 'undefined') throw new Error('Firebase SDK not loaded (offline or blocked)');

    W.app = W.firebase.apps.length ? W.firebase.app() : W.firebase.initializeApp(firebaseConfig);
    W.auth = W.firebase.auth();
    W.db = W.firebase.firestore();
    W.RAR_FIREBASE_READY = true;

    // Analytics is optional: it throws in unsupported environments (file://, some privacy modes).
    try {
      if (typeof W.firebase.analytics === 'function') W.analytics = W.firebase.analytics();
    } catch (e) {
      W.analytics = null;
    }
  } catch (err) {
    console.warn('[RAR] Firebase unavailable, running in local-only mode:', err && err.message);
  }

  /** Safe analytics helper: never throws, does nothing when Analytics is unavailable. */
  W.trackEvent = function (name, params) {
    try {
      if (W.analytics) W.analytics.logEvent(name, params || {});
    } catch (e) { /* analytics must never break the app */ }
  };
})(window);
