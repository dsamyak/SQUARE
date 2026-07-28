import React from 'react';
import Confetti from './Confetti';

export default function BadgeUnlock({ title, subtitle, icon, onClose }) {
  return (
    <div className="badge-unlock-overlay" onClick={onClose}>
      <Confetti />
      <div className="badge-unlock-icon">{icon}</div>
      <h2 className="badge-unlock-title">{title}</h2>
      <p className="badge-unlock-subtitle">{subtitle}</p>
      <p style={{ marginTop: '30px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
        Tap anywhere to continue
      </p>
    </div>
  );
}
