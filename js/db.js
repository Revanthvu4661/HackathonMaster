/* js/db.js
 * Firestore wrapper with localStorage fallback. Exposes window.DB.
 *
 * Design: LOCAL-FIRST. The existing pages read localStorage synchronously in ~35 places, so
 * localStorage stays the working copy. When a user is signed in:
 *   - writes to the synced keys are MIRRORED to Firestore (debounced), and
 *   - on login the browser's data is uploaded (migrate) and the cloud data is merged back (hydrate).
 * Signed out, or with Firebase unavailable, nothing changes: everything stays in localStorage.
 *
 * Firestore layout (all under users/{uid}, locked down by firestore.rules):
 *   history/{kind}-{timestamp}   kind = 'strategist' | 'team'    (deterministic id => no duplicates)
 *   strategies/{auto-id}
 *   checklists/{auto-id | 'current'}
 *   meta/latest                  latest strategist / team-builder result
 * Documents store the original object as a JSON string in `data`: Firestore rejects nested arrays
 * and undefined values, which these result objects contain.
 */
(function (W) {
  'use strict';

  var K = {
    strat: 'strat_history', tb: 'tb_history',
    latestStrat: 'latest_strat_result', latestTb: 'latest_tb_result',
    checklist: 'activeChecklist', states: 'checklistStates',
    strategies: 'rar_strategies',            // local fallback for saveStrategy when signed out
    owner: 'rar_cloud_owner'                 // which account the local data was synced with
  };
  var MIRRORED = [K.strat, K.tb, K.latestStrat, K.latestTb, K.checklist, K.states];
  var LOCAL_CAP = 10;   // the app keeps 10 history items locally
  var CLOUD_CAP = 50;   // getHistory returns up to 50

  var proto = W.Storage && W.Storage.prototype;
  var rawSet = proto ? proto.setItem : function (k, v) { this.setItem(k, v); };
  var rawRemove = proto ? proto.removeItem : function (k) { this.removeItem(k); };

  function warn(msg, err) { console.warn('[RAR db] ' + msg, err && err.message ? err.message : err || ''); }
  function ready() { return !!(W.RAR_FIREBASE_READY && W.db); }
  function uid() { return W.auth && W.auth.currentUser ? W.auth.currentUser.uid : null; }
  function userRef(id) { return W.db.collection('users').doc(id); }
  function parse(raw, d) { try { return raw == null ? d : JSON.parse(raw); } catch (e) { return d; } }
  function lsGet(k, d) { try { return parse(W.localStorage.getItem(k), d); } catch (e) { return d; } }
  // lsPut/lsDel bypass the mirror hook (they are used for local-only writes and for hydration).
  function lsPut(k, v) {
    try { rawSet.call(W.localStorage, k, typeof v === 'string' ? v : JSON.stringify(v)); return true; }
    catch (e) { warn('localStorage write failed (quota?) for ' + k, e); return false; }
  }
  function lsDel(k) { try { rawRemove.call(W.localStorage, k); } catch (e) { /* ignore */ } }

  /* ----- document encoding ----- */
  function kindOf(item) { return item && item.idea !== undefined && item.problem === undefined ? 'team' : 'strategist'; }
  function histDoc(kind, item) {
    var ts = Number(item.timestamp) || Date.now();
    return {
      id: kind + '-' + ts,
      fields: { kind: kind, timestamp: ts, title: String(item.problem || item.idea || '').slice(0, 200), data: JSON.stringify(item) }
    };
  }
  function decode(doc, tag) {
    var d = doc.data(), o = parse(d && d.data, null);
    if (o && tag) { o._id = doc.id; o._kind = d.kind; }
    return o;
  }
  function byTimeDesc(a, b) { return (b.timestamp || 0) - (a.timestamp || 0); }

  /* ----- local fallbacks ----- */
  function localHistorySave(kind, item) {
    var key = kind === 'team' ? K.tb : K.strat, field = kind === 'team' ? 'idea' : 'problem';
    if (!item.timestamp) item.timestamp = Date.now();
    var list = lsGet(key, []).filter(function (h) { return h[field] !== item[field]; });
    list.unshift(item);
    lsPut(key, list.slice(0, LOCAL_CAP));
    return kind + '-' + item.timestamp;
  }
  function localHistory() {
    return lsGet(K.strat, []).concat(lsGet(K.tb, [])).sort(byTimeDesc).slice(0, CLOUD_CAP);
  }

  /* ----- public API ----- */
  function saveStrategy(userId, data) {
    var item = Object.assign({}, data);
    if (!item.timestamp) item.timestamp = Date.now();
    if (userId && ready()) {
      return userRef(userId).collection('strategies').add({
        timestamp: item.timestamp, title: String(item.problem || item.idea || '').slice(0, 200),
        data: JSON.stringify(item)
      }).then(function (ref) { return ref.id; }).catch(function (e) { warn('saveStrategy failed', e); return null; });
    }
    var list = lsGet(K.strategies, []);
    list.unshift(item);
    lsPut(K.strategies, list.slice(0, LOCAL_CAP));
    return Promise.resolve('local-' + item.timestamp);
  }

  function getStrategies(userId) {
    if (userId && ready()) {
      return userRef(userId).collection('strategies').orderBy('timestamp', 'desc').limit(CLOUD_CAP).get()
        .then(function (s) { return s.docs.map(function (d) { return decode(d, true); }).filter(Boolean); })
        .catch(function (e) { warn('getStrategies failed', e); return lsGet(K.strategies, []); });
    }
    return Promise.resolve(lsGet(K.strategies, []));
  }

  function saveHistory(userId, item) {
    var kind = kindOf(item);
    if (!item.timestamp) item.timestamp = Date.now();
    if (userId && ready()) {
      var d = histDoc(kind, item);
      return userRef(userId).collection('history').doc(d.id).set(d.fields)
        .then(function () { return d.id; })
        .catch(function (e) { warn('saveHistory failed, kept locally', e); return localHistorySave(kind, item); });
    }
    return Promise.resolve(localHistorySave(kind, item));
  }

  function getHistory(userId) {
    if (userId && ready()) {
      return userRef(userId).collection('history').orderBy('timestamp', 'desc').limit(CLOUD_CAP).get()
        .then(function (s) { return s.docs.map(function (d) { return decode(d, true); }).filter(Boolean); })
        .catch(function (e) { warn('getHistory failed, using local copy', e); return localHistory(); });
    }
    return Promise.resolve(localHistory());
  }

  function saveChecklist(userId, data) {
    // data: { checklist, states }
    if (userId && ready()) {
      return userRef(userId).collection('checklists').add({ timestamp: Date.now(), data: JSON.stringify(data) })
        .then(function (ref) { return ref.id; })
        .catch(function (e) { warn('saveChecklist failed, kept locally', e); return saveChecklistLocal(data); });
    }
    return Promise.resolve(saveChecklistLocal(data));
  }
  function saveChecklistLocal(data) {
    if (data && data.checklist) lsPut(K.checklist, data.checklist);
    if (data && data.states) lsPut(K.states, data.states);
    return 'local';
  }

  function getChecklist(userId) {
    var local = { checklist: lsGet(K.checklist, null), states: lsGet(K.states, {}) };
    if (userId && ready()) {
      return userRef(userId).collection('checklists').orderBy('timestamp', 'desc').limit(1).get()
        .then(function (s) { return s.empty ? local : (parse(s.docs[0].data().data, local) || local); })
        .catch(function (e) { warn('getChecklist failed, using local copy', e); return local; });
    }
    return Promise.resolve(local);
  }

  /** Upload what's in this browser to the account. Idempotent. Never overwrites newer cloud checklist/latest. */
  async function migrateFromLocalStorage(userId, opts) {
    opts = opts || {};
    if (!userId || !ready()) return { skipped: true };
    var ref = userRef(userId), batch = W.db.batch(), n = { history: 0, latest: 0, checklist: 0 };

    [['strategist', K.strat], ['team', K.tb]].forEach(function (p) {
      lsGet(p[1], []).forEach(function (item) {
        if (!item || !item.timestamp) return;
        var d = histDoc(p[0], item);
        batch.set(ref.collection('history').doc(d.id), d.fields);
        n.history++;
      });
    });

    var cloudLatest = await ref.collection('meta').doc('latest').get();
    var cl = cloudLatest.exists ? cloudLatest.data() : {}, latest = {};
    var ls = lsGet(K.latestStrat, null), lt = lsGet(K.latestTb, null);
    if (ls && !cl.strat) latest.strat = JSON.stringify(ls);
    if (lt && !cl.tb) latest.tb = JSON.stringify(lt);
    if (Object.keys(latest).length) { latest.timestamp = Date.now(); batch.set(ref.collection('meta').doc('latest'), latest, { merge: true }); n.latest = 1; }

    var cloudCheck = await ref.collection('checklists').doc('current').get();
    var ck = lsGet(K.checklist, null), st = lsGet(K.states, null);
    if (!cloudCheck.exists && (ck || st)) {
      batch.set(ref.collection('checklists').doc('current'), { timestamp: Date.now(), data: JSON.stringify({ checklist: ck, states: st || {} }) });
      n.checklist = 1;
    }

    await batch.commit();
    // Optional: remove the local copies once they are safely in Firestore. Off by default because the
    // pages read these keys synchronously; deleting them would blank the history sidebar.
    if (opts.clear) MIRRORED.forEach(lsDel);
    return n;
  }

  /** Merge cloud data into this browser's localStorage. Returns how many items were added locally. */
  async function hydrate(userId) {
    var ref = userRef(userId), pulled = 0;
    var snap = await ref.collection('history').orderBy('timestamp', 'desc').limit(CLOUD_CAP).get();
    var cloud = { strategist: [], team: [] };
    snap.docs.forEach(function (d) { var o = decode(d, false); if (o) (d.data().kind === 'team' ? cloud.team : cloud.strategist).push(o); });

    [['strategist', K.strat], ['team', K.tb]].forEach(function (p) {
      var local = lsGet(p[1], []), have = {};
      local.forEach(function (i) { have[i.timestamp] = 1; });
      var add = cloud[p[0]].filter(function (i) { return !have[i.timestamp]; });
      if (!add.length) return;
      var merged = local.concat(add).sort(byTimeDesc).slice(0, LOCAL_CAP);
      pulled += merged.filter(function (i) { return !have[i.timestamp]; }).length;
      lsPut(p[1], merged);
    });

    var lat = await ref.collection('meta').doc('latest').get();
    if (lat.exists) {
      var d = lat.data();
      if (d.strat && W.localStorage.getItem(K.latestStrat) == null) { lsPut(K.latestStrat, d.strat); pulled++; }
      if (d.tb && W.localStorage.getItem(K.latestTb) == null) { lsPut(K.latestTb, d.tb); pulled++; }
    }

    var cur = await ref.collection('checklists').doc('current').get();
    if (cur.exists && W.localStorage.getItem(K.checklist) == null) {
      var o = parse(cur.data().data, {}) || {};
      if (o.checklist) lsPut(K.checklist, o.checklist);
      if (o.states) lsPut(K.states, o.states);
      pulled++;
    }
    return pulled;
  }

  /* ----- login sync ----- */
  var syncing = null;
  function syncOnLogin(userId) {
    if (!ready() || !userId) return Promise.resolve(0);
    if (syncing && syncing.uid === userId) return syncing.p;
    var p = (async function () {
      var owner = null;
      try { owner = W.localStorage.getItem(K.owner); } catch (e) { /* ignore */ }
      if (owner && owner !== userId) {
        // This browser's data belongs to a different account: never leak it into this one.
        MIRRORED.concat([K.strategies]).forEach(lsDel);
      } else {
        await migrateFromLocalStorage(userId);
      }
      try { rawSet.call(W.localStorage, K.owner, userId); } catch (e) { /* ignore */ }
      var pulled = await hydrate(userId);
      try { W.dispatchEvent(new CustomEvent('rar:cloud-synced', { detail: { pulled: pulled } })); } catch (e) { /* ignore */ }
      return pulled;
    })().catch(function (e) { warn('login sync failed (are firestore.rules deployed?)', e); syncing = null; return 0; });
    syncing = { uid: userId, p: p };
    return p;
  }
  function onLogout() { syncing = null; }

  /* ----- write-through mirror ----- */
  var pending = {}, timer = null;

  function queue(key, prev, next) {
    var id = uid();
    if (!id || !ready()) return;
    var p = pending[key];
    pending[key] = { uid: id, prev: p ? p.prev : prev, next: next };   // keep the earliest 'prev' across a burst
    clearTimeout(timer);
    timer = setTimeout(flush, 800);
  }

  function flush() {
    var jobs = pending; pending = {};
    Object.keys(jobs).forEach(function (key) {
      var j = jobs[key];
      if (j.uid !== uid()) return;   // account changed meanwhile
      mirrorKey(key, j).catch(function (e) { warn('cloud mirror failed for ' + key, e); });
    });
  }

  function mirrorKey(key, j) {
    var ref = userRef(j.uid);

    if (key === K.strat || key === K.tb) {
      var kind = key === K.tb ? 'team' : 'strategist';
      var prevL = parse(j.prev, []), nextL = parse(j.next, []);
      var prevIds = {}, nextIds = {};
      prevL.forEach(function (i) { if (i && i.timestamp) prevIds[i.timestamp] = 1; });
      nextL.forEach(function (i) { if (i && i.timestamp) nextIds[i.timestamp] = 1; });
      var added = nextL.filter(function (i) { return i && i.timestamp && !prevIds[i.timestamp]; });
      var removed = prevL.filter(function (i) { return i && i.timestamp && !nextIds[i.timestamp]; });
      var batch = W.db.batch();
      added.forEach(function (i) { var d = histDoc(kind, i); batch.set(ref.collection('history').doc(d.id), d.fields); });
      // Only a write that adds nothing and drops items is a real user delete. When something was added,
      // dropped items are the app's 10-item trim / same-problem replacement: keep those in the cloud.
      if (!added.length) removed.forEach(function (i) { batch.delete(ref.collection('history').doc(kind + '-' + i.timestamp)); });
      return batch.commit();
    }

    if (key === K.latestStrat || key === K.latestTb) {
      var f = { timestamp: Date.now() }, field = key === K.latestTb ? 'tb' : 'strat';
      f[field] = j.next == null ? W.firebase.firestore.FieldValue.delete() : j.next;
      return ref.collection('meta').doc('latest').set(f, { merge: true });
    }

    // activeChecklist / checklistStates
    return ref.collection('checklists').doc('current').set({
      timestamp: Date.now(),
      data: JSON.stringify({ checklist: lsGet(K.checklist, null), states: lsGet(K.states, {}) })
    });
  }

  // Hook localStorage so every existing writer (strategist, team builder, checklist, history sidebar)
  // is mirrored without editing each call site. Wrapped so it can never break a write.
  if (proto) {
    proto.setItem = function (k, v) {
      var tracked = this === W.localStorage && MIRRORED.indexOf(k) > -1, prev = null;
      if (tracked) { try { prev = this.getItem(k); } catch (e) { /* ignore */ } }
      rawSet.apply(this, arguments);
      if (tracked) { try { queue(k, prev, String(v)); } catch (e) { /* ignore */ } }
    };
    proto.removeItem = function (k) {
      var tracked = this === W.localStorage && MIRRORED.indexOf(k) > -1, prev = null;
      if (tracked) { try { prev = this.getItem(k); } catch (e) { /* ignore */ } }
      rawRemove.apply(this, arguments);
      if (tracked) { try { queue(k, prev, null); } catch (e) { /* ignore */ } }
    };
  }

  // Public calls must never throw into page code, even if the SDK throws synchronously.
  function safe(fn, fallback) {
    return function () {
      try { return fn.apply(null, arguments); }
      catch (e) { warn(fn.name + ' threw, using fallback', e); return Promise.resolve(fallback.apply(null, arguments)); }
    };
  }

  W.DB = {
    uid: uid, ready: ready,
    saveStrategy: safe(saveStrategy, function () { return null; }),
    getStrategies: safe(getStrategies, function () { return lsGet(K.strategies, []); }),
    saveHistory: safe(saveHistory, function (u, item) { return localHistorySave(kindOf(item), item); }),
    getHistory: safe(getHistory, localHistory),
    saveChecklist: safe(saveChecklist, function (u, d) { return saveChecklistLocal(d); }),
    getChecklist: safe(getChecklist, function () { return { checklist: lsGet(K.checklist, null), states: lsGet(K.states, {}) }; }),
    migrateFromLocalStorage: migrateFromLocalStorage,
    syncOnLogin: syncOnLogin, onLogout: onLogout,
    _flush: flush   // exposed for tests
  };
})(typeof window !== 'undefined' ? window : globalThis);
