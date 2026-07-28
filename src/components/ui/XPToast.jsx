import React, { useEffect, useState } from 'react';

export default function XPToast({ amount, onComplete }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className="xp-toast">
      +{amount} XP ⭐
    </div>
  );
}
