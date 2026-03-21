/**
 * Luminary Wishes — MASTER Configuration (Single Source of Truth)
 * ─────────────────────────────────────────────────────────────────
 * ALL contact, social, pricing, and project settings live here.
 * Update this file to change anything site-wide.
 */

const LUMINARY_CONFIG = {

    // ── Project Info ─────────────────────────────────────────────
    projectName: "Luminary Wishes",
    projectTagline: "Illuminate every celebration!",

    // ── Contact Details ──────────────────────────────────────────
    contact: {
        whatsapp: "918294721929",          // WhatsApp: country code + number (no +)
        whatsappDisplay: "+91 82947 21929",// Human-readable display
        telegram: "luminarywebs_admin", // Telegram username (no @)
        email: "luminarywebs@gmail.com",
        supportHours: "10:00 AM - 10:00 PM IST"
    },

    // ── Social Media ─────────────────────────────────────────────
    socials: {
        instagram: "luminarywebs",
        linkedin: "luminarytechnicals",
        facebook: "luminarywebs",
        twitter: "luminarytechnicals"
    },

    // ── Pricing & Plans ──────────────────────────────────────────
    currency: "INR",
    currencySymbol: "₹",
    plans: {
        free: window.FREE_PLAN_CONFIG || {
            name: "Lumistarter",
            price: "₹0",
            duration: "Unlimited"
        },
        normal: {
            name: "Lumidomain",
            price: "₹99",
            duration: "28 Days"
        },
        pro: {
            name: "Pro Plan",
            price: "₹399",
            duration: "28 Days"
        }
    }
};

// Make globally available
window.LUMINARY_CONFIG = LUMINARY_CONFIG;
