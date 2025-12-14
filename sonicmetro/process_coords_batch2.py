
# Raw coordinates from user (Guil -> Incheon)
raw_coords = [
    {"x": 599, "y": 1314}, {"x": 570, "y": 1315}, {"x": 541, "y": 1315}, {"x": 501, "y": 1315},
    {"x": 469, "y": 1315}, {"x": 442, "y": 1315}, {"x": 390, "y": 1314}, {"x": 345, "y": 1315},
    {"x": 300, "y": 1314}, {"x": 252, "y": 1315}, {"x": 212, "y": 1315}, {"x": 182, "y": 1336},
    {"x": 182, "y": 1362}, {"x": 181, "y": 1385}, {"x": 182, "y": 1424}, {"x": 182, "y": 1478},
    {"x": 182, "y": 1503}, {"x": 181, "y": 1527}, {"x": 182, "y": 1554}, {"x": 182, "y": 1579}
]

station_names = [
    "구일", "개봉", "오류동", "온수", "역곡", "소사", "부천", "중동", "송내", "부개",
    "부평", "백운", "동암", "간석", "주안", "도화", "제물포", "도원", "동인천", "인천"
]

def refine_coords(coords):
    refined = []
    if not coords:
        return refined
    
    # Start with first point
    curr = coords[0]
    refined.append(curr)
    
    for i in range(1, len(coords)):
        prev = refined[-1]
        target = coords[i]
        
        rx, ry = target['x'], target['y']
        px, py = prev['x'], prev['y']
        
        # 1. Unify close coordinates (1-3 pixels)
        if abs(rx - px) <= 3:
            rx = px
        if abs(ry - py) <= 3:
            ry = py
            
        target['x'] = rx
        target['y'] = ry
        refined.append(target)
    
    return refined

if __name__ == "__main__":
    refined = refine_coords(raw_coords)
    
    if len(refined) != len(station_names):
        print(f"// Warning: Coords {len(refined)} != Names {len(station_names)}")
    
    for i in range(min(len(refined), len(station_names))):
        name = station_names[i]
        c = refined[i]
        print(f"    {{ name: \"{name}\", x: {c['x']}, y: {c['y']} }},")
