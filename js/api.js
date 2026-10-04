/* js/api.js: client for the HackathonMaster API (Gemini proxy).
 *
 * Load AFTER the Firebase scripts (js/firebase.js) and BEFORE any page script that calls callGemini().
 *
 *   const data = await callGemini('gemini-2.5-flash', [{ parts: [{ text: 'Hello' }] }], { temperature: 0.3 });
 *   const text = data.candidates[0].content.parts[0].text;      // same shape as Gemini's own response
 *
 * The Gemini key now lives on the server. The browser only sends the user's Firebase ID token, so AI
 * features need a signed-in user. Signed-out users keep the offline engines, as before.
 */
(function (W) {
  'use strict';

  // Local development serves the API from the same origin (uvicorn server.app:app); production uses the Render API service.
  var LOCAL = ['localhost', '127.0.0.1'].indexOf(W.location.hostname) !== -1;
  var API_BASE = LOCAL ? '' : 'https://hackathon-master-api.onrender.com';
  var TIMEOUT_MS = 120000;   // generous: a sleeping Render free instance needs 30-60 s to wake up

  function apiError(message, status, code) {
    var e = new Error(message);
    e.status = status || 0;
    e.code = code || '';
    return e;
  }

  /** Resolves once Firebase has restored the previous session (or after 3 s). Resolves to the user or null. */
  var authPromise = null;
  function waitForAuth() {
    if (authPromise) return authPromise;
    authPromise = new Promise(function (resolve) {
      var a = W.auth;
      if (!a) return resolve(null);
      var done = false;
      var finish = function (u) { if (!done) { done = true; resolve(u || null); } };
      var off = a.onAuthStateChanged(function (u) { finish(u); if (typeof off === 'function') off(); });
      setTimeout(function () { finish(a.currentUser); }, 3000);
    });
    return authPromise;
  }

  /** Synchronous: is someone signed in right now? */
  function isSignedIn() {
    return !!(W.auth && W.auth.currentUser);
  }

  function detailText(body, fallback) {
    var d = body && body.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d) && d.length) return 'Invalid request: ' + (d[0].msg || 'check the input');   // FastAPI validation errors
    return fallback;
  }

  async function post(token, payload) {
    var ctl = new AbortController();
    var timer = setTimeout(function () { ctl.abort(); }, TIMEOUT_MS);
    try {
      return await fetch(API_BASE + '/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(payload),
        signal: ctl.signal
      });
    } catch (e) {
      if (e && e.name === 'AbortError') throw apiError('The AI service took too long to respond. Please try again.', 504, 'timeout');
      throw apiError('Could not reach the AI service. Check your connection.', 0, 'network');
    } finally {
      clearTimeout(timer);
    }
  }

  async function callGemini(model, contents, generationConfig) {
    if (!W.auth) throw apiError('Sign-in is unavailable right now.', 0, 'no-auth');
    var user = W.auth.currentUser || await waitForAuth();
    if (!user) throw apiError('Please sign in to use AI features', 401, 'auth');

    var payload = { model: model, contents: contents, generationConfig: generationConfig || {} };
    var token = await user.getIdToken();                 // cached; the SDK refreshes it when it is about to expire
    var response = await post(token, payload);

    if (response.status === 401) {                       // token rejected: force one refresh and retry once
      token = await user.getIdToken(true);
      response = await post(token, payload);
    }
    if (!response.ok) {
      var err = await response.json().catch(function () { return {}; });
      throw apiError(detailText(err, 'AI request failed'), response.status, response.status === 401 ? 'auth' : 'api');
    }
    return response.json();
  }

  W.API_BASE = API_BASE;
  W.callGemini = callGemini;
  W.isSignedIn = isSignedIn;
  W.waitForAuth = waitForAuth;
})(window);
