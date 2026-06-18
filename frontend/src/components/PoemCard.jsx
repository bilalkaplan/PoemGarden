import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CommentSection from './CommentSection';

const COLORS = {
  primary: '#ffffff',
  secondary: '#e6e7e8',
  tertiary: '#6b8e6f',
  dark: '#919D85',
  darkBg: '#738065',
  accent: '#e6e7e8'
};

const DEFAULT_AVATAR = "/default-avatar.svg";

function PoemCard({ poem, user, onUpdate, setToast }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editingPoemId, setEditingPoemId] = useState(null);
  const [editPoemData, setEditPoemData] = useState({ title: '', content: '', font: 'Arial' });
  const token = localStorage.getItem('token');
  const fonts = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Comic Sans MS'];
  const MAX_PREVIEW_LENGTH = 200;

  const handleEditPoem = () => {
    setEditingPoemId(poem._id);
    setEditPoemData({ title: poem.title, content: poem.content, font: poem.font || 'Arial' });
  };

  const handleUpdatePoem = async () => {
    try {
      await axios.put(`https://poemgarden.onrender.com/api/poems/${poem._id}`, editPoemData, { headers: { Authorization: `Bearer ${token}` } });
      setEditingPoemId(null);
      if (onUpdate) onUpdate();
      if (setToast) setToast({ message: t('poem_updated') || 'Şiir güncellendi', type: 'success' });
    } catch (err) {
      if (setToast) setToast({ message: t('poem_update_failed') || 'Şiir güncellenemedi.', type: 'error' });
    }
  };

  const handleDeletePoem = async () => {
    if (!window.confirm(t('confirm_delete') || 'Emin misiniz?')) return;
    try {
      await axios.delete(`https://poemgarden.onrender.com/api/poems/${poem._id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (onUpdate) onUpdate();
      if (setToast) setToast({ message: t('poem_deleted') || 'Şiir silindi', type: 'success' });
    } catch (err) {
      if (setToast) setToast({ message: t('poem_delete_failed') || 'Şiir silinemedi.', type: 'error' });
    }
  };

  const shouldTruncate = poem.content.length > MAX_PREVIEW_LENGTH;
  const displayContent = isExpanded ? poem.content : poem.content.substring(0, MAX_PREVIEW_LENGTH);

  return (
    <div style={{ backgroundColor: COLORS.darkBg, padding: '12px', borderRadius: '8px', marginBottom: '12px', borderLeft: `3px solid ${COLORS.secondary}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Link to={`/profile/${poem.author?._id}`} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <img src={poem.author?.avatar || DEFAULT_AVATAR} alt="Author" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${COLORS.secondary}` }} />
          <div>
            <h3 style={{ margin: '0', color: COLORS.primary, fontSize: '1.1rem' }}>{poem.title}</h3>
            <small style={{ color: COLORS.primary, fontSize: '0.8rem' }}>{t('poet')}: {poem.author?.nickname || t('anonymous')}</small>
          </div>
        </Link>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowMenu(!showMenu)} style={{ background: 'none', border: 'none', color: COLORS.primary, fontSize: '1.2rem', cursor: 'pointer', padding: '0 5px' }}>⋮</button>
          {showMenu && (
            <div style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: COLORS.dark, borderRadius: '4px', padding: '5px 0', zIndex: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.2)', minWidth: '150px' }}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/?open=' + poem._id);
                  if (setToast) setToast({ message: t('link_copied') || 'Bağlantı kopyalandı!', type: 'success' });
                  setShowMenu(false);
                }}
                style={{ display: 'block', width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: 'white', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = COLORS.darkBg}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                🔗 {t('copy_link') || 'Bağlantıyı Kopyala'}
              </button>
            </div>
          )}
        </div>
      </div>

      {editingPoemId === poem._id ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input value={editPoemData.title} onChange={(e) => setEditPoemData({ ...editPoemData, title: e.target.value })} style={{ padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: '#444', color: COLORS.primary }} />
          <textarea value={editPoemData.content} onChange={(e) => setEditPoemData({ ...editPoemData, content: e.target.value })} style={{ padding: '8px', height: '120px', borderRadius: '6px', border: 'none', backgroundColor: '#444', color: COLORS.primary, resize: 'none' }} />
          <select value={editPoemData.font} onChange={(e) => setEditPoemData({ ...editPoemData, font: e.target.value })} style={{ padding: '6px 8px', borderRadius: '5px', border: 'none', boxSizing: 'border-box', fontSize: '0.85rem', backgroundColor: '#444', color: COLORS.primary }}>
            {fonts.map(font => (
              <option key={font} value={font} style={{ color: COLORS.primary }}>{font}</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleUpdatePoem} style={{ padding: '8px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{t('save')}</button>
            <button onClick={() => setEditingPoemId(null)} style={{ padding: '8px', backgroundColor: COLORS.tertiary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{t('cancel')}</button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '0.95rem', color: COLORS.primary, fontStyle: 'italic', whiteSpace: 'pre-wrap', marginBottom: '8px', fontFamily: poem.font || 'Arial', maxHeight: isExpanded ? 'none' : '100px', overflow: 'hidden' }}>
          {displayContent}
          {shouldTruncate && !isExpanded && '...'}
        </p>
      )}
      
      {shouldTruncate && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ backgroundColor: 'transparent', color: 'black', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: '0', marginBottom: '8px' }}
        >
          {isExpanded ? t('collapse') : t('read_more')}
        </button>
      )}

      {user && (poem.author?._id === user._id || user.role === 'admin') && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          {poem.author?._id === user._id && (
            <button onClick={handleEditPoem} style={{ padding: '6px 10px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{t('edit')}</button>
          )}
          <button onClick={handleDeletePoem} style={{ padding: '6px 10px', backgroundColor: '#c41c1c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{t('delete')}</button>
        </div>
      )}

      <CommentSection poem={poem} user={user} onUpdate={onUpdate} setToast={setToast} />
    </div>
  );
}

export default PoemCard;
