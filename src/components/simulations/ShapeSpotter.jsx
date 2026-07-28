import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../../utils/audio';
import Confetti from '../ui/Confetti';

const OBJECTS = [
  { id: 1, type: 'square', emoji: '🖼️', label: 'Picture Frame' },
  { id: 2, type: 'circle', emoji: '🍪', label: 'Cookie' },
  { id: 3, type: 'square', emoji: '🪟', label: 'Window' },
  { id: 4, type: 'triangle', emoji: '🍕', label: 'Pizza Slice' },
  { id: 5, type: 'square', emoji: '📦', label: 'Cardboard Box' },
  { id: 6, type: 'rectangle', emoji: '📱', label: 'Phone' },
  { id: 7, type: 'square', emoji: '🧇', label: 'Waffle' },
  { id: 8, type: 'circle', emoji: '⚽', label: 'Soccer Ball' },
];

export default function ShapeSpotter({ onComplete }) {
  const [spotted, setSpotted] = useState([]);
  const [wrongShake, setWrongShake] = useState(null);
  const [complete, setComplete] = useState(false);

  const squareIds = OBJECTS.filter(o => o.type === 'square').map(o => o.id);

  const handleTap = (obj) => {
    if (complete) return;
    
    if (obj.type === 'square' && !spotted.includes(obj.id)) {
      sounds.correct();
      const newSpotted = [...spotted, obj.id];
      setSpotted(newSpotted);
      
      if (newSpotted.length === squareIds.length) {
        setComplete(true);
        sounds.celebrate();
        if (onComplete) {
          setTimeout(onComplete, 1500);
        }
      }
    } else if (obj.type !== 'square') {
      sounds.wrong();
      setWrongShake(obj.id);
      setTimeout(() => setWrongShake(null), 500);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {complete && <Confetti />}
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '20px' }}>
        Spot all the squares! ({spotted.length}/{squareIds.length})
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
        {OBJECTS.map((obj) => {
          const isSpotted = spotted.includes(obj.id);
          const isWrong = wrongShake === obj.id;

          return (
            <motion.div
              key={obj.id}
              onClick={() => handleTap(obj)}
              animate={isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
              whileHover={isSpotted || complete ? {} : { scale: 1.1 }}
              whileTap={isSpotted || complete ? {} : { scale: 0.9 }}
              transition={isWrong ? { duration: 0.4 } : {}}
              style={{
                width: '100px', height: '100px',
                background: isSpotted ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255,255,255,0.05)',
                border: isSpotted ? '2px solid var(--green)' : isWrong ? '2px solid var(--coral)' : '2px solid rgba(255,255,255,0.1)',
                borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: isSpotted || complete ? 'default' : 'pointer',
                opacity: isSpotted ? 0.7 : 1,
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>{obj.emoji}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                {obj.label}
              </span>
              <AnimatePresence>
                {isSpotted && (
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    style={{ position: 'absolute', top: -5, right: -5, background: 'var(--green)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}
                  >✓</motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {complete && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20px', color: 'var(--green-light)', fontWeight: 'bold', fontSize: '1.2rem' }}>
            You found them all! 🏆
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
