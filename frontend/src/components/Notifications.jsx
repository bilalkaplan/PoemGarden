import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const COLORS = {
  secondary: '#feadb9',
  dark: '#919D85',
  darkBg: '#738065',
  primary: '#2d2d2d'
};

function Notifications() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('https://poemgarden.onrender.com/api/auth/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Bildirimler yüklenemedi:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const handleMarkRead = async (notifId, poemId) => {
    try {
      await axios.put(`https://poemgarden.onrender.com/api/auth/notifications/${notifId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => n._id === notifId ? { ...n, read: true } : n));
      window.location.href = `/?open=${poemId}`;
    } catch (err) {
      console.error("Bildirim okunamadı:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          border: `1px solid ${COLORS.secondary}`,
          backgroundColor: COLORS.dark,
          color: 'white',
          cursor: 'pointer',
          fontSize: '0.95rem',
          fontWeight: 'bold',
          position: 'relative'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#c41c1c',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            backgroundColor: COLORS.darkBg,
            border: `1px solid ${COLORS.secondary}`,
            borderRadius: '6px',
            minWidth: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          {notifications.length === 0 ? (
            <div style={{ padding: '12px', color: '#E6E6FA', fontSize: '0.85rem' }}>
              {t('no_notifications')}
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif._id}
                onClick={() => handleMarkRead(notif._id, notif.poem._id)}
                style={{
                  padding: '10px 12px',
                  borderBottom: `1px solid ${COLORS.dark}`,
                  cursor: 'pointer',
                  backgroundColor: notif.read ? COLORS.dark : '#5a5245',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6b5d52'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.read ? COLORS.dark : '#5a5245'}
              >
                <div style={{ flex: 1 }}>
                  <small style={{ color: '#E6E6FA', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    {notif.from?.nickname}
                  </small>
                  <div style={{ color: '#E6E6FA', fontSize: '0.85rem', marginTop: '2px' }}>
                    {notif.message}
                  </div>
                  <div style={{ color: '#D8BFD8', fontSize: '0.8rem', marginTop: '2px', fontStyle: 'italic' }}>
                    "{notif.poem?.title}"
                  </div>
                </div>
                {!notif.read && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#E6E6FA',
                      marginLeft: '8px'
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
