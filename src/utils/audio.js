import { audioMap } from './audioMap.js';

// Internal caches
const elevenLabsCache = {};
const preloadCache = {};

// Global playback state for cancellation
let currentAudio = null;
let cancelled = false;

let actx = null;
function initAudio() {
  if (!actx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    actx = new AudioContext();
  }
  if (actx.state === 'suspended') actx.resume();
}

function playTone(freq, type, duration, vol=0.1) {
  try {
    initAudio();
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, actx.currentTime);
    
    gain.gain.setValueAtTime(vol, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.start();
    osc.stop(actx.currentTime + duration);
  } catch (e) {}
}

export const sounds = {
  click: () => playTone(800, 'sine', 0.1, 0.05),
  correct: () => {
    playTone(600, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(800, 'sine', 0.2, 0.1), 100);
  },
  wrong: () => {
    playTone(300, 'square', 0.2, 0.05);
    setTimeout(() => playTone(250, 'square', 0.3, 0.05), 150);
  },
  celebrate: () => {
    [400, 500, 600, 800].forEach((f, i) => {
      setTimeout(() => playTone(f, 'sine', 0.2, 0.1), i * 150);
    });
  }
};

/**
 * Retrieves the URL for a given text segment.
 * 1. Static audioMap check
 * 2. Dynamic memory cache
 * 3. ElevenLabs API fallback (graceful null)
 */
export async function getAudioUrl(text) {
  if (audioMap[text]) return audioMap[text];
  if (elevenLabsCache[text]) return elevenLabsCache[text];

  // Dynamic fallback — would hit backend proxy in production
  console.warn(`[Audio] No pre-generated audio for: "${text}"`);
  return null;
}

/**
 * Plays a single text segment. Returns a promise that resolves when done.
 * Checks the `cancelled` flag between play calls.
 */
export async function speak(text) {
  if (cancelled) return;
  const url = await getAudioUrl(text);
  if (!url) return;

  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => { currentAudio = null; resolve(); };
    audio.onerror = () => { currentAudio = null; resolve(); }; // graceful
    audio.play().catch(() => resolve());
  });
}

/**
 * Preloads an array of segments for seamless playback.
 */
export async function preloadNarration(segments) {
  for (const segment of segments) {
    const url = await getAudioUrl(segment.text);
    if (url && !preloadCache[url]) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = url;
      preloadCache[url] = audio;
    }
  }
}

/**
 * Stops any currently playing narration immediately.
 */
export function stopNarration() {
  cancelled = true;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Plays an array of narration segments sequentially with look-ahead preloading.
 * Returns a cancellation handle: { cancel() }
 *
 * Usage:
 *   const handle = narrate(segments, audioEnabled);
 *   // later: handle.cancel();
 */
export function narrate(segments, audioEnabled = true) {
  if (!audioEnabled || !segments || segments.length === 0) {
    return { cancel: () => {} };
  }

  cancelled = false;
  let aborted = false;

  const run = async () => {
    // Preload first segment
    await getAudioUrl(segments[0].text);

    for (let i = 0; i < segments.length; i++) {
      if (cancelled || aborted) break;

      // Look-ahead preload
      if (i + 1 < segments.length) {
        getAudioUrl(segments[i + 1].text);
      }

      try {
        await speak(segments[i].text);
      } catch (e) {
        console.error(`Playback failed: "${segments[i].text}"`, e);
      }
    }
  };

  run();

  return {
    cancel: () => {
      aborted = true;
      stopNarration();
    }
  };
}
