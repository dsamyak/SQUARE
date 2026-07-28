import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { narrate, stopNarration } from '../../utils/audio';
import { playReadQuestion, playHintNarration } from '../../utils/narration';
import Popup from '../ui/Popup';

export default function QuestionRenderer({ question, onAnswer, disabled, attempts, hintsRemaining, onUseHint }) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Auto-read question prompt
    const handle = narrate(playReadQuestion(question.prompt));
    return () => {
      handle.cancel();
      stopNarration();
    };
  }, [question.id]);

  const handleReadQuestion = () => {
    stopNarration();
    narrate(playReadQuestion(question.prompt));
  };

  const handleHintClick = () => {
    if (hintsRemaining > 0 && question.hint) {
      setShowHint(true);
      onUseHint();
      narrate(playHintNarration(question.hint));
    }
  };

  const isReveal = attempts >= 1; // If they failed once, they are on their second attempt

  return (
    <div className="question-renderer">
      <Popup 
        isOpen={showHint}
        type="hint"
        title="Hint!"
        message={question.hint}
        onConfirm={() => setShowHint(false)}
        confirmText="Got it!"
      />

      <h3 className="question-prompt" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
        {question.prompt}
        <button 
          onClick={handleReadQuestion} 
          style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', opacity: 0.8 }}
          title="Listen to question"
        >
          🔊
        </button>
      </h3>
      
      {question.type === 'mcq' || question.type === 'truefalse' ? (
        <div className="options-grid">
          {question.options.map((opt, idx) => {
            // Highlighting correct answer if in reveal mode after failing max attempts
            // Since this renderer is shown *during* the second attempt, we don't reveal until after the second fail.
            // But if we want to visually guide them, we could. For now, let's just let them guess again.
            return (
              <motion.button 
                key={idx}
                className="btn btn-outline option-btn"
                onClick={() => onAnswer(opt)}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
              >
                {opt}
              </motion.button>
            )
          })}
        </div>
      ) : null}

      <div className="question-actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={handleHintClick}
          disabled={disabled || hintsRemaining <= 0 || !question.hint}
        >
          💡 Hint ({hintsRemaining} left)
        </button>
        {attempts > 0 && <span style={{ color: 'var(--coral)', fontSize: '0.9rem', fontWeight: 'bold' }}>Last Try!</span>}
      </div>
    </div>
  );
}
