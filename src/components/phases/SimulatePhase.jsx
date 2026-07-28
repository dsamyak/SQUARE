import React, { useState } from 'react';
import { usePhase } from '../../hooks/usePhase';
import { motion, AnimatePresence } from 'framer-motion';
import SquareBuilder from '../simulations/SquareBuilder';
import ShapeSpotter from '../simulations/ShapeSpotter';
import ShapeSorter from '../simulations/ShapeSorter';
import Popup from '../ui/Popup';
import BadgeUnlock from '../ui/BadgeUnlock';
import { useQuestions } from '../../hooks/useQuestions';
import { generateSessionQuestions } from '../../utils/questionBank';

export default function SimulatePhase() {
  const { advance } = usePhase();
  const { startPractice } = useQuestions();
  const [station, setStation] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [popup, setPopup] = useState(null);
  const [showBadge, setShowBadge] = useState(false);

  const handleStationComplete = (id) => {
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
    }
  };

  const tabs = [
    { id: 1, label: 'Build It', icon: '🔨' },
    { id: 2, label: 'Spot It', icon: '🔍' },
    { id: 3, label: 'Sort It', icon: '🗑️' },
  ];

  const handleAdvance = () => {
    setShowBadge(true);
    setTimeout(() => {
      setShowBadge(false);
      startPractice(generateSessionQuestions(20));
      // No need to call advance(), START_PRACTICE sets the phase to PLAY
    }, 2500);
  };

  return (
    <div className="simulate-screen">
      <AnimatePresence>
        {showBadge && (
          <BadgeUnlock 
            title="Simulator Champion!" 
            subtitle="You completed all the stations!" 
            icon="🏆" 
            onClose={() => {}} 
          />
        )}
      </AnimatePresence>
      
      <Popup 
        isOpen={popup !== null}
        type="hint"
        title={`Station ${popup?.id}`}
        message={popup?.msg}
        onConfirm={() => setPopup(null)}
        confirmText="Got it!"
      />

      <div className="station-tabs">
        {tabs.map((tab) => {
          const isLocked = tab.id > 1 && !completed.includes(tab.id - 1);
          const isActive = station === tab.id;
          const isCompleted = completed.includes(tab.id);
          
          return (
            <motion.div 
              key={tab.id}
              whileHover={!isLocked ? { scale: 1.05 } : {}}
              onClick={() => {
                if (!isLocked) {
                  setStation(tab.id);
                  const msgs = {
                    1: "Drag the tiles onto the grid to build a square. Make sure all sides match!",
                    2: "Time to go on a shape hunt! Can you find all the squares hiding on the screen?",
                    3: "Drag only the Perfect Squares into the bin!"
                  };
                  if (!completed.includes(tab.id)) {
                    setPopup({ id: tab.id, msg: msgs[tab.id] });
                  }
                }
              }}
              className={`station-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
            >
              <span style={{ fontSize: '1.2rem' }}>{isLocked ? '🔒' : tab.icon}</span>
              <span>{tab.label}</span>
              {isCompleted && <span style={{ color: 'var(--green-light)', marginLeft: '4px' }}>✓</span>}
            </motion.div>
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
                  <button className="btn btn-primary" onClick={handleAdvance}>Next: Play Phase →</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
