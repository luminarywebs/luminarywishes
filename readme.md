# ✨ Luminary Wishes

A premium celebration website platform that allows users to create personalized animated greeting pages for Birthdays, Anniversaries, and Weddings.

## 🚀 Features

- **Dynamic Checkout**: Split-screen design, real-time summary, and plan-specific flows.
- **PWA Ready**: Installable as a native app with offline caching (`manifest.json` + `sw.js`).
- **Free & Paid Tiers**:
  - **Lumistarter (Free)**: instant activation, no payment required.
  - **Lumidomain/Pro**: Integrated payment and personalization connection via WhatsApp/Telegram.
- **Secure Links**: URL-based encryption to share personalized pages safely.
- [x] **Direct Contact Options**: One-click connect via WhatsApp, Telegram, or Email.
- [x] **Smart Session Storage**: Auto-saves form inputs to prevent data loss on refresh.
- [x] **Mobile First Design**: Optimized touch targets and centered layouts for small screens.
- **Interactive Templates**: Animations, music toggles, confetti, and candle blowing interactions.

## 📂 Project Structure

```
Luminary Wishes/
├── index.html              # Landing page
├── pricing.html            # Pricing plans
├── checkout.html           # Main checkout flow
├── contact.html            # Contact & Support
├── manifest.json           # PWA Manifest
├── sw.js                   # Service Worker (Caching strategy)
│
├── styles/                 # CSS Stylesheets
│   ├── main.css            # Global theme & components
│   └── checkout.css        # Checkout-specific layout
│
├── scripts/                # Core Logic
│   ├── main.js             # Global interactions (Navbar, PWA reg)
│   ├── checkout.js         # Checkout logic, validation, payment
│   ├── config.js           # Central config (URLs, Pricing)
│   ├── contact.js          # Contact form handling
│   └── encryption-utils.js # URL parameter encryption
│
├── control/                # Configuration Data
│   ├── contacts.js         # Contact numbers & methods
│   └── wishes.js           # Template definitions & metadata
│
└── templates/              # Celebration Templates
    ├── birthday.html       
    ├── anniversary.html    
    ├── marriage.html       
    ├── template.css        # Shared template styles     
    └── template.js         # Shared template logic
```

## 🛠️ Setup & Usage

1. **Deploy**: Host on any static server (Vercel, Netlify, GitHub Pages).
2. **Configure**: Update `control/contacts.js` with your support WhatsApp/Telegram numbers.
3. **Customize**: Add new templates in `templates/` and register them in `control/wishes.js`.

## 📱 Mobile Optimization
The site is fully responsive, featuring a sticky order summary on checkout and touch-optimized interactive elements in templates.
