import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      style={{
        backgroundColor: 'rgba(98, 111, 84, 0.85)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px',
        textAlign: 'center',
        marginTop: 'auto'
      }}
    >
      <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.92)', fontSize: '0.88rem', fontWeight: 500, letterSpacing: '0.01em' }}>
        © {new Date().getFullYear()} PoemGarden. {t('all_rights_reserved') || 'Tüm Hakları Saklıdır.'}
      </p>
    </footer>
  );
}

export default Footer;
