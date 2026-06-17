import os
import re

nav_link = '        <a href="hackathon_universe.html" class="nav-link">🌐 Hackathon Universe</a>\n        <a href="repos.html"'
mobile_nav_link = '    <a href="hackathons.html" class="mobile-link">Live Hackathons</a>\n    <a href="hackathon_universe.html" class="mobile-link">🌐 Hackathon Universe</a>\n    <a href="repos.html"'

for root, _, files in os.walk("D:/RAR Hackathon"):
    for file in files:
        if file.endswith(".html") and file != "hackathon_universe.html":
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Replace desktop nav
            content = re.sub(r'        <a href="repos.html"', nav_link, content)
            
            # Replace mobile nav
            content = re.sub(r'    <a href="hackathons.html" class="mobile-link">Live Hackathons</a>\n    <a href="repos.html"', mobile_nav_link, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
print("Updated navigation in all HTML files.")
