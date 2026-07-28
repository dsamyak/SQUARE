import React, { createContext, useReducer } from 'react';

export const PHASES = {
  INTRO: 'intro',
  WONDER: 'wonder',
  STORY: 'story',
  SIMULATE: 'simulate',
  PLAY: 'play',
  REFLECT: 'reflect',
};

const initialState = {
  phase: PHASES.INTRO,
  score: { correct: 0, total: 0 },
  hintsRemaining: 3,
  sessionQuestions: [],
  currentQuestionIndex: 0,
  audioEnabled: true,
  completedPhases: [],
  // New unified design system state
  xp: 0,
  badges: [],
  lives: 3,
  streakCount: 0,
  attemptsForCurrent: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_PHASE':
      return { 
        ...state, 
        phase: action.payload,
        completedPhases: state.completedPhases.includes(state.phase) 
          ? state.completedPhases 
          : [...state.completedPhases, state.phase]
      };
    case 'TOGGLE_AUDIO':
      return { ...state, audioEnabled: !state.audioEnabled };
    case 'START_PRACTICE':
      return { 
        ...state, 
        phase: PHASES.PLAY, 
        sessionQuestions: action.payload,
        currentQuestionIndex: 0,
        score: { correct: 0, total: action.payload.length },
        hintsRemaining: 3
      };
    case 'ANSWER_QUESTION':
      return {
        ...state,
        score: {
          ...state.score,
          correct: state.score.correct + (action.payload.isCorrect ? 1 : 0)
        }
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        attemptsForCurrent: 0,
      };
    case 'USE_HINT':
      return {
        ...state,
        hintsRemaining: Math.max(0, state.hintsRemaining - 1)
      };
    case 'AWARD_XP':
      return { ...state, xp: state.xp + action.payload };
    case 'AWARD_BADGE':
      return { ...state, badges: state.badges.includes(action.payload) ? state.badges : [...state.badges, action.payload] };
    case 'LOSE_LIFE':
      return { ...state, lives: Math.max(0, state.lives - 1) };
    case 'RESET_LIVES':
      return { ...state, lives: 3 };
    case 'INCREMENT_STREAK':
      return { ...state, streakCount: state.streakCount + 1 };
    case 'RESET_STREAK':
      return { ...state, streakCount: 0 };
    case 'INCREMENT_ATTEMPT':
      return { ...state, attemptsForCurrent: state.attemptsForCurrent + 1 };
    case 'RESET_APP':
      return { ...initialState, audioEnabled: state.audioEnabled };
    default:
      return state;
  }
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
