export type SfxName =
  | "click"
  | "select"
  | "place"
  | "reroll"
  | "rollStart"
  | "rollTick"
  | "teamReveal"
  | "matchStart"
  | "roundWin"
  | "roundLoss"
  | "roundBig"
  | "victory"
  | "defeat"
  | "champion";

const STORAGE_KEY = "vcd-sound-enabled";

type MaybeWindow = Window & typeof globalThis;

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let lastTickAt = 0;

function getWindow(): MaybeWindow | null {
  return typeof window === "undefined" ? null : window;
}

export function isSfxEnabled(): boolean {
  const w = getWindow();
  if (!w) return false;
  return w.localStorage.getItem(STORAGE_KEY) !== "0";
}

export function setSfxEnabled(enabled: boolean) {
  const w = getWindow();
  if (!w) return;
  w.localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
  w.dispatchEvent(new CustomEvent("vcd:sfx", { detail: { enabled } }));
}

function ensureContext(): AudioContext | null {
  const w = getWindow();
  if (!w) return null;

  const AudioCtor = w.AudioContext || (w as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;

  if (!audioCtx) {
    audioCtx = new AudioCtor();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.28;
    masterGain.connect(audioCtx.destination);
  }

  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }

  return audioCtx;
}

export function unlockSfx() {
  if (!isSfxEnabled()) return;
  ensureContext();
}

function envelope(gain: GainNode, start: number, attack: number, hold: number, release: number, peak = 0.5) {
  gain.gain.cancelScheduledValues(start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), start + attack);
  gain.gain.setValueAtTime(Math.max(0.0002, peak), start + attack + hold);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + hold + release);
}

function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  gainValue = 0.35,
  destination: AudioNode | null = masterGain,
) {
  if (!destination) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  osc.connect(gain);
  gain.connect(destination);
  envelope(gain, start, 0.008, Math.max(0.01, duration * 0.35), Math.max(0.02, duration * 0.55), gainValue);
  osc.start(start);
  osc.stop(start + duration + 0.06);
}

function sweep(
  ctx: AudioContext,
  from: number,
  to: number,
  start: number,
  duration: number,
  type: OscillatorType = "sawtooth",
  gainValue = 0.18,
) {
  if (!masterGain) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  envelope(gain, start, 0.015, duration * 0.25, duration * 0.75, gainValue);
  osc.start(start);
  osc.stop(start + duration + 0.08);
}

function noiseBurst(ctx: AudioContext, start: number, duration: number, gainValue = 0.16) {
  if (!masterGain) return;
  const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * duration)), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(900, start);
  filter.Q.value = 0.7;
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  envelope(gain, start, 0.006, duration * 0.18, duration * 0.82, gainValue);
  source.start(start);
  source.stop(start + duration + 0.03);
}

function arpeggio(ctx: AudioContext, notes: number[], start: number, step: number, type: OscillatorType, gainValue: number) {
  notes.forEach((freq, i) => tone(ctx, freq, start + i * step, step * 1.35, type, gainValue));
}

export function playSfx(name: SfxName) {
  if (!isSfxEnabled()) return;
  const ctx = ensureContext();
  if (!ctx) return;
  const now = ctx.currentTime + 0.01;

  switch (name) {
    case "click":
      tone(ctx, 520, now, 0.06, "triangle", 0.18);
      break;
    case "select":
      tone(ctx, 640, now, 0.08, "triangle", 0.22);
      tone(ctx, 980, now + 0.055, 0.1, "sine", 0.16);
      break;
    case "place":
      tone(ctx, 420, now, 0.08, "square", 0.18);
      tone(ctx, 760, now + 0.075, 0.12, "triangle", 0.2);
      noiseBurst(ctx, now + 0.01, 0.08, 0.08);
      break;
    case "reroll":
      sweep(ctx, 260, 920, now, 0.35, "sawtooth", 0.13);
      arpeggio(ctx, [420, 520, 660], now + 0.02, 0.055, "triangle", 0.13);
      break;
    case "rollStart":
      sweep(ctx, 110, 620, now, 0.55, "sawtooth", 0.16);
      noiseBurst(ctx, now, 0.32, 0.13);
      arpeggio(ctx, [240, 300, 380, 480], now + 0.06, 0.075, "square", 0.08);
      break;
    case "rollTick": {
      const w = getWindow();
      const stamp = w?.performance.now() ?? Date.now();
      if (stamp - lastTickAt < 95) return;
      lastTickAt = stamp;
      tone(ctx, 760 + Math.random() * 220, now, 0.045, "square", 0.09);
      break;
    }
    case "teamReveal":
      noiseBurst(ctx, now, 0.2, 0.12);
      arpeggio(ctx, [392, 523.25, 659.25, 783.99], now + 0.02, 0.095, "triangle", 0.2);
      tone(ctx, 196, now, 0.55, "sine", 0.12);
      break;
    case "matchStart":
      tone(ctx, 98, now, 0.18, "sine", 0.2);
      tone(ctx, 98, now + 0.22, 0.18, "sine", 0.22);
      sweep(ctx, 180, 780, now + 0.12, 0.5, "sawtooth", 0.1);
      break;
    case "roundWin":
      arpeggio(ctx, [523.25, 659.25, 783.99], now, 0.065, "triangle", 0.14);
      break;
    case "roundLoss":
      arpeggio(ctx, [392, 329.63, 261.63], now, 0.075, "sine", 0.12);
      break;
    case "roundBig":
      noiseBurst(ctx, now, 0.18, 0.12);
      arpeggio(ctx, [466.16, 622.25, 739.99, 932.33], now, 0.06, "square", 0.13);
      break;
    case "victory":
      noiseBurst(ctx, now, 0.24, 0.14);
      arpeggio(ctx, [392, 523.25, 659.25, 783.99, 1046.5], now + 0.02, 0.11, "triangle", 0.23);
      tone(ctx, 130.81, now, 1.0, "sine", 0.11);
      break;
    case "defeat":
      noiseBurst(ctx, now, 0.28, 0.08);
      arpeggio(ctx, [392, 349.23, 293.66, 246.94], now, 0.16, "sine", 0.18);
      sweep(ctx, 220, 90, now + 0.1, 0.85, "triangle", 0.12);
      break;
    case "champion":
      noiseBurst(ctx, now, 0.35, 0.15);
      arpeggio(ctx, [392, 523.25, 659.25, 783.99, 1046.5, 1318.51], now + 0.02, 0.105, "triangle", 0.22);
      tone(ctx, 196, now, 1.15, "sine", 0.13);
      tone(ctx, 392, now + 0.38, 0.85, "triangle", 0.12);
      break;
  }
}
