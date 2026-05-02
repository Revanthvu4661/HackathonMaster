import sys

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('\\`', '`')
content = content.replace('\\${', '${')

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed app.js")
