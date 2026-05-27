import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedSquare({ onComplete }) {
  const [step, setStep] = useState(0);

  // Animation sequence:
  // 0: Draw outline
  // 1: Show 4 sides one by one
  // 2: Show 4 corners one by one
  // 3: Show "equal" highlight
  
  useEffect(() => {
    let timer;
    if (step === 0) timer = setTimeout(() => setStep(1), 2000);
    else if (step === 1) timer = setTimeout(() => setStep(2), 3000);
    else if (step === 2) timer = setTimeout(() => setStep(3), 3000);
    else if (step === 3) {
      if (onComplete) onComplete();
    }
    return () => clearTimeout(timer);
  }, [step, onComplete]);

  return (
    <div style={{ position: 'relative', width: 300, height: 300, margin: '0 auto' }}>
      <svg viewBox="0 0 300 300" width="100%" height="100%">
        {/* Base animated square outline */}
        <motion.rect 
          x="50" y="50" width="200" height="200" 
          fill="rgba(108,99,255,0.1)"
          stroke="#6C63FF" 
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Sides Highlight (Step 1+) */}
        {step >= 1 && (
          <>
            <motion.line x1="50" y1="50" x2="250" y2="50" stroke="#FF6B6B" strokeWidth="6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
            <motion.text x="150" y="40" textAnchor="middle" fill="#FF6B6B" fontWeight="bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>1 Side</motion.text>

            <motion.line x1="250" y1="50" x2="250" y2="250" stroke="#FF6B6B" strokeWidth="6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
            <motion.text x="265" y="155" fill="#FF6B6B" fontWeight="bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>2</motion.text>

            <motion.line x1="250" y1="250" x2="50" y2="250" stroke="#FF6B6B" strokeWidth="6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} />
            <motion.text x="150" y="275" textAnchor="middle" fill="#FF6B6B" fontWeight="bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>3</motion.text>

            <motion.line x1="50" y1="250" x2="50" y2="50" stroke="#FF6B6B" strokeWidth="6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} />
            <motion.text x="35" y="155" textAnchor="end" fill="#FF6B6B" fontWeight="bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>4</motion.text>
          </>
        )}

        {/* Corners Highlight (Step 2+) */}
        {step >= 2 && (
          <>
            <motion.circle cx="50" cy="50" r="10" fill="#4ECDC4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} />
            <motion.circle cx="250" cy="50" r="10" fill="#4ECDC4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }} />
            <motion.circle cx="250" cy="250" r="10" fill="#4ECDC4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: 'spring' }} />
            <motion.circle cx="50" cy="250" r="10" fill="#4ECDC4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.7, type: 'spring' }} />
          </>
        )}

        {/* Equal Sides Highlight (Step 3+) */}
        {step >= 3 && (
          <motion.text x="150" y="155" textAnchor="middle" fill="#FFE66D" fontWeight="bold" fontSize="1.2rem" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            ALL EQUAL!
          </motion.text>
        )}
      </svg>
    </div>
  );
}
