import csv

def get_station_order():
    # We need the order from Oido to Jinjeop.
    # Usually "Up" or "Down" has the sequence.
    # Let's look at unique stations in sequence from a train's schedule.
    
    filename = 'data/4호선_상행_평일.csv' # Check this first
    # Or 'data/4호선_하행_평일.csv'
    
    # We'll try to find a train that goes from Oido to Jinjeop (or close)
    # and extract its stops.
    
    files = ['data/4호선_상행_평일.csv', 'data/4호선_하행_평일.csv']
    
    longest_schedule = []
    
    for f in files:
        with open(f, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            # Group by trainNo
            trains = {}
            for row in reader:
                tid = row['trainno']
                if tid not in trains: trains[tid] = []
                trains[tid].append(row)
            
            for tid, rows in trains.items():
                # Sort by time
                try:
                    rows.sort(key=lambda x: x['trainArvlTm'] or x['trainDptreTm'])
                except:
                    continue
                    
                stations = [r['stnNm'] for r in rows]
                if '오이도' in stations and '진접' in stations:
                    # found a full traversal?
                    return stations
                
                if len(stations) > len(longest_schedule):
                    longest_schedule = stations

    return longest_schedule

stations = get_station_order()
print(f"Total Stations: {len(stations)}")
print(stations)
