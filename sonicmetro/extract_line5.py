import csv

def get_line5_stations():
    files = ['data/5호선_상행_평일.csv', 'data/5호선_하행_평일.csv']
    
    hanam_train = []
    macheon_train = []
    
    for f in files:
        with open(f, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            trains = {}
            for row in reader:
                tid = row['trainno']
                if tid not in trains: trains[tid] = []
                trains[tid].append(row)
            
            for tid, rows in trains.items():
                stations = [r['stnNm'] for r in rows]
                
                # Check for full traversals
                if '방화' in stations and '하남검단산' in stations:
                    if len(stations) > len(hanam_train):
                        hanam_train = stations
                
                if '방화' in stations and '마천' in stations:
                    if len(stations) > len(macheon_train):
                        macheon_train = stations
                        
    return hanam_train, macheon_train

hanam, macheon = get_line5_stations()

# Determine split point
# Both should start with Banghwa and diverge after Gangdong
print("Hanam Branch (Full):", hanam)
print("Macheon Branch (Full):", macheon)

# Find split index
split_idx = 0
for i in range(min(len(hanam), len(macheon))):
    if hanam[i] != macheon[i]:
        split_idx = i
        break

print(f"\nSplit Index: {split_idx}")
print(f"Split Station (Last Shared): {hanam[split_idx-1]}")
print(f"First Hanam Specific: {hanam[split_idx]}")
print(f"First Macheon Specific: {macheon[split_idx]}")
