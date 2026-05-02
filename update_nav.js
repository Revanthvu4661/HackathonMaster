const fs = require('fs');

const files = ['index.html', 'generator.html', 'features.html', 'showcase.html', 'projects.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Add to desktop nav if not exists
  if (!content.includes('href="projects.html"')) {
    content = content.replace(
      /<a href="showcase\.html" class="nav-link(.*?)">Showcase<\/a>/g,
      '<a href="showcase.html" class="nav-link$1">Showcase</a>\n        <a href="projects.html" class="nav-link">Projects</a>'
    );
    // Add to mobile nav
    content = content.replace(
      /<a href="showcase\.html" class="mobile-link(.*?)">Showcase<\/a>/g,
      '<a href="showcase.html" class="mobile-link$1">Showcase</a>\n    <a href="projects.html" class="mobile-link">Projects</a>'
    );
  }

  // If this is projects.html, set it as active
  if (file === 'projects.html') {
    content = content.replace(/class="nav-link active"/g, 'class="nav-link"');
    content = content.replace(/href="projects\.html" class="nav-link"/, 'href="projects.html" class="nav-link active"');
  }

  fs.writeFileSync(file, content);
});

console.log("Nav updated in all files.");
