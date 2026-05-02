const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

// 1. Rename the file
if (fs.existsSync('calendar.html')) {
  fs.renameSync('calendar.html', 'hackathons.html');
  console.log('Renamed calendar.html to hackathons.html');
}

// 2. Update all links
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('calendar.html')) {
    content = content.replaceAll('calendar.html', 'hackathons.html');
    fs.writeFileSync(file, content);
    console.log('Updated links in ' + file);
  }
}

// Also check app_v2.js
let appJS = fs.readFileSync('app_v2.js', 'utf8');
if (appJS.includes('calendar.html')) {
  appJS = appJS.replaceAll('calendar.html', 'hackathons.html');
  fs.writeFileSync('app_v2.js', appJS);
  console.log('Updated links in app_v2.js');
}
