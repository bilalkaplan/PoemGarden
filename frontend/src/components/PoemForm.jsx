import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const COLORS = {
  primary: '#ffffff',
  secondary: '#8b7355',
  darkBg: '#738065',
};

function PoemForm({ onSuccess, setToast }) {
  const { t } = useTranslation();
  const [newPoem, setNewPoem] = useState({ title: '', content: '', font: 'Arial' });
  const token = localStorage.getItem('token');
  const fonts = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Comic Sans MS'];

  const handleAddPoem = async (e) => {
    e.preventDefault();
    try {
        await axios.post('https://poemgarden.onrender.com/api/poems', newPoem, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewPoem({ title: '', content: '', font: 'Arial' });
        if (onSuccess) onSuccess();
        if (setToast) setToast({ message: t('poem_added') || 'Şiir eklendi', type: 'success' });
    } catch (error) {
        if (setToast) setToast({ message: t('poem_add_failed') || "Şiir eklenirken hata oluştu.", type: 'error' });
    }
  };

  return (
    <form onSubmit={handleAddPoem} style={{ backgroundColor: COLORS.darkBg, padding: '15px', borderRadius: '10px', marginBottom: '25px', borderLeft: `4px solid ${COLORS.secondary}` }}>
      <input 
        placeholder={t('poem_title')} 
        value={newPoem.title} 
        onChange={(e) => setNewPoem({...newPoem, title: e.target.value})} 
        required
        style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '5px', border: 'none', boxSizing: 'border-box', fontSize: '0.95rem', backgroundColor: '#444', color: COLORS.primary }} 
      />
      <textarea 
        placeholder={t('poem_content')} 
        value={newPoem.content} 
        onChange={(e) => setNewPoem({...newPoem, content: e.target.value})} 
        required
        style={{ width: '100%', padding: '8px', height: '80px', borderRadius: '5px', border: 'none', marginBottom: '8px', boxSizing: 'border-box', fontSize: '0.9rem', backgroundColor: '#444', color: COLORS.primary, resize: 'none', overflow: 'auto' }} 
      />
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <select 
          value={newPoem.font} 
          onChange={(e) => setNewPoem({...newPoem, font: e.target.value})}
          style={{ padding: '6px 8px', borderRadius: '5px', border: 'none', boxSizing: 'border-box', fontSize: '0.85rem', flex: 1, backgroundColor: '#444', color: COLORS.primary }}
        >
          {fonts.map(font => (
            <option key={font} value={font} style={{ color: COLORS.primary }}>{font}</option>
          ))}
        </select>
      </div>
      <button type="submit" style={{ width: '100%', padding: '8px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' }}>
        {t('add_poem_btn')}
      </button>
    </form>
  );
}

export default PoemForm;
