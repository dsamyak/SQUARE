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

// ─── ElevenLabs Settings ──────────────────────────────────────────
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const MODEL_ID = 'eleven_multilingual_v2';
const elevenLabsCache = {}; // Cache for dynamically fetched blobs

const styleSettings = {
  statement: { stability: 0.65, similarity_boost: 0.75, style: 0.3 },
  question: { stability: 0.55, similarity_boost: 0.80, style: 0.5 },
  encouragement: { stability: 0.50, similarity_boost: 0.70, style: 0.7 },
  emphasis: { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
  thinking: { stability: 0.60, similarity_boost: 0.75, style: 0.4 },
  celebration: { stability: 0.45, similarity_boost: 0.65, style: 0.8 }
};

// ─── Core Playback Engine ──────────────────────────────────────────
let currentAudio = null;   
let cancelled = false;
let globalAudioEnabled = true;

/**
 * Update the global audio enabled state from the React context.
 */
export function setAudioEnabled(enabled) {
  globalAudioEnabled = enabled;
  if (!enabled) stopNarration();
}

/**
 * Gets the audio URL for a text segment. Checks static map, then memory cache, then dynamically fetches.
 */
export async function getAudioUrl(text, style = 'statement') {
  // 1. Static Cache Check
  if (audioMap[text]) {
    return audioMap[text];
  }
  
  // 2. Dynamic Memory Cache Check
  if (elevenLabsCache[text]) {
    return elevenLabsCache[text];
  }
  
  // 3. Dynamic Request to ElevenLabs
  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_api_key_here') {
    console.warn("ElevenLabs API Key missing or invalid. Skipping dynamic audio generation.");
    return null;
  }
  
  try {
    const settings = styleSettings[style] || styleSettings.statement;
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarity_boost,
          style: settings.style,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) throw new Error(`ElevenLabs API failed with status ${response.status}`);
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    elevenLabsCache[text] = url; // Cache the dynamically generated audio URL
    return url;
  } catch (err) {
    console.error("Dynamic audio generation failed:", err);
    return null;
  }
}

/**
 * Preloads the audio for a list of segments.
 */
export async function preloadNarration(segments) {
  if (!globalAudioEnabled || !segments) return;
  for (const segment of segments) {
    if (!audioMap[segment.text] && !elevenLabsCache[segment.text]) {
      getAudioUrl(segment.text, segment.style).catch(() => {});
    }
  }
}

function playMP3(url) {
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

/**
 * Speaks a single text segment using the resolved audio URL.
 */
export async function speak(segment) {
  if (cancelled || !globalAudioEnabled) return;
  
  const text = typeof segment === 'string' ? segment : segment.text;
  const style = typeof segment === 'string' ? 'statement' : (segment.style || 'statement');
  
  const url = await getAudioUrl(text, style);
  if (url && !cancelled) {
    try {
      await playMP3(url);
    } catch (_) {
      // Ignored
    }
  }
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
}

/**
 * Plays an array of narration segments sequentially with eager preloading.
 * Returns a handle with a cancel() method.
 */
export function narrate(segments, localAudioEnabled = true) {
  // Respect both the local parameter (for backwards compatibility) and global state
  if (!globalAudioEnabled || !localAudioEnabled || !segments || segments.length === 0) {
    return { cancel() {} };
  }

  cancelled = false;
  let aborted = false;

  const run = async () => {
    for (let i = 0; i < segments.length; i++) {
      if (cancelled || aborted) break;
      
      // Eagerly preload the next segment
      if (i + 1 < segments.length) {
        const next = segments[i + 1];
        const nextText = typeof next === 'string' ? next : next.text;
        const nextStyle = typeof next === 'string' ? 'statement' : (next.style || 'statement');
        getAudioUrl(nextText, nextStyle).catch(() => {});
      }
      
      try {
        await speak(segments[i]);
      } catch (e) {
        const text = typeof segments[i] === 'string' ? segments[i] : segments[i].text;
        console.warn('[narrate] segment failed:', text, e);
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
