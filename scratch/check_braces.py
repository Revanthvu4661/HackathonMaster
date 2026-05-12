def check_braces(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    stack = []
    for i, char in enumerate(content):
        if char == '{':
            stack.append(('{', i))
        elif char == '}':
            if not stack:
                print(f"Extra closing brace at index {i}")
            else:
                stack.pop()
    
    if stack:
        for char, i in stack:
            print(f"Unclosed opening brace at index {i}")
            # Find line number
            line_num = content[:i].count('\n') + 1
            print(f"Line number: {line_num}")

if __name__ == "__main__":
    check_braces(r'c:\Users\revan\Desktop\Hackathon Helper\app_v2.js')
