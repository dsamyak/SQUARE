import React, { useState, useEffect, useRef } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { motion } from 'framer-motion';
import AnimatedSquare from '../simulations/AnimatedSquare';
import { narrate, stopNarration } from '../../utils/audio';
import { wonderNarration } from '../../utils/narration';

export default function WonderPhase() {
  const { advance } = usePhase();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const narrationRef = useRef(null);

  useEffect(() => {
    narrationRef.current = narrate(wonderNarration());
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, []);

  const handleAdvance = () => {
    narrationRef.current?.cancel();
    stopNarration();
    advance();
  };

  return (
    <div className="wonder-screen">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
        <h2 className="wonder-question">Why do balls roll away, but blocks stack perfectly?</h2>
        <p className="wonder-subtext">What secret shape makes a block stay put? Let's find out...</p>
        
        <div style={{ margin: '40px 0', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
          <AnimatedSquare onComplete={() => setIsAnimationComplete(true)} />
        </div>

        {isAnimationComplete && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="wonder-question" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
              It's the 4 equal sides and 4 corners!
            </p>
            <button className="btn btn-primary" onClick={handleAdvance}>
              Let's hear a story →
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
