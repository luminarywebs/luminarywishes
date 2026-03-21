/**
 * LUMINARY WISHES - TEMPLATE CORE 2.0
 * Ultra Premium Design System Synchronization
 */

// Global state
let currentTemplate = '';

/**
 * Initialize the template based on type
 */
function initializeTemplate(type) {
    currentTemplate = type;
    
    // Hide preloader
    window.addEventListener('load', () => {
        const loader = document.getElementById('preloader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => loader.remove(), 1000);
            }, 600);
        }
    });

    // Populate data
    const params = getURLParams();
    populateData(params, type);

    // Initialize shared features
    initMusicToggle();
    initShareButton();
    initRevealSystem();

    // Specific Init
    switch (type) {
        case 'birthday': initBirthdayTemplate(params); break;
        case 'anniversary': initAnniversaryTemplate(params); break;
        case 'marriage': initMarriageTemplate(params); break;
    }
}

/**
 * URL Param Parsing (supports encrypted 'data' parameter)
 */
function getURLParams() {
    // Check if encryption utils are loaded
    if (typeof getDataFromURL === 'function') {
        const params = new URLSearchParams(window.location.search);
        return getDataFromURL(params);
    }
    
    // Fallback if utils not loaded
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

/**
 * Populate template with data
 */
function populateData(params, type) {
    // Name / Names
    const nameDisplay = document.getElementById('nameDisplay');
    if (nameDisplay) {
        if (params.name1 && params.name2) {
            nameDisplay.textContent = `${params.name1} & ${params.name2}`;
        } else {
            nameDisplay.textContent = params.name || (type === 'birthday' ? 'Alex' : 'Alex & Sam');
        }
    }

    // Message
    const messageEl = document.getElementById('customMessage');
    if (messageEl && params.message) {
        messageEl.textContent = params.message;
    }

    // Template specific populations
    if (type === 'birthday') {
        let age = parseInt(params.age);
        let diffDays = 0;

        if (params.date) {
            const birthDate = new Date(params.date);
            diffDays = Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24));
            if (isNaN(age)) age = Math.floor(diffDays / 365.25);
        }
        
        const daysEl = document.getElementById('daysSinceBirth');
        const countEl = document.getElementById('birthdayCount');
        const monthsEl = document.getElementById('monthsCount');
        const weeksEl = document.getElementById('weeksCount');
        const weekendsEl = document.getElementById('weekendsCount');
        const hoursEl = document.getElementById('hoursCount');
        
        let targetDays = diffDays > 0 ? diffDays : (isNaN(age) ? 0 : Math.floor(age * 365.25));

        if (daysEl) animateValue(daysEl, 0, targetDays, 2500);
        if (countEl && !isNaN(age)) animateValue(countEl, 0, age, 2000);
        
        if (monthsEl) {
            let months = diffDays > 0 ? Math.floor(diffDays / 30.4375) : (isNaN(age) ? 0 : age * 12);
            animateValue(monthsEl, 0, months, 2200);
        }
        
        if (weeksEl) {
            let weeks = Math.floor(targetDays / 7);
            animateValue(weeksEl, 0, weeks, 2300);
        }

        if (weekendsEl) {
            let weekends = Math.floor(targetDays * (2/7));
            animateValue(weekendsEl, 0, weekends, 2400);
        }

        if (hoursEl) {
            let hours = targetDays * 24;
            animateValue(hoursEl, 0, hours, 2100);
        }
    } 
    else if (type === 'anniversary') {
        let years = parseInt(params.years);
        let diffDays = 0;

        if (params.date) {
            const annivDate = new Date(params.date);
            diffDays = Math.floor((new Date() - annivDate) / (1000 * 60 * 60 * 24));
            if (isNaN(years)) years = Math.floor(diffDays / 365.25);
        }

        const yearsEl = document.getElementById('yearsCount');
        const daysEl = document.getElementById('daysCount');
        const monthsEl = document.getElementById('monthsCount');
        const weeksEl = document.getElementById('weeksCount');
        const weekendsEl = document.getElementById('weekendsCount');
        const hoursEl = document.getElementById('hoursCount');

        let targetDays = diffDays > 0 ? diffDays : (isNaN(years) ? 0 : Math.floor(years * 365.25));

        if (yearsEl && !isNaN(years)) animateValue(yearsEl, 0, years, 2000);
        
        if (daysEl) animateValue(daysEl, 0, targetDays, 2500);

        if (monthsEl) {
            let months = diffDays > 0 ? Math.floor(diffDays / 30.4375) : (isNaN(years) ? 0 : years * 12);
            animateValue(monthsEl, 0, months, 2200);
        }
        
        if (weeksEl) {
            let weeks = Math.floor(targetDays / 7);
            animateValue(weeksEl, 0, weeks, 2300);
        }

        if (weekendsEl) {
            let weekends = Math.floor(targetDays * (2 / 7));
            animateValue(weekendsEl, 0, weekends, 2400);
        }

        if (hoursEl) {
            let hours = targetDays * 24;
            animateValue(hoursEl, 0, hours, 2100);
        }
    }
    else if (type === 'marriage') {
        const dateEl = document.getElementById('weddingDateDisplay');
        if (dateEl && params.date) {
            const weddingDate = new Date(params.date);
            dateEl.textContent = weddingDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    }
}

/**
 * Shared Feature: Music Toggle
 */
function initMusicToggle() {
    const btn = document.getElementById('musicToggle');
    const audio = document.getElementById('bgMusic');
    if (!btn || !audio) return;

    let playing = false;
    btn.addEventListener('click', () => {
        if (playing) {
            audio.pause();
            btn.innerHTML = '🔊';
            btn.classList.remove('playing');
        } else {
            audio.play().catch(e => console.warn("Audio blocked by browser"));
            btn.innerHTML = '🔇';
            btn.classList.add('playing');
        }
        playing = !playing;
    });
}

/**
 * Common Feature: Share Button
 */
function initShareButton() {
    // Both header button and action button can trigger share
    const btns = [document.getElementById('shareBtn'), document.getElementById('shareBtnAction')];
    
    btns.forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', async () => {
            const shareData = {
                title: document.title,
                text: 'Check out this special celebration!',
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    copyUrlFallback();
                }
            } else {
                copyUrlFallback();
            }
        });
    });
}

function copyUrlFallback() {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showNotice('Link copied to clipboard! 📋');
}

/**
 * Numerical Animation
 */
function animateValue(el, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        el.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Confetti Effect
 */
function createConfetti(count = 100) {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    const colors = ['#ffffff', '#f472b6', '#818cf8', '#fbbf24', '#43e97b'];
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            z-index: 1000;
            opacity: ${0.5 + Math.random() * 0.5};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
        `;
        document.body.appendChild(div);

        const anim = div.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(110vh) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: 2500 + Math.random() * 3500,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        });
        anim.onfinish = () => div.remove();
    }
}

/**
 * Reveal System (Scroll triggered)
 */
function initRevealSystem() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-item').forEach(item => {
        observer.observe(item);
    });
}

/**
 * Birthday Specific
 */
function initBirthdayTemplate(params) {
    const blowBtn = document.getElementById('blowCandlesBtn');
    if (blowBtn) {
        blowBtn.addEventListener('click', blowCandles);
    }
}

function blowCandles() {
    const cake = document.getElementById('birthdayCake');
    const card = document.querySelector('.celebration-card');
    
    if (cake && !cake.classList.contains('blown')) {
        cake.classList.add('blown');
        card.classList.add('candles-extinguished');
        
        // Celebration
        showNotice('Make a wish! ✨');
        createConfetti(180);
        
        // Change text on button if it exists
        const blowBtn = document.getElementById('blowCandlesBtn');
        if (blowBtn) {
            blowBtn.innerHTML = '✨ Wish Made!';
            blowBtn.style.pointerEvents = 'none';
            blowBtn.style.opacity = '0.7';
        }
    }
}

/**
 * Anniversary Specific
 */
function initAnniversaryTemplate(params) {
    // Custom logic if needed
}

/**
 * Marriage Specific
 */
function initMarriageTemplate(params) {
    // Custom logic if needed
}

/**
 * UI Utility: Show Notice
 */
function showNotice(msg) {
    const notice = document.createElement('div');
    notice.className = 'premium-notice';
    notice.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(-150px);
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(40px) saturate(200%);
        padding: 20px 45px;
        border-radius: 24px;
        color: white;
        z-index: 10000;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
        font-weight: 500;
        font-size: 1.1rem;
        letter-spacing: 0.5px;
    `;
    notice.textContent = msg;
    document.body.appendChild(notice);
    
    setTimeout(() => notice.style.transform = 'translateX(-50%) translateY(0)', 100);
    setTimeout(() => {
        notice.style.transform = 'translateX(-50%) translateY(-150px)';
        setTimeout(() => notice.remove(), 1000);
    }, 4000);
}
