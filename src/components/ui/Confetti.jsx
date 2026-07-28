import React, { useEffect, useState } from 'react';

export default function Confetti() {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const colors = ['var(--gold)', 'var(--green)', 'var(--coral)', 'var(--teal)', 'var(--pink)', 'white'];
    const newPieces = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 2 + 2}s`,
      animationDelay: `${Math.random() * 0.5}s`,
      backgroundColor: colors[Math.floor(Math.random() * colors.length)]
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div 
          key={p.id} 
          className="confetti-piece"
          style={{ 
            left: p.left, 
            backgroundColor: p.backgroundColor,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay
          }} 
        />
      ))}
    </div>
  );
}
