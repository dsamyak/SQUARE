import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function useQuestions() {
  const { state, dispatch } = useContext(AppContext);

  const { sessionQuestions, currentQuestionIndex, score, hintsRemaining, xp, badges, streakCount, attemptsForCurrent, lives } = state;

  const currentQuestion = sessionQuestions[currentQuestionIndex];
  const isFinished = currentQuestionIndex >= sessionQuestions.length && sessionQuestions.length > 0;

  const answerQuestion = (isCorrect) => {
    dispatch({ type: 'ANSWER_QUESTION', payload: { isCorrect } });
  };

  const startPractice = (questions) => {
    dispatch({ type: 'START_PRACTICE', payload: questions });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const useHint = () => {
    dispatch({ type: 'USE_HINT' });
  };

  const awardXp = (amount) => dispatch({ type: 'AWARD_XP', payload: amount });
  const awardBadge = (badge) => dispatch({ type: 'AWARD_BADGE', payload: badge });
  const loseLife = () => dispatch({ type: 'LOSE_LIFE' });
  const incrementStreak = () => dispatch({ type: 'INCREMENT_STREAK' });
  const resetStreak = () => dispatch({ type: 'RESET_STREAK' });
  const incrementAttempt = () => dispatch({ type: 'INCREMENT_ATTEMPT' });

  return {
    currentQuestion,
    currentQuestionIndex,
    sessionQuestions,
    totalQuestions: sessionQuestions.length,
    score,
    hintsRemaining,
    xp,
    badges,
    streakCount,
    attemptsForCurrent,
    lives,
    isFinished,
    answerQuestion,
    startPractice,
    nextQuestion,
    useHint,
    awardXp,
    awardBadge,
    loseLife,
    incrementStreak,
    resetStreak,
    incrementAttempt,
  };
}
