import React from 'react';

export default function Notification({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="notice" role="status" aria-live="polite">
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}
