const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// 1. Rename "Features" to "AI Tools" in all navigation menus
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/"nav-link( active)?">Features<\/a>/g, '"nav-link$1">AI Tools</a>');
  content = content.replace(/"mobile-link( active)?">Features<\/a>/g, '"mobile-link$1">AI Tools</a>');
  fs.writeFileSync(file, content);
  console.log("Updated navigation in " + file);
}

// 2. Reorder features.html
let fContent = fs.readFileSync('features.html', 'utf8');
const featStart = fContent.indexOf('<!-- ===== FEATURES SECTION ===== -->');
const toolsStart = fContent.indexOf('<!-- ===== AI TOOLS COMPARISON ===== -->');
const showcaseStart = fContent.indexOf('<!-- ===== SHOWCASE SECTION ===== -->');

if (featStart !== -1 && toolsStart !== -1 && showcaseStart !== -1 && featStart < toolsStart) {
  const featSection = fContent.substring(featStart, toolsStart);
  const toolsSection = fContent.substring(toolsStart, showcaseStart);
  
  // Swap them
  const newFContent = fContent.substring(0, featStart) + toolsSection + featSection + fContent.substring(showcaseStart);
  fs.writeFileSync('features.html', newFContent);
  console.log('Successfully swapped AI Tools and Features sections in features.html');
} else {
  console.log('Could not parse features.html sections correctly.');
}
