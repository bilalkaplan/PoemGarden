import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      style={{
        backgroundColor: 'rgba(34, 46, 36, 0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.18)',
        padding: '20px 16px',
        textAlign: 'center',
        marginTop: 'auto'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.94)', fontSize: '0.88rem', fontWeight: 600, letterSpacing: '0.01em' }}>
          © {new Date().getFullYear()} PoemGarden. {t('all_rights_reserved') || 'Tüm Hakları Saklıdır.'}
        </p>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.72)', fontSize: '0.76rem', lineHeight: 1.5 }}>
          {t('copyright_disclaimer')}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
