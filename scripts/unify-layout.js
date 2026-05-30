// scripts/unify-layout.js
// This script standardizes header, footer, canonical links, CSS, and JSON-LD schema across all HTML files.
// Payment pages (pay.html, checkout.html) receive header but no footer.

const fs = require('fs').promises;
const path = require('path');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..'); // luminarywishes.dpdns.org root
const EXCLUDE_FOOTER = new Set(['pay.html', 'checkout.html']);
const CSS_LINK = '<link rel="stylesheet" href="styles/main.css">';

// Header template extracted from index.html navigation (adjusted for consistency)
const HEADER_TEMPLATE = `
<nav class="navbar" id="navbar">
    <div class="nav-container">
        <a href="index.html" class="logo" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
            <img src="assets/icon.svg" alt="Luminary Wishes" style="width: 30px; height: 30px; vertical-align: middle; margin-right: 8px;">
            <span style="font-weight: 800; font-size: 1.25rem;">Luminary Wishes</span>
        </a>
        <ul class="nav-links" id="navLinks">
            <li><a href="#home">Home</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#templates">Templates</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="pay.html" style="color: #ffd700;">☕ Support</a></li>
            <li><a href="more/owner.html">About</a></li>
            <li><a href="pricing.html" class="btn btn-primary" style="padding: 0.5rem 1.5rem;">Get Started</a></li>
        </ul>
        <div class="menu-toggle" id="menuToggle"><span></span><span></span><span></span></div>
    </div>
</nav>
`;

// Footer template – can be enhanced later
const FOOTER_TEMPLATE = `
<footer id="global-footer" style="padding: 4rem 0 1.5rem; margin-top: 2rem; background: var(--dark-card); border-top: 1px solid var(--glass-border);">
    <!-- Footer content (optional) -->
</footer>
`;

// Helper to extract JSON‑LD schema from index.html (first <script type="application/ld+json"> block)
async function getSchemaBlock() {
  const indexPath = path.join(ROOT_DIR, 'index.html');
  const indexContent = await fs.readFile(indexPath, 'utf8');
  const match = indexContent.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
  if (match) {
    return `<script type="application/ld+json">${match[1].trim()}</script>`;
  }
  console.warn('No JSON‑LD block found in index.html');
  return '';
}

function ensureTag(content, tag, insertAfter, snippet) {
  if (content.includes(tag)) return content; // already present
  const idx = content.indexOf(insertAfter);
  if (idx === -1) return content; // can't find insertion point
  return content.slice(0, idx + insertAfter.length) + '\n' + snippet + content.slice(idx + insertAfter.length);
}

async function processFile(filePath) {
  const fileName = path.basename(filePath);
  let content = await fs.readFile(filePath, 'utf8');

  // Ensure <head> exists (most files have it)
  const headClose = '</head>';
  // CSS link
  if (!content.includes(CSS_LINK)) {
    content = ensureTag(content, CSS_LINK, headClose, `  ${CSS_LINK}`);
  }

  // Canonical link
  const canonicalHref = `https://luminarywishes.dpdns.org/${fileName}`;
  const canonicalTag = `<link rel="canonical" href="${canonicalHref}">`;
  if (!content.includes('rel="canonical"')) {
    content = ensureTag(content, canonicalTag, headClose, `  ${canonicalTag}`);
  } else {
    // replace existing canonical href
    content = content.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']+["']\s*\/?>/i, canonicalTag);
  }

  // JSON‑LD schema – will be inserted later after we have it
  // Header injection (after opening <body>)
  if (!content.includes('<nav class="navbar"')) {
    const bodyOpen = '<body'; // to capture possible attributes
    const bodyIdx = content.indexOf(bodyOpen);
    if (bodyIdx !== -1) {
      const afterTag = content.indexOf('>', bodyIdx) + 1; // end of <body>
      content = content.slice(0, afterTag) + '\n' + HEADER_TEMPLATE + content.slice(afterTag);
    }
  }

  // Footer injection (skip for payment pages)
  if (!EXCLUDE_FOOTER.has(fileName) && !content.includes('<footer id="global-footer"')) {
    const bodyClose = '</body>';
    const idx = content.indexOf(bodyClose);
    if (idx !== -1) {
      content = content.slice(0, idx) + FOOTER_TEMPLATE + '\n' + content.slice(idx);
    }
  }

  await fs.writeFile(filePath, content, 'utf8');
}

async function main() {
  const schemaBlock = await getSchemaBlock();
  // Insert schema into each file (if not present)
  const files = await fs.readdir(ROOT_DIR);
  for (const file of files) {
    if (path.extname(file) !== '.html') continue;
    const filePath = path.join(ROOT_DIR, file);
    let content = await fs.readFile(filePath, 'utf8');
    // Insert schema if missing
    if (schemaBlock && !content.includes('<script type="application/ld+json">')) {
      const headClose = '</head>';
      const idx = content.indexOf(headClose);
      if (idx !== -1) {
        content = content.slice(0, idx) + '\n' + schemaBlock + '\n' + content.slice(idx);
        await fs.writeFile(filePath, content, 'utf8');
      }
    }
  }

  // Second pass to handle header/footer, css, canonical (which may depend on earlier modifications)
  for (const file of files) {
    if (path.extname(file) !== '.html') continue;
    const filePath = path.join(ROOT_DIR, file);
    await processFile(filePath);
  }
  console.log('Layout unification complete.');
}

main().catch(err => console.error('Error:', err));
