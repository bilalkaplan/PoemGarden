import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import PoemForm from '../components/PoemForm';
import PoemCard from '../components/PoemCard';
import Toast from '../components/Toast';

const COLORS = {
  primary: '#ffffff',
  secondary: '#e6e7e8',
  tertiary: '#6b8e6f',
  dark: '#919D85',
  darkBg: '#738065',
  accent: '#e6e7e8'
};

function Home() {
  const { t } = useTranslation();
  const [poems, setPoems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toastConfig, setToastConfig] = useState({ message: '', type: 'info' });
  
  const user = JSON.parse(localStorage.getItem('user'));
  const urlParams = new URLSearchParams(window.location.search);
  const openId = urlParams.get('open');

  const fetchPoems = async (p = page) => {
    try {
      if (openId) {
        const res = await axios.get(`https://poemgarden.onrender.com/api/poems/${openId}`);
        setPoems([res.data]);
        setTotalPages(1);
        setPage(1);
      } else {
        const res = await axios.get(`https://poemgarden.onrender.com/api/poems?page=${p}&limit=10`);
        setPoems(res.data.poems || res.data);
        setTotalPages(res.data.totalPages || 1);
        setPage(res.data.currentPage || p);
      }
    } catch (err) {
      console.error("Şiirler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchPoems();
    const interval = setInterval(() => fetchPoems(page), 5000);
    return () => clearInterval(interval);
  }, [page]);

  return (
    <div style={{ padding: '20px 10px', color: COLORS.primary, maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: COLORS.dark, minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: COLORS.primary, fontSize: '1.8rem' }}>{t('welcome')}</h1>

      {user && !openId ? (
        <PoemForm onSuccess={() => fetchPoems(1)} setToast={setToastConfig} />
      ) : !user && !openId ? (
        <p style={{ textAlign: 'center', color: COLORS.primary, marginBottom: '20px', fontSize: '0.9rem' }}>{t('login_to_add_poem')}</p>
      ) : null}

      {openId && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            onClick={() => window.location.href = '/'} 
            style={{ padding: '8px 16px', backgroundColor: COLORS.tertiary, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {t('see_all_poems') || 'Tüm Şiirleri Gör'}
          </button>
        </div>
      )}

      <div>
        {loading ? (
          <p style={{ textAlign: 'center', color: COLORS.primary, fontSize: '1rem', padding: '20px' }}>{t('loading_poems')}</p>
        ) : poems && poems.length > 0 ? poems.map(poem => (
          <PoemCard 
            key={poem._id} 
            poem={poem} 
            user={user} 
            onUpdate={() => fetchPoems(page)} 
            setToast={setToastConfig} 
          />
        )) : (
          <p style={{ textAlign: 'center', color: COLORS.primary, fontSize: '0.9rem' }}>{t('no_poems_yet')}</p>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '12px' }}>
            <button onClick={() => fetchPoems(Math.max(1, page-1))} disabled={page===1} style={{ padding: '6px 10px', borderRadius: '4px', border: 'none', backgroundColor: COLORS.darkBg, color: '#ffffff', cursor: page===1 ? 'not-allowed' : 'pointer', opacity: page===1 ? 0.5 : 1 }}>{t('prev') || 'Prev'}</button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button key={idx} onClick={() => fetchPoems(idx+1)} style={{ padding: '6px 10px', borderRadius: '4px', border: `1px solid ${page===idx+1 ? COLORS.secondary : 'transparent'}`, backgroundColor: page===idx+1 ? COLORS.secondary : COLORS.darkBg, color: '#ffffff', cursor: 'pointer', fontWeight: page===idx+1 ? 'bold' : 'normal' }}>{idx+1}</button>
            ))}
            <button onClick={() => fetchPoems(Math.min(totalPages, page+1))} disabled={page===totalPages} style={{ padding: '6px 10px', borderRadius: '4px', border: 'none', backgroundColor: COLORS.darkBg, color: '#ffffff', cursor: page===totalPages ? 'not-allowed' : 'pointer', opacity: page===totalPages ? 0.5 : 1 }}>{t('next') || 'Next'}</button>
          </div>
        )}
      </div>

      <Toast 
        message={toastConfig.message} 
        type={toastConfig.type} 
        onClose={() => setToastConfig({ message: '', type: 'info' })} 
      />
    </div>
  );
}

export default Home;
