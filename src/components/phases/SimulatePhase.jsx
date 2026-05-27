import React, { useState } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { motion, AnimatePresence } from 'framer-motion';
import SquareBuilder from '../simulations/SquareBuilder';
import ShapeSpotter from '../simulations/ShapeSpotter';

export default function SimulatePhase() {
  const { advance } = usePhase();
  const [station, setStation] = useState(1);
  const [completed, setCompleted] = useState([]);

  const handleStationComplete = (id) => {
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
    }
  };

  return (
    <div className="simulate-screen">
      <div className="station-tabs">
        <div className={`station-tab ${station === 1 ? 'active' : ''} ${completed.includes(1) ? 'completed' : ''}`}>
          Sandbox 1: Build It
        </div>
        <div className={`station-tab ${station === 2 ? 'active' : ''} ${completed.includes(2) ? 'completed' : ''}`}>
          Sandbox 2: Spot It
        </div>
      </div>

      <div className="glass-card" style={{ width: '100%', minHeight: '400px', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {station === 1 && (
            <motion.div key="st1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 className="station-header">Hypothesis: I can build a square!</h2>
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
              <h2 className="station-header">Hypothesis: Squares are everywhere!</h2>
              <ShapeSpotter onComplete={() => handleStationComplete(2)} />
              {completed.includes(2) && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button className="btn btn-primary" onClick={advance}>Next: Play →</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
