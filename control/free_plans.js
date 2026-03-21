/**
 * Luminary Wishes - Free Plan Configuration
 * All controls for the free plan pricing, name, and duration.
 */

const FREE_PLAN_CONFIG = {
    name: "Lumistarter",
    price: "₹0",
    duration: "Unlimited"
};

// Make globally available
window.FREE_PLAN_CONFIG = FREE_PLAN_CONFIG;

// Override LUMINARY_CONFIG if it's already loaded
if (window.LUMINARY_CONFIG && window.LUMINARY_CONFIG.plans) {
    window.LUMINARY_CONFIG.plans.free = FREE_PLAN_CONFIG;
}

// Update DOM elements automatically
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.free-plan-name').forEach(el => {
        el.textContent = FREE_PLAN_CONFIG.name;
    });
    document.querySelectorAll('.free-plan-price').forEach(el => {
        el.textContent = FREE_PLAN_CONFIG.price;
    });
    document.querySelectorAll('.free-plan-duration').forEach(el => {
        el.textContent = FREE_PLAN_CONFIG.duration;
    });
});
