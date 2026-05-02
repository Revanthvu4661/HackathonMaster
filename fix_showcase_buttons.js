const fs = require('fs');

let content = fs.readFileSync('app_v2.js', 'utf8');

// 1. Fix the showcase button HTML
const oldFooter = '<span class="view-btn">View Blueprint <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>';
const newFooter = '<span class="view-btn" data-title="${p.title}" style="cursor:pointer;">View Blueprint <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>';

content = content.replace(oldFooter, newFooter);

// 2. Add the event listener binding
if(!content.includes("presetProject")) {
  const oldLoopEnd = '});\n\n// Button interactions';
  const newLoopEnd = `});
if(showcaseGrid) {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      localStorage.setItem('presetProject', e.currentTarget.dataset.title);
      window.location.href = 'generator.html';
    });
  });
}

// Check for preset on load
const preset = localStorage.getItem('presetProject');
const pInput = document.getElementById('projectInput');
const gBtn = document.getElementById('generateBtn');
if(preset && pInput && gBtn) {
  pInput.value = "Create a complete, detailed blueprint for: " + preset;
  gBtn.removeAttribute('disabled');
  localStorage.removeItem('presetProject');
  setTimeout(() => {
    gBtn.click();
  }, 500);
}

// Button interactions`;
  
  content = content.replace(oldLoopEnd, newLoopEnd);
}

fs.writeFileSync('app_v2.js', content);
console.log('Fixed showcase buttons and added generator auto-load!');
