import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function PoemForm({ onSuccess, setToast }) {
  const { t } = useTranslation();
  const [newPoem, setNewPoem] = useState({ title: '', content: '', font: 'Lora' });
  const [isOpen, setIsOpen] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token') || storedUser?.token;
  const fonts = ['Lora', 'Georgia', 'Merriweather', 'Times New Roman', 'Arial'];

  const handleAddPoem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://poemgarden.onrender.com/api/poems', newPoem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewPoem({ title: '', content: '', font: 'Lora' });
      if (onSuccess) onSuccess();
      if (setToast) setToast({ message: t('poem_added') || 'Şiir eklendi', type: 'success' });
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      if (setToast) setToast({ message: serverMsg || t('poem_add_failed') || 'Şiir eklenirken hata oluştu.', type: 'error' });
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="composer-trigger"
      >
        <div className="composer-trigger-left">
          <div className="composer-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '1.02rem', color: 'var(--text-main)' }}>
              {t('add_new_poem') || 'Bir şiir ekleyin'}
            </div>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('write_new_poem_prompt')}
            </div>
          </div>
        </div>
        <span className="blog-btn blog-btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
          + {t('add_poem_btn')}
        </span>
      </button>
    );
  }

  return (
    <form onSubmit={handleAddPoem} className="blog-card" style={{ padding: '28px 32px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="composer-icon-circle" style={{ width: '34px', height: '34px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.18rem', fontWeight: 600, margin: 0, color: 'var(--text-main)' }}>
            {t('add_new_poem') || 'Bir şiir ekleyin'}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="blog-btn blog-btn-ghost"
          style={{ padding: '6px 12px', fontSize: '0.82rem' }}
        >
          {t('close_form') || 'Daralt'} ▲
        </button>
      </div>

      <input
        placeholder={t('poem_title')}
        value={newPoem.title}
        onChange={(e) => setNewPoem({ ...newPoem, title: e.target.value })}
        required
        className="blog-input"
        style={{
          fontFamily: newPoem.font || 'var(--font-serif)',
          fontSize: '1.12rem',
          fontWeight: '500'
        }}
      />

      <textarea
        placeholder={t('poem_content')}
        value={newPoem.content}
        onChange={(e) => setNewPoem({ ...newPoem, content: e.target.value })}
        required
        className="blog-textarea"
        style={{
          fontFamily: newPoem.font || 'var(--font-serif)',
          fontSize: '1.08rem',
          minHeight: '150px'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Font:</span>
          <select
            value={newPoem.font}
            onChange={(e) => setNewPoem({ ...newPoem, font: e.target.value })}
            className="blog-select"
            style={{ width: 'auto', marginBottom: 0, padding: '8px 14px', fontFamily: newPoem.font }}
          >
            {fonts.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
            ))}
          </select>
        </div>
        {newPoem.content.trim().length > 0 && (
          <span className="meta-badge">
            {newPoem.content.split('\n').filter(line => line.trim() !== '').length} {t('lines_count')}
          </span>
        )}
      </div>

      <button type="submit" className="blog-btn blog-btn-primary" style={{ width: '100%', padding: '13px', fontSize: '1.02rem', fontWeight: 600 }}>
        {t('add_poem_btn')}
      </button>
    </form>
  );
}

export default PoemForm;
