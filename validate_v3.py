import json
from collections import Counter

print("Reading file...", flush=True)
with open(r'd:\RAR Hackathon\offline_data_v3.js', 'r', encoding='utf-8') as f:
    content = f.read()

js_content = content.strip()
assert js_content.startswith('window.OFFLINE_KNOWLEDGE_BASE = ['), 'Missing header'
assert js_content.endswith('];'), 'Missing closing'

array_str = js_content[len('window.OFFLINE_KNOWLEDGE_BASE = '):-1]
if array_str.endswith(';'):
    array_str = array_str[:-1]

print("Parsing JSON...", flush=True)
try:
    data = json.loads(array_str)
    print("JSON valid. Total entries:", len(data))
except Exception as e:
    print("JSON ERROR:", e)
    exit(1)

# Sample entry check
sample = data[1000]
print("Entry 1001 industry:", sample["result"]["industry"])
print("Entry 1001 keyword count:", len(sample["keywords"]))
print("Entry 1001 name:", sample["team_result"]["project_summary"]["name"])

# Schema validation
required_result = ["overview","techstack","ai_strategy","mega_prompt","database_schema","api_endpoints","win_secret","industry"]
required_team = ["project_summary","roles","skills_map","task_timeline","collaboration","solo_strategy"]
errors = 0
kw_under_20 = 0
for i, entry in enumerate(data):
    for field in required_result:
        if field not in entry["result"]:
            print("Entry", i, "missing result." + field)
            errors += 1
    for field in required_team:
        if field not in entry["team_result"]:
            print("Entry", i, "missing team_result." + field)
            errors += 1
    kc = len(entry["keywords"])
    if kc < 20:
        kw_under_20 += 1
        if kw_under_20 <= 5:
            print("Entry", i, "only has", kc, "keywords")

print("Schema validation errors:", errors)
print("Entries with < 20 keywords:", kw_under_20)

# Industry breakdown
industries = Counter(e["result"]["industry"] for e in data)
print("Total industries:", len(industries))
for ind, cnt in sorted(industries.items()):
    print(" ", ind, ":", cnt)
