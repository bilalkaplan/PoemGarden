import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import PoemForm from '../components/PoemForm';
import PoemCard from '../components/PoemCard';
import Toast from '../components/Toast';

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
    <div className="blog-container">
      <h1 className="blog-title" style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2.5rem', color: '#fff' }}>
        {t('welcome')}
      </h1>

      {user && !openId ? (
        <PoemForm onSuccess={() => fetchPoems(1)} setToast={setToastConfig} />
      ) : !user && !openId ? (
        <p style={{ textAlign: 'center', color: '#fff', marginBottom: '40px', fontSize: '1.1rem', opacity: 0.9 }}>
          {t('login_to_add_poem')}
        </p>
      ) : null}

      {openId && (
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <button 
            onClick={() => window.location.href = '/'} 
            className="blog-btn blog-btn-secondary"
            style={{ fontWeight: 'bold' }}
          >
            {t('see_all_poems') || 'Tüm Şiirleri Gör'}
          </button>
        </div>
      )}

      <div>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#fff', fontSize: '1.1rem', padding: '40px' }}>{t('loading_poems')}</p>
        ) : poems && poems.length > 0 ? poems.map(poem => (
          <PoemCard 
            key={poem._id} 
            poem={poem} 
            user={user} 
            onUpdate={() => fetchPoems(page)} 
            setToast={setToastConfig} 
          />
        )) : (
          <p style={{ textAlign: 'center', color: '#fff', fontSize: '1.1rem', opacity: 0.9 }}>{t('no_poems_yet')}</p>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '32px' }}>
            <button 
              onClick={() => fetchPoems(Math.max(1, page-1))} 
              disabled={page===1} 
              className="blog-btn"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', cursor: page===1 ? 'not-allowed' : 'pointer', opacity: page===1 ? 0.5 : 1 }}
            >
              {t('prev') || 'Prev'}
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => fetchPoems(idx+1)} 
                className="blog-btn"
                style={{ backgroundColor: page===idx+1 ? '#fff' : 'rgba(255,255,255,0.2)', color: page===idx+1 ? 'var(--bg-color)' : '#fff', fontWeight: page===idx+1 ? 'bold' : 'normal' }}
              >
                {idx+1}
              </button>
            ))}
            <button 
              onClick={() => fetchPoems(Math.min(totalPages, page+1))} 
              disabled={page===totalPages} 
              className="blog-btn"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', cursor: page===totalPages ? 'not-allowed' : 'pointer', opacity: page===totalPages ? 0.5 : 1 }}
            >
              {t('next') || 'Next'}
            </button>
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
