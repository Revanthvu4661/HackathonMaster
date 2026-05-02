const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') || f === 'app_v2.js');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('calendar.html')) {
    content = content.replaceAll('calendar.html', 'hackathons.html');
    fs.writeFileSync(file, content);
    console.log('Updated links in ' + file);
  }
}
