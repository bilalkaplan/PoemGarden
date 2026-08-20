import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function PoemForm({ onSuccess, setToast }) {
  const { t } = useTranslation();
  const [newPoem, setNewPoem] = useState({ title: '', content: '', font: 'Lora' });
  const token = localStorage.getItem('token');
  const fonts = ['Lora', 'Georgia', 'Merriweather', 'Arial', 'Times New Roman'];

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
        if (setToast) setToast({ message: t('poem_add_failed') || "Şiir eklenirken hata oluştu.", type: 'error' });
    }
  };

  return (
    <form onSubmit={handleAddPoem} className="blog-card" style={{ padding: '24px', marginBottom: '40px' }}>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-main)' }}>
        {t('add_new_poem') || 'Yeni Şiir Yaz'}
      </h2>
      <input 
        placeholder={t('poem_title')} 
        value={newPoem.title} 
        onChange={(e) => setNewPoem({...newPoem, title: e.target.value})} 
        required
        className="blog-input"
        style={{ fontFamily: newPoem.font === 'Lora' || newPoem.font === 'Merriweather' || newPoem.font === 'Georgia' ? newPoem.font : 'var(--font-sans)', fontSize: '1.2rem', fontWeight: '500' }} 
      />
      <textarea 
        placeholder={t('poem_content')} 
        value={newPoem.content} 
        onChange={(e) => setNewPoem({...newPoem, content: e.target.value})} 
        required
        className="blog-textarea"
        style={{ fontFamily: newPoem.font === 'Lora' || newPoem.font === 'Merriweather' || newPoem.font === 'Georgia' ? newPoem.font : 'var(--font-serif)', fontSize: '1.1rem', minHeight: '150px' }} 
      />
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Font:</span>
        <select 
          value={newPoem.font} 
          onChange={(e) => setNewPoem({...newPoem, font: e.target.value})}
          className="blog-select"
          style={{ width: 'auto', marginBottom: 0, padding: '8px 12px' }}
        >
          {fonts.map(font => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="blog-btn blog-btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1.05rem' }}>
        {t('add_poem_btn')}
      </button>
    </form>
  );
}

export default PoemForm;
