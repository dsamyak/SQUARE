import React, { useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { sounds } from '../../utils/audio';

const SHAPES = [
  { id: 's1', type: 'square', color: '#6C63FF', isSquare: true },
  { id: 'r1', type: 'rectangle', color: '#FF6B6B', isSquare: false, width: 80, height: 40 },
  { id: 'c1', type: 'circle', color: '#4ECDC4', isSquare: false },
  { id: 's2', type: 'square', color: '#FFE66D', isSquare: true },
];

export default function ShapeSorter({ onComplete }) {
  const [sorted, setSorted] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const binRef = useRef(null);
  
  const handleDragEnd = (event, info, shape) => {
    const binRect = binRef.current.getBoundingClientRect();
    const point = { x: info.point.x, y: info.point.y };
    
    // Simple AABB collision check, accounting for page scroll
    const isInsideBin = (
      point.x >= binRect.left + window.scrollX && point.x <= binRect.right + window.scrollX &&
      point.y >= binRect.top + window.scrollY && point.y <= binRect.bottom + window.scrollY
    );

    if (isInsideBin) {
      if (shape.isSquare) {
        sounds.correct();
        const newSorted = [...sorted, shape.id];
        setSorted(newSorted);
        setErrorMsg('');
        
        // If all squares are found (there are 2)
        if (newSorted.length === 2) {
          setTimeout(onComplete, 1000);
        }
      } else {
        sounds.wrong();
        setErrorMsg('Oops! That shape does not have 4 EQUAL sides.');
      }
    }
  };

  return (
    <div className="shape-sorter-simulation" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
      <p style={{ margin: 0, fontSize: '1.2rem', textAlign: 'center' }}>
        Drag only the <strong>Perfect Squares</strong> into the bin!
      </p>

      {/* The Shapes conveyor */}
      <div style={{ display: 'flex', gap: '20px', minHeight: '80px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {SHAPES.map(shape => {
          if (sorted.includes(shape.id)) return <div key={shape.id} style={{ width: 60, height: 60 }} />; // placeholder
          
          let borderRadius = '8px';
          let width = 60;
          let height = 60;
          
          if (shape.type === 'circle') borderRadius = '50%';
          if (shape.type === 'rectangle') { width = shape.width; height = shape.height; }

          return (
            <motion.div
              key={shape.id}
              drag
              dragSnapToOrigin={!shape.isSquare}
              onDragEnd={(e, info) => handleDragEnd(e, info, shape)}
              whileDrag={{ scale: 1.2, zIndex: 10 }}
              style={{
                width,
                height,
                backgroundColor: shape.color,
                borderRadius,
                cursor: 'grab',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          );
        })}
      </div>

      <div style={{ height: '30px', color: '#FF6B6B', fontWeight: 'bold' }}>
        {errorMsg}
      </div>

      {/* The Target Bin */}
      <div 
        ref={binRef}
        style={{
          width: '200px',
          height: '150px',
          border: '4px dashed rgba(255,255,255,0.4)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: 'rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.6)'
        }}
      >
        <span style={{ fontSize: '2rem' }}>🗑️</span>
        <span>Square Bin</span>
        {sorted.length === 2 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: '#4ECDC4', marginTop: '10px' }}>
            All Sorted! ✓
          </motion.div>
        )}
      </div>
    </div>
  );
}
