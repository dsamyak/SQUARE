import React, { useState, useEffect, useRef } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSquare from '../simulations/AnimatedSquare';
import { narrate, stopNarration } from '../../utils/audio';
import { wonderNarration } from '../../utils/narration';
import BadgeUnlock from '../ui/BadgeUnlock';

export default function WonderPhase() {
  const { advance } = usePhase();
  const [step, setStep] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const narrationRef = useRef(null);

  useEffect(() => {
    // Play full narration chain on mount
    narrationRef.current = narrate(wonderNarration());
    
    const timers = [
      setTimeout(() => setStep(1), 3500),
      setTimeout(() => setStep(2), 7000),
      setTimeout(() => setStep(3), 11000)
    ];

    return () => {
      narrationRef.current?.cancel();
      stopNarration();
      timers.forEach(clearTimeout);
    };
  }, []);

  const handleAdvance = () => {
    setShowBadge(true);
    setTimeout(() => {
      setShowBadge(false);
      narrationRef.current?.cancel();
      stopNarration();
      advance();
    }, 2500);
  };

  return (
    <div className="wonder-screen">
      <AnimatePresence>
        {showBadge && (
          <BadgeUnlock 
            title="Wonder Unlocked!" 
            subtitle="You found the secret of squares!" 
            icon="🔍" 
            onClose={() => {}} 
          />
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
        <h2 className="wonder-question">Why do balls roll away, but blocks stack perfectly?</h2>
        <p className="wonder-subtext">What secret shape makes a block stay put? Let's find out...</p>
        
        <div style={{ margin: '40px 0', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
          <AnimatedSquare onComplete={() => {}} />
        </div>

        <div style={{ minHeight: '120px' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <p className="wonder-question" style={{ fontSize: '1.8rem', color: 'var(--gold)' }}>
                  Let's count! One, two, three, FOUR sides!
                </p>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <p className="wonder-question" style={{ fontSize: '1.8rem', color: 'var(--teal)' }}>
                  FOUR corners! A square always has four corners.
                </p>
              </motion.div>
            )}
            {step >= 3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="wonder-question" style={{ fontSize: '2rem', color: 'var(--green-light)' }}>
                  ALL sides are EQUAL!
                </p>
                <button className="btn btn-primary" onClick={handleAdvance} style={{ marginTop: '20px' }}>
                  Let's hear a story →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
