import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '../../utils/audio';

const OBJECTS = [
  { id: 1, type: 'square', emoji: '🖼️', label: 'Picture Frame' },
  { id: 2, type: 'circle', emoji: '🍪', label: 'Cookie' },
  { id: 3, type: 'square', emoji: '🪟', label: 'Window' },
  { id: 4, type: 'triangle', emoji: '🍕', label: 'Pizza Slice' },
  { id: 5, type: 'square', emoji: '🧀', label: 'Cheese Slice' },
  { id: 6, type: 'rectangle', emoji: '📱', label: 'Phone' },
];

export default function ShapeSpotter({ onComplete }) {
  const [spotted, setSpotted] = useState([]);

  const squareIds = OBJECTS.filter(o => o.type === 'square').map(o => o.id);

  const handleTap = (obj) => {
    if (obj.type === 'square' && !spotted.includes(obj.id)) {
      sounds.correct();
      const newSpotted = [...spotted, obj.id];
      setSpotted(newSpotted);
      
      if (newSpotted.length === squareIds.length && onComplete) {
        setTimeout(() => {
          sounds.celebrate();
          onComplete();
        }, 1000);
      }
    } else if (obj.type !== 'square') {
      sounds.wrong();
    }
  };

  const isComplete = spotted.length === squareIds.length;

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: 'var(--gold-light)', fontSize: '1.2rem', marginBottom: '20px' }}>
        Spot all the squares in the real world! ({spotted.length}/{squareIds.length})
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
        {OBJECTS.map((obj) => {
          const isSpotted = spotted.includes(obj.id);
          const isWrong = !isSpotted && obj.type !== 'square';

          return (
            <motion.div
              key={obj.id}
              onClick={() => handleTap(obj)}
              whileHover={{ scale: isSpotted ? 1 : 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: '100px',
                height: '100px',
                background: isSpotted ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.05)',
                border: isSpotted ? '2px solid var(--green)' : '2px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isSpotted ? 'default' : 'pointer',
                opacity: isSpotted ? 0.7 : 1,
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>{obj.emoji}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                {obj.label}
              </span>
              {isSpotted && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  style={{ position: 'absolute', top: -5, right: -5, background: 'var(--green)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20px', color: 'var(--green-light)', fontWeight: 'bold', fontSize: '1.2rem' }}>
          You found them all! 🏆
        </motion.div>
      )}
    </div>
  );
}
