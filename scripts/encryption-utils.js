/**
 * Luminary Wishes — Encryption & Short Link System
 * Short links:  /b/TOKEN  → birthday
 *               /a/TOKEN  → anniversary
 *               /m/TOKEN  → marriage
 * Payload is XOR-obfuscated then base62-encoded → short token (~10-14 chars)
 */

const LWEncryption = (() => {
    const B62   = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const XKEY  = 'LW2026';

    function xor(str, key) {
        let out = '';
        for (let i = 0; i < str.length; i++)
            out += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        return out;
    }

    function b62enc(bytes) {
        let num = BigInt('0x' + Array.from(bytes).map(b => b.toString(16).padStart(2,'0')).join(''));
        if (num === 0n) return '0';
        let r = '';
        while (num > 0n) { r = B62[Number(num % 62n)] + r; num /= 62n; }
        return r;
    }

    function b62dec(s) {
        let num = 0n;
        for (const c of s) num = num * 62n + BigInt(B62.indexOf(c));
        let hex = num.toString(16);
        if (hex.length % 2) hex = '0' + hex;
        const bytes = [];
        for (let i = 0; i < hex.length; i += 2) bytes.push(parseInt(hex.slice(i, i+2), 16));
        return new Uint8Array(bytes);
    }

    // Abbreviate keys to save space
    const ENC_MAP = { name:'n', name1:'n1', name2:'n2', age:'a', years:'y', date:'d', message:'m', theme:'t', music:'mu', plan:'p', type:'ty', timestamp:'ts', expiry:'ex', customColor:'cc' };
    const DEC_MAP = Object.fromEntries(Object.entries(ENC_MAP).map(([k,v])=>[v,k]));

    function compress(obj) {
        const out = {};
        for (const [k,v] of Object.entries(obj)) if (v !== null && v !== undefined) out[ENC_MAP[k]||k] = v;
        return JSON.stringify(out);
    }
    function decompress(str) {
        const mini = JSON.parse(str), out = {};
        for (const [k,v] of Object.entries(mini)) out[DEC_MAP[k]||k] = v;
        return out;
    }

    function encode(payload) {
        try {
            const bytes = new TextEncoder().encode(xor(compress(payload), XKEY));
            return b62enc(bytes);
        } catch(e) { console.error('[LWEnc] encode', e); return null; }
    }

    function decode(token) {
        try {
            const bytes = b62dec(token);
            return decompress(xor(new TextDecoder().decode(bytes), XKEY));
        } catch(e) { console.error('[LWEnc] decode', e); return null; }
    }

    // Build full https short URL
    function buildLink(type, data) {
        const prefixes = { birthday:'/b/', anniversary:'/a/', marriage:'/m/' };
        const prefix   = prefixes[type] || '/b/';
        const domain   = window.LUMINARY_CONFIG?.domain || 'luminarywishes.dpdns.org';
        const plan     = data.plan || 'free';
        const now      = Date.now();
        const payload  = {
            ...data,
            type,
            plan,
            timestamp: now,
            expiry: plan === 'free' ? null : now + 365*24*60*60*1000
        };
        const token = encode(payload);
        return token ? `https://${domain}${prefix}${token}` : null;
    }

    // Parse current URL token
    function parseCurrentURL() {
        const path = window.location.pathname;
        const map  = { '/b/':'birthday', '/a/':'anniversary', '/m/':'marriage' };
        for (const [pfx] of Object.entries(map)) {
            if (path.startsWith(pfx)) {
                const token = path.slice(pfx.length);
                return token ? decode(token) : null;
            }
        }
        // Fallback: ?data= (legacy)
        const sp = new URLSearchParams(window.location.search);
        if (sp.has('data')) return legacyDecode(sp.get('data'));
        return null;
    }

    // Legacy base64 decode (backward compat)
    function legacyDecode(enc) {
        try {
            let b64 = enc.replace(/-/g,'+').replace(/_/g,'/');
            while (b64.length%4) b64+='=';
            return JSON.parse(decodeURIComponent(escape(atob(b64))));
        } catch { return null; }
    }

    function isExpired(payload) {
        if (!payload?.expiry) return false;
        const now = window.LWTimeSync ? window.LWTimeSync.now() : Date.now();
        return now > payload.expiry;
    }

    return { encode, decode, buildLink, parseCurrentURL, isExpired };
})();

// Legacy aliases so existing code still works
function encryptData(data) {
    try {
        const json = JSON.stringify(data);
        const b64  = btoa(unescape(encodeURIComponent(json)));
        return b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    } catch(e) { return null; }
}
function decryptData(enc) {
    try {
        let b64 = enc.replace(/-/g,'+').replace(/_/g,'/');
        while (b64.length%4) b64+='=';
        return JSON.parse(decodeURIComponent(escape(atob(b64))));
    } catch(e) { return null; }
}
function hasEncryptedParam(params) { return params.has('data'); }
function getDataFromURL(params) {
    if (hasEncryptedParam(params)) {
        const d = decryptData(params.get('data'));
        if (d) return d;
    }
    return {
        name: params.get('name')||null, name1:params.get('name1')||null,
        name2:params.get('name2')||null, age:params.get('age')||null,
        years:params.get('years')||null, date:params.get('date')||null,
        message:params.get('message')||null, theme:params.get('theme')||null,
        music:params.get('music')||null, plan:params.get('plan')||'free'
    };
}

window.LWEncryption = LWEncryption;
console.log('%c🔒 Encryption Utils Loaded (v2 — short links)', 'color:#43e97b;font-weight:bold;');
