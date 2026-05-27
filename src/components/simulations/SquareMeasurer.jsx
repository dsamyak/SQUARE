import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../../utils/audio';

const SIDES = [
  { key: 'top',    label: 'Top Side',    emoji: '📏' },
  { key: 'right',  label: 'Right Side',  emoji: '📐' },
  { key: 'bottom', label: 'Bottom Side', emoji: '📏' },
  { key: 'left',   label: 'Left Side',   emoji: '📐' },
];

export default function SquareMeasurer({ onComplete }) {
  const [measured, setMeasured] = useState({});
  const [activeSide, setActiveSide] = useState(null);

  const measuredCount = Object.keys(measured).length;
  const allDone = measuredCount === 4;

  useEffect(() => {
    if (measuredCount === 4) {
      const timer = setTimeout(() => {
        sounds.celebrate();
        if (onComplete) onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [measuredCount, onComplete]);

  const handleMeasure = (sideKey) => {
    if (measured[sideKey] || allDone || activeSide) return;

    setActiveSide(sideKey);
    sounds.click();

    // Animate the ruler for 600ms then reveal the measurement
    setTimeout(() => {
      setMeasured(prev => ({ ...prev, [sideKey]: true }));
      setActiveSide(null);
    }, 600);
  };

  const squareSize = 180;
  const labelOffset = 36;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '10px' }}>
      <p style={{ margin: 0, fontSize: '1.15rem', textAlign: 'center', lineHeight: 1.6 }}>
        🔍 Tap each side of the square to measure it with your <strong style={{ color: '#FFE66D' }}>magic ruler</strong>!
      </p>

      {/* Progress chips */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {SIDES.map(s => (
          <div key={s.key} style={{
            padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
            background: measured[s.key] ? 'rgba(78, 205, 196, 0.25)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${measured[s.key] ? '#4ECDC4' : 'rgba(255,255,255,0.15)'}`,
            color: measured[s.key] ? '#4ECDC4' : 'rgba(255,255,255,0.4)',
          }}>
            {measured[s.key] ? '✓ ' : ''}{s.label}
          </div>
        ))}
      </div>

      {/* The interactive square with labels outside */}
      <div style={{ position: 'relative', width: squareSize + labelOffset * 2, height: squareSize + labelOffset * 2 }}>

        {/* The square itself */}
        <div style={{
          position: 'absolute',
          top: labelOffset, left: labelOffset,
          width: squareSize, height: squareSize,
          background: 'linear-gradient(135deg, #6C63FF, #8B5CF6)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(108, 99, 255, 0.4), inset 0 0 20px rgba(255,255,255,0.1)',
          border: '3px solid rgba(255,255,255,0.2)',
        }} />

        {/* Corner dots */}
        {[[0,0],[1,0],[0,1],[1,1]].map(([cx, cy], i) => (
          <div key={i} style={{
            position: 'absolute',
            top: labelOffset + cy * squareSize - 5,
            left: labelOffset + cx * squareSize - 5,
            width: 10, height: 10, borderRadius: '50%',
            background: '#FFE66D', border: '2px solid #1a1a2e', zIndex: 5,
          }} />
        ))}

        {/* TOP — clickable edge */}
        <div
          onClick={() => handleMeasure('top')}
          style={{
            position: 'absolute',
            top: 0, left: labelOffset,
            width: squareSize, height: labelOffset,
            cursor: measured.top ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <AnimatePresence mode="wait">
            {activeSide === 'top' ? (
              <motion.div key="ruler" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ fontSize: '1.4rem', transformOrigin: 'left' }}>📏</motion.div>
            ) : measured.top ? (
              <motion.div key="val" initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ background: '#4ECDC4', color: '#1a1a2e', padding: '3px 14px', borderRadius: '6px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 2px 8px rgba(78,205,196,0.4)' }}>
                5 cm
              </motion.div>
            ) : (
              <motion.div key="prompt" whileHover={{ scale: 1.1 }}
                style={{ background: 'rgba(255,255,255,0.12)', padding: '3px 14px', borderRadius: '6px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', border: '1px dashed rgba(255,255,255,0.3)' }}>
                Tap to measure
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM — clickable edge */}
        <div
          onClick={() => handleMeasure('bottom')}
          style={{
            position: 'absolute',
            bottom: 0, left: labelOffset,
            width: squareSize, height: labelOffset,
            cursor: measured.bottom ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <AnimatePresence mode="wait">
            {activeSide === 'bottom' ? (
              <motion.div key="ruler" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ fontSize: '1.4rem', transformOrigin: 'left' }}>📏</motion.div>
            ) : measured.bottom ? (
              <motion.div key="val" initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ background: '#4ECDC4', color: '#1a1a2e', padding: '3px 14px', borderRadius: '6px', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 2px 8px rgba(78,205,196,0.4)' }}>
                5 cm
              </motion.div>
            ) : (
              <motion.div key="prompt" whileHover={{ scale: 1.1 }}
                style={{ background: 'rgba(255,255,255,0.12)', padding: '3px 14px', borderRadius: '6px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', border: '1px dashed rgba(255,255,255,0.3)' }}>
                Tap to measure
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LEFT — clickable edge */}
        <div
          onClick={() => handleMeasure('left')}
          style={{
            position: 'absolute',
            top: labelOffset, left: 0,
            width: labelOffset, height: squareSize,
            cursor: measured.left ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <AnimatePresence mode="wait">
            {activeSide === 'left' ? (
              <motion.div key="ruler" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ fontSize: '1.4rem', transformOrigin: 'top' }}>📐</motion.div>
            ) : measured.left ? (
              <motion.div key="val" initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ background: '#4ECDC4', color: '#1a1a2e', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', writingMode: 'vertical-rl', boxShadow: '0 2px 8px rgba(78,205,196,0.4)' }}>
                5 cm
              </motion.div>
            ) : (
              <motion.div key="prompt" whileHover={{ scale: 1.1 }}
                style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 3px', borderRadius: '6px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', border: '1px dashed rgba(255,255,255,0.3)', writingMode: 'vertical-rl' }}>
                Tap
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT — clickable edge */}
        <div
          onClick={() => handleMeasure('right')}
          style={{
            position: 'absolute',
            top: labelOffset, right: 0,
            width: labelOffset, height: squareSize,
            cursor: measured.right ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <AnimatePresence mode="wait">
            {activeSide === 'right' ? (
              <motion.div key="ruler" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ fontSize: '1.4rem', transformOrigin: 'top' }}>📐</motion.div>
            ) : measured.right ? (
              <motion.div key="val" initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ background: '#4ECDC4', color: '#1a1a2e', padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.8rem', writingMode: 'vertical-rl', boxShadow: '0 2px 8px rgba(78,205,196,0.4)' }}>
                5 cm
              </motion.div>
            ) : (
              <motion.div key="prompt" whileHover={{ scale: 1.1 }}
                style={{ background: 'rgba(255,255,255,0.12)', padding: '8px 3px', borderRadius: '6px', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', border: '1px dashed rgba(255,255,255,0.3)', writingMode: 'vertical-rl' }}>
                Tap
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            style={{
              color: '#FFE66D', fontWeight: 'bold', fontSize: '1.3rem', textAlign: 'center',
              padding: '12px 24px', borderRadius: '12px',
              background: 'rgba(255, 230, 77, 0.1)', border: '1px solid rgba(255,230,77,0.3)',
            }}
          >
            🎉 All 4 sides are exactly <span style={{ color: '#4ECDC4' }}>5 cm</span>! It's a perfect square!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
