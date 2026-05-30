/**
 * Luminary Wishes — UPI Payment Widget
 * Generates UPI QR codes dynamically from UPI ID + amount.
 */
const LWPay = (() => {
    const QUICK = [10, 30, 51, 100, 200, 500];

    function buildUPI(upiId, amount, note = 'Luminary Wishes Support') {
        return `upi://pay?` + new URLSearchParams({ pa: upiId, pn: 'Luminary Wishes', am: amount.toFixed(2), cu: 'INR', tn: note }).toString();
    }

    function loadQR() {
        return new Promise((res, rej) => {
            if (window.QRCode) { res(); return; }
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
            s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
        });
    }

    async function renderQR(containerId, upiId, amount) {
        await loadQR();
        const el = document.getElementById(containerId);
        if (!el) return;
        el.innerHTML = '';
        new window.QRCode(el, {
            text: buildUPI(upiId, amount),
            width: 200, height: 200,
            colorDark: '#0a0e27', colorLight: '#ffffff',
            correctLevel: window.QRCode.CorrectLevel.H
        });
    }

    async function mountWidget(containerId, options = {}) {
        const cfg   = window.LUMINARY_CONFIG || {};
        const upiId = options.upiId || cfg.contact?.upiId || 'luminarywebs@upi';
        const sym   = cfg.currencySymbol || '₹';
        const el    = document.getElementById(containerId);
        if (!el) return;

        el.innerHTML = `
        <div class="pay-widget glass-card" style="max-width:460px;margin:0 auto;padding:2rem;border-radius:20px">
            <div style="text-align:center;margin-bottom:1.5rem">
                <div style="font-size:2.5rem;margin-bottom:0.5rem">☕</div>
                <h3 style="font-size:1.4rem;font-weight:800;margin-bottom:0.35rem">${options.title || 'Support Luminary Wishes'}</h3>
                <p style="color:var(--text-muted);font-size:0.9rem">Your support keeps the lights on ✨</p>
                <p style="margin-top:0.4rem;font-size:0.82rem;color:var(--text-muted)">UPI: <strong style="color:var(--accent-color,#7c6df5)">${upiId}</strong></p>
            </div>
            <div style="margin-bottom:1.25rem">
                <p style="font-size:0.78rem;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);font-weight:700;margin-bottom:0.6rem">Quick amounts</p>
                <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
                    ${QUICK.map(a => `<button class="pay-quick-btn" data-amount="${a}" style="padding:0.45rem 0.9rem;border:2px solid rgba(255,255,255,0.1);border-radius:30px;background:transparent;color:var(--text-secondary,#c9d1f0);font-size:0.88rem;font-weight:700;cursor:pointer;transition:all 0.2s">${sym}${a}</button>`).join('')}
                </div>
            </div>
            <div style="margin-bottom:1.5rem">
                <label style="display:block;font-size:0.82rem;color:var(--text-muted);font-weight:600;margin-bottom:0.5rem">Or enter amount</label>
                <div style="display:flex;align-items:center;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;overflow:hidden">
                    <span style="padding:0 0.75rem;font-weight:800;color:var(--accent-color,#7c6df5);font-size:1.1rem">${sym}</span>
                    <input id="pay-amount-input" type="number" min="1" max="10000" value="51" placeholder="Amount" inputmode="numeric"
                        style="flex:1;background:transparent;border:none;padding:0.7rem 0.5rem 0.7rem 0;color:#fff;font-size:1.05rem;font-weight:700;outline:none">
                </div>
            </div>
            <div style="display:flex;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap">
                <button id="pay-show-qr" style="flex:1;min-width:130px;padding:0.75rem 1rem;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;border-radius:30px;font-weight:700;font-size:0.95rem;cursor:pointer">Show QR Code</button>
                <button id="pay-open-app" style="flex:1;min-width:130px;padding:0.75rem 1rem;background:transparent;color:#fff;border:2px solid rgba(255,255,255,0.2);border-radius:30px;font-weight:700;font-size:0.95rem;cursor:pointer">Open UPI App</button>
            </div>
            <div id="pay-qr-wrap" style="display:none;text-align:center;margin-bottom:1.25rem">
                <div style="display:inline-block;background:#fff;border-radius:14px;padding:1.1rem">
                    <div id="pay-qr-canvas"></div>
                    <p style="color:#333;font-size:0.82rem;font-weight:600;margin-top:0.5rem">Scan with any UPI app</p>
                    <p id="pay-qr-amt" style="color:#667eea;font-size:1rem;font-weight:800"></p>
                </div>
            </div>
            <p style="text-align:center;font-size:0.8rem;color:var(--text-muted)">100% goes toward hosting, development &amp; keeping Luminary Wishes alive 💜</p>
        </div>`;

        function getAmt() { const v = parseInt(document.getElementById('pay-amount-input')?.value||'51'); return isNaN(v)||v<1?51:v; }

        el.querySelectorAll('.pay-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                el.querySelectorAll('.pay-quick-btn').forEach(b => { b.style.borderColor='rgba(255,255,255,0.1)'; b.style.color='var(--text-secondary,#c9d1f0)'; });
                btn.style.borderColor = '#667eea'; btn.style.color = '#fff';
                const inp = document.getElementById('pay-amount-input');
                if (inp) inp.value = btn.dataset.amount;
            });
        });

        document.getElementById('pay-show-qr')?.addEventListener('click', async () => {
            const amt = getAmt();
            document.getElementById('pay-qr-wrap').style.display = 'block';
            document.getElementById('pay-qr-amt').textContent = `${sym}${amt}`;
            await renderQR('pay-qr-canvas', upiId, amt);
        });

        document.getElementById('pay-open-app')?.addEventListener('click', () => {
            window.location.href = buildUPI(upiId, getAmt());
        });
    }

    return { mountWidget, renderQR, buildUPI };
})();
window.LWPay = LWPay;
