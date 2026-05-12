import os
import json

with open('offline_data_100.js', 'r', encoding='utf-8') as f:
    content100 = f.read()
    # Extract the JSON part
    json100_str = content100.replace('window.OFFLINE_KNOWLEDGE_BASE = ', '').strip()
    if json100_str.endswith(';'):
        json100_str = json100_str[:-1]
    data100 = json.loads(json100_str)

with open('offline_data_200_new.js', 'r', encoding='utf-8') as f:
    content200 = f.read()
    # Extract the JSON part
    json200_str = content200.replace('window.OFFLINE_KNOWLEDGE_BASE_EXTRA = ', '').strip()
    if json200_str.endswith(';'):
        json200_str = json200_str[:-1]
    data200 = json.loads(json200_str)

data300 = data100 + data200

with open('offline_data_300.js', 'w', encoding='utf-8') as f:
    f.write("window.OFFLINE_KNOWLEDGE_BASE = " + json.dumps(data300, indent=2) + ";")

print(f"Merged {len(data100)} + {len(data200)} = {len(data300)} entries into offline_data_300.js")
