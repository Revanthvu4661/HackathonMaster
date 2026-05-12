import json

def load_js_data(filename, var_name):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        json_str = content.replace(f'window.{var_name} = ', '').strip()
        if json_str.endswith(';'):
            json_str = json_str[:-1]
        return json.loads(json_str)

data300 = load_js_data('offline_data_300.js', 'OFFLINE_KNOWLEDGE_BASE')
data500 = load_js_data('offline_data_500_new.js', 'OFFLINE_KNOWLEDGE_BASE_500')

data800 = data300 + data500

with open('offline_data_800.js', 'w', encoding='utf-8') as f:
    f.write("window.OFFLINE_KNOWLEDGE_BASE = " + json.dumps(data800, indent=2) + ";")

print(f"Total: {len(data800)} entries in offline_data_800.js")
