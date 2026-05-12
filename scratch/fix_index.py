import os

def fix_index():
    path = r'c:\Users\revan\Desktop\Hackathon Helper\index.html'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix mobile menu
    mobile_menu_old = """  <div class="mobile-menu" id="mobileMenu">
        <a href="index.html" class="mobile-link">Home</a>
    <a href="strategist.html" class="mobile-link">Strategist</a>
        <a href="strategist.html" class="nav-link">Strategist</a>
        <a href="features.html" class="mobile-link">AI Tools</a>
    <a href="team_builder.html" class="mobile-link">Team Builder</a>
    <a href="hackathons.html" class="mobile-link">Live Hackathons</a>
    <a href="repos.html" class="mobile-link">Hackathon Repos</a>
  </div>"""
    
    mobile_menu_new = """  <div class="mobile-menu" id="mobileMenu">
    <a href="index.html" class="mobile-link">Home</a>
    <a href="strategist.html" class="mobile-link">Strategist</a>
    <a href="features.html" class="mobile-link">AI Tools</a>
    <a href="team_builder.html" class="mobile-link">Team Builder</a>
    <a href="hackathons.html" class="mobile-link">Live Hackathons</a>
    <a href="repos.html" class="mobile-link">Hackathon Repos</a>
  </div>"""

    # Fix hero actions
    hero_actions_old = """        <div class="hero-actions">
          <button class="btn-primary btn-lg" id="heroGenerateBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Generate My Project
          </button>
          <button class="btn-outline btn-lg" id="heroShowcaseBtn">
            View Showcase
          </button>
        </div>"""
    
    hero_actions_new = """        <div class="hero-actions">
          <button class="btn-outline btn-lg" id="heroShowcaseBtn">
            View Showcase
          </button>
        </div>"""

    # Try replacement with normalization
    def normalize(s):
        return "\n".join(line.rstrip() for line in s.splitlines())

    # We'll just do a more direct string find if possible
    if hero_actions_old in content:
        content = content.replace(hero_actions_old, hero_actions_new)
    else:
        print("Hero actions not found exactly")
        # Try finding the parts
        if 'id="heroGenerateBtn"' in content:
             print("Found heroGenerateBtn ID")

    if mobile_menu_old in content:
        content = content.replace(mobile_menu_old, mobile_menu_new)
    else:
        print("Mobile menu not found exactly")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Done")

if __name__ == "__main__":
    fix_index()
