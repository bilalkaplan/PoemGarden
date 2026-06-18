import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Notifications from './Notifications';

const COLORS = {
  primary: '#2d2d2d',
  secondary: '#e6e7e8',
  tertiary: '#6b8e6f',
  dark: '#919D85',
  darkBg: '#738065',
};

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
    <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: COLORS.darkBg, borderBottom: `2px solid ${COLORS.secondary}`, alignItems: 'center' }}>
      
      {/* Sol: Logo ve Marka */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', minWidth: '250px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '15px', color: COLORS.primary, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.8rem' }}>
          <img src="/logo.jpg" alt="Logo" style={{ height: '60px', width: '60px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${COLORS.secondary}` }} />
          PoemGarden
        </Link>
      </div>
      
      {/* Orta: Kullanıcı İşlemleri */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', minWidth: '300px', margin: '10px 0' }}>
        {!user ? (
          <>
            <Link to="/login" style={{ color: COLORS.primary, textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s', fontWeight: '500' }} onMouseEnter={(e) => e.target.style.color = COLORS.secondary} onMouseLeave={(e) => e.target.style.color = COLORS.primary}>{t('login')}</Link>
            <Link to="/register" style={{ padding: '8px 18px', borderRadius: '4px', border: `1px solid ${COLORS.secondary}`, backgroundColor: COLORS.secondary, color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>{t('register')}</Link>
          </>
        ) : (
          <>
            <Notifications />
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '4px', border: `1px solid ${COLORS.secondary}`, backgroundColor: COLORS.dark, color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {t('profile')}
            </Link>
            <button onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: '4px', border: `1px solid ${COLORS.secondary}`, backgroundColor: COLORS.dark, color: 'white', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}>{t('logout')}</button>
          </>
        )}
      </div>
      
      {/* Sağ: Diller */}
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '8px', minWidth: '250px' }}>
        {['tr', 'en', 'sr', 'de'].map(lang => {
          const flagUrls = { tr: 'https://flagcdn.com/w20/tr.png', en: 'https://flagcdn.com/w20/gb.png', sr: 'https://flagcdn.com/w20/rs.png', de: 'https://flagcdn.com/w20/de.png' };
          return (
            <button 
              key={lang}
              onClick={() => i18n.changeLanguage(lang)} 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 10px', cursor: 'pointer', 
                backgroundColor: i18n.language === lang ? COLORS.secondary : COLORS.dark, 
                color: i18n.language === lang ? COLORS.primary : '#f0f0f0', 
                border: `1px solid ${COLORS.secondary}`, borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' 
              }}
            >
              <img src={flagUrls[lang]} alt={lang} style={{ width: '16px', borderRadius: '2px' }} />
              {lang}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
