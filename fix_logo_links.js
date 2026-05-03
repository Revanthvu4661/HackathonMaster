const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the brand div and wrap it in a link
  const brandRegex = /<div class="nav-brand">([\s\S]*?)<\/div>/;
  const match = content.match(brandRegex);
  
  if (match && !match[0].includes('href="index.html"')) {
    const originalBrand = match[0];
    const newBrand = `<a href="index.html" class="nav-brand" style="text-decoration: none; color: inherit;">${match[1]}</a>`;
    content = content.replace(originalBrand, newBrand);
    fs.writeFileSync(file, content);
    console.log(`Updated brand link in ${file}`);
  }
}
