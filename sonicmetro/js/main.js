import { SubwayMap } from './map.js?v=29';
import { DataManager } from './data.js?v=30';
import { SoundManager } from './sound.js?v=1';

const IMAGE_URL = 'images/subwaymap_sup.jpg';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("SonicMetro Initializing...");

    const map = new SubwayMap('map-container', IMAGE_URL);
    const dataManager = new DataManager();
    const soundManager = new SoundManager();

    // Animation State
    let isPlaying = false;
    let dayType = "평일"; // Default
    let speed = 60;
    let simulationTime = 18000;
    let lastFrameTime = 0;

    // Event Queue
    let arrivalEvents = [];
    let nextEventIndex = 0;

    // Train State for Pitch Shifting
    let trainStates = new Map();

    // UI Elements
    const clock = document.getElementById('clock');
    const timeDisplayCenter = document.getElementById('time-display-left');
    const playBtn = document.getElementById('btn-play');
    const pauseBtn = document.getElementById('btn-pause');
    const resetBtn = document.getElementById('btn-reset');
    const exportBtn = document.getElementById('btn-export');
    const speedInput = document.getElementById('speed-range');
    const speedVal = document.getElementById('speed-val');

    const dayToggle = document.getElementById('day-toggle');
    const timeSlider = document.getElementById('time-slider');

    // Controls - Initialize listeners early
    // Controls - Initialize listeners early
    playBtn.addEventListener('click', async () => {
        isPlaying = true;
        await soundManager.init(); // Init on user gesture
    });
    pauseBtn.addEventListener('click', () => isPlaying = false);

    resetBtn.addEventListener('click', () => {
        isPlaying = false;
        updateTimeRange(); // Resets to min
        map.renderTrains([]);
        nextEventIndex = 0; // Reset events
        trainStates.clear(); // Reset pitch states
    });

    exportBtn.addEventListener('click', () => {
        const trainsArray = Array.from(dataManager.trains.entries());
        const jsonStr = JSON.stringify(trainsArray, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "train_schedule_debug.json";
        a.click();
        URL.revokeObjectURL(url);
    });
    speedInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        speed = val * 60;
        speedVal.textContent = val + 'x';
    });

    dayToggle.addEventListener('click', () => {
        dayType = dayType === "평일" ? "주말" : "평일";
        dayToggle.textContent = dayType;
        isPlaying = false;

        // Regenerate Events for new Day
        arrivalEvents = generateArrivalEvents(dataManager.trains, dayType);
        console.log(`Switched to ${dayType}. Generated ${arrivalEvents.length} events.`);

        updateTimeRange();
        map.renderTrains([]);
    });

    timeSlider.addEventListener('input', (e) => {
        simulationTime = parseFloat(e.target.value);
        updateClock();

        // Sync Event Index (Binary Search or Linear)
        // Simple Linear for now as performance is likely fine
        nextEventIndex = arrivalEvents.findIndex(ev => ev.time > simulationTime);
        if (nextEventIndex === -1) nextEventIndex = arrivalEvents.length;

        if (!isPlaying) {
            renderFrame(simulationTime);
        }
    });

    // Initialize Map
    try {
        await map.init();
    } catch (e) {
        console.error("Map Init Critical Failure:", e);
        alert("Map failed to load. Check console.");
    }

    // Data Manager
    // Data Manager
    dataManager.loadAllData().then(() => {
        console.log(`Initialized with ${dataManager.trains.size} trains.`);

        // Prepare Event Queue
        arrivalEvents = generateArrivalEvents(dataManager.trains, dayType);
        console.log(`Generated ${arrivalEvents.length} arrival events for ${dayType}.`);

        updateTimeRange();
        requestAnimationFrame(loop);
    });

    function generateArrivalEvents(trains, currentDayType) {
        const events = [];
        for (const [id, train] of trains) {
            if (train.dayType !== currentDayType) continue; // Filter by day
            if (!train.schedule) continue;
            train.schedule.forEach(stop => {
                // We use arrival time. If undefined (first station), use departure?
                // Actually usually arrival is defined except start. 
                // We want sound on arrival.
                if (stop.arrivalSeconds) {
                    // console.log("Added Event:", stop); // Debug
                    events.push({
                        time: stop.arrivalSeconds, // Use numeric seconds!
                        line: train.line,
                        station: stop.station,
                        trainId: id,
                        express: train.express
                    });
                }
            });
        }

        // Sort by time
        return events.sort((a, b) => a.time - b.time);
    }

    function updateTimeRange() {
        const { min, max } = dataManager.getMinMaxTime(dayType);
        timeSlider.min = min;
        timeSlider.max = max;
        // Reset to start
        simulationTime = min;
        timeSlider.value = min;

        // Reset Event Index
        nextEventIndex = arrivalEvents.findIndex(ev => ev.time >= min);
        if (nextEventIndex === -1) nextEventIndex = 0;
        updateClock();
    }


    timeSlider.addEventListener('input', (e) => {
        simulationTime = parseFloat(e.target.value);
        updateClock();
        // Force render when paused
        if (!isPlaying) {
            renderFrame(simulationTime);
        }
    });

    function formatTime(seconds) {
        // Handle > 24h: show as 25:00:00 per user request

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function updateClock() {
        const timeStr = formatTime(simulationTime);
        if (clock) clock.textContent = timeStr;
        if (timeDisplayCenter) timeDisplayCenter.textContent = timeStr;
    }

    // Rendering Logic
    function renderFrame(time) {
        // Using current dayType
        const activeTrains = dataManager.getActiveTrains(time, dayType).filter(t => t !== null);

        if (Math.floor(time) % 10 === 0 && !window.loggedOnce) {
            console.log(`Time: ${formatTime(time)}, Active Trains: ${activeTrains.length}`);
            window.loggedOnce = true;
            setTimeout(() => window.loggedOnce = false, 1000);
        }

        const renderData = activeTrains.map(t => {
            if (!t) return null;
            const prev = map.getStationCoords(t.prevStation, t.line);
            const next = map.getStationCoords(t.nextStation, t.line);

            if (!prev || !next) return null;

            // Interpolate X, Y
            const x = prev.x + (next.x - prev.x) * t.progress;
            const y = prev.y + (next.y - prev.y) * t.progress;

            // Calculate Angle
            let angle = 0;
            let dx = 0;
            let dy = 0;

            if (t.status === 'STOPPED' && t.headingTo) {
                const head = map.getStationCoords(t.headingTo, t.line);
                if (head) {
                    dx = head.x - prev.x;
                    dy = head.y - prev.y;
                }
            } else {
                dx = next.x - prev.x;
                dy = next.y - prev.y;
            }

            if (dx !== 0 || dy !== 0) {
                angle = Math.atan2(dy, dx) * 180 / Math.PI;
                angle += 90; // Adjust because our pentagon points UP (0 deg)
            }
            // Else stopped: keep 0

            return {
                trainId: t.trainId,
                line: t.line,
                branch: t.branch,
                x: x,
                y: y,
                angle: angle,
                express: t.express
            };
        }).filter(t => t !== null);

        map.renderTrains(renderData);
    }

    // Animation Loop
    function loop(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const dt = (timestamp - lastFrameTime) / 1000; // seconds
        lastFrameTime = timestamp;

        if (isPlaying) {
            try {
                simulationTime += dt * speed;

                // Reset at slider max (end of schedule), not 24h
                const maxTime = parseFloat(timeSlider.max) || 86400;
                if (simulationTime >= maxTime) {
                    simulationTime = parseFloat(timeSlider.min) || 0;
                }

                updateClock();
                timeSlider.value = simulationTime; // Sync slider

                // Process Events
                while (nextEventIndex < arrivalEvents.length && arrivalEvents[nextEventIndex].time <= simulationTime) {
                    const ev = arrivalEvents[nextEventIndex];

                    // debug logging for first few events
                    if (nextEventIndex % 50 === 0) {
                        console.log("Checking Event:", ev, "Enabled:", map.enabledStations.has(ev.station));
                    }

                    // Trigger Logic
                    // 1. Check if station enabled
                    // 2. Check if line enabled

                    // Track consecutive enabled stations
                    // trainStates is defined in outer scope

                    if (!map.disabledLines.has(ev.line)) {
                        const state = trainStates.get(ev.trainId) || { count: 0 };

                        if (map.enabledStations.has(ev.station)) {
                            state.count++;

                            // Determine Direction Step
                            // Get train direction from dataManager
                            const trainData = dataManager.trains.get(ev.trainId);
                            let direction = trainData ? trainData.direction : "상행";

                            // Direction mapping
                            // Up/Inner (상행, 내선) -> Positive
                            // Down/Outer (하행, 외선) -> Negative
                            const isPositive = (direction === "상행" || direction === "내선") || (trainData && trainData.line === "6호선"); // Line 6 acts as loop/one-way effectively? Check data.
                            // Actually Line 6 is "상행" for loop. "하행" is entering? 
                            // data.js says: if 6호선 -> direction = "상행". So always positive. Correct.

                            // Modulo 8 logic (0 to 7)
                            let stepIndex = (state.count - 1) % 8;

                            let pitchStep = isPositive ? stepIndex : -stepIndex;

                            // Play Sound with Pitch Step
                            soundManager.playTone(ev.line, ev.express, pitchStep);

                            // Visual Effect
                            const coords = map.getStationCoords(ev.station, ev.line);
                            if (coords) {
                                map.triggerStationEffect(coords.x, coords.y);
                            }
                        } else {
                            // Reset count if station is disabled
                            state.count = 0;
                        }
                        trainStates.set(ev.trainId, state);
                    }

                    nextEventIndex++;
                }

            } catch (error) {
                console.error("Error in animation loop:", error);
            }
        }

        // Always render (allows for smooth dragging if we wanted, though drag updates via event)
        // But here we render animation frame
        if (isPlaying) {
            renderFrame(simulationTime);
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
});
