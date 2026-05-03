const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix the brand link to include the name
  const brandAreaRegex = /<a href="index.html" class="nav-brand"[\s\S]*?<\/a>\s*<span class="brand-name">([\s\S]*?)<\/span>/;
  const match = content.match(brandAreaRegex);
  
  if (match) {
    const newBrand = `<a href="index.html" class="nav-brand" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 0.5rem;">${match[0].replace(/<\/a>[\s\S]*?<span class="brand-name">/, '').replace(/<a href="index.html" class="nav-brand"[\s\S]*?>/, '').replace(/<\/span>/, '')}</a>`;
    
    // Actually, let's just do a clean replacement of the whole nav-brand div
    const fullBrandRegex = /<div class="nav-brand">[\s\S]*?<\/div>/;
    const navMatch = content.match(fullBrandRegex);
    if (navMatch) {
       // Re-construct the brand div properly
       const cleanedBrand = `<div class="nav-brand">
        <a href="index.html" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 0.5rem;">
          <div class="brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L26 8V20L14 26L2 20V8L14 2Z" stroke="url(#brandGrad)" stroke-width="1.5" fill="none"/>
              <path d="M14 7L20 10.5V17.5L14 21L8 17.5V10.5L14 7Z" fill="url(#brandGrad)" opacity="0.4"/>
              <circle cx="14" cy="14" r="3" fill="url(#brandGrad)"/>
              <defs>
                <linearGradient id="brandGrad" x1="2" y1="2" x2="26" y2="26">
                  <stop offset="0%" stop-color="#a78bfa"/>
                  <stop offset="100%" stop-color="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="brand-name">Hackathon<span class="brand-accent">Master</span></span>
        </a>
      </div>`;
       content = content.replace(navMatch[0], cleanedBrand);
       fs.writeFileSync(file, content);
       console.log(`Deep fixed brand link in ${file}`);
    }
  }
}
