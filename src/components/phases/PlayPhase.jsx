import React, { useState, useEffect } from 'react';
import { useQuestions } from '../../hooks/useQuestions';
import { usePhase } from '../../hooks/usePhase';
import QuestionRenderer from './QuestionRenderer';
import ProgressBar from '../ui/ProgressBar';
import FeedbackOverlay from '../ui/FeedbackOverlay';
import XPToast from '../ui/XPToast';
import Confetti from '../ui/Confetti';
import { motion } from 'framer-motion';
import { narrate, stopNarration } from '../../utils/audio';
import { playCorrectNarration, playWrongNarration } from '../../utils/narration';
import { generateSessionQuestions } from '../../utils/questionBank';

export default function PlayPhase() {
  const { 
    currentQuestion, 
    currentQuestionIndex, 
    sessionQuestions, 
    score, 
    hintsRemaining,
    attemptsForCurrent,
    lives,
    streakCount,
    xp,
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
    incrementAttempt
  } = useQuestions();

  const { advance } = usePhase();
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  // Seed questions if not already loaded (e.g. navigated directly to Play phase)
  useEffect(() => {
    if (sessionQuestions.length === 0) {
      startPractice(generateSessionQuestions(20));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (answer) => {
    if (!currentQuestion) return;
    stopNarration();
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      narrate(playCorrectNarration());
      setFeedback({ isCorrect: true });
      answerQuestion(true);
      incrementStreak();

      const xpGained = streakCount >= 2 ? 20 : 10;
      setEarnedXp(xpGained);
      awardXp(xpGained);

      if (streakCount + 1 === 3) {
        awardBadge('On a Roll! 🔥');
      }

      setShowConfetti(true);

      setTimeout(() => {
        setFeedback(null);
        setShowConfetti(false);
        nextQuestion();
      }, 2000);
    } else {
      narrate(playWrongNarration());
      setFeedback({ isCorrect: false });
      incrementAttempt();
      resetStreak();

      if (attemptsForCurrent >= 1) {
        // Second fail → lose life and move on
        loseLife();
        answerQuestion(false);
        setTimeout(() => {
          setFeedback(null);
          nextQuestion();
        }, 2000);
      } else {
        setTimeout(() => setFeedback(null), 1500);
      }
    }
  };

  // Finished screen
  if (isFinished) {
    return (
      <motion.div
        className="play-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: 'center' }}
      >
        <Confetti />
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏆</div>
        <h2 style={{ marginBottom: '8px' }}>Quiz Complete!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          You scored <strong>{score.correct}</strong> out of <strong>{score.total}</strong>
        </p>
        <p style={{ color: 'var(--gold)', fontSize: '1.3rem', marginBottom: '32px' }}>
          Total XP: {xp} ⭐
        </p>
        <button className="btn btn-primary btn-lg" onClick={advance}>
          Go to Reflection →
        </button>
      </motion.div>
    );
  }

  // Loading state while questions are seeding
  if (!currentQuestion) {
    return (
      <div className="play-screen" style={{ textAlign: 'center', paddingTop: '80px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⏳</div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="play-screen">
      {showConfetti && <Confetti />}
      {earnedXp > 0 && showConfetti && (
        <XPToast amount={earnedXp} onComplete={() => setEarnedXp(0)} />
      )}
      <FeedbackOverlay isVisible={!!feedback} isCorrect={feedback?.isCorrect} />

      {/* HUD */}
      <div className="hud">
        <div className="hud-stat">
          <span className="hud-icon">❤️</span>
          <span className="hud-value">{'❤️'.repeat(lives) || '💔'}</span>
        </div>
        <div className="hud-stat">
          <span className="hud-icon">⭐</span>
          <span className="hud-value">{xp} XP</span>
        </div>
        {streakCount >= 2 && (
          <div className="hud-stat">
            <span className="hud-icon">🔥</span>
            <span className="hud-value">{streakCount}x Streak!</span>
          </div>
        )}
      </div>

      <ProgressBar
        current={currentQuestionIndex + 1}
        total={sessionQuestions.length}
        streak={streakCount}
      />

      <div className="question-container glass-card">
        <QuestionRenderer
          question={currentQuestion}
          onAnswer={handleAnswer}
          disabled={!!feedback}
          attempts={attemptsForCurrent}
          hintsRemaining={hintsRemaining}
          onUseHint={useHint}
        />
      </div>
    </div>
  );
}
