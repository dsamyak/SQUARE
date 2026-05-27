import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SquareBuilder({ onComplete }) {
  // A simple grid: 3x3. We need 4 pieces to make a square outline (2x2 square)
  // Let's do a drag-and-drop or tap-to-place simplified version.
  const [placed, setPlaced] = useState([]);

  const targetPositions = [0, 1, 3, 4]; // Top-left 2x2 in a 3x3 grid
  
  const handleTap = (index) => {
    if (placed.includes(index)) {
      setPlaced(placed.filter(i => i !== index));
    } else {
      const newPlaced = [...placed, index];
      setPlaced(newPlaced);
      
      // Check if they matched target
      const isCorrect = targetPositions.every(t => newPlaced.includes(t)) && newPlaced.length === targetPositions.length;
      if (isCorrect && onComplete) {
        setTimeout(onComplete, 1000);
      }
    }
  };

  const isComplete = targetPositions.every(t => placed.includes(t)) && placed.length === targetPositions.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <p style={{ color: 'var(--gold-light)', fontSize: '1.2rem' }}>
        Tap the tiles to build a square! (Hint: make a 2x2 shape)
      </p>

      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 80px)', 
        gridTemplateRows: 'repeat(3, 80px)', 
        gap: '4px',
        padding: '12px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        border: isComplete ? '4px solid var(--green)' : '4px solid transparent',
        transition: 'border 0.3s'
      }}>
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            onClick={() => handleTap(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: placed.includes(i) ? 'var(--coral)' : 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              cursor: 'pointer',
              border: placed.includes(i) ? '2px solid white' : '2px dashed rgba(255,255,255,0.2)'
            }}
          />
        ))}
      </div>

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ color: 'var(--green-light)', fontWeight: 'bold', fontSize: '1.2rem' }}>
          Great job! You built a square! 🎉
        </motion.div>
      )}
    </div>
  );
}
