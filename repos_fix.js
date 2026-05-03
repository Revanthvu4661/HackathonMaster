const fs = require('fs');

// 1. Rename the file
if (fs.existsSync('projects.html')) {
  fs.renameSync('projects.html', 'repos.html');
  console.log('Renamed projects.html to repos.html');
}

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f === 'app_v2.js');

// 2. Update all links
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('projects.html')) {
    content = content.replaceAll('projects.html', 'repos.html');
    changed = true;
  }
  
  // Also ensure no redirects exist
  if (content.includes('window.location.href = "projects.html"')) {
     content = content.replaceAll('window.location.href = "projects.html"', '');
     changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated links in ' + file);
  }
}
