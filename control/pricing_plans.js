/**
 * Luminary Wishes — Pricing Plans Data
 * Derives from LUMINARY_CONFIG master config.
 */

(function () {
    const cfg = window.LUMINARY_CONFIG || {};
    const sym = cfg.currencySymbol || '₹';

    window.PRICING_PLANS_DATA = {
        cards: [
            {
                key:       'free',
                badge:     { text: 'FREE', cls: 'badge-free' },
                accent:    'rgba(255,255,255,0.06)',
                icon:      '🌱',
                name:      'Lumistarter',
                tagline:   'Try the magic, forever free',
                price:     `${sym}0`,
                priceNum:  0,
                period:    'lifetime',
                features: [
                    { icon: '✦', text: '3 Celebration templates', dim: false },
                    { icon: '✦', text: 'Name, date & message editing', dim: false },
                    { icon: '✦', text: 'Shareable short link (/b/ /a/ /m/)', dim: false },
                    { icon: '✦', text: 'Lifetime access — no expiry', dim: false },
                    { icon: '○', text: 'No custom photos', dim: true },
                    { icon: '○', text: 'No music or color themes', dim: true },
                    { icon: '○', text: 'No subdomain', dim: true },
                ],
                ctaText: 'Start for Free',
                ctaCls:  'cta-outline',
            },
            {
                key:       'plus',
                badge:     { text: 'POPULAR', cls: 'badge-popular' },
                accent:    'var(--primary-gradient, linear-gradient(135deg,#667eea,#764ba2))',
                icon:      '✨',
                name:      'Luminary Plus',
                tagline:   'Full personalization, your way',
                price:     `${sym}99`,
                priceNum:  99,
                period:    '/ year',
                features: [
                    { icon: '✦', text: 'All 3 templates + exclusive designs', dim: false },
                    { icon: '✦', text: 'Upload your own photos', dim: false },
                    { icon: '✦', text: 'Music selection (4 genres)', dim: false },
                    { icon: '✦', text: 'Custom color theme & gradient picker', dim: false },
                    { icon: '✦', text: 'Subdomain: xyz.lumiwish.qzz.io', dim: false },
                    { icon: '✦', text: '1 Year hosting included', dim: false },
                    { icon: '✦', text: 'Priority support', dim: false },
                ],
                ctaText: 'Get Plus — ₹99',
                ctaCls:  'cta-purple',
            },
            {
                key:       'pro',
                badge:     { text: 'GOLD', cls: 'badge-gold' },
                accent:    'linear-gradient(135deg,#ffd700,#ffa500)',
                icon:      '👑',
                name:      'Luminary Pro',
                nameClass: 'gold-text',
                tagline:   'A human makes it. Just for you.',
                price:     `${sym}399`,
                priceNum:  399,
                period:    '/ year',
                cardCls:   'featured',
                features: [
                    { icon: '✦', text: 'Fully custom — no templates', dim: false },
                    { icon: '✦', text: 'Dedicated designer works with you', dim: false },
                    { icon: '✦', text: 'Subdomain: xyz.lumiwish.qzz.io', dim: false },
                    { icon: '✦', text: 'Custom music, colors, layout — everything', dim: false },
                    { icon: '✦', text: '1 Year hosting included', dim: false },
                    { icon: '✦', text: 'Direct WhatsApp consultation', dim: false },
                    { icon: '✦', text: 'Revision rounds included', dim: false },
                ],
                ctaText: 'Upgrade to Pro 👑',
                ctaCls:  'cta-gold',
            }
        ],

        table: {
            headers: [
                { label: 'Feature',         align: 'left' },
                { label: 'Lumistarter',     subLabel: 'Free', align: 'center' },
                { label: 'Luminary Plus',   subLabel: '₹99/yr', align: 'center' },
                { label: 'Luminary Pro 👑', subLabel: '₹399/yr', align: 'center' }
            ],
            rows: [
                { feature: 'Celebration Templates',    values: ['3 templates', 'All 3 + exclusive', 'Fully custom'] },
                { feature: 'Hosting Duration',         values: ['Lifetime', '1 Year', '1 Year'] },
                { feature: 'Subdomain',                values: ['<span class="cross">—</span>', 'xyz.lumiwish.qzz.io', 'xyz.lumiwish.qzz.io'] },
                { feature: 'Custom Photos',            values: ['<span class="cross">—</span>', '<span class="check">✓</span>', '<span class="check">✓</span>'] },
                { feature: 'Music Selection',          values: ['<span class="cross">—</span>', '<span class="check">✓</span> 4 genres', '<span class="check">✓</span> Custom'] },
                { feature: 'Color Theme Picker',       values: ['<span class="cross">—</span>', '<span class="check">✓</span>', '<span class="check">✓</span>'] },
                { feature: 'Short Encrypted Link',     values: ['<span class="check">✓</span>', '<span class="check">✓</span>', '<span class="check">✓</span>'] },
                { feature: 'Mobile Optimized',         values: ['<span class="check">✓</span>', '<span class="check">✓</span>', '<span class="check">✓</span>'] },
                { feature: 'Human Designer',           values: ['<span class="cross">—</span>', '<span class="cross">—</span>', '<span class="check">✓</span>'] },
                { feature: 'WhatsApp Consultation',    values: ['<span class="cross">—</span>', '<span class="cross">—</span>', '<span class="check">✓</span>'] },
                { feature: 'Priority Support',         values: ['<span class="cross">—</span>', '<span class="check">✓</span>', '<span class="check">✓</span>'] },
            ],
            priceRow: {
                label: '<strong>Price</strong>',
                values: ['<span class="table-price">₹0</span>', '<span class="table-price">₹99/yr</span>', '<span class="table-price">₹399/yr</span>']
            }
        }
    };
})();
