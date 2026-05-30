/**
 * Luminary Wishes — Time Sync
 * Syncs server time to validate link expiry without trusting device clock.
 */
const LWTimeSync = (() => {
    let _offset = 0, _synced = false, _syncedAt = 0;
    const SOURCES = [
        'https://worldtimeapi.org/api/ip',
        'https://timeapi.io/api/Time/current/zone?timeZone=UTC'
    ];
    function extract(d) {
        if (d.unixtime)        return d.unixtime * 1000;
        if (d.dateTime)        return new Date(d.dateTime + 'Z').getTime();
        if (d.currentDateTime) return new Date(d.currentDateTime).getTime();
        return null;
    }
    async function fetchSrc(url) {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 3000);
        try {
            const res  = await fetch(url, { signal: ctrl.signal });
            const data = await res.json();
            clearTimeout(t);
            return extract(data);
        } catch { clearTimeout(t); return null; }
    }
    async function sync() {
        for (const src of SOURCES) {
            const before = Date.now();
            const server = await fetchSrc(src);
            const after  = Date.now();
            if (server) {
                _offset  = (server + (after - before) / 2) - after;
                _synced  = true;
                _syncedAt = after;
                try { sessionStorage.setItem('_lwts', btoa(JSON.stringify({ o: _offset, t: _syncedAt }))); } catch {}
                return true;
            }
        }
        // restore from session cache (valid 30 min)
        try {
            const c = JSON.parse(atob(sessionStorage.getItem('_lwts') || ''));
            if (Date.now() - c.t < 1800000) { _offset = c.o; _synced = true; _syncedAt = c.t; return true; }
        } catch {}
        return false;
    }
    function now()              { return Date.now() + _offset; }
    function isExpired(ms)      { return ms ? now() > ms : false; }
    function countdown(target)  {
        const diff = target - now();
        if (diff <= 0) return 'Expired';
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m remaining`;
    }
    sync();
    setInterval(sync, 20 * 60 * 1000);
    return { sync, now, isExpired, countdown, get synced() { return _synced; } };
})();
window.LWTimeSync = LWTimeSync;
