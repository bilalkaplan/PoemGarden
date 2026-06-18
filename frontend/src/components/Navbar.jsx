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
    <nav style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: COLORS.darkBg, borderBottom: `2px solid ${COLORS.secondary}`, alignItems: 'center', gap: '20px' }}>
      
      {/* Logo ve Marka */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: COLORS.primary, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.5rem' }}>
        <img src="/logo.jpg" alt="Logo" style={{ height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${COLORS.secondary}` }} />
        PoemGarden
      </Link>
      
      {/* Sağ Taraf: Kullanıcı İşlemleri ve Diller */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '25px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!user ? (
            <>
              <Link to="/login" style={{ color: COLORS.primary, textDecoration: 'none', fontSize: '1rem', transition: 'color 0.2s', fontWeight: '500' }} onMouseEnter={(e) => e.target.style.color = COLORS.secondary} onMouseLeave={(e) => e.target.style.color = COLORS.primary}>{t('login')}</Link>
              <Link to="/register" style={{ padding: '6px 16px', borderRadius: '4px', border: `1px solid ${COLORS.secondary}`, backgroundColor: COLORS.secondary, color: 'white', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>{t('register')}</Link>
            </>
          ) : (
            <>
              <Notifications />
              <Link to="/profile" style={{ padding: '6px 14px', borderRadius: '4px', border: `1px solid ${COLORS.secondary}`, backgroundColor: COLORS.dark, color: 'white', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>👤 {t('profile')}</Link>
              <button onClick={handleLogout} style={{ padding: '6px 14px', borderRadius: '4px', border: `1px solid ${COLORS.secondary}`, backgroundColor: COLORS.dark, color: 'white', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}>{t('logout')}</button>
            </>
          )}
        </div>
        
        {/* Dikey ayırıcı çizgi */}
        <div style={{ width: '1px', height: '28px', backgroundColor: COLORS.secondary, opacity: 0.6 }}></div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
                  color: i18n.language === lang ? 'white' : '#f0f0f0', 
                  border: `1px solid ${COLORS.secondary}`, borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' 
                }}
              >
                <img src={flagUrls[lang]} alt={lang} style={{ width: '16px', borderRadius: '2px' }} />
                {lang}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
