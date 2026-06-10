import React from 'react';
import { useTranslation } from 'react-i18next';

export const LoadingSpinner = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: 'white'
    }}>
      <div style={{
        border: '4px solid #333',
        borderTop: '4px solid #4CAF50',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }} />
      <p>{message || t('loading')}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const InlineSpinner = () => {
  return (
    <div style={{
      display: 'inline-block',
      border: '2px solid #333',
      borderTop: '2px solid #4CAF50',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      animation: 'spin 1s linear infinite',
      marginRight: '10px'
    }} />
  );
};
