import React, { useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { usePhase } from '../../hooks/usePhase';
import { useQuestions } from '../../hooks/useQuestions';
import { generateSessionQuestions } from '../../utils/questionBank';
import { motion, AnimatePresence } from 'framer-motion';

function QuestionCard({ question, nextQuestion, answerQuestion, useHint }) {
  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="question-card">
      <h3 className="question-text">{question.prompt}</h3>
      {question.options && (
        <div className="options-grid">
          {question.options.map(opt => (
            <button key={opt} className="option-btn" onClick={() => answerQuestion(opt === question.correctAnswer)}>
              {opt}
            </button>
          ))}
        </div>
      )}
      {!question.options && (
        <div style={{ textAlign: 'center' }}>
          <button className="option-btn" onClick={() => answerQuestion(true)}>Got it! ({question.correctAnswer})</button>
        </div>
      )}
      <button className="hint-btn" onClick={useHint}>💡 Hint</button>
    </motion.div>
  );
}

export default function PlayPhase() {
  const { advance } = usePhase();
  const { state, dispatch } = useContext(AppContext);
  const { currentQuestion, isFinished, score, answerQuestion, nextQuestion, useHint } = useQuestions();

  useEffect(() => {
    if (!state.sessionQuestions || state.sessionQuestions.length === 0) {
      dispatch({ type: 'START_PRACTICE', payload: generateSessionQuestions() });
    }
  }, [dispatch, state.sessionQuestions]);

  if (isFinished) {
    return (
      <div className="play-screen">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="score-card">
          <h2 className="score-title">Play Complete!</h2>
          <div className="score-value">{score.correct} / {score.total}</div>
          <button className="btn btn-primary" onClick={advance}>Next: Reflect 📓</button>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="play-screen">
      <AnimatePresence mode="wait">
        <QuestionCard 
          key={currentQuestion.id} 
          question={currentQuestion} 
          nextQuestion={nextQuestion} 
          answerQuestion={(isCorrect) => {
            answerQuestion(isCorrect);
            setTimeout(nextQuestion, 1000);
          }} 
          useHint={useHint} 
        />
      </AnimatePresence>
    </div>
  );
}
