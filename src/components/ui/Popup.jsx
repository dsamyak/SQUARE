import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Popup({ isOpen, type, title, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel' }) {
  if (!isOpen) return null;

  const typeConfig = {
    hint: { icon: '💡', className: 'popup-hint' },
    success: { icon: '✅', className: 'popup-success' },
    error: { icon: '❌', className: 'popup-error' },
    achievement: { icon: '🏆', className: 'popup-success' },
    completion: { icon: '🎉', className: 'popup-success' },
    confirm: { icon: '❓', className: 'popup-hint' },
  };

  const config = typeConfig[type] || typeConfig.hint;

  return (
    <AnimatePresence>
      <div className="popup-overlay">
        <motion.div 
          className={`popup-content ${config.className}`}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="popup-icon">{config.icon}</div>
          <h2 className="popup-title">{title}</h2>
          <p className="popup-message">{message}</p>
          <div className="popup-actions">
            {onCancel && (
              <button className="btn btn-outline btn-sm" onClick={onCancel}>
                {cancelText}
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
