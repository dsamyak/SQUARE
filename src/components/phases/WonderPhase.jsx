import React, { useState } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { motion } from 'framer-motion';
import AnimatedSquare from '../simulations/AnimatedSquare';

export default function WonderPhase() {
  const { advance } = usePhase();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  return (
    <div className="wonder-screen">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
        <h2 className="wonder-question">What makes a shape a square?</h2>
        <p className="wonder-subtext">Let's watch and find out...</p>
        
        <div style={{ margin: '40px 0', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
          <AnimatedSquare onComplete={() => setIsAnimationComplete(true)} />
        </div>

        {isAnimationComplete && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="wonder-question" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
              4 equal sides! 4 corners!
            </p>
            <button className="btn btn-primary" onClick={advance}>
              Let's hear a story →
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
