import { useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import { setAudioEnabled, sounds, narrate } from '../utils/audio';

export function useAudio() {
  const { state, dispatch } = useContext(AppContext);
  const { audioEnabled } = state;

  useEffect(() => {
    setAudioEnabled(audioEnabled);
  }, [audioEnabled]);

  const toggleAudio = () => {
    dispatch({ type: 'TOGGLE_AUDIO' });
  };

  /**
   * Play an SFX by name: 'click', 'correct', 'wrong', 'celebrate'
   */
  const play = useCallback((sfxName) => {
    if (!audioEnabled) return;
    const fn = sounds[sfxName];
    if (fn) fn();
  }, [audioEnabled]);

  /**
   * Narrate a text string (used by CharacterSpeech when an audioSrc is provided).
   * Wraps it in the narrate() engine so it respects global audio state.
   */
  const playNarration = useCallback((text) => {
    if (!audioEnabled || !text) return;
    narrate([{ text, style: 'statement' }]);
  }, [audioEnabled]);

  return { toggleAudio, audioEnabled, play, playNarration };
}
