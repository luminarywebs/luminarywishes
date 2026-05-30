/**
 * Luminary Wishes — Frontend Management System
 * Handles: session tracking, free plan enforcement, activity, plan state
 */
const LWManagement = (() => {
    const K = { free:'_lw_fm', session:'_lw_ss', fp:'_lw_fp', visits:'_lw_vt' };
    const enc = o => { try { return btoa(encodeURIComponent(JSON.stringify(o))); } catch { return null; } };
    const dec = s => { try { return JSON.parse(decodeURIComponent(atob(s))); } catch { return null; } };
    const store    = (k,v) => { try { localStorage.setItem(k, enc(v)); } catch {} };
    const retrieve = k => { try { const r = localStorage.getItem(k); return r ? dec(r) : null; } catch { return null; } };

    // Soft device fingerprint (no PII)
    function fp() {
        const p = [navigator.language, navigator.platform, screen.width+'x'+screen.height,
            Intl.DateTimeFormat().resolvedOptions().timeZone, navigator.hardwareConcurrency||0].join('|');
        let h = 0;
        for (let i = 0; i < p.length; i++) { h = ((h << 5) - h) + p.charCodeAt(i); h |= 0; }
        return Math.abs(h).toString(36);
    }

    // Session init
    function initSession() {
        const fingerprint = fp();
        if (!retrieve(K.fp)) store(K.fp, { fp: fingerprint, first: Date.now() });
        const session = { start: Date.now(), page: location.pathname, referrer: document.referrer || 'direct' };
        try { sessionStorage.setItem(K.session, enc(session)); } catch {}
        const visits = retrieve(K.visits) || [];
        visits.push({ ts: Date.now(), page: location.pathname });
        if (visits.length > 30) visits.shift();
        store(K.visits, visits);
        return session;
    }

    // Free plan: 1 link per browser fingerprint
    function getFreeMeta() { return retrieve(K.free) || { count: 0, links: [], fp: fp() }; }
    function canUseFree() {
        const m = getFreeMeta();
        if (m.fp && m.fp !== fp()) return { allowed: true, reason: 'new_device' };
        if (m.count >= 1) return { allowed: false, reason: 'limit_reached' };
        return { allowed: true, reason: 'ok' };
    }
    function recordFreeUse(token) {
        const m = getFreeMeta();
        m.count++; m.fp = fp();
        m.links.push({ token, ts: Date.now() });
        store(K.free, m);
    }

    // Plan state (sessionStorage)
    function getActivePlan()       { return sessionStorage.getItem('selectedPlan') || 'free'; }
    function setPlan(key, price)   { sessionStorage.setItem('selectedPlan', key); sessionStorage.setItem('planPrice', price); }
    function isPaid()              { const p = getActivePlan(); return p === 'plus' || p === 'pro'; }

    // Expiry using synced time
    function checkExpiry(ms) {
        if (!ms) return false;
        return window.LWTimeSync ? window.LWTimeSync.isExpired(ms) : Date.now() > ms;
    }

    // Activity tracking
    let _last = Date.now();
    ['mousemove','keydown','touchstart','scroll'].forEach(ev =>
        document.addEventListener(ev, () => _last = Date.now(), { passive: true }));
    function isActive() { return Date.now() - _last < 5 * 60 * 1000; }

    // Warn on checkout if free limit hit
    if (location.pathname.includes('checkout')) {
        const check = canUseFree();
        if (!check.allowed) window._lwFreeLimitReached = true;
    }

    function _devReset() { Object.values(K).forEach(k => localStorage.removeItem(k)); sessionStorage.clear(); }

    const session = initSession();
    return { session, canUseFree, recordFreeUse, getActivePlan, setPlan, isPaid, checkExpiry, isActive, _devReset };
})();
window.LWManagement = LWManagement;
