import { SubwayMap } from './map.js?v=29';
import { DataManager } from './data.js?v=28';

const IMAGE_URL = 'images/subwaymap_sup.jpg';

document.addEventListener('DOMContentLoaded', async () => {
    console.log("SonicMetro Initializing...");

    const map = new SubwayMap('map-container', IMAGE_URL);
    const dataManager = new DataManager();

    // Animation State
    let isPlaying = false;
    let dayType = "평일"; // Default
    let speed = 60;
    let simulationTime = 18000;
    let lastFrameTime = 0;

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
    playBtn.addEventListener('click', () => isPlaying = true);
    pauseBtn.addEventListener('click', () => isPlaying = false);

    resetBtn.addEventListener('click', () => {
        isPlaying = false;
        updateTimeRange(); // Resets to min
        map.renderTrains([]);
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
        updateTimeRange();
        map.renderTrains([]);
    });

    timeSlider.addEventListener('input', (e) => {
        simulationTime = parseFloat(e.target.value);
        updateClock();
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
    dataManager.loadAllData().then(() => {
        console.log(`Initialized with ${dataManager.trains.size} trains.`);
        updateTimeRange();
        requestAnimationFrame(loop);
    });

    function updateTimeRange() {
        const { min, max } = dataManager.getMinMaxTime(dayType);
        timeSlider.min = min;
        timeSlider.max = max;
        // Reset to start
        simulationTime = min;
        timeSlider.value = min;
        updateClock();
    }

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
        speed = val * 60; // 1x = 60 seconds/sec
        speedVal.textContent = val + 'x';
    });

    dayToggle.addEventListener('click', () => {
        dayType = dayType === "평일" ? "주말" : "평일";
        dayToggle.textContent = dayType;
        isPlaying = false;
        updateTimeRange();
        map.renderTrains([]);
    });

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
