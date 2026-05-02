const fs = require('fs');

const files = ['generator.html', 'features.html', 'showcase.html'];

for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find boundaries of Hero Section
  const startStr = '<!-- ===== HERO SECTION ===== -->';
  const startIndex = content.indexOf(startStr);
  
  if (startIndex !== -1) {
    // We want to delete up until the next section starts.
    // Next sections are either GENERATOR SECTION, FEATURES SECTION, or SHOWCASE SECTION
    let endStr1 = '<!-- ===== GENERATOR SECTION ===== -->';
    let endStr2 = '<!-- ===== FEATURES SECTION ===== -->';
    let endStr3 = '<!-- ===== SHOWCASE SECTION ===== -->';
    
    let endIndex = content.indexOf(endStr1, startIndex + 1);
    if (endIndex === -1) endIndex = content.indexOf(endStr2, startIndex + 1);
    if (endIndex === -1) endIndex = content.indexOf(endStr3, startIndex + 1);
    
    if (endIndex !== -1) {
      let heroChunk = content.substring(startIndex, endIndex);
      content = content.replace(heroChunk, '');
      fs.writeFileSync(file, content);
      console.log("Removed Hero Section from " + file);
    } else {
      console.log("Could not find end of Hero section in " + file);
    }
  } else {
    console.log("No Hero section found in " + file);
  }
}
