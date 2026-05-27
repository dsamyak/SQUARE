import React, { useState } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { motion, AnimatePresence } from 'framer-motion';
import SquareBuilder from '../simulations/SquareBuilder';
import ShapeSpotter from '../simulations/ShapeSpotter';
import ShapeSorter from '../simulations/ShapeSorter';
import SquareMeasurer from '../simulations/SquareMeasurer';

export default function SimulatePhase() {
  const { advance } = usePhase();
  const [station, setStation] = useState(1);
  const [completed, setCompleted] = useState([]);

  const handleStationComplete = (id) => {
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
    }
  };

  const tabs = [
    { id: 1, label: 'Build It' },
    { id: 2, label: 'Spot It' },
    { id: 3, label: 'Sort It' },
    { id: 4, label: 'Measure It' },
  ];

  return (
    <div className="simulate-screen">
      <div className="station-tabs" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', width: '100%', justifyContent: 'center' }}>
        {tabs.map((tab) => {
          const isLocked = tab.id > 1 && !completed.includes(tab.id - 1);
          const isActive = station === tab.id;
          const isCompleted = completed.includes(tab.id);
          
          return (
            <div 
              key={tab.id}
              onClick={() => {
                if (!isLocked) setStation(tab.id);
              }}
              className={`station-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
              style={{ 
                cursor: isLocked ? 'not-allowed' : 'pointer', 
                padding: '10px 16px', 
                borderRadius: '8px', 
                background: isActive ? '#6C63FF' : 'rgba(255,255,255,0.1)', 
                whiteSpace: 'nowrap',
                opacity: isLocked ? 0.4 : 1
              }}
            >
              {isLocked && <span style={{ marginRight: '6px' }}>🔒</span>}
              {tab.label} {isCompleted && '✓'}
            </div>
          );
        })}
      </div>

      <div className="glass-card" style={{ width: '100%', minHeight: '400px', position: 'relative', marginTop: '20px' }}>
        <AnimatePresence mode="wait">
          {station === 1 && (
            <motion.div key="st1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 className="station-header">Sandbox 1: I can build a square!</h2>
              <SquareBuilder onComplete={() => handleStationComplete(1)} />
              {completed.includes(1) && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button className="btn btn-primary" onClick={() => setStation(2)}>Go to Sandbox 2 →</button>
                </div>
              )}
            </motion.div>
          )}

          {station === 2 && (
            <motion.div key="st2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 className="station-header">Sandbox 2: Squares are everywhere!</h2>
              <ShapeSpotter onComplete={() => handleStationComplete(2)} />
              {completed.includes(2) && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button className="btn btn-primary" onClick={() => setStation(3)}>Go to Sandbox 3 →</button>
                </div>
              )}
            </motion.div>
          )}

          {station === 3 && (
            <motion.div key="st3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 className="station-header">Sandbox 3: Sort the shapes!</h2>
              <ShapeSorter onComplete={() => handleStationComplete(3)} />
              {completed.includes(3) && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button className="btn btn-primary" onClick={() => setStation(4)}>Go to Sandbox 4 →</button>
                </div>
              )}
            </motion.div>
          )}

          {station === 4 && (
            <motion.div key="st4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 className="station-header">Sandbox 4: Measure the sides!</h2>
              <SquareMeasurer onComplete={() => handleStationComplete(4)} />
              {completed.includes(4) && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button className="btn btn-primary" onClick={advance}>Next: Play Phase →</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
