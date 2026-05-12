import os
import re

def cleanup_html(directory):
    html_files = [f for f in os.listdir(directory) if f.endswith('.html')]
    
    pattern = re.compile(r'//\s*Mobile Menu Toggle.*?}\s*}\s*;?', re.DOTALL)
    # Also handle slightly different variations
    pattern2 = re.compile(r'//\s*Mobile Menu Toggle.*?}\s*}\s*', re.DOTALL)
    
    for filename in html_files:
        path = os.path.join(directory, filename)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        
        # Look for the script block
        # Example:
        # const hamburger = document.getElementById('hamburger');
        # const mobileMenu = document.getElementById('mobileMenu');
        # if(hamburger && mobileMenu) { ... }
        
        script_pattern = re.compile(r'//\s*Mobile Menu Toggle.*?if\s*\(hamburger\s*&&\s*mobileMenu\)\s*\{.*?\}\s*\}', re.DOTALL)
        
        # Another variation:
        # const hamburger = document.getElementById('hamburger');
        # ...
        # hamburger.addEventListener('click', () => { ... });
        
        if script_pattern.search(content):
            print(f"Found redundant script in {filename}")
            new_content = script_pattern.sub('', content)
            
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Cleaned up {filename}")

if __name__ == "__main__":
    cleanup_html(r'c:\Users\revan\Desktop\Hackathon Helper')
