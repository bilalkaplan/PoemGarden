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
      <div className="nav-left">
        <Link to="/" className="nav-brand">
          PoemGarden
        </Link>
      </div>

      <div className="nav-center nav-links">
        {!user ? (
          <>
            <Link
              to="/login"
              className="blog-btn"
              style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', padding: '8px 16px' }}
            >
              {t('login')}
            </Link>
            <Link
              to="/register"
              className="blog-btn"
              style={{ background: '#fff', color: 'var(--text-main)', fontWeight: 600, padding: '8px 16px' }}
            >
              {t('register')}
            </Link>
          </>
        ) : (
          <>
            <Notifications />
            <Link
              to="/profile"
              className="blog-btn"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', padding: '8px 14px', border: '1px solid rgba(255,255,255,0.28)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {t('profile')}
            </Link>
            <button
              onClick={handleLogout}
              className="blog-btn"
              style={{ background: 'rgba(0,0,0,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)', padding: '8px 14px' }}
            >
              {t('logout')}
            </button>
          </>
        )}
      </div>

      <div className="nav-right nav-links">
        {['tr', 'en', 'sr', 'de'].map(lang => {
          const flagUrls = {
            tr: 'https://flagcdn.com/w20/tr.png',
            en: 'https://flagcdn.com/w20/gb.png',
            sr: 'https://flagcdn.com/w20/rs.png',
            de: 'https://flagcdn.com/w20/de.png'
          };
          const isActive = i18n.language === lang;
          return (
            <button
              key={lang}
              onClick={() => i18n.changeLanguage(lang)}
              className="blog-btn"
              style={{
                padding: '5px 9px',
                backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.14)',
                color: isActive ? 'var(--text-main)' : '#fff',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                textTransform: 'uppercase'
              }}
            >
              <img src={flagUrls[lang]} alt={lang} style={{ width: '15px', borderRadius: '2px', marginRight: '5px' }} />
              {lang}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
