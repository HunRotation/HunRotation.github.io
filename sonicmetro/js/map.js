import { Line1_Gyeongwon, Line1_Gyeongin, Line1_GyeongbuJanghang, Line2_Stations, Line2_Seongsu_Branch, Line2_Sinjeong_Branch, Line3_Stations, Line4_Stations, Line5_Hanam_Main, Line5_Macheon_Branch, Line6_Stations, Line6_Loop, Line7_Stations, Line8_Stations, Line9_Stations } from './stations.js?v=24';

export class SubwayMap {
    constructor(containerId, imageUrl) {
        this.container = document.getElementById(containerId);
        this.imageUrl = imageUrl;
        this.svg = null;
        this.g = null;

        // Store branches (Raw Data)
        this.branches = {
            gyeongwon: Line1_Gyeongwon,
            gyeongin: Line1_Gyeongin,
            gyeongbu: Line1_GyeongbuJanghang,
            line2_main: Line2_Stations || [],
            line2_seongsu: Line2_Seongsu_Branch || [],
            line2_sinjeong: Line2_Sinjeong_Branch || [],
            line3: Line3_Stations || [],
            line4: Line4_Stations || [],
            line5_main: Line5_Hanam_Main || [],
            line5_branch: Line5_Macheon_Branch || [],
            line6_main: Line6_Stations || [],
            line6_loop: Line6_Loop || [],
            line7: Line7_Stations || [],
            line8: Line8_Stations || [],
            line9: Line9_Stations || []
        };

        // Processed stations will be stored here
        this.allStations = [];
        this.stationMap = null;

        // Interaction State
        this.enabledStations = new Set(); // Start with no stations enabled
        this.disabledLines = new Set(); // Lines disabled
        this.lastToggleTime = 0;
    }

    // Helper to get natural dimensions
    loadImageDimensions(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
            img.onerror = (e) => reject(e);
            img.src = url;
        });
    }

    async init() {
        if (!this.container) {
            console.error("Map container not found!");
            return;
        }

        try {
            // 1. Load Image Metadata first
            console.log("Loading Map Image...");
            const dims = await this.loadImageDimensions(this.imageUrl);
            this.mapW = dims.width;
            this.mapH = dims.height;
            console.log(`Map Dimensions Loaded: ${this.mapW}x${this.mapH}`);

            // 2. Prepare SVG Container
            this.svg = d3.select(this.container)
                .append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .style("background-color", "#f0f0f0");

            // Background for Zoom Capture
            this.svg.append("rect")
                .attr("class", "zoom-bg")
                .attr("width", "100%")
                .attr("height", "100%")
                .style("fill", "none")
                .style("pointer-events", "all");

            // 3. Content Group
            this.g = this.svg.append("g");

            // 4. Layers (Order matters for Z-index)
            this.g.append("image") // Background Image
                .attr("href", this.imageUrl)
                .attr("width", this.mapW)
                .attr("height", this.mapH)
                .attr("x", 0)
                .attr("y", 0)
                .style("pointer-events", "none");

            this.layerConnections = this.g.append("g").attr("class", "layer-connections");
            this.layerStations = this.g.append("g").attr("class", "layer-stations");
            this.layerTrains = this.g.append("g").attr("class", "layer-trains");
            this.layerEffects = this.g.append("g").attr("class", "layer-effects");


            // 5. Process Coordinates (Dynamic Scaling)
            this.processStations();

            // 6. Render
            this.renderConnections();
            this.renderStations(this.allStations);

            // 7. Setup Zoom
            this.setupZoom();

            // 8. Initial UI Render
            this.renderActiveStationsList();

        } catch (err) {
            console.error("Failed to initialize map:", err);
            this.container.innerHTML = `<div style="color:red; p:20px;">Map Error: ${err.message}</div>`;
        }
    }

    processStations() {
        // Base resolution was 2048
        const BASE_RES = 2048;
        this.scaleFactor = this.mapW / BASE_RES;
        console.log(`Coordinate Scaling Factor: ${this.scaleFactor.toFixed(2)}`);

        // Helper to add line info if missing (though stations.js acts as source of truth for lines)
        const process = (stations, lineName) => stations.map(s => ({
            ...s,
            name: s.name.normalize('NFC'), // Normalize for safety
            line: lineName, // Attach line info effectively
            x: s.x * this.scaleFactor,
            y: s.y * this.scaleFactor
        }));

        const l1_gw = process(Line1_Gyeongwon, "1호선");
        const l1_gi = process(Line1_Gyeongin, "1호선");
        const l1_gb = process(Line1_GyeongbuJanghang, "1호선");
        const l2_m = process(Line2_Stations || [], "2호선");
        const l2_s = process(Line2_Seongsu_Branch || [], "2호선");
        const l2_si = process(Line2_Sinjeong_Branch || [], "2호선");
        const l3 = process(Line3_Stations || [], "3호선");
        const l4 = process(Line4_Stations || [], "4호선");
        const l5_m = process(Line5_Hanam_Main || [], "5호선");
        const l5_b = process(Line5_Macheon_Branch || [], "5호선");
        const l6_m = process(Line6_Stations || [], "6호선");
        const l6_l = process(Line6_Loop || [], "6호선");
        const l7 = process(Line7_Stations || [], "7호선");
        const l8 = process(Line8_Stations || [], "8호선");
        const l9 = process(Line9_Stations || [], "9호선");

        this.allStations = [...l1_gw, ...l1_gi, ...l1_gb, ...l2_m, ...l2_s, ...l2_si, ...l3, ...l4, ...l5_m, ...l5_b, ...l6_m, ...l6_l, ...l7, ...l8, ...l9];

        // Build efficient map: "StationName" -> { "1호선": coords, "3호선": coords }
        this.stationMap = new Map();
        this.allStations.forEach(s => {
            if (!this.stationMap.has(s.name)) {
                this.stationMap.set(s.name, {});
            }
            const entry = this.stationMap.get(s.name);
            entry[s.line] = s;
        });
    }

    setupZoom() {
        const cW = this.container.clientWidth || window.innerWidth || 800;
        const cH = this.container.clientHeight || window.innerHeight || 600;

        // Calculate fit scale
        const scale = Math.min(cW / this.mapW, cH / this.mapH) * 0.95;
        const tx = (cW - this.mapW * scale) / 2;
        const ty = (cH - this.mapH * scale) / 2;

        const zoom = d3.zoom()
            .scaleExtent([scale * 0.5, 8]) // Dynamic range based on fit
            .on("zoom", (e) => this.g.attr("transform", e.transform));

        this.svg.call(zoom);

        // Initial Transform
        this.svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));

        // Debug Click listener removed per user request
    }

    toggleStation(name) {
        const now = Date.now();
        if (this.lastToggleTime && (now - this.lastToggleTime < 300)) {
            return;
        }
        this.lastToggleTime = now;

        if (this.enabledStations.has(name)) {
            this.enabledStations.delete(name);
        } else {
            this.enabledStations.add(name);
        }
        this.renderStations(this.allStations);
        this.renderActiveStationsList();
    }

    renderActiveStationsList() {
        const container = document.getElementById('station-list-content');
        if (!container) return;

        if (this.enabledStations.size === 0) {
            container.innerHTML = '<div class="empty-state">Click stations to enable</div>';
            return;
        }

        // Group by Line
        const groups = {};
        const linesOrder = ["1호선", "2호선", "3호선", "4호선", "5호선", "6호선", "7호선", "8호선", "9호선"];

        // Iterate all active stations
        // We need to iterate ALL stations to find which lines the enabled names belong to
        this.allStations.forEach(s => {
            if (this.enabledStations.has(s.name)) {
                if (!groups[s.line]) groups[s.line] = [];
                // Avoid duplicates if data has multiple entries for same station on same line (unlikely but safe)
                if (!groups[s.line].includes(s.name)) {
                    groups[s.line].push(s.name);
                }
            }
        });

        let html = '';
        linesOrder.forEach(line => {
            if (groups[line] && groups[line].length > 0) {
                const color = this.getLineColor(line);
                const stationsStr = groups[line].join(', ');
                html += `
                    <div class="line-group">
                        <div class="line-header">
                            <span class="line-color-dot" style="background: ${color}"></span>
                            ${line}
                        </div>
                        <div class="station-items">${stationsStr}</div>
                    </div>
                `;
            }
        });

        // Handle lines not in explicit order (branches?) if any
        // For simplicity, we stick to main lines or add logic for branches if needed

        container.innerHTML = html;
    }

    getLineColor(line) {
        // Simple mapping based on Seoul Metro colors
        if (line.includes("1호선")) return "#0052A4";
        if (line.includes("2호선")) return "#00A84D";
        if (line.includes("3호선")) return "#EF7C1C";
        if (line.includes("4호선")) return "#00A4E3";
        if (line.includes("5호선")) return "#996CAC";
        if (line.includes("6호선")) return "#CD7C2F";
        if (line.includes("7호선")) return "#747F00";
        if (line.includes("8호선")) return "#E6186C";
        if (line.includes("9호선")) return "#BDB092";
        return "#999";
    }

    toggleLine(lineName) {
        // Find basic line name (e.g. "2호선")
        // lineName might be "line-2-main" or similar from class, or just "2호선"
        /*
           We will use a mapping or logic.
           Ref to getTrainColor logic:
           Lines are 1호선..9호선.
        */
        if (this.disabledLines.has(lineName)) {
            this.disabledLines.delete(lineName);
        } else {
            this.disabledLines.add(lineName);
        }
        // Re-render everything affected
        this.renderConnections();
        this.renderTrains([]); // Temporary clear or just let next frame handle it?
        // Actually, main loop handles train rendering. We just need connections update.
        // We should trigger a re-render of trains next frame.
    }

    // Ripple Effect
    triggerStationEffect(x, y) {
        const circle = this.layerEffects.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 5 * this.scaleFactor)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2 * this.scaleFactor);

        circle.transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("r", 30 * this.scaleFactor)
            .attr("stroke-opacity", 0)
            .on("end", () => circle.remove());
    }

    renderStations(stations) {
        // Dynamic styling based on scale
        const R = 3 * this.scaleFactor;
        const R_SEL = 6 * this.scaleFactor; // Bigger for enabled
        const STROKE = 1.5 * this.scaleFactor;

        // Filter for unique stations to check clicking issues
        // We prefer the one that appears first or just any, as coordinates are seemingly identical for interchanges
        // Actually, coordinates might differ slightly for some interchanges? 
        // For '종로3가', they are identical in stations.js (941, 593) for L1.
        // Let's verify L3/L5 coords in stations.js... 
        // L3: (942, 584) -> DIFFERENT!
        // L5: (941, 605) -> DIFFERENT!
        // Ah! They are NOT stacked perfectly. They are adjacent cluster.
        // So user sees 3 dots?
        // If user sees 3 dots, they must click ALL 3 to disable?
        // NO. `toggleStation` uses `name`.
        // If I click L1 dot -> `enabledStations` loses "종로3가".
        // L3 dot re-renders. Check `enabledStations.has("종로3가")` -> False. It turns white.
        // L5 dot re-renders. It turns white.

        // ISSUE: If I click L1 dot. It turns white.
        // Then I click L3 dot (which is now white).
        // It calls `toggleStation("종로3가")`.
        // "종로3가" is not in Set. So it ADDS it back.
        // So clicking ANY of the 3 dots toggles the GLOBAL state for that name.

        // This seems correct behavior for "Toggle by Name".
        // Why did the user feel it wasn't valid?
        // Maybe they clicked L1 (Disabled), then accidentally clicked L2 (Enabled)?
        // Or maybe they thought "I disabled THIS dot" but another dot nearby started flashing?
        // Actually, arrival event checks `enabledStations.has(stationName)`.
        // If ANY dot is enabled, sound plays.

        // WAIT. If I disable "종로3가", ALL 3 dots turn white.
        // Visually, it looks disabled.
        // But sound plays?
        // This implies `enabledStations` HAS "종로3가".
        // Which implies the user toggled it ON again.

        // Is it possible the Click event is bubbling to the map container?
        // We have `e.stopPropagation()`.

        // Maybe Debounce?

        this.layerStations.selectAll(".station-marker")
            .data(stations) // We keep all stations so they display correctly at their specific line positions
            .join("circle") // Modern D3
            .attr("class", "station-marker")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => this.enabledStations.has(d.name) ? R_SEL : Math.max(R, 3))
            .style("fill", d => this.enabledStations.has(d.name) ? "#FFD700" : "white") // Use style to override CSS
            .style("stroke", d => this.enabledStations.has(d.name) ? "black" : "#0052A4")
            .attr("stroke-width", Math.max(STROKE, 1))
            .style("cursor", "pointer")
            .on("click", (e, d) => {
                e.stopPropagation(); // Prevent map debug click
                this.toggleStation(d.name);
            });
    }

    renderConnections() {
        const PATH_W = 4 * this.scaleFactor;

        const line = d3.line().x(d => d.x).y(d => d.y);

        // Clear previous
        this.layerConnections.selectAll("*").remove();

        const pathGroup = this.layerConnections; // Work directly on the group

        const drawPath = (rawBranch, className, color) => {
            // Determine Line Name from color/context effectively?
            // Actually, we pass className like "line-gyeongwon". 
            // We need to map this to "1호선" etc to check disabledLines.
            let lineKey = "1호선"; // Default
            if (className.includes("line-2")) lineKey = "2호선";
            if (className.includes("line-3")) lineKey = "3호선";
            if (className.includes("line-4")) lineKey = "4호선";
            if (className.includes("line-5")) lineKey = "5호선";
            if (className.includes("line-6")) lineKey = "6호선";
            if (className.includes("line-7")) lineKey = "7호선";
            if (className.includes("line-8")) lineKey = "8호선";
            if (className.includes("line-9")) lineKey = "9호선";

            const isGray = this.disabledLines.has(lineKey);
            const finalColor = isGray ? "#CCCCCC" : (color || "#0052A4");

            // Must map raw branch to scaled coords
            const scaled = rawBranch.map(s => ({
                x: s.x * this.scaleFactor,
                y: s.y * this.scaleFactor
            }));

            pathGroup.append("path")
                .datum(scaled)
                .attr("class", className)
                .attr("fill", "none")
                .attr("stroke", finalColor) // Default blue if not specified, but usually overridden
                .attr("stroke-width", Math.max(PATH_W, 2))
                .attr("opacity", 0.5)
                .attr("d", line)
                .style("cursor", "pointer")
                .on("click", (e) => {
                    e.stopPropagation();
                    console.log("Clicked Line:", lineKey);
                    this.toggleLine(lineKey);
                });
        };

        drawPath(this.branches.gyeongwon, "line-gyeongwon", "#0052A4");

        const guroRaw = this.branches.gyeongwon.find(s => s.name === "구로");
        if (guroRaw && this.branches.gyeongin.length) {
            drawPath([guroRaw, ...this.branches.gyeongin], "line-gyeongin", "#0052A4");
        }
        if (guroRaw && this.branches.gyeongbu.length) {
            drawPath([guroRaw, ...this.branches.gyeongbu], "line-gyeongbu", "#0052A4");
        }

        // Line 2
        // Main Loop: Connect start to end to close the loop
        if (this.branches.line2_main.length > 0) {
            const loopData = [...this.branches.line2_main, this.branches.line2_main[0]];
            drawPath(loopData, "line-2-main", "#3CB44A");
        }
        // Branch Seongsu: Connected to Seongsu (Must find Seongsu in Main)
        const seongsu = this.branches.line2_main.find(s => s.name === "성수");
        if (seongsu && this.branches.line2_seongsu.length > 0) {
            // Yongdap(0) -> Seongsu (append Seongsu to start or end?)
            // Branch array starts with Yongdap.
            // Connect Seongsu -> Yongdap...
            drawPath([seongsu, ...this.branches.line2_seongsu], "line-2-seongsu", "#3CB44A");
        }
        // Branch Sinjeong: Connected to Sindorim
        const sindorim = this.branches.line2_main.find(s => s.name === "신도림");
        if (sindorim && this.branches.line2_sinjeong.length > 0) {
            // Dorimcheon(0) -> Sindorim
            drawPath([sindorim, ...this.branches.line2_sinjeong], "line-2-sinjeong", "#3CB44A");
        }

        // Line 3
        drawPath(this.branches.line3, "line-3", "#EF7C1C");

        // Line 4
        drawPath(this.branches.line4, "line-4", "#00A4E3");

        // Line 5
        drawPath(this.branches.line5_main, "line-5-main", "#996CAC");
        const gangdong = this.branches.line5_main.find(s => s.name === "강동");
        if (gangdong && this.branches.line5_branch.length) {
            drawPath([gangdong, ...this.branches.line5_branch], "line-5-branch", "#996CAC");
        }

        // Line 6
        drawPath(this.branches.line6_main, "line-6-main", "#CD7C2F");
        const eungam = this.branches.line6_main.find(s => s.name === "응암");
        if (eungam && this.branches.line6_loop.length) {
            // Loop: Eungam -> Yeokchon -> ... -> Gusan -> Eungam
            drawPath([eungam, ...this.branches.line6_loop, eungam], "line-6-loop", "#CD7C2F");
        }

        // Line 7
        drawPath(this.branches.line7, "line-7", "#747F00");

        // Line 8
        drawPath(this.branches.line8, "line-8", "#E6186C");

        // Line 9
        drawPath(this.branches.line9, "line-9", "#BDB092");
    }

    renderTrains(activeTrains) {
        const PENTAGON_SIZE = 6 * this.scaleFactor;

        const trains = this.layerTrains.selectAll(".train-marker")
            .data(activeTrains, d => d.trainId);

        trains.exit().remove();

        const enter = trains.enter()
            .append("path")
            .attr("class", "train-marker")
            .attr("fill", d => this.getTrainColor(d))
            .attr("stroke", "white")
            .attr("stroke-width", Math.max(1 * this.scaleFactor, 1));

        trains.merge(enter)
            .style("fill", d => this.getTrainColor(d))
            .attr("d", d => this.getPentagonPath(d, PENTAGON_SIZE))
            .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.angle})`);
    }

    getTrainColor(train) {
        // If line is disabled, return gray
        if (this.disabledLines.has(train.line)) return "#CCCCCC";

        if (train.express) return "red";

        if (train.line === "2호선" || train.branch === "2호선" || (train.branch && train.branch.includes("2호선"))) return "#3CB44A";
        if (train.line === "3호선" || train.branch === "3호선" || (train.branch && train.branch.includes("3호선"))) return "#EF7C1C";
        if (train.line === "4호선" || train.branch === "4호선" || (train.branch && train.branch.includes("4호선"))) return "#00A4E3";
        if (train.line === "5호선" || train.branch === "5호선" || (train.branch && train.branch.includes("5호선"))) return "#996CAC";
        if (train.line === "6호선" || train.branch === "6호선" || (train.branch && train.branch.includes("6호선"))) return "#CD7C2F";
        if (train.line === "7호선" || train.branch === "7호선" || (train.branch && train.branch.includes("7호선"))) return "#747F00";
        if (train.line === "8호선" || train.branch === "8호선" || (train.branch && train.branch.includes("8호선"))) return "#E6186C";
        if (train.line === "9호선" || train.branch === "9호선" || (train.branch && train.branch.includes("9호선"))) return "#BDB092";

        return "#0052A4";
    }

    getPentagonPath(d, s) {
        return `M ${-s},${s} L ${s},${s} L ${s},${-s} L ${0},${-s * 2} L ${-s},${-s} Z`;
    }

    getStationCoords(name, line) {
        if (!this.stationMap) {
            // Should be initialized in processStations, but failsafe
            return null;
        }

        const entry = this.stationMap.get(name);
        if (!entry) return null;

        // If line is provided, try to get specific coords
        if (line && entry[line]) {
            return entry[line];
        }

        // Fallback: Return first available (Object.values(entry)[0])
        // This handles cases where line might be slightly different or missing
        const values = Object.values(entry);
        return values.length > 0 ? values[0] : null;
    }
}
