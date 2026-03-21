document.addEventListener('DOMContentLoaded', () => {
    // Initialize data from config
    initContactInfo();

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Direct platform buttons
    const btnWhatsApp = document.getElementById('btn-whatsapp');
    const btnTelegram = document.getElementById('btn-telegram');

    if (btnWhatsApp) {
        btnWhatsApp.addEventListener('click', () => sendDirectMessage('whatsapp'));
    }
    if (btnTelegram) {
        btnTelegram.addEventListener('click', () => sendDirectMessage('telegram'));
    }

    // Add input validation on blur
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        // Auto-save on input
        input.addEventListener('input', () => saveContactSession());
    });

    // Restore session data
    restoreContactSession();
});

// Save contact form state
function saveContactSession() {
    const data = {
        firstName: document.getElementById('firstName')?.value,
        lastName: document.getElementById('lastName')?.value,
        email: document.getElementById('email')?.value,
        subject: document.getElementById('subject')?.value,
        message: document.getElementById('message')?.value
    };
    sessionStorage.setItem('contactFormData', JSON.stringify(data));
}

// Restore contact form state
function restoreContactSession() {
    try {
        const saved = sessionStorage.getItem('contactFormData');
        if (!saved) return;

        const data = JSON.parse(saved);
        if (data.firstName) document.getElementById('firstName').value = data.firstName;
        if (data.lastName) document.getElementById('lastName').value = data.lastName;
        if (data.email) document.getElementById('email').value = data.email;
        if (data.subject) document.getElementById('subject').value = data.subject;
        if (data.message) document.getElementById('message').value = data.message;

        // Trigger resize for textarea if content restored
        const textarea = document.getElementById('message');
        if (textarea && data.message) {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        }
    } catch (e) {
        console.error('Error restoring session:', e);
    }
}

// Initialize contact info from config
function initContactInfo() {
    if (!window.LUMINARY_CONFIG) return;

    const config = window.LUMINARY_CONFIG;

    // Update Email
    const emailLink = document.getElementById('contact-email');
    if (emailLink) {
        emailLink.textContent = config.contact.email;
        emailLink.href = `mailto:${config.contact.email}`;
    }

    // Update Social Links Container dynamically
    const socialContainer = document.getElementById('social-links-container');
    if (socialContainer) {
        // Generate the 4 specified platforms
        const platformLinks = [
            { id: 'ig', title: 'Instagram', icon: '📷', url: config.socials.instagram ? `https://instagram.com/${config.socials.instagram}` : '#' },
            { id: 'wa', title: 'WhatsApp', icon: '💬', url: config.contact.whatsapp ? `https://wa.me/${config.contact.whatsapp.replace(/\+/g, '')}` : '#' },
            { id: 'tg', title: 'Telegram', icon: '✈️', url: config.contact.telegram ? `https://t.me/${config.contact.telegram}` : '#' },
            { id: 'em', title: 'Email Us', icon: '✉️', url: config.contact.email ? `mailto:${config.contact.email}` : '#' },
            { id: 'li', title: 'LinkedIn', icon: '💼', url: config.socials.linkedin ? `https://linkedin.com/company/${config.socials.linkedin}` : '#' }
        ];

        socialContainer.innerHTML = platformLinks.map(link => `
            <a href="${link.url}" target="_blank" title="${link.title}" style="text-decoration: none; font-size: 1.5rem; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">${link.icon}</a>
        `).join('');
    }
}

// Send direct empty message to platform
function sendDirectMessage(platform) {
    const config = window.LUMINARY_CONFIG;
    let url = '';

    if (platform === 'whatsapp') {
        const msg = encodeURIComponent("Hello! I'm interested in Luminary Wishes.");
        url = `https://wa.me/${config.contact.whatsapp.replace(/\+/g, '')}?text=${msg}`;
    } else if (platform === 'telegram') {
        url = `https://t.me/${config.contact.telegram}`;
    }

    if (url) window.open(url, '_blank');
}

// Global submit function for new buttons
// NOTE: event is passed explicitly from onclick handlers
window.submitToPlatform = async function (platform, event) {
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim()
    };

    // Validate
    if (!validateForm(formData)) return;

    // Show loading state on the clicked button
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Open...';
    btn.disabled = true;

    // Simulate short delay for feel
    await new Promise(r => setTimeout(r, 500));

    // Construct Message
    const fullMessage = `*New Contact Request*\n` +
        `*From:* ${formData.firstName} ${formData.lastName}\n` +
        `*Email:* ${formData.email}\n` +
        `*Subject:* ${formData.subject}\n\n` +
        `*Message:* ${formData.message}`;

    const config = window.LUMINARY_CONFIG;
    let url = '';

    if (platform === 'whatsapp') {
        const encodedMsg = encodeURIComponent(fullMessage);
        url = `https://wa.me/${config.contact.whatsapp.replace(/\+/g, '')}?text=${encodedMsg}`;
    } else if (platform === 'telegram') {
        url = `https://t.me/${config.contact.telegram}`;
        // Telegram doesn't support pre-filled msg easily via link, but we open chat
        showNotification('Use Paste to send your message in Telegram! 📋', 'success');
        await navigator.clipboard.writeText(fullMessage);
    } else if (platform === 'email') {
        const encodedMsg = encodeURIComponent(fullMessage);
        url = `mailto:${config.contact.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodedMsg}`;
    }

    if (url) window.open(url, '_blank');

    btn.innerHTML = originalText;
    btn.disabled = false;
};

// Form Submission Handler
async function handleFormSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim()
    };

    // Validate all fields
    if (!validateForm(formData)) {
        return;
    }

    // Get submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Sending...';

    // Simulate API call
    await simulateFormSubmission(formData);

    // Show success message
    showSuccessMessage(formData);

    // Reset form
    e.target.reset();

    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
}

// Simulate form submission (in production, this would be an API call)
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        console.log('Form Data:', data);
        setTimeout(resolve, 1500);
    });
}

// Validate entire form
function validateForm(data) {
    let isValid = true;
    let errors = [];

    // First Name
    if (!data.firstName || data.firstName.length < 2) {
        errors.push('Please enter a valid first name');
        isValid = false;
        highlightError('firstName');
    }

    // Last Name
    if (!data.lastName || data.lastName.length < 2) {
        errors.push('Please enter a valid last name');
        isValid = false;
        highlightError('lastName');
    }

    // Email
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
        isValid = false;
        highlightError('email');
    }

    // Subject
    if (!data.subject) {
        errors.push('Please select a subject');
        isValid = false;
        highlightError('subject');
    }

    // Message
    if (!data.message || data.message.length < 10) {
        errors.push('Please enter a message (minimum 10 characters)');
        isValid = false;
        highlightError('message');
    }

    if (!isValid) {
        showNotification(errors[0], 'error');
    }

    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    switch (field.id) {
        case 'firstName':
        case 'lastName':
            isValid = value.length >= 2;
            break;

        case 'email':
            isValid = isValidEmail(value);
            break;

        case 'subject':
            isValid = value !== '';
            break;

        case 'message':
            isValid = value.length >= 10;
            break;
    }

    if (!isValid) {
        highlightError(field.id);
    } else {
        removeError(field.id);
    }

    return isValid;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Highlight field error
function highlightError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#f5576c';
        field.style.boxShadow = '0 0 0 3px rgba(245, 87, 108, 0.1)';
    }
}

// Remove field error
function removeError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }
}

// Show success message
function showSuccessMessage(formData) {
    const config = window.LUMINARY_CONFIG;
    const form = document.getElementById('contactForm');

    // Construct the message string for platforms
    const fullMessage = `*New Contact Request*\n\n` +
        `*From:* ${formData.firstName} ${formData.lastName}\n` +
        `*Email:* ${formData.email}\n` +
        `*Subject:* ${formData.subject}\n\n` +
        `*Message:* ${formData.message}`;

    const encodedMsg = encodeURIComponent(fullMessage);
    const waUrl = `https://wa.me/${config.contact.whatsapp.replace(/\+/g, '')}?text=${encodedMsg}`;
    const tgUrl = `https://t.me/${config.contact.telegram}`;
    const mailUrl = `mailto:${config.contact.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodedMsg}`;

    // Hide form
    form.style.display = 'none';

    // Create success container
    const successContainer = document.createElement('div');
    successContainer.className = 'form-success show';
    successContainer.style.cssText = `
        text-align: center;
        padding: 60px 20px;
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(25px);
        border: 1px solid var(--glass-border);
        border-radius: 40px;
        animation: fadeInUp 0.8s ease forwards;
    `;

    successContainer.innerHTML = `
        <div style="font-size: 5rem; margin-bottom: 30px;">✨</div>
        <h2 style="font-size: 2.5rem; margin-bottom: 15px; background: var(--primary-gradient); -webkit-background-clip: text; color: transparent;">Message Received!</h2>
        <p style="font-size: 1.2rem; margin-bottom: 40px; color: var(--text-secondary);">Thank you, ${formData.firstName}. Your message is ready for direct delivery.</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; max-width: 600px; margin: 0 auto;">
            <a href="${waUrl}" target="_blank" class="btn" style="background: #25D366; color: white; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span style="font-size: 1.5rem;">💬</span> WhatsApp
            </a>
            <a href="${tgUrl}" target="_blank" class="btn" style="background: #0088cc; color: white; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span style="font-size: 1.5rem;">✈️</span> Telegram
            </a>
            <a href="${mailUrl}" class="btn" style="background: var(--primary-purple); color: white; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span style="font-size: 1.5rem;">✉️</span> Email Us
            </a>
        </div>
        
        <button onclick="location.reload()" class="btn btn-outline" style="margin-top: 40px;">Send Another Message</button>
    `;

    form.parentNode.appendChild(successContainer);
    successContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showNotification('Success! Choose a platform to send your message. 🚀', 'success');
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ?
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' :
            'linear-gradient(135deg, #f5576c 0%, #ff9a9e 100%)'};
        color: white;
        border-radius: 10px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animation styles if not already present
if (!document.querySelector('#contact-animations')) {
    const style = document.createElement('style');
    style.id = 'contact-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Auto-resize textarea
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    messageTextarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}

// Character counter for message
if (messageTextarea) {
    const charCounter = document.createElement('small');
    charCounter.style.cssText = 'display: block; margin-top: 5px; color: var(--text-muted); text-align: right;';
    messageTextarea.parentNode.appendChild(charCounter);

    messageTextarea.addEventListener('input', function () {
        const length = this.value.length;
        const min = 10;
        const remaining = Math.max(0, min - length);

        if (remaining > 0) {
            charCounter.textContent = `${remaining} more characters needed`;
            charCounter.style.color = 'var(--text-muted)';
        } else {
            charCounter.textContent = `${length} characters`;
            charCounter.style.color = '#43e97b';
        }
    });
}
