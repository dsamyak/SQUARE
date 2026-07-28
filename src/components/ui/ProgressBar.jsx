import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ current, total, streak = 0 }) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100)) || 0;

  return (
    <div className="progress-bar-container" style={{ maxWidth: 400, margin: '0 auto 16px', width: '100%' }}>
      <div className="progress-bar-label">
        <span>Question {current} of {total}</span>
        {streak > 1 && (
          <motion.span 
            initial={{ scale: 0.8 }} 
            animate={{ scale: 1 }}
            style={{ color: 'var(--gold)', fontWeight: 'bold' }}
          >
            🔥 {streak} Streak!
          </motion.span>
        )}
      </div>
      <div className="progress-bar-track" style={{ position: 'relative', overflow: 'hidden' }}>
        <motion.div 
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ position: 'relative' }}
        >
          {/* Shimmer effect */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
            animation: 'shimmer 2s infinite linear',
            transform: 'skewX(-20deg)'
          }} />
        </motion.div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
}
