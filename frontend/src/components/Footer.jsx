import { useTranslation } from 'react-i18next';

const COLORS = {
  primary: '#2d2d2d',
  secondary: '#e6e7e8',
  darkBg: '#738065',
};

function Footer() {
  const { t } = useTranslation();
  return (
    <footer style={{ backgroundColor: COLORS.darkBg, borderTop: `2px solid ${COLORS.secondary}`, padding: '20px', textAlign: 'center', marginTop: 'auto' }}>
      <p style={{ margin: 0, color: COLORS.primary, fontSize: '0.9rem', fontWeight: 'bold' }}>
        © {new Date().getFullYear()} PoemGarden. {t('all_rights_reserved') || 'Tüm hakları saklıdır.'}
      </p>
    </footer>
  );
}

export default Footer;
