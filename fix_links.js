const fs = require('fs');

let html = fs.readFileSync('projects.html', 'utf8');

// Replace standard github archive links with codeload links
html = html.replace(/href="https:\/\/github\.com\/(.*?)\/(.*?)\/archive\/refs\/heads\/(main|master)\.zip"/g, 'href="https://codeload.github.com/$1/$2/zip/refs/heads/$3" download="$2.zip"');

fs.writeFileSync('projects.html', html);
console.log("Links fixed.");
