
import { Chuck } from 'https://cdn.jsdelivr.net/npm/webchuck/+esm';

export class SoundManager {
    constructor() {
        this.chuck = null;
        this.isReady = false;

        // C Lydian Scale: C, D, E, F#, G, A, B
        // C=0, D=2, E=4, F#=6, G=7, A=9, B=11
        this.lydianIntervals = [0, 2, 4, 6, 7, 9, 11];

        // Base mapping (Line -> Note Data)
        // We store the "Base Note" as [Octave, ScaleIndex] (0-6)
        // C4 is Octave 4.
        this.lineBases = {
            "1호선": { oct: 3, note: 5 }, // A3 (Index 5 in C3 Lydian)
            "2호선": { oct: 4, note: 2 }, // E4 (Index 2)
            "3호선": { oct: 4, note: 4 }, // G4 (Index 4)
            "4호선": { oct: 4, note: 6 }, // B4 (Index 6)
            "5호선": { oct: 5, note: 1 }, // D5 (Index 1)
            "6호선": { oct: 5, note: 3 }, // F#5 (Index 3)
            "7호선": { oct: 5, note: 5 }, // A5 (Index 5)
            "8호선": { oct: 5, note: 0 }, // C5 (Index 0) - Target Sound
            "9호선": { oct: 6, note: 2 },  // E6 (Index 2)
            "경의중앙선": { oct: 4, note: 1 } // D4 (Index 1) - StifKarp
        };
    }

    async init() {
        try {
            this.chuck = await Chuck.init([]);
            this.isReady = true;
            console.log("WebChucK Ready!");
        } catch (e) {
            console.error("WebChucK Init Failed:", e);
        }
    }

    getLydianFreq(octave, index) {
        while (index >= 7) {
            index -= 7;
            octave++;
        }
        while (index < 0) {
            index += 7;
            octave--;
        }

        const semitoneOffset = this.lydianIntervals[index];
        const totalSemitones = -9 + semitoneOffset + (octave - 4) * 12;
        return 440 * Math.pow(2, totalSemitones / 12);
    }

    getPatchCode(line, isExpress, pitchStep) {
        if (!line) return "";
        line = line.normalize('NFC');

        const DURATION_ON = isExpress ? "500::ms" : "150::ms";
        const DURATION_OFF = isExpress ? "500::ms" : "150::ms";
        const CHAIN_END = isExpress ? "=> JCRev rev => dac; 0.2 => rev.mix;" : "=> dac;";

        // Calculate Target Frequency
        let base = this.lineBases["1호선"]; // Default
        // Find line base
        for (const [key, val] of Object.entries(this.lineBases)) {
            if (line.includes(key)) {
                base = val;
                break;
            }
        }

        let targetOct = base.oct;
        let targetNote = base.note + pitchStep;

        let freq = this.getLydianFreq(targetOct, targetNote);

        if (line.includes("8호선")) {
            freq = freq * Math.pow(2, -7 / 12);
        }

        let patchBody = "";
        let type = "env"; // Default to envelope based

        // Instrument Selection (Keep existing)
        if (line.includes("1호선")) {
            patchBody = `SinOsc osc => ADSR env ${CHAIN_END} 0.2 => osc.gain; env.set(10::ms, 50::ms, 0.5, 100::ms); ${freq} => osc.freq;`;
            type = "env";
        } else if (line.includes("2호선")) {
            patchBody = `TriOsc osc => ADSR env ${CHAIN_END} 0.2 => osc.gain; env.set(10::ms, 50::ms, 0.5, 100::ms); ${freq} => osc.freq;`;
            type = "env";
        } else if (line.includes("3호선")) {
            patchBody = `SqrOsc osc => ADSR env ${CHAIN_END} 0.07 => osc.gain; env.set(10::ms, 50::ms, 0.5, 100::ms); ${freq} => osc.freq;`;
            type = "env";
        } else if (line.includes("4호선")) {
            patchBody = `SawOsc osc => LPF lpf => ADSR env ${CHAIN_END} 0.09 => osc.gain; 800 => lpf.freq; env.set(10::ms, 50::ms, 0.5, 100::ms); ${freq} => osc.freq;`;
            type = "env";
        } else if (line.includes("5호선")) {
            patchBody = `Rhodey voc ${CHAIN_END} 0.35 => voc.gain; ${freq} => voc.freq;`;
            type = "voc";
        } else if (line.includes("6호선")) {
            patchBody = `Wurley voc ${CHAIN_END} 0.25 => voc.gain; ${freq} => voc.freq;`;
            type = "voc";
        } else if (line.includes("7호선")) {
            patchBody = `Mandolin voc ${CHAIN_END} 0.35 => voc.gain; ${freq} => voc.freq;`;
            type = "voc";
        } else if (line.includes("8호선")) {
            patchBody = `PercFlut voc ${CHAIN_END} 0.35 => voc.gain; ${freq} => voc.freq;`;
            type = "voc";
        } else if (line.includes("9호선")) {
            patchBody = `Moog voc ${CHAIN_END} 0.5 => voc.gain; ${freq} => voc.freq;`;
            type = "voc";
        } else if (line.includes("경의")) {
            patchBody = `StifKarp voc ${CHAIN_END} 0.5 => voc.gain; ${freq} => voc.freq;`;
            type = "voc";
        }



        // Trigger Logic
        let triggerCode = "";
        if (type === "env") {
            triggerCode = `env.keyOn(); ${DURATION_ON} => now; env.keyOff(); ${DURATION_OFF} => now;`;
        } 
        else if (line.includes("경의")) {
            triggerCode = `1 => voc.noteOn; ${DURATION_ON} * 2 => now; 1 => voc.noteOff; ${DURATION_OFF} * 2 => now;`;
        }
        else {
            triggerCode = `1 => voc.noteOn; ${DURATION_ON} => now; 1 => voc.noteOff; ${DURATION_OFF} => now;`;
        }

        let finalCode = patchBody + triggerCode;

        finalCode = `{\n${finalCode}\n}`;



        return finalCode;
    }

    async playTone(line, isExpress = false, pitchStep = 0) {
        if (!this.isReady || !this.chuck) return;

        const code = this.getPatchCode(line, isExpress, pitchStep);

        if (code) {
            this.chuck.runCode(code).catch(e => console.error("WebChucK Run Error:", e));
        }
    }
}
