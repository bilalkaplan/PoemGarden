import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Notifications from './Notifications';

const COLORS = {
  primary: '#2d2d2d',
  secondary: '#8b7355',
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
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', backgroundColor: COLORS.darkBg, borderBottom: `2px solid ${COLORS.secondary}`, alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: COLORS.primary, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.4rem' }}>🌸 PoemGarden</Link>
        
        {!user ? (
          <>
            <Link to="/login" style={{ color: COLORS.primary, textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = COLORS.secondary} onMouseLeave={(e) => e.target.style.color = COLORS.primary}>{t('login')}</Link>
            <Link to="/register" style={{ color: COLORS.primary, textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = COLORS.secondary} onMouseLeave={(e) => e.target.style.color = COLORS.primary}>{t('register')}</Link>
          </>
        ) : (
          <>
            <Notifications />
            <Link to="/profile" style={{ padding: '6px 12px', borderRadius: '4px', border: `1px solid ${COLORS.secondary}`, backgroundColor: COLORS.dark, color: 'white', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>👤 {t('profile')}</Link>
            <button onClick={handleLogout} style={{ padding: '6px 12px', borderRadius: '4px', border: `1px solid ${COLORS.secondary}`, backgroundColor: COLORS.dark, color: 'white', cursor: 'pointer', fontSize: '0.95rem', marginLeft: '8px' }}>{t('logout')}</button>
          </>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        {['tr', 'en', 'sr', 'de'].map(lang => (
          <button 
            key={lang}
            onClick={() => i18n.changeLanguage(lang)} 
            style={{ 
              padding: '6px 12px', cursor: 'pointer', 
              backgroundColor: i18n.language === lang ? COLORS.secondary : COLORS.dark, 
              color: i18n.language === lang ? 'white' : '#f0f0f0', 
              border: `1px solid ${COLORS.secondary}`, borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' 
            }}
          >
            {lang}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
