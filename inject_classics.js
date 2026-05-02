const fs = require('fs');
const https = require('https');

const classicIdeas = [
  { q: 'cyberbullying detection', cat: 'AI/ML', name: 'Cyberbullying Detection System', desc: 'A classic winning AI project that detects and filters toxic, bullying, or abusive comments in real-time.' },
  { q: 'disease prediction', cat: 'AI/ML', name: 'Disease Medical Recommendation', desc: 'Predicts diseases based on symptoms and recommends appropriate medical actions or nearby doctors.' },
  { q: 'sign language translator', cat: 'AI/ML', name: 'Sign Language to Text/Speech', desc: 'Uses computer vision to translate real-time sign language gestures into text and spoken audio.' },
  { q: 'fake news detection', cat: 'AI/ML', name: 'Fake News Detector', desc: 'NLP-based application that analyzes articles and social media posts to determine their authenticity.' },
  { q: 'crop disease detection', cat: 'AI/ML', name: 'Agri-Tech Crop Disease Scanner', desc: 'Helps farmers by scanning leaf images to detect crop diseases and recommend fertilizers.' },
  { q: 'carbon footprint tracker', cat: 'Full Stack', name: 'Carbon Footprint Tracker', desc: 'A gamified platform that tracks users daily activities to calculate and reduce their carbon footprint.' },
  { q: 'disaster management app', cat: 'Full Stack', name: 'Disaster Relief SOS App', desc: 'Offline-capable emergency app for coordinating rescue efforts, mapping safe zones, and sending SOS signals.' },
  { q: 'student mental health', cat: 'University', name: 'Student Mental Health Chatbot', desc: 'An anonymous AI-driven chatbot providing mental health support and resources for university students.' }
];

function fetchTopRepo(idea) {
  return new Promise((resolve) => {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(idea.q)}&per_page=1&sort=stars`;
    
    https.get(url, { headers: { 'User-Agent': 'Node.js-Hackathon-App' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.items && parsed.items.length > 0) {
            const item = parsed.items[0];
            resolve({
              title: idea.name,
              desc: idea.desc,
              tags: ["Hackathon Classic", "Winner", "Top Tier"],
              category: idea.cat,
              repo: item.full_name,
              branch: item.default_branch || 'main'
            });
          } else {
            resolve(null);
          }
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  console.log("Fetching classic hackathon winning templates...");
  let newClassics = [];
  
  for (let idea of classicIdeas) {
    const repo = await fetchTopRepo(idea);
    if (repo) {
      newClassics.push(repo);
      console.log(`Found repo for ${idea.name}: ${repo.repo}`);
    } else {
      console.log(`Failed to find repo for ${idea.name}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  // Load existing projects
  let currentJS = fs.readFileSync('projects_app.js', 'utf8');
  const regex = /const allProjects = (\[[\s\S]*?\]);/m;
  let existing = [];
  let match = currentJS.match(regex);
  if(match) {
    existing = eval(match[1]);
  }

  // Prepend new classics
  let combined = [...newClassics, ...existing];

  // Replace
  const newContent = currentJS.replace(regex, `const allProjects = ${JSON.stringify(combined, null, 2)};`);
  fs.writeFileSync('projects_app.js', newContent);
  console.log("Successfully injected classic hackathon templates!");
}

run();
