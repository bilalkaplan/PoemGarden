import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
      if (poemId) {
        window.location.href = `/?open=${poemId}`;
      }
    } catch (err) {
      console.error("Bildirim okunamadı:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="blog-btn"
        style={{
          padding: '8px 12px',
          backgroundColor: 'rgba(255,255,255,0.18)',
          border: '1px solid rgba(255,255,255,0.28)',
          color: '#fff',
          position: 'relative'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: 'var(--danger)',
              color: '#fff',
              borderRadius: '50%',
              width: '19px',
              height: '19px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="notif-dropdown">
          {notifications.length === 0 ? (
            <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center' }}>
              {t('no_notifications')}
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif._id}
                onClick={() => handleMarkRead(notif._id, notif.poem?._id)}
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  backgroundColor: notif.read ? 'transparent' : 'rgba(79, 111, 84, 0.08)',
                  transition: 'background-color 0.15s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.86rem' }}>
                    {notif.from?.nickname}
                  </div>
                  <div style={{ color: 'var(--text-main)', fontSize: '0.84rem', marginTop: '2px' }}>
                    {notif.message}
                  </div>
                  {notif.poem?.title && (
                    <div style={{ color: 'var(--accent)', fontSize: '0.8rem', marginTop: '2px', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      "{notif.poem.title}"
                    </div>
                  )}
                </div>
                {!notif.read && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent)',
                      flexShrink: 0
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
