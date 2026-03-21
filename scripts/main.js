// Luminary Wishes - Main JavaScript

// ================================
// NAVBAR SCROLL EFFECT
// ================================
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ================================
// MOBILE MENU TOGGLE
// ================================
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

if (menuToggle && navLinks) {
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// ================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ================================
// SCROLL ANIMATIONS
// ================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// ================================
// PARALLAX EFFECT FOR FLOATING ELEMENTS
// ================================
const floatingElements = document.querySelectorAll('.floating-element');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.05}deg)`;
    });
});

// ================================
// PRICING CARD INTERACTION
// ================================
const pricingCards = document.querySelectorAll('.card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ================================
// DYNAMIC YEAR IN FOOTER
// ================================
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('footer p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
}

// ================================
// TEMPLATE PREVIEW HOVER EFFECTS
// ================================
const templateCards = document.querySelectorAll('#templates .card');

templateCards.forEach(card => {
    const btn = card.querySelector('.btn');

    card.addEventListener('mouseenter', () => {
        if (btn) {
            btn.style.transform = 'scale(1.05)';
        }
    });

    card.addEventListener('mouseleave', () => {
        if (btn) {
            btn.style.transform = 'scale(1)';
        }
    });
});

// ================================
// CONFETTI EFFECT ON CTA BUTTON
// ================================
function createConfetti(x, y) {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    const confettiCount = 30;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '10000';
        confetti.style.opacity = '1';

        document.body.appendChild(confetti);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 3 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 5;

        let posX = x;
        let posY = y;
        let velocityY = vy;
        let opacity = 1;

        const animate = () => {
            posX += vx;
            posY += velocityY;
            velocityY += 0.3; // gravity
            opacity -= 0.02;

            confetti.style.left = posX + 'px';
            confetti.style.top = posY + 'px';
            confetti.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };

        animate();
    }
}

// Add confetti to CTA button clicks
const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        createConfetti(x, y);
    });
});

// ================================
// LOADING ANIMATION
// ================================
// ================================
// LOADING ANIMATION & PRELOADER
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Inject Preloader HTML if not present
    if (!document.getElementById('preloader')) {
        const preloader = document.createElement('div');
        preloader.id = 'preloader';
        preloader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-logo">
                    <img src="assets/icon.svg" alt="Logo" style="width: 40px; height: 40px; vertical-align: middle; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;">
                    Luminary Wishes
                </div>
            </div>
        `;
        document.body.prepend(preloader);
        document.body.classList.add('loading');
    }
});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Small buffer to ensure "pop-in" feel
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.classList.remove('loading');

            // Cleanup after transition
            setTimeout(() => {
                preloader.remove();
            }, 600);
        }, 500); // 500ms minimum wait time
    }
});

// ================================
// INTERACTIVE STAR RATING
// ================================
const testimonialCards = document.querySelectorAll('#testimonials .card, section:has(+ section) .card');
testimonialCards.forEach(card => {
    const stars = card.querySelector('div[style*="⭐"]');
    if (stars) {
        stars.style.cursor = 'default';
        stars.style.transition = 'transform 0.3s ease';

        card.addEventListener('mouseenter', () => {
            stars.style.transform = 'scale(1.2) rotate(10deg)';
        });

        card.addEventListener('mouseleave', () => {
            stars.style.transform = 'scale(1) rotate(0deg)';
        });
    }
});

// ================================
// CONSOLE MESSAGE
// ================================
console.log('%c✨ Luminary Wishes ✨', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; color: transparent;');
console.log('%cIlluminate every celebration! 🎉', 'font-size: 14px; color: #667eea;');

// ================================
// PWA SERVICE WORKER REGISTRATION
// ================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered!', reg.scope))
            .catch(err => console.log('SW Failed:', err));
    });
}

// ================================
// FLOATING DIRECT SUPPORT WIDGET
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Only add if on a page where LUMINARY_CONFIG is expected (or just always check)
    const config = window.LUMINARY_CONFIG || {
        contact: {
            whatsapp: "918294721929",
            telegram: "LuminaryWishesSupport",
            email: "luminarylongings@gmail.com"
        },
        socials: {
            instagram: "luminarywebs",
            linkedin: "luminary-longings",
            facebook: "luminarylongings",
            twitter: "luminary_l"
        }
    };

    // ── Populate Footer Social Links (VAR SYSTEM) ────────────────
    const footerSocialMaps = [
        { id: null, selector: 'footer a[title="Instagram"], footer a:has(> .fa-instagram)', href: `https://instagram.com/${config.socials.instagram}` },
        { id: null, selector: 'footer a[title="LinkedIn"], footer a:has(> .fa-linkedin)', href: `https://linkedin.com/company/${config.socials.linkedin}` },
        { id: null, selector: 'footer a[title="Facebook"], footer a:has(> .fa-facebook)', href: `https://facebook.com/${config.socials.facebook}` },
        { id: null, selector: 'footer a[title="Twitter"], footer a:has(> .fa-twitter)', href: `https://twitter.com/${config.socials.twitter}` },
    ];

    // Simpler: update footer emoji anchor links by emoji content
    document.querySelectorAll('footer a').forEach(a => {
        const text = a.textContent.trim();
        if (text === '📘') a.href = `https://facebook.com/${config.socials.facebook}`;
        else if (text === '📷') a.href = `https://instagram.com/${config.socials.instagram}`;
        else if (text === '🐦') a.href = `https://twitter.com/${config.socials.twitter}`;
        else if (text === '💼') a.href = `https://linkedin.com/company/${config.socials.linkedin}`;
    });

    const widget = document.createElement('div');
    widget.id = 'support-widget';
    widget.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 15px;
    `;

    const chatBtn = document.createElement('div');
    chatBtn.style.cssText = `
        width: 60px;
        height: 60px;
        background: var(--primary-gradient);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(118, 75, 162, 0.4);
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        font-size: 24px;
        position: relative;
    `;
    chatBtn.innerHTML = '✨';

    const menu = document.createElement('div');
    menu.style.cssText = `
        display: none;
        flex-direction: column;
        gap: 10px;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
    `;

    const createLink = (icon, text, url, color) => {
        const a = document.createElement('a');
        a.href = url;
        a.target = "_blank";
        a.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 10px 15px;
            border-radius: 30px;
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            white-space: nowrap;
        `;
        a.innerHTML = `<span style="font-size: 18px;">${icon}</span> ${text}`;
        a.onmouseover = () => {
            a.style.background = color;
            a.style.transform = 'scale(1.05)';
        };
        a.onmouseout = () => {
            a.style.background = 'rgba(255, 255, 255, 0.1)';
            a.style.transform = 'scale(1)';
        };
        return a;
    };

    const waLink = createLink('💬', 'WhatsApp', `https://wa.me/${config.contact.whatsapp.replace(/\+/g, '')}`, '#25D366');
    const tgLink = createLink('✈️', 'Telegram', `https://t.me/${config.contact.telegram}`, '#0088cc');
    const mailLink = createLink('✉️', 'Email Us', `mailto:${config.contact.email}`, 'var(--primary-purple)');

    menu.appendChild(waLink);
    menu.appendChild(tgLink);
    menu.appendChild(mailLink);

    let isOpen = false;
    chatBtn.onclick = () => {
        isOpen = !isOpen;
        if (isOpen) {
            menu.style.display = 'flex';
            setTimeout(() => {
                menu.style.transform = 'translateY(0)';
                menu.style.opacity = '1';
                chatBtn.style.transform = 'scale(1.1)';
            }, 10);
        } else {
            menu.style.transform = 'translateY(20px)';
            menu.style.opacity = '0';
            chatBtn.style.transform = 'scale(1)';
            setTimeout(() => {
                menu.style.display = 'none';
            }, 300);
        }
    };

    widget.appendChild(menu);
    widget.appendChild(chatBtn);
    document.body.appendChild(widget);

    // Add a small hover label
    const label = document.createElement('div');
    label.textContent = "Need help?";
    label.style.cssText = `
        position: absolute;
        right: 75px;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        color: var(--dark-bg);
        padding: 5px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 700;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        white-space: nowrap;
    `;
    chatBtn.appendChild(label);

    chatBtn.onmouseover = () => { label.style.opacity = '1'; label.style.right = '85px'; };
    chatBtn.onmouseout = () => { label.style.opacity = '0'; label.style.right = '75px'; };
});


// ================================
// GLOBAL PLAN SELECTION
// ================================
window.selectPlan = function (plan, price) {
    // Store selection in sessionStorage
    sessionStorage.setItem('selectedPlan', plan);
    sessionStorage.setItem('planPrice', price);

    // Redirect to checkout
    window.location.href = 'checkout.html';
};

// ================================
// CENTRALIZED GLOBAL FOOTER
// ================================
function renderGlobalFooter() {
    const footerElement = document.getElementById('global-footer');
    if (!footerElement) return;

    const cfg = window.LUMINARY_CONFIG || {};
    const contact = cfg.contact || {};
    const socials = cfg.socials || {};

    // Only these specified platforms per user request
    const platformLinks = Object.entries({
        'instagram': { icon: '📷', url: socials.instagram ? `https://instagram.com/${socials.instagram}` : '#' },
        'whatsapp': { icon: '💬', url: contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/\+/g, '')}` : '#' },
        'telegram': { icon: '✈️', url: contact.telegram ? `https://t.me/${contact.telegram}` : '#' },
        'email': { icon: '✉️', url: contact.email ? `mailto:${contact.email}` : '#' }
    });

    const socialIconsHtml = platformLinks.map(([key, data]) => `
        <a href="${data.url}" target="_blank" title="${key}" style="
            text-decoration:none;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            width:40px;height:40px;
            border-radius:50%;
            background:rgba(255,255,255,0.05);
            transition:transform 0.3s, background 0.3s;
        " onmouseover="this.style.transform='scale(1.15)'; this.style.background='rgba(255,255,255,0.15)';" onmouseout="this.style.transform='scale(1)'; this.style.background='rgba(255,255,255,0.05)';">
            ${data.icon}
        </a>
    `).join('');

    footerElement.innerHTML = `
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                <div>
                    <div style="font-size:1.5rem; font-weight:800; margin-bottom: 1rem; color:white; display: flex; align-items: center; gap: 10px;">
                        <img src="assets/icon.svg" alt="Luminary Wishes" style="width: 32px; height: 32px;">
                        Luminary Wishes
                    </div>
                    <p style="color: var(--text-muted, #9ca3af); font-size:0.95rem; line-height:1.5;">Illuminate every celebration with personalized, animated websites.</p>
                </div>
                <div>
                    <h4 style="color:white; margin-bottom: 1rem; font-size:1.1rem; font-weight:700;">Product</h4>
                    <ul style="list-style: none; padding:0; margin:0; color: var(--text-secondary, #d1d5db);">
                        <li style="margin-bottom: 0.5rem;"><a href="index.html#templates" style="color:inherit; text-decoration:none; transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color=''">Templates</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="pricing.html" style="color:inherit; text-decoration:none; transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color=''">Pricing</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="index.html#how-it-works" style="color:inherit; text-decoration:none; transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color=''">How It Works</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color:white; margin-bottom: 1rem; font-size:1.1rem; font-weight:700;">Legal & Connect</h4>
                    <ul style="list-style: none; padding:0; margin:0; color: var(--text-secondary, #d1d5db);">
                        <li style="margin-bottom: 0.5rem;"><a href="terms.html" style="color:inherit; text-decoration:none; transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color=''">Terms of Service</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="privacy.html" style="color:inherit; text-decoration:none; transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color=''">Privacy Policy</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="contact.html" style="color:inherit; text-decoration:none; transition:color 0.2s;" onmouseover="this.style.color='white'" onmouseout="this.style.color=''">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color:white; margin-bottom: 1rem; font-size:1.1rem; font-weight:700;">Connect</h4>
                    <div style="display: flex; gap: 0.8rem; font-size: 1.2rem;">
                        ${socialIconsHtml}
                    </div>
                </div>
            </div>
            <div style="text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); color: var(--text-muted, #9ca3af); font-size:0.9rem;">
                <p>&copy; 2026 Luminary Wishes. All rights reserved. Made with 💝 for celebrations.</p>
            </div>
        </div>
    `;
}

// Automatically render the global footer when DOM is ready
document.addEventListener('DOMContentLoaded', renderGlobalFooter);
