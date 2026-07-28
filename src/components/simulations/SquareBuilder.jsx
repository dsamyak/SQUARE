import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from '../ui/Confetti';
import { sounds } from '../../utils/audio';

export default function SquareBuilder({ onComplete }) {
  const [placed, setPlaced] = useState([]);
  const [complete, setComplete] = useState(false);

  const validSquares = [
    [0, 1, 3, 4], [1, 2, 4, 5], [3, 4, 6, 7], [4, 5, 7, 8]
  ];
  
  const handleTap = (index) => {
    if (complete) return;
    
    let newPlaced;
    if (placed.includes(index)) {
      newPlaced = placed.filter(i => i !== index);
    } else {
      newPlaced = [...placed, index];
    }
    setPlaced(newPlaced);
    
    const isCorrect = validSquares.some(sq => sq.every(t => newPlaced.includes(t)) && newPlaced.length === 4);
    if (isCorrect && !complete) {
      setComplete(true);
      sounds.celebrate();
      if (onComplete) {
        setTimeout(onComplete, 1500);
      }
    } else {
      sounds.correct();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {complete && <Confetti />}
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
        Tap 4 tiles to build a square.
      </p>

      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 80px)', 
        gridTemplateRows: 'repeat(3, 80px)', 
        gap: '4px', padding: '12px', background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        border: complete ? '4px solid var(--green)' : '4px solid transparent',
        transition: 'border 0.3s'
      }}>
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            onClick={() => handleTap(i)}
            whileHover={!complete ? { scale: 1.05 } : {}}
            whileTap={!complete ? { scale: 0.95 } : {}}
            style={{
              width: '100%', height: '100%',
              backgroundColor: placed.includes(i) ? 'var(--teal)' : 'rgba(255,255,255,0.1)',
              borderRadius: '8px', cursor: complete ? 'default' : 'pointer',
              border: placed.includes(i) ? '2px solid white' : '2px dashed rgba(255,255,255,0.2)'
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {complete && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ color: 'var(--green-light)', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Great job! You built a square! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
