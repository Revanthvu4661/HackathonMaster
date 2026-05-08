import os
import re

files_to_update = [
    'index.html',
    'strategist.html',
    'features.html',
    'hackathons.html',
    'repos.html',
    'showcase.html',
    'generator.html',
    'app_v2.js'
]

def rename_app(filepath):
    if not os.path.exists(filepath):
        return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update title and text
    new_content = content.replace('Hackathon Master', 'RAR Hackathon Helper')
    new_content = new_content.replace('HackathonMaster', 'RARHackathonHelper')
    
    # Update navbar brand structure
    # Old: <span class="brand-name">Hackathon<span class="brand-accent">Master</span></span>
    # New: <span class="brand-name">RAR <span class="brand-accent">Hackathon Helper</span></span>
    nav_old = r'Hackathon<span class="brand-accent">Master</span>'
    nav_new = r'RAR <span class="brand-accent">Hackathon Helper</span>'
    new_content = re.sub(nav_old, nav_new, new_content)

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for f in files_to_update:
    rename_app(f)
