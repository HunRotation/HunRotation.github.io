import requests
from urllib.parse import quote

API_KEY = "50514268696b6f673437644a755a73"
line = "2호선"
directions = ["내선", "외선", "상행", "하행"]

print(f"Testing Line: {line}")

for d in directions:
    print(f"\n--- Testing Direction: {d} ---")
    url = f"http://openapi.seoul.go.kr:8088/{API_KEY}/json/getTrainSch/1/500//N/{quote(d)}/{quote('평일')}/{quote(line)}"
    
    try:
        r = requests.get(url)
        if r.status_code != 200:
            print(f"HTTP Error {r.status_code}")
            continue
            
        data = r.json()
        items = []
        if "getTrainSch" in data and "row" in data["getTrainSch"]:
            items = data["getTrainSch"]["row"]
        elif "response" in data and "body" in data["response"] and "items" in data["response"]["body"]:
            val = data["response"]["body"]["items"].get("item")
            items = val if isinstance(val, list) else [val]
            
        if not items:
            print("No data.")
            continue
        if items:
            print(f"Found {len(items)} items.")
            print("Keys:", list(items[0].keys())) # Debug keys
        # Check distinct line names
        line_names = set(item.get("lineNm") for item in items)
        print(f"Distinct Lines: {line_names}")
        
        # Check sample stations to identify branches
        stations = list(set(item.get("statnNm") for item in items))
        print(f"Sample Stations (5): {stations[:5]}")
        
    except Exception as e:
        print(f"Error: {e}")
