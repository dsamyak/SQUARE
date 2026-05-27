import { motion } from 'framer-motion';
import { usePhase } from '../../hooks/usePhase';
import { narrate, stopNarration } from '../../utils/audio';
import { introNarration } from '../../utils/narration';

export default function IntroScreen() {
  const { advance } = usePhase();

  const handleStart = () => {
    // Play narration on user click — this satisfies the browser autoplay policy
    const handle = narrate(introNarration());
    
    // Wait a brief moment so the user hears the greeting, then advance
    setTimeout(() => {
      handle.cancel();
      stopNarration();
      advance();
    }, 3000);
  };

  return (
    <div className="intro-screen">
      <motion.div 
        className="intro-badge"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span>⬛</span> Grade 1 Geometry
      </motion.div>

      <motion.h1 
        className="intro-title"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        What is a Square?
      </motion.h1>

      <motion.p 
        className="intro-subtitle"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Let's discover squares everywhere!
      </motion.p>

      <motion.p 
        className="intro-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Join us on a fun journey to learn about squares, build them, and find them in the world around you.
      </motion.p>

      <motion.div 
        className="intro-journey-map"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="intro-journey-step">
          <span className="intro-journey-icon">🔍</span>
          <span className="intro-journey-label">Wonder</span>
        </div>
        <span className="intro-journey-arrow">→</span>
        <div className="intro-journey-step">
          <span className="intro-journey-icon">📖</span>
          <span className="intro-journey-label">Story</span>
        </div>
        <span className="intro-journey-arrow">→</span>
        <div className="intro-journey-step">
          <span className="intro-journey-icon">🧪</span>
          <span className="intro-journey-label">Simulate</span>
        </div>
        <span className="intro-journey-arrow">→</span>
        <div className="intro-journey-step">
          <span className="intro-journey-icon">🎮</span>
          <span className="intro-journey-label">Play</span>
        </div>
        <span className="intro-journey-arrow">→</span>
        <div className="intro-journey-step">
          <span className="intro-journey-icon">📓</span>
          <span className="intro-journey-label">Reflect</span>
        </div>
      </motion.div>

      <motion.button 
        className="btn btn-primary btn-lg"
        onClick={handleStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Start Learning 🚀
      </motion.button>
    </div>
  );
}
