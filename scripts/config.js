/**
 * Luminary Wishes — MASTER Configuration (Single Source of Truth)
 * ALL contact, social, pricing, and project settings live here.
 * Update this file to change anything site-wide.
 */

const LUMINARY_CONFIG = {

    // ── Project Info ─────────────────────────────────────────────
    projectName:    "Luminary Wishes",
    projectTagline: "Illuminate every celebration!",
    domain:         "luminarywishes.dpdns.org",
    baseURL:        "https://luminarywishes.dpdns.org",
    plusSubdomain:  "lumiwish.qzz.io",   // xyz.lumiwish.qzz.io for Plus/Pro

    // ── Contact Details ──────────────────────────────────────────
    contact: {
        whatsapp:        "918294721929",
        whatsappDisplay: "+91 82947 21929",
        telegram:        "luminarywebs_admin",
        email:           "luminarywebs@gmail.com",
        upiId:           "luminarywebs@upi",
        supportHours:    "10:00 AM - 10:00 PM IST"
    },

    // ── Social Media ─────────────────────────────────────────────
    socials: {
        instagram: "luminarywebs",
        linkedin:  "luminarytechnicals",
        facebook:  "luminarywebs",
        twitter:   "luminarytechnicals"
    },

    // ── Currency ──────────────────────────────────────────────────
    currency:       "INR",
    currencySymbol: "₹",

    // ── Plans ─────────────────────────────────────────────────────
    plans: {
        free: {
            name:     "Lumistarter",
            price:    "₹0",
            priceNum: 0,
            duration: "Lifetime",
            badge:    "FREE",
            tagline:  "Try the magic, forever free",
            features: [
                "3 beautiful templates (Birthday, Anniversary, Wedding)",
                "Name, date & message editing",
                "Shareable short link (/b/ /a/ /m/)",
                "Lifetime access — no expiry",
                "No custom photos",
                "No music or color themes",
                "No subdomain"
            ]
        },
        normal: {
            name:     "Luminary Plus",
            price:    "₹99",
            priceNum: 99,
            duration: "1 Year",
            badge:    "POPULAR",
            tagline:  "Full personalization, your way",
            subdomain: "xyz.lumiwish.qzz.io",
            features: [
                "All 3 templates + exclusive designs",
                "Upload your own photos",
                "Music selection (4 genres)",
                "Custom color theme & gradient picker",
                "Personal subdomain: xyz.lumiwish.qzz.io",
                "1 Year hosting included",
                "Priority support"
            ]
        },
        pro: {
            name:     "Luminary Pro",
            price:    "₹399",
            priceNum: 399,
            duration: "1 Year",
            badge:    "GOLD",
            tagline:  "A human makes it. Just for you.",
            subdomain: "xyz.lumiwish.qzz.io",
            features: [
                "Fully custom — no templates",
                "Dedicated designer works with you",
                "Your own subdomain: xyz.lumiwish.qzz.io",
                "Custom music, colors, layout — everything",
                "1 Year hosting included",
                "Direct WhatsApp consultation",
                "Revision rounds included"
            ]
        }
    },

    // ── Music Presets (Plus/Pro) ──────────────────────────────────
    musicPresets: [
        { id: "romantic",  label: "Romantic",   emoji: "💕" },
        { id: "upbeat",    label: "Upbeat",     emoji: "🎉" },
        { id: "classical", label: "Classical",  emoji: "🎻" },
        { id: "lofi",      label: "Lo-Fi Calm", emoji: "🌙" },
        { id: "none",      label: "No Music",   emoji: "🔇" }
    ],

    // ── Color Presets (Plus/Pro) ──────────────────────────────────
    colorPresets: [
        { id: "royal",   label: "Royal Purple", gradient: "linear-gradient(135deg,#667eea,#764ba2)" },
        { id: "sunset",  label: "Sunset",       gradient: "linear-gradient(135deg,#f093fb,#f5576c)" },
        { id: "ocean",   label: "Ocean",        gradient: "linear-gradient(135deg,#4facfe,#00f2fe)" },
        { id: "gold",    label: "Gold Rush",    gradient: "linear-gradient(135deg,#f7971e,#ffd200)" },
        { id: "emerald", label: "Emerald",      gradient: "linear-gradient(135deg,#11998e,#38ef7d)" },
        { id: "rose",    label: "Rose Gold",    gradient: "linear-gradient(135deg,#f8a5c2,#f78fb3)" },
        { id: "custom",  label: "Custom RGB",   gradient: null }
    ],

    // ── Short link route prefixes ─────────────────────────────────
    routes: {
        birthday:    "/b/",
        anniversary: "/a/",
        marriage:    "/m/"
    }
};

window.LUMINARY_CONFIG = LUMINARY_CONFIG;
