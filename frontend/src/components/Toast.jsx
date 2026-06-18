import { useEffect } from 'react';

const COLORS = {
  success: '#6b8e6f',
  error: '#c41c1c',
  info: '#e6e7e8',
  text: '#ffffff'
};

function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: COLORS[type] || COLORS.info,
      color: COLORS.text,
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 1000,
      fontWeight: 'bold',
      animation: 'slideIn 0.3s ease-out'
    }}>
      {message}
    </div>
  );
}

export default Toast;
