
import os
import csv
from datetime import datetime, timedelta

DATA_DIR = "sonicmetro/data"

def parse_time(t_str):
    if not t_str: return None
    try:
        return datetime.strptime(t_str, "%H:%M:%S")
    except ValueError:
        return None

def format_time(dt):
    if not dt: return ""
    return dt.strftime("%H:%M:%S")

def process_file(filepath):
    print(f"Processing {filepath}...")
    updated_rows = []
    headers = []
    
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        rows = list(reader)
        
    original_count = len(rows)
    fill_count = 0
    
    for row in rows:
        stn = row.get('stnNm', '').strip()
        origin = row.get('dptreStnNm', '').strip()
        dest = row.get('arvlStnNm', '').strip()
        
        arvl_str = row.get('trainArvlTm', '').strip()
        dpt_str = row.get('trainDptreTm', '').strip()
        
        arvl_dt = parse_time(arvl_str)
        dpt_dt = parse_time(dpt_str)
        
        # Rule 1: Missing Arrival
        if not arvl_dt and dpt_dt:
            # If current station matches departure station (Start), leave empty
            if stn != origin:
                arvl_dt = dpt_dt - timedelta(seconds=30)
                row['trainArvlTm'] = format_time(arvl_dt)
                fill_count += 1
                
        # Rule 2: Missing Departure
        if not dpt_dt and arvl_dt:
            # If current station matches arrival station (End), leave empty
            if stn != dest:
                dpt_dt = arvl_dt + timedelta(seconds=30)
                row['trainDptreTm'] = format_time(dpt_dt)
                fill_count += 1
        
        updated_rows.append(row)

    if fill_count > 0:
        with open(filepath, 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
            writer.writerows(updated_rows)
        print(f"  -> Filled {fill_count} missing values.")
    else:
        print("  -> No changes needed.")

def main():
    files = [f for f in os.listdir(DATA_DIR) if f.endswith(".csv")]
    for filename in files:
        process_file(os.path.join(DATA_DIR, filename))

if __name__ == "__main__":
    main()
