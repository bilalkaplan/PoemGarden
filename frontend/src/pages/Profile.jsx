import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';

function Profile() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const DEFAULT_AVATAR = "/default-avatar.svg";
  const [user, setUser] = useState(null);
  const [myPoems, setMyPoems] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', bio: '', avatar: '' });
  const [editingPoemId, setEditingPoemId] = useState(null);
  const [editPoemData, setEditPoemData] = useState({ title: '', content: '', font: 'Lora' });
  const [expandedPoem, setExpandedPoem] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [toast, setToast] = useState(null);
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const isOwnProfile = !id || id === storedUser?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (isOwnProfile) {
          if (storedUser) {
            setUser(storedUser);
            setEditData({ 
              firstName: storedUser.firstName, 
              lastName: storedUser.lastName,
              bio: storedUser.bio || 'Edebiyat aşığı.',
              avatar: storedUser.avatar || ''
            });
            fetchMyPoems(storedUser._id);
            fetchMyComments(storedUser._id);
          }
        } else {
          const userRes = await axios.get(`https://poemgarden.onrender.com/api/auth/user/${id}`);
          setUser(userRes.data);
          fetchMyPoems(id);
          fetchMyComments(id);
        }
      } catch (err) {
        console.error("Profil yüklenemedi:", err);
      }
    };
    fetchProfile();
  }, [id]);

  const fetchMyPoems = async (userId) => {
    try {
      const res = await axios.get(`https://poemgarden.onrender.com/api/poems?author=${userId}`);
      setMyPoems(res.data.poems || res.data);
    } catch (err) {
      console.error("Şiirler yüklenemedi:", err);
    }
  };

  const fetchMyComments = async (userId) => {
    try {
      const res = await axios.get(`https://poemgarden.onrender.com/api/poems/user/${userId}/comments`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      setMyComments(res.data);
    } catch (err) {
      console.error("Yorumlar yüklenemedi:", err);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm(t('confirm_delete_user') || 'Bu kullanıcıyı silmek istediğinize emin misiniz? Tüm şiirleri silinecek!')) return;
    try {
      await axios.delete(`https://poemgarden.onrender.com/api/auth/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(t('user_deleted') || 'Kullanıcı silindi');
      window.location.href = '/';
    } catch (err) {
      alert(t('user_delete_failed') || 'Kullanıcı silinirken hata oluştu.');
    }
  };

  const handleDeletePoem = async (poemId) => {
    if (!window.confirm(t('confirm_delete') || 'Are you sure?')) return;
    try {
      await axios.delete(`https://poemgarden.onrender.com/api/poems/${poemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyPoems(storedUser._id);
      alert(t('poem_deleted') || 'Poem deleted');
    } catch (err) {
      alert(t('poem_delete_failed') || 'Şiir silinirken hata oluştu.');
    }
  };

  const handleEditPoem = (poem) => {
    setEditingPoemId(poem._id);
    setEditPoemData({ title: poem.title, content: poem.content, font: poem.font || 'Lora' });
  };

  const handleUpdatePoem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://poemgarden.onrender.com/api/poems/${editingPoemId}`, editPoemData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(t('poem_updated') || 'Poem updated');
      setEditingPoemId(null);
      fetchMyPoems(storedUser._id);
    } catch (err) {
      alert(t('poem_update_failed') || 'Şiir güncellemesi başarısız.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    const updatedUser = { 
      ...user, 
      firstName: editData.firstName, 
      lastName: editData.lastName,
      bio: editData.bio,
      avatar: editData.avatar
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);

    try {
      await axios.put(`https://poemgarden.onrender.com/api/auth/profile`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      alert(t('profile_update_failed') || 'Profile update failed.');
    }
  };


  const fonts = ['Lora', 'Georgia', 'Merriweather', 'Arial', 'Times New Roman'];
  const MAX_PREVIEW_LENGTH = 150;

  if (!user) {
    return <div style={{ textAlign: 'center', color: '#fff', padding: '40px', fontSize: '1.1rem', minHeight: '100vh' }}>{t('loading')}</div>;
  }

  return (
    <div className="blog-container">
      <h1 className="blog-title" style={{ color: '#fff', marginBottom: '32px', fontSize: '2.5rem', textAlign: 'center' }}>{t('profile')}</h1>

      <div className="blog-card" style={{ marginBottom: '40px', padding: '40px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '24px' }}>
          <img src={user.avatar && !user.avatar.includes('<svg') ? user.avatar : DEFAULT_AVATAR} alt="" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(0,0,0,0.05)' }} />
          <div>
            <h2 className="blog-title" style={{ fontSize: '1.8rem', margin: 0 }}>{user.nickname}</h2>
            {user.createdAt && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 12px 0', fontStyle: 'italic' }}>
                {t('joined_in', { date: new Date(user.createdAt).toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' }) })}
              </p>
            )}
            <p style={{ fontSize: '1.05rem', margin: '8px 0', color: 'var(--text-main)', lineHeight: 1.5 }}>{user.bio}</p>
          </div>
        </div>

        {!isEditing || !isOwnProfile ? (
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.95rem', margin: '8px 0', color: 'var(--text-main)' }}><strong>{t('first_name')}:</strong> {user.firstName}</p>
            <p style={{ fontSize: '0.95rem', margin: '8px 0', color: 'var(--text-main)' }}><strong>{t('last_name')}:</strong> {user.lastName}</p>
            <p style={{ fontSize: '0.95rem', margin: '8px 0', color: 'var(--text-main)' }}><strong>{t('email')}:</strong> {user.email}</p>
            
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              {isOwnProfile && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="blog-btn blog-btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  {t('edit_profile')}
                </button>
              )}
              {!isOwnProfile && storedUser?.role === 'admin' && (
                <button 
                  onClick={handleDeleteUser} 
                  className="blog-btn blog-btn-danger"
                  style={{ padding: '8px 16px' }}
                >
                  {t('delete_user') || 'Kullanıcıyı Sil'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                value={editData.firstName} 
                onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                placeholder={t('first_name')}
                className="blog-input"
                style={{ flex: 1, marginBottom: 0 }}
              />
              <input 
                value={editData.lastName} 
                onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                placeholder={t('last_name')}
                className="blog-input"
                style={{ flex: 1, marginBottom: 0 }}
              />
            </div>
            <textarea 
              value={editData.bio} 
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              placeholder={t('bio') || 'Biyografi'}
              className="blog-textarea"
              style={{ minHeight: '80px', marginBottom: 0 }}
            />
            <div style={{ padding: '16px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <label style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'block', marginBottom: '12px', fontWeight: 500 }}>{t('profile_photo') || 'Profil Fotoğrafı (Zorunlu Değil)'}</label>
              <input 
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}
              />
              {editData.avatar && !editData.avatar.includes('<svg') && (
                <img src={editData.avatar} alt="" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginTop: '16px', border: '2px solid rgba(0,0,0,0.05)', display: 'block' }} />
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button type="submit" className="blog-btn blog-btn-primary" style={{ padding: '10px 20px' }}>{t('save')}</button>
              <button type="button" onClick={() => setIsEditing(false)} className="blog-btn blog-btn-ghost" style={{ padding: '10px 20px' }}>{t('cancel')}</button>
            </div>
          </form>
        )}
      </div>

      <div style={{ marginTop: '48px' }}>
        <h2 className="blog-title" style={{ color: '#fff', marginBottom: '24px', fontSize: '1.8rem', textAlign: 'center' }}>
          {isOwnProfile ? t('my_poems') || 'My Poems' : t('user_poems_title', { nickname: user.nickname }) || `${user.nickname}'s Poems`}
        </h2>
        
        {myPoems.length > 0 ? (
          myPoems.map(poem => {
            const isExpanded = expandedPoem === poem._id;
            const shouldTruncate = poem.content.length > MAX_PREVIEW_LENGTH;
            const displayContent = isExpanded ? poem.content : poem.content.substring(0, MAX_PREVIEW_LENGTH);
            
            return (
              <article key={poem._id} className="blog-card">
                {editingPoemId === poem._id ? (
                  <form onSubmit={handleUpdatePoem} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input 
                      value={editPoemData.title} 
                      onChange={(e) => setEditPoemData({ ...editPoemData, title: e.target.value })}
                      placeholder={t('poem_title')}
                      className="blog-input"
                      style={{ fontSize: '1.2rem', fontFamily: 'var(--font-sans)', marginBottom: 0 }}
                    />
                    <textarea 
                      value={editPoemData.content} 
                      onChange={(e) => setEditPoemData({ ...editPoemData, content: e.target.value })}
                      placeholder={t('poem_content')}
                      className="blog-textarea"
                      style={{ minHeight: '150px', fontSize: '1.1rem', fontFamily: editPoemData.font || 'var(--font-serif)', marginBottom: 0 }}
                    />
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Font:</span>
                      <select 
                        value={editPoemData.font} 
                        onChange={(e) => setEditPoemData({ ...editPoemData, font: e.target.value })}
                        className="blog-select"
                        style={{ width: 'auto', marginBottom: 0, padding: '8px 12px' }}
                      >
                        {fonts.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                      <button type="submit" className="blog-btn blog-btn-primary">{t('save')}</button>
                      <button type="button" onClick={() => setEditingPoemId(null)} className="blog-btn blog-btn-ghost">{t('cancel')}</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '16px', marginBottom: '24px' }}>
                      <h3 className="blog-title" style={{ margin: 0, fontSize: '1.4rem' }}>{poem.title}</h3>
                      <div style={{ position: 'relative' }}>
                        <button onClick={() => setOpenMenuId(openMenuId === poem._id ? null : poem._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', padding: '0 8px', lineHeight: 1 }}>⋮</button>
                        {openMenuId === poem._id && (
                          <div style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 0', zIndex: 10, boxShadow: 'var(--shadow-md)', minWidth: '180px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.origin + '/?open=' + poem._id);
                                if (toast) toast({ message: t('link_copied') || 'Bağlantı kopyalandı!', type: 'success' });
                                setOpenMenuId(null);
                              }}
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: 'var(--text-main)', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-sans)' }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.03)'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              🔗 {t('copy_link') || 'Bağlantıyı Kopyala'}
                            </button>
                          </div>
                        )}
                      </div>
                    </header>
                    <p className="poem-content" style={{ fontFamily: poem.font === 'Arial' || !poem.font ? 'var(--font-serif)' : poem.font }}>
                      {displayContent}
                      {shouldTruncate && !isExpanded && '...'}
                    </p>
                    {shouldTruncate && (
                      <div style={{ textAlign: 'center', margin: '24px 0' }}>
                        <button 
                          onClick={() => setExpandedPoem(isExpanded ? null : poem._id)}
                          className="blog-btn blog-btn-secondary"
                          style={{ padding: '6px 16px', fontSize: '0.85rem', borderRadius: '20px' }}
                        >
                          {isExpanded ? t('collapse') : t('read_more')}
                        </button>
                      </div>
                    )}
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '16px', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '16px' }}>
                      {t('date')}: {new Date(poem.createdAt).toLocaleDateString(i18n.language)}
                    </div>
                    {isOwnProfile && (
                      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleEditPoem(poem)}
                          className="blog-btn blog-btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          {t('edit')}
                        </button>
                        <button 
                          onClick={() => handleDeletePoem(poem._id)}
                          className="blog-btn blog-btn-ghost"
                          style={{ padding: '6px 12px', fontSize: '0.85rem', color: 'var(--danger)' }}
                        >
                          {t('delete')}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </article>
            );
          })
        ) : (
          <p style={{ color: '#fff', fontSize: '1.1rem', textAlign: 'center', opacity: 0.9 }}>{t('no_poems_yet')}</p>
        )}
      </div>

      <div style={{ marginTop: '64px' }}>
        <h2 className="blog-title" style={{ color: '#fff', marginBottom: '24px', fontSize: '1.8rem', textAlign: 'center' }}>{t('my_comments') || 'Yorumlarım'}</h2>
        {myComments.length > 0 ? (
          myComments.map(comment => (
            <div key={comment._id} className="blog-card" style={{ padding: '24px' }}>
              {comment.type === 'reply' && comment.parentCommentText && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '12px', paddingLeft: '12px', borderLeft: '3px solid rgba(0,0,0,0.1)' }}>
                  "{comment.parentCommentText}"
                </div>
              )}
              <div style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '16px', wordBreak: 'break-word', lineHeight: 1.5 }}>
                {comment.text}
                {comment.edited && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px', fontStyle: 'italic' }}>{t('edited_tag') || '(Düzenlendi)'}</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <button className="blog-btn blog-btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    {t('go_to_poem')} "{comment.poemTitle}"
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#fff', fontSize: '1.1rem', textAlign: 'center', opacity: 0.9 }}>{t('no_comments_yet') || 'Henüz yorum yapmadınız.'}</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
