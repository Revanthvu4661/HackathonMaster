const fs = require('fs');
const js = fs.readFileSync('app_v2.js', 'utf8');

const mockDOM = `
  const document = {
    body: { getAttribute: () => null, setAttribute: () => null, removeAttribute: () => null },
    getElementById: (id) => {
      const el = { 
        id, 
        addEventListener: () => null, 
        style: {}, 
        classList: { toggle: () => null, add: () => null, remove: () => null } 
      };
      // For features.html, some elements are missing
      if (['projectInput', 'generateBtn', 'aiSettingsBtn', 'copyBtn', 'downloadBtn', 'regenerateBtn'].includes(id)) return null;
      return el;
    },
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => ({ style: {} })
  };
  const window = {
    addEventListener: () => null,
    dispatchEvent: () => null,
    location: {}
  };
  const localStorage = { getItem: () => null, setItem: () => null, removeItem: () => null };
  const setTimeout = (cb) => { /* run instantly */ cb(); };
  const setInterval = () => null;
`;

try {
  eval(mockDOM + js);
  console.log("SUCCESS");
} catch (e) {
  console.error("ERROR CAUGHT:");
  console.error(e);
}
