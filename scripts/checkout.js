// Checkout Page JavaScript

// State Management
const checkoutState = {
    currentStep: 1,
    selectedPlan: 'lumidomain',
    planPrice: (window.LUMINARY_CONFIG && window.LUMINARY_CONFIG.plans.normal.price) ? parseFloat(window.LUMINARY_CONFIG.plans.normal.price.replace(/[^0-9.]/g, '')) : 99,
    selectedTemplate: null,
    personalizationData: {},
    paymentMethod: 'upi',
    email: '',
    paymentScreenshot: null, // File object
    qrCode: null // File object
};

// Initialize checkout on page load
document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Template Rendering
    renderTemplates();

    // Load plan from sessionStorage
    const savedPlan = sessionStorage.getItem('selectedPlan');
    const savedPrice = sessionStorage.getItem('planPrice');

    if (savedPlan && savedPrice) {
        checkoutState.selectedPlan = savedPlan;
        checkoutState.planPrice = parseFloat(savedPrice);
        updateOrderSummary();

        // Show Pro options if Pro Plan is selected
        if (savedPlan === 'pro') {
            document.getElementById('pro-options-form')?.classList.remove('hidden');
        }
    }

    // Initialize with first template selected if available
    const firstOption = document.querySelector('input[name="template"]');
    if (firstOption) {
        firstOption.checked = true;
        firstOption.dispatchEvent(new Event('change'));
    }

    // File upload listeners
    setupFileUpload('qr-upload', 'upi-qr-code', (file) => {
        checkoutState.qrCode = file;
    });

    setupFileUpload('payment-screenshot', 'preview-image', (file) => {
        checkoutState.paymentScreenshot = file;
        const preview = document.getElementById('screenshot-preview');
        if (preview) preview.style.display = 'block';
        const uploadArea = document.querySelector('.file-upload-area');
        if (uploadArea) uploadArea.style.display = 'none';
    });

    // Restore session data
    restoreSessionData();

    // Auto-save listeners
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            saveSessionData();
        });
    });
});

function saveSessionData() {
    const data = {
        // Birthday
        'birthday-name': document.getElementById('birthday-name')?.value,
        'birthday-age': document.getElementById('birthday-age')?.value,
        'birthday-message': document.getElementById('birthday-message')?.value,

        // Anniversary
        'anniversary-name1': document.getElementById('anniversary-name1')?.value,
        'anniversary-name2': document.getElementById('anniversary-name2')?.value,
        'anniversary-years': document.getElementById('anniversary-years')?.value,
        'anniversary-message': document.getElementById('anniversary-message')?.value,

        // Marriage
        'marriage-name1': document.getElementById('marriage-name1')?.value,
        'marriage-name2': document.getElementById('marriage-name2')?.value,
        'marriage-date': document.getElementById('marriage-date')?.value,
        'marriage-message': document.getElementById('marriage-message')?.value,

        // Common/Pro
        'custom-celebration-type': document.getElementById('custom-celebration-type')?.value,
        'order-description': document.getElementById('order-description')?.value,
        'email': document.getElementById('email')?.value
    };

    sessionStorage.setItem('checkoutFormData', JSON.stringify(data));
}

function restoreSessionData() {
    try {
        const saved = sessionStorage.getItem('checkoutFormData');
        if (!saved) return;

        const data = JSON.parse(saved);
        Object.keys(data).forEach(id => {
            const el = document.getElementById(id);
            if (el && data[id]) el.value = data[id];
        });
    } catch (e) {
        console.error('Error restoring session data:', e);
    }
}

// ================================
// DYNAMIC TEMPLATE RENDERING
// ================================
function renderTemplates() {
    const grid = document.getElementById('templateGrid');
    if (!grid) return;

    // Use WISHES_CONFIG if available, otherwise fallback (or empty)
    const config = window.WISHES_CONFIG || { templates: [] };
    let templates = config.templates;

    // Filter templates based on plan (if needed in future, currently showing all for Paid)
    // For Free plan, we might want to restrict, but user asked for different flows, not necessarily hidden templates.
    // However, the "Custom" template is strictly for Paid plans.

    // For now, render all. The 'custom' one will be handled by logic.
    const isPaid = sessionStorage.getItem('selectedPlan') !== 'free';

    grid.innerHTML = templates.map(t => {
        // If template is 'custom' and user is NOT paid, skip it?
        // User asked: "this only applies to pro and lumidomain plan not in free" regarding custom/wishes variables.
        // So we hide 'custom' for free plan.
        if (t.id === 'custom' && !isPaid) return '';

        return `
        <div class="template-option" data-template="${t.id}">
            <input type="radio" name="template" id="temp-${t.id}" value="${t.id}">
            <label for="temp-${t.id}" class="template-card">
                <div class="card-visual">${t.icon}</div>
                <div class="card-info">
                    <h3>${t.name}</h3>
                    <p>${t.description}</p>
                </div>
                <div class="check-icon"></div>
            </label>
        </div>
        `;
    }).join('');

    // Re-attach listeners since DOM is new
    // Set up template selection listeners
    document.querySelectorAll('input[name="template"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = e.target.value;
            checkoutState.selectedTemplate = val;
            updateOrderSummary();

            // Highlight selected card
            document.querySelectorAll('.template-option').forEach(opt => opt.classList.remove('selected'));
            e.target.closest('.template-option').classList.add('selected');

            // Toggle Custom Celebration Type Input
            const customTypeGroup = document.getElementById('custom-type-group');
            if (customTypeGroup) { // Check if element exists
                if (val === 'custom') {
                    customTypeGroup.classList.remove('hidden');
                } else {
                    customTypeGroup.classList.add('hidden');
                }
            }
        });
    });

    // Toggle Description Field for Paid Plans
    const isPaidPlan = sessionStorage.getItem('selectedPlan') !== 'free';
    if (isPaidPlan) {
        document.getElementById('paid-description-group')?.classList.remove('hidden');
    }

    // Initialize Phone in Payment Tab
    const phoneDisplay = document.getElementById('display-phone-number');
    if (phoneDisplay && window.CONTACT_CONFIG) {
        phoneDisplay.textContent = window.CONTACT_CONFIG.phone;
    }
}

// File Upload Helper
function setupFileUpload(inputId, previewImgId, callback) {
    const input = document.getElementById(inputId);
    const previewImg = document.getElementById(previewImgId);

    if (!input || !previewImg) return;

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.*')) {
            showNotification('Please upload an image file (PNG, JPG)', 'error');
            return;
        }

        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('File too large. Max size is 5MB', 'error');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            if (inputId === 'qr-upload') {
                previewImg.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);

        if (callback) callback(file);
    });
}

function removeScreenshot() {
    checkoutState.paymentScreenshot = null;
    const input = document.getElementById('payment-screenshot');
    if (input) input.value = '';
    const preview = document.getElementById('screenshot-preview');
    if (preview) preview.style.display = 'none';
    const uploadArea = document.querySelector('.file-upload-area');
    if (uploadArea) uploadArea.style.display = 'block';
}

// Step Navigation
function nextStep(stepNumber) {
    if (!validateStep(checkoutState.currentStep)) {
        return;
    }

    // Special logic for Step 3 if Free Plan
    if (stepNumber === 3) {
        const isFree = checkoutState.selectedPlan === 'free';
        const paymentMethods = document.querySelector('.payment-methods');
        const upiForm = document.getElementById('upi-payment-form');
        const upiNotice = document.querySelector('.upi-notice');
        const payTitle = document.getElementById('payment-step-title');

        if (isFree) {
            if (paymentMethods) paymentMethods.style.display = 'none';
            if (upiForm) upiForm.style.display = 'none';
            if (upiNotice) upiNotice.style.display = 'none';
            if (payTitle) payTitle.textContent = 'Free Plan Activation';

            // Hide email field for free plan
            const emailField = document.getElementById('email')?.closest('.input-group');
            if (emailField) emailField.style.display = 'none';

            // Explicitly hide the payment actions bar which contains "Send via" buttons
            const paymentActionsBar = document.querySelector('.payment-actions')?.closest('.action-bar');
            if (paymentActionsBar) paymentActionsBar.style.display = 'none';

            // Add a friendly message if it doesn't exist
            if (!document.getElementById('free-activation-msg')) {
                const step3 = document.getElementById('step3');
                const paymentContainer = document.querySelector('.payment-container');
                const msg = document.createElement('div');
                msg.id = 'free-activation-msg';
                msg.innerHTML = `
                    <div style="background: rgba(67, 233, 123, 0.1); border: 1px solid #43e97b; padding: 25px; border-radius: 20px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 3rem; display: block; margin-bottom: 15px;">🎁</span>
                        <h3 style="color: #43e97b; margin-bottom: 10px;">Zero Payment Required!</h3>
                        <p>You've selected the ${window.FREE_PLAN_CONFIG ? window.FREE_PLAN_CONFIG.name : 'Lumistarter'} Free plan. Click the button below to instantly activate your celebration page!</p>
                        <button class="btn btn-primary" onclick="processPayment('free')" style="width: 100%; padding: 15px; margin-top: 20px; font-size: 1.1rem;">
                            Activate My Celebration Now 🚀
                        </button>
                    </div>
                `;
                // Insert after email input, before hidden payment methods
                if (paymentContainer) {
                    paymentContainer.insertBefore(msg, paymentMethods);
                } else {
                    step3.appendChild(msg);
                }
            }
        } else {
            // Restore for paid plans
            if (paymentMethods) paymentMethods.style.display = 'block';
            if (upiForm) upiForm.style.display = 'block';
            if (upiNotice) upiNotice.style.display = 'block';
            if (upiNotice) upiNotice.style.display = 'block';
            if (payTitle) payTitle.textContent = 'Final Details';

            // Show email field for paid plans
            const emailField = document.getElementById('email')?.closest('.input-group');
            if (emailField) emailField.style.display = 'block';

            const paymentActionsBar = document.querySelector('.payment-actions')?.closest('.action-bar');
            if (paymentActionsBar) paymentActionsBar.style.display = 'flex';

            document.getElementById('free-activation-msg')?.remove();
        }
    }

    document.getElementById(`step${checkoutState.currentStep}`).classList.add('hidden');
    document.querySelector(`.step[data-step="${checkoutState.currentStep}"]`).classList.remove('active');
    document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');
    document.getElementById(`step${stepNumber}`).classList.remove('hidden');

    checkoutState.currentStep = stepNumber;

    if (stepNumber === 2 && checkoutState.selectedTemplate) {
        showPersonalizationForm(checkoutState.selectedTemplate);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(stepNumber) {
    document.getElementById(`step${checkoutState.currentStep}`).classList.add('hidden');
    document.querySelector(`.step[data-step="${checkoutState.currentStep}"]`).classList.remove('active');
    document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');
    document.getElementById(`step${stepNumber}`).classList.remove('hidden');

    checkoutState.currentStep = stepNumber;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validation
function validateStep(stepNumber) {
    switch (stepNumber) {
        case 1:
            if (!checkoutState.selectedTemplate) {
                showNotification('Please select a template', 'error');
                return false;
            }
            return true;
        case 2:
            return validatePersonalization();
        case 3:
            return validatePayment();
        default:
            return true;
    }
}

function validatePersonalization() {
    const template = checkoutState.selectedTemplate;
    let isValid = true;
    let errors = [];

    if (template === 'birthday') {
        const name = document.getElementById('birthday-name').value.trim();
        const age = document.getElementById('birthday-age').value;

        if (!name) { errors.push('Name is required'); isValid = false; }
        if (!age || age < 1) { errors.push('Valid age is required'); isValid = false; }

        if (isValid) {
            checkoutState.personalizationData = {
                name, age, message: document.getElementById('birthday-message').value.trim()
            };
        }
    } else if (template === 'anniversary') {
        const name1 = document.getElementById('anniversary-name1').value.trim();
        const name2 = document.getElementById('anniversary-name2').value.trim();
        const years = document.getElementById('anniversary-years').value;

        if (!name1 || !name2) { errors.push('Both names are required'); isValid = false; }
        if (!years || years < 1) { errors.push('Valid years are required'); isValid = false; }

        if (isValid) {
            checkoutState.personalizationData = {
                name1, name2, years, message: document.getElementById('anniversary-message').value.trim()
            };
        }
    } else if (template === 'marriage') {
        const name1 = document.getElementById('marriage-name1').value.trim();
        const name2 = document.getElementById('marriage-name2').value.trim();
        const date = document.getElementById('marriage-date').value.trim();

        if (!name1 || !name2) { errors.push('Both names are required'); isValid = false; }
        if (!date) { errors.push('Wedding date is required'); isValid = false; }

        if (isValid) {
            checkoutState.personalizationData = {
                name1, name2, date, message: document.getElementById('marriage-message').value.trim()
            };
        }
    } else if (template === 'custom') {
        const type = document.getElementById('custom-celebration-type')?.value.trim();
        if (!type) { errors.push('Please specify the celebration type (e.g., Diwali)'); isValid = false; }

        if (isValid) {
            checkoutState.personalizationData = {
                customType: type,
                message: ''
            };
        }
    }

    // Always collect Pro Details if Pro Plan is selected, regardless of template
    if (isValid && checkoutState.selectedPlan === 'pro') {
        const proId = document.getElementById('pro-template-id')?.value.trim();
        const proName = document.getElementById('pro-template-name')?.value.trim();
        const proInst = document.getElementById('pro-instructions')?.value.trim();

        checkoutState.personalizationData.proId = proId;
        checkoutState.personalizationData.proName = proName;
        checkoutState.personalizationData.proInstructions = proInst;
    }

    if (!isValid) showNotification(errors.join('. '), 'error');
    return isValid;
}

function validatePayment() {
    // For free plan — no email or payment required
    if (checkoutState.selectedPlan === 'free') return true;

    // For paid plans — only email is required
    const email = document.getElementById('email').value.trim();
    checkoutState.email = email;

    if (!email || !email.includes('@')) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }

    return true;
}

function showPersonalizationForm(template) {
    document.querySelectorAll('.personalization-form').forEach(form => form.style.display = 'none');
    const form = document.getElementById(`${template}-form`);
    if (form) form.style.display = 'block';
}

function updateOrderSummary() {
    let planName = 'Lumidomain';
    if (checkoutState.selectedPlan === 'free') planName = window.FREE_PLAN_CONFIG ? (window.FREE_PLAN_CONFIG.name + ' (Free)') : 'Lumistarter (Free)';
    else if (checkoutState.selectedPlan === 'pro') planName = 'Pro Plan';

    document.getElementById('summary-plan').textContent = planName;

    if (checkoutState.selectedTemplate) {
        const templateName = checkoutState.selectedTemplate.charAt(0).toUpperCase() + checkoutState.selectedTemplate.slice(1);
        document.getElementById('summary-template').textContent = templateName;
    }

    const subtotal = checkoutState.planPrice;
    const currency = window.LUMINARY_CONFIG ? window.LUMINARY_CONFIG.currencySymbol : '₹';
    document.getElementById('summary-subtotal').textContent = `${currency}${subtotal.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `${currency}${subtotal.toFixed(2)}`;

    const featuresList = document.getElementById('plan-features-list');
    const freeDur = window.FREE_PLAN_CONFIG ? window.FREE_PLAN_CONFIG.duration : 'Unlimited';
    const normDur = window.LUMINARY_CONFIG?.plans?.normal?.duration || '28 Days';
    const proDur = window.LUMINARY_CONFIG?.plans?.pro?.duration || '28 Days';

    if (checkoutState.selectedPlan === 'free') {
        featuresList.innerHTML = `<li>✓ Basic subdomain (${freeDur})</li><li>✓ Try for free</li><li>✓ 3 Stunning templates</li><li>✓ Standard support</li>`;
    } else if (checkoutState.selectedPlan === 'lumidomain') {
        featuresList.innerHTML = `<li>✓ Subdomain hosting (${normDur})</li><li>✓ Full personalization</li><li>✓ All animations</li><li>✓ Mobile optimized</li><li>✓ Social sharing</li>`;
    } else {
        let proDetails = '';
        const proId = document.getElementById('pro-template-id')?.value;
        const proName = document.getElementById('pro-template-name')?.value;
        if (proId) proDetails += `<li>✦ Template ID: ${proId}</li>`;
        if (proName) proDetails += `<li>✦ Custom Theme: ${proName}</li>`;

        featuresList.innerHTML = `<li>✓ Custom domain (${proDur})</li><li>✓ Lifetime archiving</li><li>✓ Priority 24/7 support</li>${proDetails}<li>✓ Visitor analytics</li>`;
    }
}

// Toggle Payment Mode (Media vs Call)
window.togglePaymentMode = function (mode) {
    const mediaDetails = document.getElementById('pay-media-details');
    const callDetails = document.getElementById('pay-call-details');

    document.querySelectorAll('.payment-method-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelector(`input[value="${mode === 'pay-media' ? 'media' : 'call'}"]`).closest('.payment-method-option').classList.add('selected');

    if (mode === 'pay-media') {
        mediaDetails.classList.remove('hidden');
        callDetails.classList.add('hidden');
    } else {
        mediaDetails.classList.add('hidden');
        callDetails.classList.remove('hidden');
    }
};

// Process Order & Send Message
window.processOrder = function (platform) {
    if (!validatePersonalization()) {
        showNotification('Please complete the personalization step first!', 'error');
        prevStep(2); // Go back if data missing
        return;
    }

    // Collect Data
    const config = window.CONTACT_CONFIG;
    const plan = checkoutState.selectedPlan.toUpperCase();
    const template = checkoutState.selectedTemplate;
    const data = checkoutState.personalizationData;
    const description = document.getElementById('order-description')?.value.trim() || 'No specific edits.';

    // Custom Type Handling
    let templateName = template;
    if (template === 'custom') {
        const customType = document.getElementById('custom-celebration-type')?.value.trim() || 'Custom';
        templateName = `Custom (${customType})`;
    }

    // Build Details String
    let details = '';
    if (template === 'birthday') details = `Name: ${data.name}\nAge: ${data.age}`;
    else if (template === 'anniversary') details = `Couple: ${data.name1} & ${data.name2}\nYears: ${data.years}`;
    else if (template === 'marriage') details = `Couple: ${data.name1} & ${data.name2}\nDate: ${data.date}`;
    else details = `Custom Event Details`; // Fallback

    // Construct the formatted message
    const message = `
*✨ New Order Request - Luminary Wishes*
--------------------------------
*Plan:* ${plan}
*Template:* ${templateName}

*📝 Personalization Details:*
${details}

*✍️ Additional Instructions:*
${description}

*💳 Payment Mode:* ${document.querySelector('input[name="payment_mode"]:checked')?.value === 'call' ? 'Call' : 'Chat/Media'}
--------------------------------
Please verify my order and share the payment link.
`.trim();

    const encodedMessage = encodeURIComponent(message);
    let url = '';

    if (platform === 'whatsapp') {
        url = `https://wa.me/${config.whatsapp}?text=${encodedMessage}`;
    } else if (platform === 'telegram') {
        url = `https://t.me/${config.telegram}`; // Telegram usually doesn't support pre-filled text in same way via simple link, but user requested link.
        // Coping to clipboard is often better for Tele, but we'll open the chat.
    } else if (platform === 'email') {
        url = `mailto:${config.email}?subject=${encodeURIComponent(config.messages.paymentSubject)}&body=${encodedMessage}`;
    }

    if (url) window.open(url, '_blank');

    // Show success state (Waiting for verification)
    showSuccessPage(null, true);
};

// Handle Free Plan Activation
window.processPayment = function (method) {
    if (method === 'free') {
        // No email required for free plan
        checkoutState.email = 'Guest';

        showNotification('Activating Free Plan... 🚀', 'success');

        // Generate secure link
        const celebrationLink = generateCelebrationLink();

        // Show success
        showSuccessPage(celebrationLink, false);
    }
};

// Legacy manual verification function replaced by processOrder above
function processManualVerification(platform) {
    // Kept empty or redirected if needed, but processOrder handles it now.
}

function generateCelebrationLink() {
    try {
        const template = checkoutState.selectedTemplate || 'birthday';
        const data = checkoutState.personalizationData;

        // Construct relative URL using standard API
        // This handles file://, localhost, and subdirectories correctly
        const url = new URL(`templates/${template}.html`, window.location.href);

        // Clear existing params if any (from window.location)
        url.search = '';

        if (typeof encryptData === 'function') {
            const encrypted = encryptData(data);
            if (encrypted) {
                url.searchParams.set('data', encrypted);
            } else {
                throw new Error('Encryption returned null');
            }
        } else {
            // Fallback
            for (const [key, value] of Object.entries(data)) {
                if (value) url.searchParams.set(key, value);
            }
        }

        return url.href;

    } catch (e) {
        console.error('Link Generation Error:', e);
        // Emergency fallback: manually construct simple string
        const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
        return `${baseUrl}templates/${checkoutState.selectedTemplate}.html`;
    }
}

function showSuccessPage(celebrationLink, isWaiting = false) {
    document.getElementById('step3').classList.add('hidden');
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));

    const successDiv = document.getElementById('success');
    successDiv.classList.remove('hidden');

    if (isWaiting) {
        document.getElementById('success-icon').textContent = '⌚';
        document.getElementById('success-title').textContent = 'Order Under Review';
        document.getElementById('success-message').textContent = 'Verifying your payment...';
        document.getElementById('instant-success-details').classList.add('hidden');
        document.getElementById('waiting-details').classList.remove('hidden');
        document.getElementById('waiting-email').textContent = checkoutState.email;
        document.getElementById('waiting-order-id').textContent = '#LL-' + Math.floor(Math.random() * 90000 + 10000);
    } else {
        document.getElementById('success-icon').textContent = '🎉';
        document.getElementById('success-title').textContent = 'Congratulations!';
        document.getElementById('success-message').textContent = 'Celebration page ready!';
        document.getElementById('instant-success-details').classList.remove('hidden');
        document.getElementById('waiting-details').classList.add('hidden');
        document.getElementById('celebration-link').value = celebrationLink;
        document.getElementById('preview-link').href = celebrationLink;
        document.getElementById('confirm-email').textContent = checkoutState.email;

        const freeDur = window.FREE_PLAN_CONFIG ? window.FREE_PLAN_CONFIG.duration : 'Unlimited';
        const normDur = window.LUMINARY_CONFIG?.plans?.normal?.duration || '28 Days';
        const proDur = window.LUMINARY_CONFIG?.plans?.pro?.duration || '28 Days';
        document.getElementById('activation-days').textContent = checkoutState.selectedPlan === 'free' ? freeDur : (checkoutState.selectedPlan === 'lumidomain' ? normDur : proDur);
    }

    createSuccessConfetti();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createSuccessConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#ffd200'];
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `position:fixed;width:10px;height:10px;background-color:${colors[Math.floor(Math.random() * colors.length)]};left:${Math.random() * 100}%;top:-10px;border-radius:${Math.random() > 0.5 ? '50%' : '0'};z-index:10000;pointer-events:none;`;
            document.body.appendChild(confetti);
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], { duration: (2 + Math.random() * 2) * 1000, easing: 'ease-out' }).onfinish = () => confetti.remove();
        }, i * 40);
    }
}

function copyLink() {
    const linkInput = document.getElementById('celebration-link');
    linkInput.select();
    document.execCommand('copy');
    showNotification('Link copied! 📋', 'success');
}

function shareLink() {
    const link = document.getElementById('celebration-link').value;
    const shareData = {
        title: 'My Celebration - Luminary Wishes',
        text: 'Check out this celebration page I created!',
        url: link
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Shared successfully'))
            .catch((e) => console.log('Share failed', e));
    } else {
        copyLink(); // Fallback
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `position:fixed;top:80px;right:20px;padding:15px 25px;background:${type === 'success' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #f5576c 0%, #ff9a9e 100%)'};color:white;border-radius:10px;font-weight:600;box-shadow:0 4px 15px rgba(0,0,0,0.3);z-index:10000;`;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add notification animations if not exists
function ensureNotificationStyles() {
    if (document.getElementById('checkout-notification-styles')) return;
    const style = document.createElement('style');
    style.id = 'checkout-notification-styles';
    style.textContent = `
        @keyframes slideInRight { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
    `;
    document.head.appendChild(style);
}

// ================================
// LOADING ANIMATION & PRELOADER
// ================================
document.addEventListener('DOMContentLoaded', () => {
    ensureNotificationStyles();
    // Inject Preloader HTML if not present
    if (!document.getElementById('preloader')) {
        const preloader = document.createElement('div');
        preloader.id = 'preloader';
        preloader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-logo">✨ Luminary Wishes</div>
            </div>
        `;
        document.body.prepend(preloader);
        document.body.classList.add('loading');
    }
});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.classList.remove('loading');
            setTimeout(() => preloader.remove(), 600);
        }, 500);
    }
});

// PWA Service Worker for Checkout
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered in checkout!', reg.scope))
            .catch(err => console.log('SW Failed:', err));
    });
}
