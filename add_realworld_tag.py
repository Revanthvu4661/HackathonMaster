import os

html_files = ['index.html', 'team_builder.html', 'strategist.html']
old_tag = '<script src="offline_data_v3.js"></script>'
new_tags = '<script src="offline_data_v3.js"></script>\n  <script src="offline_data_realworld.js"></script>'

for fname in html_files:
    path = os.path.join(r'd:\RAR Hackathon', fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'offline_data_realworld.js' in content:
        print(fname + ': already has realworld tag')
        continue

    count = content.count(old_tag)
    if count == 0:
        print(fname + ': WARNING - v3 tag not found, skipping')
        continue

    new_content = content.replace(old_tag, new_tags)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(fname + ': added realworld tag (' + str(count) + ' occurrence(s))')

# Final verification
print('\nVerification:')
for fname in html_files:
    path = os.path.join(r'd:\RAR Hackathon', fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    v3 = content.count('offline_data_v3.js')
    rw = content.count('offline_data_realworld.js')
    print(fname + ': v3=' + str(v3) + ', realworld=' + str(rw))
