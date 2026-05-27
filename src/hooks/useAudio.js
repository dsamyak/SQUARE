import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { setAudioEnabled } from '../utils/audio';

export function useAudio() {
  const { state, dispatch } = useContext(AppContext);
  const { audioEnabled } = state;

  useEffect(() => {
    setAudioEnabled(audioEnabled);
  }, [audioEnabled]);

  const toggleAudio = () => {
    dispatch({ type: 'TOGGLE_AUDIO' });
  };

  return { toggleAudio, audioEnabled };
}
