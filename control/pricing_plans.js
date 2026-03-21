/**
 * Luminary Wishes — Pricing Plans & Table Data (VAR System)
 * ───────────────────────────────────────────────────────────
 * All plan cards and comparison table details are centralized here.
 * This script pulls prices/durations dynamically from LUMINARY_CONFIG and FREE_PLAN_CONFIG 
 * so everything is 100% synced from a single source of truth.
 */

(function () {
    const cfg = window.LUMINARY_CONFIG || { plans: { normal: {}, pro: {} } };
    const fpc = window.FREE_PLAN_CONFIG || {};

    const freePrice = fpc.price || '$0';
    const normalPrice = cfg.plans.normal.price || '$9.99';
    const proPrice = cfg.plans.pro.price || '$24.99';

    const freeNum = 0;
    const normalNum = parseFloat((normalPrice).replace(/[^0-9.]/g, '')) || 9.99;
    const proNum = parseFloat((proPrice).replace(/[^0-9.]/g, '')) || 24.99;

    window.PRICING_PLANS_DATA = {
        // ─── Plan Cards ───────────────────────────────────────────
        cards: [
            {
                key: 'free',
                badge: { text: 'FREE', cls: 'badge-free' },
                accent: 'rgba(255,255,255,0.08)',
                icon: '🌱',
                name: fpc.name || 'Lumistarter',
                nameClass: '',
                tagline: 'Experience the magic for free',
                price: freePrice,
                priceClass: '',
                priceStyle: 'color: var(--text-secondary)',
                period: '/celebration',
                features: [
                    { icon: '✦', text: 'Basic subdomain (trial.luminarylongings.com)', dim: false },
                    { icon: '✦', text: '3 Celebration templates', dim: false },
                    { icon: '✦', text: 'Basic personalization', dim: false },
                    { icon: '✦', text: `${fpc.duration || 'Unlimited'} Validity`, dim: false },
                    { icon: '○', text: 'Background music', dim: true },
                    { icon: '○', text: 'Custom domain support', dim: true },
                    { icon: '○', text: 'Priority support', dim: true },
                ],
                ctaText: 'Start for Free',
                ctaCls: 'cta-outline',
                priceNum: freeNum,
            },
            {
                key: 'lumidomain',
                badge: { text: 'POPULAR', cls: 'badge-popular' },
                accent: 'var(--primary-gradient, linear-gradient(135deg,#667eea,#764ba2))',
                icon: '🌟',
                name: cfg.plans.normal.name || 'Lumidomain',
                nameClass: '',
                tagline: 'Perfect for any celebration',
                price: normalPrice,
                priceClass: 'grad-purple',
                period: '/celebration',
                features: [
                    { icon: '✦', text: 'Your subdomain (yourname.luminarylongings.com)', dim: false },
                    { icon: '✦', text: 'All 3 celebration templates', dim: false },
                    { icon: '✦', text: 'Full personalization', dim: false },
                    { icon: '✦', text: `Active for ${cfg.plans.normal.duration || '30 Days'}`, dim: false },
                    { icon: '✦', text: 'Background music integration', dim: false },
                    { icon: '✦', text: 'Mobile optimized', dim: false },
                    { icon: '○', text: 'Custom domain support', dim: true },
                    { icon: '○', text: 'Priority 24/7 support', dim: true },
                ],
                ctaText: 'Choose Lumidomain',
                ctaCls: 'cta-purple',
                priceNum: normalNum,
            },
            {
                key: 'pro',
                badge: { text: 'GOLD PLAN', cls: 'badge-gold' },
                accent: 'linear-gradient(135deg,#ffd700,#ffa500)',
                icon: '👑',
                name: cfg.plans.pro.name || 'Pro Plan',
                nameClass: 'gold-text',
                tagline: 'For the ultimate celebration',
                price: proPrice,
                priceClass: 'grad-gold',
                period: '/celebration',
                cardCls: 'featured',
                features: [
                    { icon: '✦', text: 'Your own custom domain (happybirthday.com)', dim: false },
                    { icon: '✦', text: 'Lifetime archiving (downloadable source)', dim: false },
                    { icon: '✦', text: 'All 3 templates + Custom theme', dim: false },
                    { icon: '✦', text: 'Premium music library (50+ tracks)', dim: false },
                    { icon: '✦', text: `Active for ${cfg.plans.pro.duration || '90 Days'}`, dim: false },
                    { icon: '✦', text: 'No Luminary branding (Whitelabel)', dim: false },
                    { icon: '✦', text: 'Priority 24/7 support', dim: false },
                    { icon: '✦', text: 'Visitor analytics dashboard', dim: false },
                    { icon: '✦', text: 'Password protection', dim: false },
                ],
                ctaText: 'Upgrade to Pro',
                ctaCls: 'cta-gold',
                priceNum: proNum,
            }
        ],

        // ─── Comparison Table ──────────────────────────────────────
        table: {
            headers: [
                { label: 'Feature', align: 'left' },
                { label: 'Lumistarter', subLabel: 'Free', align: 'center' },
                { label: 'Lumidomain', align: 'center' },
                { label: 'Pro Plan 👑', align: 'center' }
            ],
            rows: [
                {
                    feature: 'Celebration Templates',
                    values: ['Birthday only', 'All 3', 'All 3 + Custom']
                },
                {
                    feature: 'Hosting Duration',
                    values: [fpc.duration || '7 days', cfg.plans.normal.duration || '30 days', `<strong>${cfg.plans.pro.duration || '90 days'}</strong>`]
                },
                {
                    feature: 'Domain Type',
                    values: ['Shared subdomain', 'Your subdomain', '<strong>Custom Domain</strong>']
                },
                {
                    feature: 'Full Personalization',
                    values: ['<span class="cross">—</span>', '<span class="check">✓</span>', '<span class="check">✓</span>']
                },
                {
                    feature: 'Background Music',
                    values: ['<span class="cross">—</span>', '<span class="check">✓</span>', '<span class="check">✓</span> <small>50+ tracks</small>']
                },
                {
                    feature: 'Mobile Optimized',
                    values: ['<span class="check">✓</span>', '<span class="check">✓</span>', '<span class="check">✓</span>']
                },
                {
                    feature: 'Social Sharing',
                    values: ['<span class="check">✓</span>', '<span class="check">✓</span>', '<span class="check">✓</span>']
                },
                {
                    feature: 'Priority 24/7 Support',
                    values: ['<span class="cross">—</span>', '<span class="cross">—</span>', '<span class="check">✓</span>']
                },
                {
                    feature: 'Visitor Analytics',
                    values: ['<span class="cross">—</span>', '<span class="cross">—</span>', '<span class="check">✓</span>']
                },
                {
                    feature: 'Whitelabel (No Branding)',
                    values: ['<span class="cross">—</span>', '<span class="cross">—</span>', '<span class="check">✓</span>']
                },
                {
                    feature: 'Password Protection',
                    values: ['<span class="cross">—</span>', '<span class="cross">—</span>', '<span class="check">✓</span>']
                },
                {
                    feature: 'Lifetime Archive',
                    values: ['<span class="cross">—</span>', '<span class="cross">—</span>', '<span class="check">✓</span>']
                }
            ],
            priceRow: {
                label: '<strong>Price</strong>',
                values: [
                    `<span class="table-price" id="compare-price-free">${freePrice}</span>`,
                    `<span class="table-price" id="compare-price-normal">${normalPrice}</span>`,
                    `<span class="table-price" id="compare-price-pro">${proPrice}</span>`
                ]
            }
        }
    };
})();
