import math

# Raw coordinates from user
raw_coords = [
    {"x": 1929, "y": 55}, {"x": 1896, "y": 55}, {"x": 1863, "y": 55}, {"x": 1829, "y": 55},
    {"x": 1796, "y": 55}, {"x": 1763, "y": 55}, {"x": 1729, "y": 54}, {"x": 1696, "y": 55},
    {"x": 1664, "y": 71}, {"x": 1647, "y": 88}, {"x": 1632, "y": 103}, {"x": 1615, "y": 121},
    {"x": 1599, "y": 137}, {"x": 1566, "y": 170}, {"x": 1539, "y": 197}, {"x": 1506, "y": 229},
    {"x": 1474, "y": 261}, {"x": 1454, "y": 281}, {"x": 1434, "y": 301}, {"x": 1413, "y": 323},
    {"x": 1413, "y": 361}, {"x": 1413, "y": 390}, {"x": 1413, "y": 412}, {"x": 1413, "y": 456},
    {"x": 1413, "y": 494}, {"x": 1413, "y": 524}, {"x": 1413, "y": 554}, {"x": 1372, "y": 593},
    {"x": 1326, "y": 595}, {"x": 1264, "y": 595}, {"x": 1195, "y": 595}, {"x": 1098, "y": 595},
    {"x": 1020, "y": 595}, {"x": 941, "y": 594}, {"x": 843, "y": 633}, {"x": 844, "y": 687},
    {"x": 992, "y": 873}, {"x": 978, "y": 970}, {"x": 924, "y": 1077}, {"x": 924, "y": 1175},
    {"x": 857, "y": 1225}, {"x": 769, "y": 1225}, {"x": 714, "y": 1264}, {"x": 669, "y": 1313},
    {"x": 623, "y": 1315} 
]

# Correct 45 stations
station_names = [
    "연천", "전곡", "청산", "소요산", "동두천", "보산", "동두천중앙", "지행", "덕정", "덕계", "양주",
    "녹양", "가능", "의정부", "회룡", "망월사", "도봉산", "도봉", "방학", "창동", "녹천",
    "월계", "광운대", "석계", "신이문", "외대앞", "회기", "청량리", "제기동", "신설동", "동묘앞",
    "동대문", "종로5가", "종로3가", "종각", "시청", "서울역", "남영", "용산", "노량진", "대방",
    "신길", "영등포", "신도림", "구로"
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
    
    # Check length match
    if len(refined) != len(station_names):
        print(f"// Warning: Coords {len(refined)} != Names {len(station_names)}")
    
    # Print JS output
    print("export const stations = [")
    for i in range(min(len(refined), len(station_names))):
        name = station_names[i]
        c = refined[i]
        print(f"    {{ name: \"{name}\", x: {c['x']}, y: {c['y']} }},")
    print("];")
