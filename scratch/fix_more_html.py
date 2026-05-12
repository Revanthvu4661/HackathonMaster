import os

def fix_html_files():
    base_dir = r'c:\Users\revan\Desktop\Hackathon Helper'
    html_files = [
        'showcase.html',
        'generator.html'
    ]
    
    theme_script = '<script src="theme.js"></script>'
    
    for filename in html_files:
        path = os.path.join(base_dir, filename)
        if not os.path.exists(path):
            continue
            
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        new_lines = []
        in_mobile_menu = False
        mobile_menu_added = False
        
        for line in lines:
            # 1. Inject theme.js
            if '</head>' in line and theme_script not in "".join(lines):
                new_lines.append(f'  {theme_script}\n')
                new_lines.append(line)
                continue
                
            # 2. Fix mobile menu
            if 'id="mobileMenu"' in line:
                in_mobile_menu = True
                new_lines.append(line)
                new_lines.append('    <a href="index.html" class="mobile-link">Home</a>\n')
                new_lines.append('    <a href="strategist.html" class="mobile-link">Strategist</a>\n')
                new_lines.append('    <a href="features.html" class="mobile-link">AI Tools</a>\n')
                new_lines.append('    <a href="team_builder.html" class="mobile-link">Team Builder</a>\n')
                new_lines.append('    <a href="hackathons.html" class="mobile-link">Live Hackathons</a>\n')
                new_lines.append('    <a href="repos.html" class="mobile-link">Hackathon Repos</a>\n')
                mobile_menu_added = True
                continue
                
            if in_mobile_menu:
                if '</div>' in line:
                    in_mobile_menu = False
                    new_lines.append(line)
                continue
                
            new_lines.append(line)
            
        with open(path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"Fixed {filename}")

if __name__ == "__main__":
    fix_html_files()
