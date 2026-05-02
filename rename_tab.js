const fs = require('fs');

const files = ['index.html', 'generator.html', 'features.html', 'showcase.html', 'projects.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace desktop nav text
  content = content.replace(/>Projects<\/a>/g, '>Hackathon Repos</a>');
  
  fs.writeFileSync(file, content);
});

console.log("Tab renamed to Hackathon Repos in all files.");
