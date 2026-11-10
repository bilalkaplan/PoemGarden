import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CommentSection from './CommentSection';

const DEFAULT_AVATAR = "/default-avatar.svg";

function PoemCard({ poem, user, onUpdate, setToast }) {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editingPoemId, setEditingPoemId] = useState(null);
  const [editPoemData, setEditPoemData] = useState({ title: '', content: '', font: 'Lora' });
  const token = localStorage.getItem('token');
  const fonts = ['Lora', 'Georgia', 'Merriweather', 'Times New Roman', 'Arial'];
  const MAX_PREVIEW_LENGTH = 340;

  const handleEditPoem = () => {
    setEditingPoemId(poem._id);
    setEditPoemData({ title: poem.title, content: poem.content, font: poem.font || 'Lora' });
  };

  const handleUpdatePoem = async () => {
    try {
      await axios.put(`https://poemgarden.onrender.com/api/poems/${poem._id}`, editPoemData, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      await axios.delete(`https://poemgarden.onrender.com/api/poems/${poem._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onUpdate) onUpdate();
      if (setToast) setToast({ message: t('poem_deleted') || 'Şiir silindi', type: 'success' });
    } catch (err) {
      if (setToast) setToast({ message: t('poem_delete_failed') || 'Şiir silinemedi.', type: 'error' });
    }
  };

  const shouldTruncate = poem.content.length > MAX_PREVIEW_LENGTH;
  const displayContent = isExpanded ? poem.content : poem.content.substring(0, MAX_PREVIEW_LENGTH);
  const lineCount = poem.content ? poem.content.split('\n').filter(l => l.trim() !== '').length : 0;
  const formattedDate = poem.createdAt
    ? new Date(poem.createdAt).toLocaleDateString(i18n.language || 'tr', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '';

  return (
    <article className="blog-card">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '16px', marginBottom: '20px', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <Link to={`/profile/${poem.author?._id}`}>
            <img
              src={poem.author?.avatar || DEFAULT_AVATAR}
              alt="Author"
              onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(94, 126, 98, 0.25)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            />
          </Link>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h3 className="blog-title">{poem.title}</h3>
            <div className="blog-meta-row">
              <Link to={`/profile/${poem.author?._id}`} className="blog-meta">
                {poem.author?.nickname || t('anonymous')}
              </Link>
              {formattedDate && (
                <>
                  <span className="meta-dot">•</span>
                  <span className="meta-date">{formattedDate}</span>
                </>
              )}
              {lineCount > 0 && (
                <span className="meta-badge">
                  {lineCount} {t('lines_count')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          {poem.font && (
            <span className="meta-badge" style={{ fontFamily: poem.font }}>
              {poem.font}
            </span>
          )}
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '1.4rem',
              cursor: 'pointer',
              padding: '2px 8px',
              borderRadius: '6px',
              lineHeight: 1
            }}
          >
            ⋮
          </button>
          {showMenu && (
            <div style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: '#fff', borderRadius: '8px', padding: '6px 0', zIndex: 10, boxShadow: 'var(--shadow-md)', minWidth: '185px', border: '1px solid rgba(0,0,0,0.06)' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + '/?open=' + poem._id);
                  if (setToast) setToast({ message: t('link_copied') || 'Bağlantı kopyalandı!', type: 'success' });
                  setShowMenu(false);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: 'var(--text-main)', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-sans)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                🔗 {t('copy_link') || 'Bağlantıyı Kopyala'}
              </button>
            </div>
          )}
        </div>
      </header>

      {editingPoemId === poem._id ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <input
            value={editPoemData.title}
            onChange={(e) => setEditPoemData({ ...editPoemData, title: e.target.value })}
            className="blog-input"
            style={{ fontSize: '1.15rem', fontFamily: editPoemData.font || 'var(--font-serif)', marginBottom: 0 }}
          />
          <textarea
            value={editPoemData.content}
            onChange={(e) => setEditPoemData({ ...editPoemData, content: e.target.value })}
            className="blog-textarea"
            style={{ fontSize: '1.08rem', fontFamily: editPoemData.font || 'var(--font-serif)', minHeight: '200px', marginBottom: 0 }}
          />
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Font:</span>
            <select
              value={editPoemData.font}
              onChange={(e) => setEditPoemData({ ...editPoemData, font: e.target.value })}
              className="blog-select"
              style={{ width: 'auto', marginBottom: 0 }}
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button onClick={handleUpdatePoem} className="blog-btn blog-btn-primary">{t('save')}</button>
            <button onClick={() => setEditingPoemId(null)} className="blog-btn blog-btn-ghost">{t('cancel')}</button>
          </div>
        </div>
      ) : (
        <>
          <div className="poem-stage">
            <span className="poem-quote-mark">“</span>
            <p className="poem-content" style={{ fontFamily: poem.font === 'Arial' || !poem.font ? 'var(--font-serif)' : poem.font }}>
              {displayContent}
              {shouldTruncate && !isExpanded && '...'}
            </p>
          </div>

          {shouldTruncate && (
            <div style={{ textAlign: 'center', margin: '18px 0' }}>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="blog-btn blog-btn-secondary"
                style={{ padding: '6px 18px', fontSize: '0.85rem', borderRadius: '20px' }}
              >
                {isExpanded ? t('collapse') : t('read_more')}
              </button>
            </div>
          )}
        </>
      )}

      {user && (poem.author?._id === user._id || user.role === 'admin') && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', justifyContent: 'flex-end' }}>
          {poem.author?._id === user._id && (
            <button onClick={handleEditPoem} className="blog-btn blog-btn-secondary" style={{ padding: '6px 14px', fontSize: '0.84rem' }}>
              {t('edit')}
            </button>
          )}
          <button onClick={handleDeletePoem} className="blog-btn blog-btn-ghost" style={{ padding: '6px 14px', fontSize: '0.84rem', color: 'var(--danger)' }}>
            {t('delete')}
          </button>
        </div>
      )}

      <CommentSection poem={poem} user={user} onUpdate={onUpdate} setToast={setToast} />
    </article>
  );
}

export default PoemCard;
