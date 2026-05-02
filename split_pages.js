const fs = require('fs');

const html = fs.readFileSync('generator.html', 'utf8');

// For generator.html: Remove Hero, Features, Tools, Showcase
let genHtml = html
  .replace(/<section class="section hero-section" id="hero">[\s\S]*?<\/section>/, '')
  .replace(/<section class="section features-section" id="features">[\s\S]*?<\/section>/, '')
  .replace(/<section class="section tools-section" id="tools">[\s\S]*?<\/section>/, '')
  .replace(/<section class="section showcase-section" id="showcase">[\s\S]*?<\/section>/, '')
  .replace(/<section class="cta-section">[\s\S]*?<\/section>/, '');

// Update navbar active state
genHtml = genHtml.replace(/class="nav-link active"/g, 'class="nav-link"');
genHtml = genHtml.replace(/href="generator\.html" class="nav-link"/, 'href="generator.html" class="nav-link active"');

fs.writeFileSync('generator.html', genHtml);

// For features.html: Remove Hero, Generator, Showcase, CTA
const fHtml = fs.readFileSync('features.html', 'utf8');
let featHtml = fHtml
  .replace(/<section class="section hero-section" id="hero">[\s\S]*?<\/section>/, '')
  .replace(/<section class="section generator-section" id="generator">[\s\S]*?<\/section>/, '')
  .replace(/<section class="section showcase-section" id="showcase">[\s\S]*?<\/section>/, '')
  .replace(/<section class="cta-section">[\s\S]*?<\/section>/, '');

featHtml = featHtml.replace(/class="nav-link active"/g, 'class="nav-link"');
featHtml = featHtml.replace(/href="features\.html" class="nav-link"/, 'href="features.html" class="nav-link active"');
fs.writeFileSync('features.html', featHtml);

// For showcase.html: Remove Hero, Generator, Features, Tools, CTA
const sHtml = fs.readFileSync('showcase.html', 'utf8');
let showHtml = sHtml
  .replace(/<section class="section hero-section" id="hero">[\s\S]*?<\/section>/, '')
  .replace(/<section class="section generator-section" id="generator">[\s\S]*?<\/section>/, '')
  .replace(/<section class="section features-section" id="features">[\s\S]*?<\/section>/, '')
  .replace(/<section class="section tools-section" id="tools">[\s\S]*?<\/section>/, '')
  .replace(/<section class="cta-section">[\s\S]*?<\/section>/, '');

showHtml = showHtml.replace(/class="nav-link active"/g, 'class="nav-link"');
showHtml = showHtml.replace(/href="showcase\.html" class="nav-link"/, 'href="showcase.html" class="nav-link active"');
fs.writeFileSync('showcase.html', showHtml);

console.log("Pages split successfully.");
