/**
 * Luminary Wishes — Contact Config (Derived from LUMINARY_CONFIG)
 * ────────────────────────────────────────────────────────────────
 * This file builds CONTACT_CONFIG from the master LUMINARY_CONFIG.
 * Do NOT edit values here — edit scripts/config.js instead.
 *
 * NOTE: config.js must be loaded before this file.
 */

(function () {
    const master = window.LUMINARY_CONFIG;

    if (!master) {
        console.warn('[Luminary] contacts.js: LUMINARY_CONFIG not found. Load config.js first.');
        return;
    }

    const CONTACT_CONFIG = {
        whatsapp: master.contact.whatsapp,               // No + prefix, e.g. 918294721929
        telegram: master.contact.telegram,               // Username without @
        email: master.contact.email,
        phone: master.contact.whatsappDisplay,        // Human-readable phone

        // Social Links
        instagram: master.socials.instagram,
        linkedin: master.socials.linkedin,
        facebook: master.socials.facebook,
        twitter: master.socials.twitter,

        // Pre-defined Messages
        messages: {
            paymentSubject: 'Payment Verification - Luminary Wishes',
            inquirySubject: 'Inquiry - Luminary Wishes'
        }
    };

    window.CONTACT_CONFIG = CONTACT_CONFIG;
})();
