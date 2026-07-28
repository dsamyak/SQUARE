import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../../utils/audio';
import Confetti from '../ui/Confetti';

const SHAPES = [
  { id: 's1', type: 'square', color: '#6C63FF', isSquare: true },
  { id: 'r1', type: 'rectangle', color: '#FF6B6B', isSquare: false, width: 80, height: 40 },
  { id: 'c1', type: 'circle', color: '#4ECDC4', isSquare: false },
  { id: 's2', type: 'square', color: '#FFE66D', isSquare: true },
  { id: 't1', type: 'triangle', color: '#FFA07A', isSquare: false, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
  { id: 's3', type: 'square', color: '#98FB98', isSquare: true },
];

export default function ShapeSorter({ onComplete }) {
  const [sorted, setSorted] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [binShake, setBinShake] = useState(false);
  const [binAccept, setBinAccept] = useState(false);
  const [complete, setComplete] = useState(false);
  const binRef = useRef(null);
  
  const squareCount = SHAPES.filter(s => s.isSquare).length;

  const handleDragEnd = (event, info, shape) => {
    if (complete) return;
    const binRect = binRef.current.getBoundingClientRect();
    const point = { x: info.point.x, y: info.point.y };
    
    const isInsideBin = (
      point.x >= binRect.left && point.x <= binRect.right &&
      point.y >= binRect.top && point.y <= binRect.bottom
    );

    if (isInsideBin) {
      if (shape.isSquare) {
        sounds.correct();
        const newSorted = [...sorted, shape.id];
        setSorted(newSorted);
        setErrorMsg('');
        
        setBinAccept(true);
        setTimeout(() => setBinAccept(false), 300);

        if (newSorted.length === squareCount) {
          setComplete(true);
          sounds.celebrate();
          setTimeout(onComplete, 1500);
        }
      } else {
        sounds.wrong();
        setErrorMsg('Oops! That shape does not have 4 EQUAL sides.');
        setBinShake(true);
        setTimeout(() => setBinShake(false), 500);
      }
    }
  };

  return (
    <div className="shape-sorter-simulation" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
      {complete && <Confetti />}
      <p style={{ margin: 0, fontSize: '1.2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Drag only the <strong>Perfect Squares</strong> into the bin!
      </p>

      <div style={{ display: 'flex', gap: '20px', minHeight: '80px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {SHAPES.map(shape => {
          if (sorted.includes(shape.id)) return <div key={shape.id} style={{ width: 60, height: 60 }} />; 
          
          let style = {
            width: shape.width || 60,
            height: shape.height || 60,
            backgroundColor: shape.color,
            borderRadius: shape.type === 'circle' ? '50%' : '8px',
            cursor: 'grab',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          };
          
          if (shape.clipPath) {
            style.clipPath = shape.clipPath;
            style.borderRadius = 0;
          }

          return (
            <motion.div
              key={shape.id}
              drag={!complete}
              dragSnapToOrigin={!shape.isSquare}
              onDragEnd={(e, info) => handleDragEnd(e, info, shape)}
              whileDrag={{ scale: 1.2, zIndex: 10 }}
              style={style}
            />
          );
        })}
      </div>

      <div style={{ height: '30px', color: 'var(--coral)', fontWeight: 'bold' }}>
        {errorMsg}
      </div>

      <motion.div 
        ref={binRef}
        animate={binShake ? { x: [-10, 10, -10, 10, 0], borderColor: 'var(--coral)' } : binAccept ? { scale: 1.1, borderColor: 'var(--green)' } : {}}
        transition={{ duration: 0.3 }}
        style={{
          width: '200px', height: '150px',
          border: '4px dashed rgba(255,255,255,0.4)',
          borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)'
        }}
      >
        <span style={{ fontSize: '2rem' }}>🗑️</span>
        <span>Square Bin</span>
        <AnimatePresence>
          {complete && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: 'var(--green-light)', marginTop: '10px' }}>
              All Sorted! ✓
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
