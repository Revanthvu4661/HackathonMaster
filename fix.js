const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf-8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\${/g, '${');

fs.writeFileSync('app.js', content, 'utf-8');
console.log('Fixed app.js');
