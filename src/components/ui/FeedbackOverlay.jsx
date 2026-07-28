import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CORRECT_MESSAGES = ["🎉 Awesome!", "🌟 Fantastic Work!", "🏆 Superstar!", "✅ Excellent!", "✨ Amazing!"];
const WRONG_MESSAGES = ["Let's try again!", "Almost! Keep trying.", "Oops, not quite!"];

export default function FeedbackOverlay({ isVisible, isCorrect }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isVisible) {
      const arr = isCorrect ? CORRECT_MESSAGES : WRONG_MESSAGES;
      setMessage(arr[Math.floor(Math.random() * arr.length)]);
    }
  }, [isVisible, isCorrect]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="feedback-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={`feedback-card ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {message}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
