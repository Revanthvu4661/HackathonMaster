const fs = require('fs');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'team_builder.html');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Add to desktop nav
  if (!content.includes('href="team_builder.html"')) {
    content = content.replace(
      /<a href="features\.html" class="nav-link(.*?)">AI Tools<\/a>/g,
      '<a href="features.html" class="nav-link$1">AI Tools</a>\n        <a href="team_builder.html" class="nav-link">Team Builder</a>'
    );
    // Add to mobile nav
    content = content.replace(
      /<a href="features\.html" class="mobile-link(.*?)">AI Tools<\/a>/g,
      '<a href="features.html" class="mobile-link$1">AI Tools</a>\n    <a href="team_builder.html" class="mobile-link">Team Builder</a>'
    );
    
    // Add to footer
    content = content.replace(
      /<a href="features\.html">AI Tools<\/a>/g,
      '<a href="features.html">AI Tools</a>\n          <a href="team_builder.html">Team Builder</a>'
    );

    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});

console.log("Nav updated in all files.");
