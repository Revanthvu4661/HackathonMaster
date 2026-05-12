def remove_redundant_script(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    skip = False
    for line in lines:
        if '<script>' in line and '// Mobile Menu Toggle' in "".join(lines[lines.index(line):lines.index(line)+3]):
            skip = True
        if skip:
            if '</script>' in line:
                skip = False
            continue
        new_lines.append(line)
        
    with open(filename, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

if __name__ == "__main__":
    import os
    for f in ['features.html', 'strategist.html', 'team_builder.html', 'hackathons.html', 'repos.html', 'showcase.html', 'generator.html']:
        path = os.path.join(r'c:\Users\revan\Desktop\Hackathon Helper', f)
        if os.path.exists(path):
            remove_redundant_script(path)
