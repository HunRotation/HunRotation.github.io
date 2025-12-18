export class DataManager {
    constructor() {
        this.trains = new Map();
    }

    async loadAllData() {
        const files = [
            "data/1호선_상행_평일.csv",
            "data/1호선_하행_평일.csv",
            "data/1호선_상행_주말.csv",
            "data/1호선_하행_주말.csv",
            "data/2호선_내선_평일.csv",
            "data/2호선_외선_평일.csv",
            "data/2호선_내선_주말.csv",
            "data/2호선_외선_주말.csv",
            "data/3호선_상행_평일.csv",
            "data/3호선_하행_평일.csv",
            "data/3호선_상행_주말.csv",
            "data/3호선_하행_주말.csv",
            "data/4호선_상행_평일.csv",
            "data/4호선_하행_평일.csv",
            "data/4호선_상행_주말.csv",
            "data/4호선_하행_주말.csv",
            "data/5호선_상행_평일.csv",
            "data/5호선_하행_평일.csv",
            "data/5호선_상행_주말.csv",
            "data/5호선_하행_주말.csv",
            "data/6호선_상행_평일.csv",
            "data/6호선_하행_평일.csv",
            "data/6호선_상행_주말.csv",
            "data/6호선_하행_주말.csv",
            "data/7호선_상행_평일.csv",
            "data/7호선_하행_평일.csv",
            "data/7호선_상행_주말.csv",
            "data/7호선_하행_주말.csv",
            "data/8호선_상행_평일.csv",
            "data/8호선_하행_평일.csv",
            "data/8호선_상행_주말.csv",
            "data/8호선_하행_주말.csv",
            "data/9호선_상행_평일.csv",
            "data/9호선_하행_평일.csv",
            "data/9호선_상행_주말.csv",
            "data/9호선_하행_주말.csv",
            "data/경의중앙선_상행_평일.csv",
            "data/경의중앙선_하행_평일.csv",
            "data/경의중앙선_상행_주말.csv",
            "data/경의중앙선_하행_주말.csv"
        ];

        try {
            // Use map to catch individual errors so one failure doesn't break all
            const promises = files.map(url =>
                this.fetchCsv(url).catch(e => {
                    console.warn(`Failed to load ${url}:`, e);
                    return []; // Return empty array on failure
                })
            );
            const results = await Promise.all(promises);

            // Process each file
            results.forEach(rows => this.processRows(rows));

            this.finalize();

            console.log(`Loaded ${this.trains.size} unique trains.`);
            return this.trains;
        } catch (e) {
            console.error("Failed to load data:", e);
        }
    }

    async fetchCsv(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
        const text = await response.text();
        return this.parseCsv(text);
    }

    parseCsv(text) {
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');

        return lines.slice(1).map(line => {
            const values = line.split(','); // Simple split, assumes no commas in values
            const obj = {};
            headers.forEach((h, i) => {
                let val = values[i] ? values[i].trim() : "";
                // Normalize Unicode (NFC) to handle Mac/Linux CSV differences
                if (val) val = val.normalize('NFC');
                obj[h.trim()] = val;
            });
            return obj;
        });
    }

    processRows(rows) {
        rows.forEach(row => {
            // Group by lnkgTrainno if available, else trainno
            let id = row.lnkgTrainno;

            // Line 6 Link Logic: Up (Sinnae->Eungam) uses lnkgTrainno, Down uses trainno
            if (row.lineNm === "6호선") {
                if (row.upbdnbSe === "하행") {
                    id = row.trainno;
                }
            }

            // Line 1 Separation Logic: force trainno to prevent schedule splitting
            if (row.lineNm === "1호선") {
                id = row.trainno;
            }

            // Filter out known status messages or invalid IDs (Hangul/Special chars often indicate status)
            // '입고' = Entering Depot, '기감' = Base Entering?
            // If it contains Korean characters, it's likely not a valid unique Train ID for linking.
            if (!id || id.trim() === "" || /[가-힣]/.test(id)) {
                id = row.trainno; // Fallback to single train number
            }

            if (!id) return;

            // composite key to separate Weekday/Weekend AND Line (to avoid 2호선 vs 5호선 collision)
            let lineKeyVal = row.lineNm;
            if (lineKeyVal === "경의선" || lineKeyVal === "중앙선") lineKeyVal = "경의중앙선";

            const key = `${id}_${row.wkndSe}_${lineKeyVal}`;

            if (!this.trains.has(key)) {
                let branch = row.brlnNm;
                if (row.lineNm === "2호선") {
                    if (branch.includes("성수지선")) branch = "2호선_성수";
                    else if (branch.includes("신정지선")) branch = "2호선_신정";
                    else branch = "2호선"; // Main Loop
                }
                if (row.lineNm === "3호선") branch = "3호선";
                if (row.lineNm === "6호선") branch = "6호선";
                if (row.lineNm === "7호선") branch = "7호선";
                if (row.lineNm === "8호선") branch = "8호선";
                if (row.lineNm === "9호선") branch = "9호선";
                if (lineKeyVal === "경의중앙선") branch = "경의중앙선";


                // Line 6 is a loop, so we treat it as single direction effectively for visualization/linking
                let direction = row.upbdnbSe;
                if (row.lineNm === "6호선") direction = "상행";

                this.trains.set(key, {
                    id: id,
                    uniqueId: key,
                    line: lineKeyVal, // Use normalized line name (e.g. "경의중앙선")
                    branch: branch,
                    direction: direction,
                    dayType: row.wkndSe,
                    schedule: [],
                    origin: row.dptreStnNm,
                    dest: row.arvlStnNm,
                    express: row.etrnYn === "Y"
                });
            }

            const train = this.trains.get(key);

            if (row.trainArvlTm || row.trainDptreTm) {
                train.schedule.push({
                    station: row.stnNm,
                    arrival: row.trainArvlTm,
                    departure: row.trainDptreTm,
                    arrivalSeconds: this.timeToSeconds(row.trainArvlTm),
                    departureSeconds: this.timeToSeconds(row.trainDptreTm),
                    // Use sort order from file if possible, or infer from time
                    sortTime: this.timeToSeconds(row.trainArvlTm) || this.timeToSeconds(row.trainDptreTm)
                });
            }
        });
    }

    finalize() {
        this.trains.forEach(train => {
            // Sort schedule by time
            train.schedule.sort((a, b) => a.sortTime - b.sortTime);

            // Remove duplicates (exact same station and times)
            train.schedule = train.schedule.filter((s, i, arr) => {
                if (i === 0) return true;
                const prev = arr[i - 1];
                return !(s.station === prev.station && s.sortTime === prev.sortTime);
            });

            // Trim schedule to start from 'origin' and end at 'dest'
            const startIdx = train.schedule.findIndex(s => s.station === train.origin);
            const endIdx = train.schedule.findLastIndex(s => s.station === train.dest);

            if (startIdx !== -1 && endIdx !== -1 && endIdx >= startIdx) {
                // For Line 6, we concatenate schedules (Up + Loop + Down).
                // The 'dest' might be set to 'Eungam' from the Up schedule, but the train continues.
                // So we should NOT slice off the end for Line 6.
                if (train.line === "6호선") {
                    train.schedule = train.schedule.slice(startIdx);
                } else {
                    train.schedule = train.schedule.slice(startIdx, endIdx + 1);
                }
            }

            // Merge consecutive duplicate stations (e.g. Eungam Arrival + Eungam Departure separate entries)
            for (let i = 0; i < train.schedule.length - 1; i++) {
                const curr = train.schedule[i];
                const next = train.schedule[i + 1];

                if (curr.station.trim() === next.station.trim()) {
                    // Merge: Use curr.arrival (if exists) and next.departure (if exists)
                    // If curr has no arrival, it keeps it (likely start of line).
                    // If next has no departure, it keeps it (likely end of line).

                    if (!next.departureSeconds && curr.departureSeconds) {
                        next.departure = curr.departure;
                        next.departureSeconds = curr.departureSeconds;
                    }

                    // Construct merged node
                    const merged = {
                        ...curr,
                        departure: next.departure || curr.departure,
                        departureSeconds: next.departureSeconds || curr.departureSeconds,
                        sortTime: curr.sortTime // Keep original sort time
                    };

                    // Replace i with merged, remove i+1
                    train.schedule.splice(i, 2, merged);
                    i--; // Re-check this index against new next
                }
            }

            // Split trains if there is a massive time gap (> 20 mins)
            if (train.line === "1호선" || train.line === "Line1") {
                for (let i = 0; i < train.schedule.length - 1; i++) {
                    const curr = train.schedule[i];
                    const next = train.schedule[i + 1];
                    const diff = (next.arrivalSeconds || next.departureSeconds) - (curr.departureSeconds || curr.arrivalSeconds);

                    if (diff > 1200) { // 20 minutes check
                        // We found a gap. The schedule from i+1 onwards should be a NEW train.
                        const newSchedule = train.schedule.slice(i + 1);
                        train.schedule = train.schedule.slice(0, i + 1); // Truncate original

                        // Create new train entry
                        if (newSchedule.length > 0) {
                            const suffix = `_part${Date.now()}_${Math.floor(Math.random() * 1000)}`;
                            const newKey = `${train.uniqueId}${suffix}`;

                            this.trains.set(newKey, {
                                ...train,
                                id: train.id,
                                uniqueId: newKey,
                                schedule: newSchedule
                            });
                            // Note: We don't recurse here, assuming one split is enough for now.
                        }
                        break; // Stop checking this train since we truncated it.
                    }
                }
            }

            if (train.line === "1호선" || train.line === "Line1" || train.uniqueId.includes("1호선")) {
                for (let i = 0; i < train.schedule.length - 1; i++) {
                    const curr = train.schedule[i];
                    const next = train.schedule[i + 1];
                    const diff = (next.arrivalSeconds || next.departureSeconds) - (curr.departureSeconds || curr.arrivalSeconds);
                    if (diff > 1200) { // 20 minutes
                        console.warn(`[Suspicious Gap] Train ${train.uniqueId} (${train.id}): ${curr.station}(${curr.departure || curr.arrival}) -> ${next.station}(${next.arrival || next.departure}) takes ${Math.floor(diff / 60)} mins`);
                    }
                }
            }
        });
    }

    getActiveTrains(simTime, dayType) {
        const active = [];
        this.trains.forEach(train => {
            if (train.dayType !== dayType) return;
            if (train.schedule.length < 2) return;

            // Check if within time range of the whole schedule
            const start = train.schedule[0].sortTime;
            const end = train.schedule[train.schedule.length - 1].sortTime;

            if (simTime >= start && simTime <= end) {
                // Determine current segment
                // Find the segment where simTime is between Departure(i) and Arrival(i+1) -> Moving
                // OR between Arrival(i) and Departure(i) -> Stopped

                let status = 'UNKNOWN';
                let prevStation = null;
                let nextStation = null;
                let progress = 0;
                let headingTo = null;

                for (let i = 0; i < train.schedule.length; i++) {
                    const stop = train.schedule[i];
                    const nextStop = train.schedule[i + 1];

                    // Case 1: At Station (Stopped)
                    // If simTime is between Arr and Dep of this stop
                    if (stop.arrivalSeconds && stop.departureSeconds) {
                        if (simTime >= stop.arrivalSeconds && simTime <= stop.departureSeconds) {
                            status = 'STOPPED';
                            prevStation = stop.station;
                            nextStation = stop.station; // Same station
                            // Heading to next station to allow orientation calculation
                            headingTo = nextStop ? nextStop.station : null;
                            progress = 0;
                            break;
                        }
                    }

                    // Case 2: Moving to next station
                    if (nextStop) {
                        const dep = stop.departureSeconds || stop.arrivalSeconds; // fallback
                        const arr = nextStop.arrivalSeconds || nextStop.departureSeconds;

                        if (simTime >= dep && simTime <= arr) {
                            status = 'MOVING';
                            prevStation = stop.station;
                            nextStation = nextStop.station;
                            headingTo = nextStop.station;
                            const duration = arr - dep;
                            progress = (duration > 0) ? (simTime - dep) / duration : 1;
                            break;
                        }
                    }
                }

                if (status !== 'UNKNOWN') {
                    active.push({
                        trainId: train.uniqueId,
                        line: train.line,
                        branch: train.branch, // Pass branch for coloring
                        express: train.express,
                        prevStation,
                        nextStation,
                        headingTo,
                        progress,
                        status
                    });
                }
            }
        });
        return active;
    }

    timeToSeconds(timeStr) {
        if (!timeStr) return null;
        const [h, m, s] = timeStr.split(':').map(Number);
        return h * 3600 + m * 60 + (s || 0);
    }

    getMinMaxTime(dayType) {
        let min = Infinity;
        let max = -Infinity;
        this.trains.forEach(t => {
            if (t.dayType !== dayType) return;
            if (t.schedule.length > 0) {
                const start = t.schedule[0].sortTime;
                const end = t.schedule[t.schedule.length - 1].sortTime;
                // Ignore start times < 04:00 (14400s) to avoid 00:00 artifacts
                if (start > 14400) {
                    if (start < min) min = start;
                }
                if (end > max) max = end;
            }
        });
        // Default range if no data found (e.g. 05:00 to 01:00 next day)
        if (min === Infinity) return { min: 5 * 3600, max: 25 * 3600 };
        return { min, max };
    }

    getTrainCount(dayType) {
        let count = 0;
        this.trains.forEach(t => {
            if (t.dayType === dayType) count++;
        });
        return count;
    }
}
