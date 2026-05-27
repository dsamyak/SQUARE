import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useAudio() {
  const { state, dispatch } = useContext(AppContext);
  const { audioEnabled } = state;

  const toggleAudio = () => {
    dispatch({ type: 'TOGGLE_AUDIO' });
  };

  return { toggleAudio, audioEnabled };
}
