import React, { useState } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReflectPhase() {
  const { advanceTo, PHASES } = usePhase();
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="reflect-screen">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            key="reflect"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="reflect-chat"
          >
            <h2 className="story-title" style={{ textAlign: 'center' }}>Reflect on your journey</h2>
            <div className="reflect-message ai">
              <strong>LearnFlow AI:</strong> In your own words, what makes a shape a square?
            </div>
            
            <div className="reflect-input-area">
              <input 
                type="text" 
                className="reflect-input" 
                placeholder="A square has..." 
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
              />
              <button 
                className="reflect-send-btn" 
                onClick={() => setSubmitted(true)}
                disabled={reflection.trim().length === 0}
              >
                Send
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="celebrate"
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="certificate"
          >
            <h2 className="certificate-title">Lesson Complete!</h2>
            <p className="certificate-topic">You are a Square Expert.</p>
            <button className="btn btn-primary" onClick={() => advanceTo(PHASES.INTRO)}>Back to Start</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
