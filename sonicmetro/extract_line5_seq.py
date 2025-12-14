import csv

def get_sequences():
    files = ['data/5호선_상행_평일.csv', 'data/5호선_하행_평일.csv']
    
    # We want Banghwa -> Hanam
    # And Banghwa -> Macheon
    # Or just the lists.
    
    hanam_seq = []
    macheon_seq = []
    
    # Find longest sequences ending in each
    for f in files:
        with open(f, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            trains = {}
            for row in reader:
                tid = row['trainno']
                if tid not in trains: trains[tid] = []
                trains[tid].append(row)
                
            for tid, rows in trains.items():
                try:
                    # Sort by time
                    rows.sort(key=lambda x: x['trainArvlTm'] or '00:00:00')
                    stns = [r['stnNm'] for r in rows]
                    
                    if '방화' in stns and '하남검단산' in stns:
                        if len(stns) > len(hanam_seq): hanam_seq = stns
                            
                    if '방화' in stns and '마천' in stns:
                        if len(stns) > len(macheon_seq): macheon_seq = stns
                except: continue

    return hanam_seq, macheon_seq

h, m = get_sequences()
print("Hanam Sequence:")
print(h)
print(f"Len: {len(h)}")

print("\nMacheon Sequence:")
# We only need the branch part for Macheon usually if we handle branching logic
# But the user provided split coordinates.
print(m)
print(f"Len: {len(m)}")
