import { audioMap } from './audioMap.js';

// ─── MP3 SFX Playback ───────────────────────────────────────────
const sfxCache = {};

function playSFX(name) {
  if (!globalAudioEnabled) return;
  try {
    let audio = sfxCache[name];
    if (!audio) {
      audio = new Audio(`/audio/sfx/${name}.mp3`);
      sfxCache[name] = audio;
    }
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
const elevenLabsCache = {};

const styleSettings = {
  statement: { stability: 0.65, similarity_boost: 0.75, style: 0.3 },
  question:  { stability: 0.55, similarity_boost: 0.80, style: 0.5 },
  encouragement: { stability: 0.50, similarity_boost: 0.70, style: 0.7 },
  emphasis:  { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
  thinking:  { stability: 0.60, similarity_boost: 0.75, style: 0.4 },
  celebration: { stability: 0.45, similarity_boost: 0.65, style: 0.8 },
};

// ─── Core Playback State ──────────────────────────────────────────
let currentAudio = null;
let globalAudioEnabled = true;

// Session ID prevents audio duplication: each narrate() call increments this,
// and every step in the chain checks if the session is still current.
let narrationSessionId = 0;

/**
 * Update the global audio enabled state from the React context.
 */
export function setAudioEnabled(enabled) {
  globalAudioEnabled = enabled;
  if (!enabled) stopNarration();
}

/**
 * Gets the audio URL for a text segment.
 * Checks static map → memory cache → ElevenLabs API.
 */
export async function getAudioUrl(text, style = 'statement') {
  if (audioMap[text]) return audioMap[text];
  if (elevenLabsCache[text]) return elevenLabsCache[text];

  if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_api_key_here') {
    console.warn('ElevenLabs API Key missing. Skipping dynamic audio.');
    return null;
  }

  try {
    const settings = styleSettings[style] || styleSettings.statement;
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: settings.stability,
            similarity_boost: settings.similarity_boost,
            style: settings.style,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) throw new Error(`ElevenLabs API: ${response.status}`);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    elevenLabsCache[text] = url;
    return url;
  } catch (err) {
    console.error('Dynamic audio generation failed:', err);
    return null;
  }
}

/**
 * Preloads audio for a list of segments (fire-and-forget).
 */
export async function preloadNarration(segments) {
  if (!globalAudioEnabled || !segments) return;
  for (const seg of segments) {
    const text = typeof seg === 'string' ? seg : seg.text;
    const style = typeof seg === 'string' ? 'statement' : (seg.style || 'statement');
    if (!audioMap[text] && !elevenLabsCache[text]) {
      getAudioUrl(text, style).catch(() => {});
    }
  }
}

/**
 * Plays a single MP3 URL. Returns a promise that resolves when playback ends.
 * Rejects if the session has been invalidated (i.e. another narration started).
 */
function playMP3(url, sessionId) {
  return new Promise((resolve, reject) => {
    if (sessionId !== narrationSessionId) return resolve();

    const audio = new Audio(url);
    currentAudio = audio;

    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
      resolve();
    };
    audio.onerror = () => {
      if (currentAudio === audio) currentAudio = null;
      reject(new Error('MP3 load error'));
    };

    const p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch((e) => {
        if (currentAudio === audio) currentAudio = null;
        reject(e);
      });
    }
  });
}

/**
 * Speaks a single text segment.
 */
export async function speak(segment, sessionId) {
  if (sessionId !== narrationSessionId || !globalAudioEnabled) return;

  const text = typeof segment === 'string' ? segment : segment.text;
  const style = typeof segment === 'string' ? 'statement' : (segment.style || 'statement');

  const url = await getAudioUrl(text, style);
  if (url && sessionId === narrationSessionId) {
    try {
      await playMP3(url, sessionId);
    } catch (_) {
      // Ignored — session cancelled or load error
    }
  }
}

/**
 * Stops any currently playing narration immediately.
 * Bumps the session ID so any in-flight narration chains abort.
 */
export function stopNarration() {
  narrationSessionId++; // invalidate any running chain
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Plays an array of narration segments sequentially.
 * Automatically stops any previous narration before starting.
 * Returns a handle with a cancel() method.
 */
export function narrate(segments, localAudioEnabled = true) {
  // Always stop whatever was playing before
  stopNarration();

  if (!globalAudioEnabled || !localAudioEnabled || !segments || segments.length === 0) {
    return { cancel() {} };
  }

  // Capture a fresh session ID for this narration chain
  const sessionId = narrationSessionId;

  const run = async () => {
    for (let i = 0; i < segments.length; i++) {
      if (sessionId !== narrationSessionId) break;

      // Eagerly preload the next segment
      if (i + 1 < segments.length) {
        const next = segments[i + 1];
        const nextText = typeof next === 'string' ? next : next.text;
        const nextStyle = typeof next === 'string' ? 'statement' : (next.style || 'statement');
        getAudioUrl(nextText, nextStyle).catch(() => {});
      }

      try {
        await speak(segments[i], sessionId);
      } catch (e) {
        const text = typeof segments[i] === 'string' ? segments[i] : segments[i].text;
        console.warn('[narrate] segment failed:', text, e);
      }
    }
  };

  run();

  return {
    cancel() {
      // Only stop if this handle's session is still active
      if (sessionId === narrationSessionId) {
        stopNarration();
      }
    },
  };
}
