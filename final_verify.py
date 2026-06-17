import json, os

print("=" * 60)
print("FINAL VERIFICATION")
print("=" * 60)

# 1. offline_data_realworld.js
print("\n1. offline_data_realworld.js:")
with open(r'd:\RAR Hackathon\offline_data_realworld.js', 'r', encoding='utf-8') as f:
    rw_content = f.read()

assert rw_content.startswith('window.OFFLINE_KNOWLEDGE_BASE_REALWORLD = [')
array_str = rw_content[len('window.OFFLINE_KNOWLEDGE_BASE_REALWORLD = '):-2]
rw_data = json.loads(array_str)
print("  JSON valid: True")
print("  Entries:", len(rw_data))
print("  Size:", round(len(rw_content)/1024/1024, 1), "MB")
under20 = sum(1 for e in rw_data if len(e['keywords']) < 20)
print("  Entries with < 20 keywords:", under20)

# Industry breakdown
from collections import Counter
industries = Counter(e['result']['industry'] for e in rw_data)
print("  Industries covered:", len(industries))
print("  Top industries:")
for ind, cnt in sorted(industries.items(), key=lambda x: -x[1])[:10]:
    print("    " + ind + ":", cnt)

# 2. app_v2.js scoring
print("\n2. app_v2.js scoring function:")
with open(r'd:\RAR Hackathon\app_v2.js', 'r', encoding='utf-8') as f:
    app_content = f.read()

checks = [
    'OFFLINE_KNOWLEDGE_BASE_REALWORLD',
    'OFFLINE_KNOWLEDGE_BASE_EXTENDED',
    'score += 3',
    'score += 6',
    'score >= 12',
    'highestScore >= 4',
    'kb[0].result'
]
for check in checks:
    found = check in app_content
    print("  [" + ("OK" if found else "FAIL") + "] " + check)

# 3. HTML files
print("\n3. HTML files:")
for fname in ['index.html', 'team_builder.html', 'strategist.html']:
    path = os.path.join(r'd:\RAR Hackathon', fname)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    old = 'offline_data_1000.js' in content
    v3 = content.count('offline_data_v3.js')
    rw = content.count('offline_data_realworld.js')
    status = "OK" if not old and v3 > 0 and rw > 0 else "FAIL"
    print("  [" + status + "] " + fname + " (old=" + str(old) + ", v3=" + str(v3) + ", realworld=" + str(rw) + ")")

print("\n" + "=" * 60)
print("SUMMARY:")
print("  offline_data_v3.js: existing (2500 entries)")
print("  offline_data_realworld.js:", len(rw_data), "entries")
print("  TOTAL KB:", 2500 + len(rw_data), "entries")
print("=" * 60)
