import json

def load_js_data(filename, var_name):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
        json_str = content.replace(f'window.{var_name} = ', '').strip()
        if json_str.endswith(';'):
            json_str = json_str[:-1]
        return json.loads(json_str)

data800 = load_js_data('offline_data_800.js', 'OFFLINE_KNOWLEDGE_BASE')
data200 = load_js_data('offline_data_200_emerging.js', 'OFFLINE_KNOWLEDGE_BASE_EMERGING')

data1000 = data800 + data200

with open('offline_data_1000.js', 'w', encoding='utf-8') as f:
    f.write("window.OFFLINE_KNOWLEDGE_BASE = " + json.dumps(data1000, indent=2) + ";")

print(f"Total: {len(data1000)} entries in offline_data_1000.js")
