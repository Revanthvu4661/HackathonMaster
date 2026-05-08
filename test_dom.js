const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('features.html', 'utf-8');
const js = fs.readFileSync('app_v2.js', 'utf-8');

const dom = new JSDOM(html, { runScripts: 'dangerously' });
dom.window.eval(`
  // Catch errors
  window.onerror = function(msg, url, line, col, error) {
    console.error("Error at line " + line + ": " + msg);
  };
`);

try {
  dom.window.eval(js);
  console.log("Script executed.");
  console.log("Tools Table rows:", dom.window.document.getElementById('toolsTableBody').children.length);
} catch (e) {
  console.error("Execution error:", e);
}
