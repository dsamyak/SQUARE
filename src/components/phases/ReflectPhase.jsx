import React, { useState, useEffect, useRef } from 'react';
import { useQuestions } from '../../hooks/useQuestions';
import { usePhase } from '../../hooks/usePhase';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from '../ui/Confetti';
import { narrate, stopNarration } from '../../utils/audio';
import { reflectIntroNarration, reflectCertificateNarration } from '../../utils/narration';

export default function ReflectPhase() {
  const { advanceTo, PHASES } = usePhase();
  const { score, xp, badges } = useQuestions();
  const [step, setStep] = useState('quiz'); // 'quiz', 'rating', 'certificate'
  const narrationRef = useRef(null);

  useEffect(() => {
    if (step === 'quiz') {
      narrationRef.current = narrate(reflectIntroNarration());
    } else if (step === 'certificate') {
      narrationRef.current = narrate(reflectCertificateNarration());
    }
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, [step]);

  const handleQuizAnswer = () => {
    setStep('rating');
  };

  const handleRating = () => {
    setStep('certificate');
  };

  return (
    <div className="reflect-screen" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', paddingTop: '40px' }}>
      <AnimatePresence mode="wait">
        {step === 'quiz' && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="glass-card" style={{ padding: '40px' }}
          >
            <h2>Teach-Back Time!</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '24px', color: 'var(--text-secondary)' }}>
              Imagine you are teaching a friend. How many sides does a perfect square have?
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={handleQuizAnswer}>3 Sides</button>
              <button className="btn btn-primary" onClick={handleQuizAnswer}>4 Equal Sides</button>
              <button className="btn btn-outline" onClick={handleQuizAnswer}>No Sides</button>
            </div>
          </motion.div>
        )}

        {step === 'rating' && (
          <motion.div 
            key="rating"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="glass-card" style={{ padding: '40px' }}
          >
            <h2>How confident do you feel about squares?</h2>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
              <motion.button whileHover={{ scale: 1.1 }} className="btn btn-secondary" style={{ fontSize: '3rem', padding: '20px' }} onClick={handleRating}>😕</motion.button>
              <motion.button whileHover={{ scale: 1.1 }} className="btn btn-secondary" style={{ fontSize: '3rem', padding: '20px' }} onClick={handleRating}>😐</motion.button>
              <motion.button whileHover={{ scale: 1.1 }} className="btn btn-secondary" style={{ fontSize: '3rem', padding: '20px' }} onClick={handleRating}>😎</motion.button>
            </div>
          </motion.div>
        )}

        {step === 'certificate' && (
          <motion.div 
            key="cert"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="certificate glass-card"
          >
            <Confetti />
            <div className="certificate-header">
              <h1>Square Expert</h1>
              <p>Certificate of Completion</p>
            </div>
            
            <div className="certificate-body" style={{ margin: '40px 0' }}>
              <p style={{ fontSize: '1.2rem' }}>Awarded to <strong>Wei Ming</strong></p>
              <p style={{ color: 'var(--text-muted)' }}>For mastering the properties of squares</p>
            </div>

            <div className="certificate-stats" style={{ display: 'flex', justifyContent: 'space-around', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px' }}>
              <div>
                <div className="certificate-stat-value">{score.correct}/{score.total}</div>
                <div className="certificate-stat-label">Score</div>
              </div>
              <div>
                <div className="certificate-stat-value">{xp}</div>
                <div className="certificate-stat-label">XP Earned</div>
              </div>
              <div>
                <div className="certificate-stat-value">{badges.length}</div>
                <div className="certificate-stat-label">Badges</div>
              </div>
            </div>

            <div style={{ marginTop: '40px' }}>
              <button className="btn btn-primary btn-lg" onClick={() => advanceTo(PHASES.INTRO)}>
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
