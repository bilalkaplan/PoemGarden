import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Notifications from './Notifications';

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="glass-nav">
      {/* Sol: Logo ve Marka */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        <Link to="/" className="nav-brand">
          <img src="/logo.jpg" alt="Logo" onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.svg'; }} />
          PoemGarden
        </Link>
      </div>
      
      {/* Orta: Kullanıcı İşlemleri */}
      <div className="nav-links" style={{ flex: 1, justifyContent: 'center', minWidth: '300px', margin: '10px 0' }}>
        {!user ? (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', marginRight: '16px' }}>{t('login')}</Link>
            <Link to="/register" className="blog-btn blog-btn-primary" style={{ background: '#fff', color: 'var(--bg-color)' }}>{t('register')}</Link>
          </>
        ) : (
          <>
            <Notifications />
            <Link to="/profile" className="blog-btn" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginLeft: '12px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {t('profile')}
            </Link>
            <button onClick={handleLogout} className="blog-btn" style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}>{t('logout')}</button>
          </>
        )}
      </div>
      
      {/* Sağ: Diller */}
      <div className="nav-links" style={{ flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap', minWidth: '200px' }}>
        {['tr', 'en', 'sr', 'de'].map(lang => {
          const flagUrls = { tr: 'https://flagcdn.com/w20/tr.png', en: 'https://flagcdn.com/w20/gb.png', sr: 'https://flagcdn.com/w20/rs.png', de: 'https://flagcdn.com/w20/de.png' };
          const isActive = i18n.language === lang;
          return (
            <button 
              key={lang}
              onClick={() => i18n.changeLanguage(lang)} 
              className="blog-btn"
              style={{ 
                padding: '4px 8px', 
                backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.1)', 
                color: isActive ? 'var(--bg-color)' : '#fff', 
                border: 'none', 
                fontSize: '0.8rem', 
                textTransform: 'uppercase' 
              }}
            >
              <img src={flagUrls[lang]} alt={lang} style={{ width: '16px', borderRadius: '2px', marginRight: '6px' }} />
              {lang}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
