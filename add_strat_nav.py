import os
import glob
import re

html_files = [f for f in glob.glob('*.html') if f != 'strategist.html']

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Normal Nav link
    if 'strategist.html' not in content:
        # We find <a href="generator.html" ...>Generator</a> or similar and inject the new link
        content = re.sub(
            r'(<a href="generator\.html"[^>]*>Generator</a>)',
            r'\1\n        <a href="strategist.html" class="nav-link">Strategist</a>',
            content
        )

        # Mobile Nav link
        content = re.sub(
            r'(<a href="generator\.html" class="mobile-link">Generator</a>)',
            r'\1\n    <a href="strategist.html" class="mobile-link">Strategist</a>',
            content
        )

        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
