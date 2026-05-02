const fs = require('fs');

let js = fs.readFileSync('app_v2.js', 'utf8');

// 1. Fix Navigation scrollspy
js = js.replace(/document\.querySelectorAll\('section'\)\.forEach\(section => {[\s\S]*?}\);/g, `
  // Disabled scrollspy for multi-page routing
`);

// 2. Wrap generator logic
js = js.replace(/projectInput\.addEventListener\('input', \(\) => {/g, 'if (projectInput) {\nprojectInput.addEventListener(\'input\', () => {');
js = js.replace(/\/\/ Report Content Generation/, '}\n\n// Report Content Generation'); // closes the if (projectInput) block

// Wait, the above is a bit brittle. Let's just wrap everything cleanly.
// A better way: replace the global document.getElementById calls with safe wrappers or just put if checks around addEventListeners.
// Let's rewrite app_v2.js manually with regex.

// Let's just read it entirely and do smart string replacements.
js = js.replace(/projectInput\.addEventListener/g, 'if(projectInput) projectInput.addEventListener');
js = js.replace(/exampleChips\.forEach/g, 'if(exampleChips) exampleChips.forEach');
js = js.replace(/modeBtns\.forEach/g, 'if(modeBtns) modeBtns.forEach');
js = js.replace(/generateBtn\.addEventListener/g, 'if(generateBtn) generateBtn.addEventListener');

js = js.replace(/document\.getElementById\('copyBtn'\)\.addEventListener/g, 'const copyBtn = document.getElementById("copyBtn");\nif(copyBtn) copyBtn.addEventListener');
js = js.replace(/document\.getElementById\('downloadBtn'\)\.addEventListener/g, 'const downBtn = document.getElementById("downloadBtn");\nif(downBtn) downBtn.addEventListener');
js = js.replace(/document\.getElementById\('regenerateBtn'\)\.addEventListener/g, 'const regenBtn = document.getElementById("regenerateBtn");\nif(regenBtn) regenBtn.addEventListener');

js = js.replace(/features\.forEach\(\(f, i\) => {/g, 'if(featuresGrid) features.forEach((f, i) => {');
js = js.replace(/tools\.forEach\(t => {/g, 'if(toolsTableBody) tools.forEach(t => {');
js = js.replace(/showcaseProjects\.forEach\(\(p, i\) => {/g, 'if(showcaseGrid) showcaseProjects.forEach((p, i) => {');

js = js.replace(/document\.getElementById\('launchBtn'\)\.addEventListener/g, 'const lBtn = document.getElementById("launchBtn");\nif(lBtn) lBtn.addEventListener');
js = js.replace(/document\.getElementById\('heroGenerateBtn'\)\.addEventListener/g, 'const hgBtn = document.getElementById("heroGenerateBtn");\nif(hgBtn) hgBtn.addEventListener');
js = js.replace(/document\.getElementById\('heroShowcaseBtn'\)\.addEventListener/g, 'const hsBtn = document.getElementById("heroShowcaseBtn");\nif(hsBtn) hsBtn.addEventListener');
js = js.replace(/document\.getElementById\('ctaBtn'\)\.addEventListener/g, 'const cBtn = document.getElementById("ctaBtn");\nif(cBtn) cBtn.addEventListener');

fs.writeFileSync('app_v2.js', js);
console.log("App.js patched");
