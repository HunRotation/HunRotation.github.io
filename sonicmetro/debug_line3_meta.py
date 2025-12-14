import csv
import glob
import os

def process_line3_data():
    files = glob.glob('data/3호선*.csv')
    print(f"Found {len(files)} Line 3 files: {files}")

    trains = {}

    for filepath in files:
        print(f"Processing {filepath}...")
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Logic from js/data.js
                id = row.get('lnkgTrainno')
                
                # Filter 'Is it a status message?'
                if not id or not id.strip() or any('\u3131' <= char <= '\u3163' or '\uac00' <= char <= '\ud7a3' for char in id):
                     id = row.get('trainno')

                if not id:
                    continue
                
                # Composite key
                wkndSe = row.get('wkndSe')
                key = f"{id}_{wkndSe}"

                if key not in trains:
                    branch = row.get('brlnNm')
                    lineNm = row.get('lineNm')
                    
                    # Logic from js/data.js
                    if lineNm == "3호선":
                        branch = "3호선"
                        
                    trains[key] = {
                        'id': id,
                        'key': key,
                        'line': lineNm,
                        'branch': branch,
                        'origin': row.get('dptreStnNm'),
                        'dest': row.get('arvlStnNm'),
                        'schedule_count': 0
                    }
                
                trains[key]['schedule_count'] += 1

    # Analyze results
    line3_trains = [t for t in trains.values() if t['line'] == '3호선' or t['branch'] == '3호선']
    
    print(f"\nTotal Identified Trains: {len(trains)}")
    print(f"Total Line 3 Trains: {len(line3_trains)}")
    
    print("\nSample Line 3 Trains (First 5):")
    for t in line3_trains[:5]:
        print(f"ID: {t['id']}, Line: '{t['line']}', Branch: '{t['branch']}', Origin: {t['origin']}, Dest: {t['dest']} (Stops: {t['schedule_count']})")

    # Check for any anomalies
    non_3_branch = [t for t in line3_trains if t['branch'] != '3호선']
    if non_3_branch:
         print(f"\nWARNING: Found {len(non_3_branch)} trains with Line='3호선' but Branch!='3호선':")
         for t in non_3_branch[:5]:
             print(t)
    else:
        print("\nSUCCESS: All detected Line 3 trains have Branch='3호선'.")

if __name__ == "__main__":
    process_line3_data()
