import { audioMap } from './audioMap.js';

// ─── MP3 SFX Playback ───────────────────────────────────────────
const sfxCache = {};

function playSFX(name) {
  if (cancelled) return;
  try {
    let audio = sfxCache[name];
    if (!audio) {
      audio = new Audio(`/audio/sfx/${name}.mp3`);
      sfxCache[name] = audio;
    }
    // reset if already playing
    audio.currentTime = 0;
    const p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {});
    }
  } catch (e) {
    // Silently ignore
  }
}

export const sounds = {
  click: () => playSFX('click'),
  correct: () => playSFX('correct'),
  wrong: () => playSFX('wrong'),
  celebrate: () => playSFX('celebrate'),
};

// ─── Speech Synthesis (voices preload) ───────────────────────
let voicesLoaded = false;
let cachedVoices = [];

function loadVoices() {
  if (voicesLoaded) return;
  cachedVoices = window.speechSynthesis?.getVoices() || [];
  if (cachedVoices.length > 0) voicesLoaded = true;
}

// Browsers fire this event when voices are ready
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
    voicesLoaded = true;
  };
  // Also try immediately (some browsers resolve synchronously)
  loadVoices();
}

function pickVoice() {
  if (!voicesLoaded) loadVoices();
  // Prefer a natural-sounding English voice
  return (
    cachedVoices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
    cachedVoices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) ||
    cachedVoices.find(v => v.lang.startsWith('en-US')) ||
    cachedVoices.find(v => v.lang.startsWith('en')) ||
    null
  );
}

// ─── Playback state ──────────────────────────────────────────
let currentAudio = null;   // Audio element or SpeechSynthesisUtterance
let cancelled = false;

/**
 * Speaks a text segment using its pre-generated MP3, falling back to browser TTS.
 */
export async function speak(text) {
  if (cancelled) return;

  const url = audioMap[text] || null;

  if (url) {
    // Try MP3 first
    try {
      await playMP3(url, text);
      return;
    } catch (_) {
      // MP3 failed (missing file, autoplay blocked, etc.) → fall through to TTS
    }
  }

  // Fallback: browser text-to-speech
  await speakTTS(text);
}

function playMP3(url, text) {
  return new Promise((resolve, reject) => {
    if (cancelled) return resolve();

    const audio = new Audio(url);
    currentAudio = audio;

    audio.onended = () => { currentAudio = null; resolve(); };
    audio.onerror = () => { currentAudio = null; reject(new Error('MP3 load error')); };

    const p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch((e) => {
        currentAudio = null;
        reject(e);
      });
    }
  });
}

function speakTTS(text) {
  return new Promise((resolve) => {
    if (cancelled) return resolve();
    if (!('speechSynthesis' in window)) return resolve();

    // Cancel any lingering browser speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 0.8;
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    currentAudio = utterance;

    utterance.onend = () => { currentAudio = null; resolve(); };
    utterance.onerror = () => { currentAudio = null; resolve(); };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stops any currently playing narration immediately.
 */
export function stopNarration() {
  cancelled = true;
  if (currentAudio) {
    if (currentAudio instanceof HTMLAudioElement) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Plays an array of narration segments sequentially.
 * Returns a handle with a cancel() method.
 */
export function narrate(segments, audioEnabled = true) {
  if (!audioEnabled || !segments || segments.length === 0) {
    return { cancel() {} };
  }

  cancelled = false;
  let aborted = false;

  const run = async () => {
    for (let i = 0; i < segments.length; i++) {
      if (cancelled || aborted) break;
      try {
        await speak(segments[i].text);
      } catch (e) {
        console.warn('[narrate] segment failed:', segments[i].text, e);
      }
    }
  };

  run();

  return {
    cancel() {
      aborted = true;
      stopNarration();
    },
  };
}
