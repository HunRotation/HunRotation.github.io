import requests
import time
import csv
import os
import sys
from urllib.parse import quote

# Try importing tqdm
try:
    from tqdm import tqdm
except ImportError:
    # Minimal fallback for tqdm
    class tqdm:
        def __init__(self, iterable=None, total=None, desc=""):
            self.total = total or (len(iterable) if iterable else 0)
            self.n = 0
            self.desc = desc
            print(f"{self.desc} started...")
        
        def update(self, n=1):
            self.n += n
            # Print progress every 10%
            if self.total > 0 and self.n % (max(1, self.total // 10)) == 0:
                print(f"{self.desc}: {self.n}/{self.total}")
        
        def set_description(self, desc):
            self.desc = desc
            
        def close(self):
            print(f"{self.desc} finished.")
            
        def write(self, msg):
            print(msg)

API_KEY = "50514268696b6f673437644a755a73"
BASE_URL = "http://openapi.seoul.go.kr:8088"

LINES = ["2호선", "3호선"] # Focusing on Line 2
# Note: Plan says "상하행방향: 상행/하행"
DIRECTIONS = ["상행", "하행"] 
# Note: Plan says "주말구분: 평일/주말"
DAYS = ["평일", "주말"] 

# Use absolute path for output to be safe or relative to where script is run
# We assume script is run from project root, so sonicmetro/data/ is correct relative path
OUTPUT_FILE = "sonicmetro/data/train_schedule.csv"

def save_csv(filename, data, pbar):
    if not data: return
    keys = set()
    for item in data:
        keys.update(item.keys())
    
    fieldnames = sorted(list(keys))
    pbar.write(f"Saving {len(data)} records to {filename}...")
    
    with open(filename, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

def fetch_data():
    all_data = []
    
    # Calculate total iterations for progress bar
    total_iterations = len(LINES) * len(DIRECTIONS) * len(DAYS)
    
    pbar = tqdm(total=total_iterations, desc="Collecting Schedules")
    
    # Create directory if not exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    for line in LINES:
        current_directions = ["내선", "외선"] if line == "2호선" else DIRECTIONS
        
        for direction in current_directions:
            for day in DAYS:
                pbar.set_description(f"Processing {line} {direction} {day}")
                
                condition_data = []
                # Fallback filename for non-split lines
                filename = f"sonicmetro/data/{line}_{direction}_{day}.csv"
                
                # Fetch first page to get total count
                start_idx = 1
                end_idx = 1000
                
                safe_direction = quote(direction)
                safe_day = quote(day)
                safe_line = quote(line)
                
                # Correct URL format with double slash before N
                url = f"{BASE_URL}/{API_KEY}/json/getTrainSch/{start_idx}/{end_idx}//N/{safe_direction}/{safe_day}/{safe_line}"
                
                try:
                    response = requests.get(url)
                    time.sleep(0.2) # Reduced latency
                    
                    try:
                        data = response.json()
                    except Exception as json_err:
                        pbar.write(f"JSON Error for {line}-{direction}-{day}: {json_err} Content: {response.text[:50]}")
                        pbar.update(1)
                        continue
                    
                    items = []
                    total_count = 0
                    
                    # Logic to handle JSON structure
                    if "getTrainSch" in data:
                        wrapper = data["getTrainSch"]
                        if "row" in wrapper:
                            items = wrapper["row"]
                            total_count = wrapper.get("list_total_count", len(items))
                    elif "response" in data:
                        resp = data["response"]
                        if "body" in resp and "items" in resp["body"]:
                             body_items = resp["body"]["items"]
                             if isinstance(body_items, dict) and "item" in body_items:
                                 items = body_items["item"]
                             elif isinstance(body_items, list):
                                 items = body_items
                             total_count = resp["body"].get("totalCount", len(items))

                    if not items:
                        pbar.update(1)
                        continue
                    
                    condition_data.extend(items)
                    
                    # Pagination loop
                    if total_count > 1000:
                        current_count = len(items)
                        pbar.set_description(f"Processing {line} {direction} {day} ({current_count}/{total_count})")
                        
                        while current_count < total_count:
                            start_idx += 1000
                            end_idx += 1000
                            
                            url = f"{BASE_URL}/{API_KEY}/json/getTrainSch/{start_idx}/{end_idx}//N/{safe_direction}/{safe_day}/{safe_line}"
                            resp = requests.get(url)
                            time.sleep(0.4)
                            
                            try:
                                d = resp.json()
                            except:
                                pbar.write(f"Error parsing JSON for next page of {line} {direction} {day}")
                                break

                            new_items = []
                            if "getTrainSch" in d:
                                new_items = d["getTrainSch"].get("row", [])
                            elif "response" in d and "body" in d["response"]:
                                body_items = d["response"]["body"]["items"]
                                if isinstance(body_items, dict) and "item" in body_items:
                                    new_items = body_items["item"]
                                elif isinstance(body_items, list):
                                    new_items = body_items
                            
                            if not new_items:
                                break
                                
                            condition_data.extend(new_items)
                            current_count += len(new_items)
                
                except Exception as e:
                    pbar.write(f"Error fetching {line} {direction} {day}: {e}")
                
                # Handling Line 2 Branches
                if line == "2호선" and condition_data:
                    seongsu_stations = {"용답", "신답", "용두", "신설동"}
                    sinjeong_stations = {"도림천", "양천구청", "신정네거리", "까치산"}
                    
                    loop_data = []
                    seongsu_data = []
                    sinjeong_data = []
                    
                    # Group by train ID first
                    trains = {}
                    for row in condition_data:
                        tid = row.get("trainNo")
                        if tid not in trains: trains[tid] = []
                        trains[tid].append(row)
                        
                    for tid, rows in trains.items():
                        stops = {r.get("stnNm") for r in rows}
                        
                        # Debug first train
                        if tid == list(trains.keys())[0]:
                             pbar.write(f"  [Debug] Train {tid} stops: {list(stops)[:10]}")
                             pbar.write(f"  [Debug] Intersect Seongsu: {stops & seongsu_stations}")

                        if stops & seongsu_stations:
                            seongsu_data.extend(rows)
                        elif stops & sinjeong_stations:
                            sinjeong_data.extend(rows)
                        else:
                            loop_data.extend(rows)
                            
                    # Save
                    dir_suffix = "내선" if direction == "상행" else "외선"
                    
                    # Log Summary
                    pbar.write(f"\n[Summary: {line} {direction} {day}]")
                    pbar.write(f"  - {dir_suffix} (Loop): {len(loop_data):,} rows")
                    pbar.write(f"  - 성수지선: {len(seongsu_data):,} rows")
                    pbar.write(f"  - 신정지선: {len(sinjeong_data):,} rows")
                    pbar.write("-" * 40)

                    if loop_data:
                        save_csv(f"sonicmetro/data/{line}_{dir_suffix}_{day}.csv", loop_data, pbar)
                    if seongsu_data:
                        save_csv(f"sonicmetro/data/{line}_성수지선_{direction}_{day}.csv", seongsu_data, pbar)
                    if sinjeong_data:
                        save_csv(f"sonicmetro/data/{line}_신정지선_{direction}_{day}.csv", sinjeong_data, pbar)

                elif condition_data:
                    save_csv(filename, condition_data, pbar)
                else:
                    pbar.write(f"No data found for {line} {direction} {day}")
                
                pbar.update(1)
        
    pbar.close()
    print("All done!")


if __name__ == "__main__":
    fetch_data()
