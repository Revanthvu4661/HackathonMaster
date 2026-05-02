const fs = require('fs');
let html = fs.readFileSync('projects.html', 'utf8');

// The replacement chunk
const replacement = `      <!-- Filters and Search -->
      <div class="filters-section" style="text-align: center; margin-bottom: 2rem;">
        <div class="search-container" style="max-width: 600px; margin: 0 auto 1.5rem auto; position: relative;">
          <input type="text" id="projectSearch" placeholder="Search 65+ projects by name, tech stack, or category..." style="width: 100%; padding: 1rem 1.5rem; border-radius: 12px; background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-primary); font-size: 1rem; outline: none; transition: all 0.3s ease;">
          <svg style="position: absolute; right: 1.2rem; top: 50%; transform: translateY(-50%); color: var(--text-secondary);" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
        
        <div class="category-filters" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
          <button class="filter-btn active" data-cat="All" style="padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); cursor: pointer;">All</button>
          <button class="filter-btn" data-cat="AI/ML" style="padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer;">AI/ML</button>
          <button class="filter-btn" data-cat="Full Stack" style="padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer;">Full Stack</button>
          <button class="filter-btn" data-cat="Web3" style="padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer;">Web3</button>
          <button class="filter-btn" data-cat="University" style="padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer;">University</button>
          <button class="filter-btn" data-cat="SaaS" style="padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer;">SaaS</button>
          <button class="filter-btn" data-cat="E-commerce" style="padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer;">E-commerce</button>
          <button class="filter-btn" data-cat="Dev Tools" style="padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); cursor: pointer;">Dev Tools</button>
        </div>
      </div>
      
      <style>
        .filter-btn { transition: all 0.3s ease; }
        .filter-btn:hover { background: var(--border-color) !important; color: white !important; }
        .filter-btn.active { background: linear-gradient(135deg, var(--primary), var(--secondary)) !important; color: white !important; border-color: transparent !important; }
      </style>

      <div class="showcase-grid" id="projectGrid">
        <!-- Rendered dynamically by projects_app.js -->
      </div>
    </div>
  </section>`;

// Replace from <!-- Search Bar --> down to </section>
html = html.replace(/<!-- Search Bar -->[\s\S]*?<\/section>/, replacement);

// Remove the inline script for searching
html = html.replace(/<!-- Search Script -->[\s\S]*?<\/script>/, '');

// Append <script src="projects_app.js"></script> right before </body>
html = html.replace(/<\/body>/, '  <script src="projects_app.js"></script>\n</body>');

fs.writeFileSync('projects.html', html);
console.log("Projects html updated!");
