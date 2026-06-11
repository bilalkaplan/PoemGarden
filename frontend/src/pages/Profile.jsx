import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';

const COLORS = {
  primary: '#ffffff',
  secondary: '#8b7355', 
  tertiary: '#6b8e6f',
  dark: '#919D85',
  darkBg: '#738065',
  accent: '#8b7355'
};

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
  const [editPoemData, setEditPoemData] = useState({ title: '', content: '', font: 'Arial' });
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
    setEditPoemData({ title: poem.title, content: poem.content, font: poem.font || 'Arial' });
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


  const fonts = ['Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Comic Sans MS'];
  const MAX_PREVIEW_LENGTH = 150;

  if (!user) {
    return <div style={{ textAlign: 'center', color: '#888', padding: '20px', fontSize: '0.9rem', backgroundColor: COLORS.dark, minHeight: '100vh' }}>{t('loading')}</div>;
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px 10px', color: COLORS.primary, backgroundColor: COLORS.dark, minHeight: '100vh' }}>
      <h1 style={{ color: COLORS.primary, marginBottom: '20px', fontSize: '1.8rem' }}>{t('profile')}</h1>

      <div style={{ backgroundColor: COLORS.darkBg, padding: '15px', borderRadius: '10px', marginBottom: '25px', borderLeft: `4px solid ${COLORS.secondary}` }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', marginBottom: '15px' }}>
          <img src={user.avatar && !user.avatar.includes('<svg') ? user.avatar : DEFAULT_AVATAR} alt="" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${COLORS.secondary}` }} />
          <div>
            <h2 style={{ fontSize: '1.3rem', color: COLORS.primary, margin: 0 }}>{user.nickname}</h2>
            {user.createdAt && (
              <p style={{ fontSize: '0.75rem', color: '#ccc', margin: '2px 0 8px 0', fontStyle: 'italic' }}>
                {t('joined_in', { date: new Date(user.createdAt).toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' }) })}
              </p>
            )}
            <p style={{ fontSize: '0.9rem', margin: '5px 0', color: COLORS.primary }}>{user.bio}</p>
          </div>
        </div>

        {!isEditing || !isOwnProfile ? (
          <>
            <p style={{ fontSize: '0.9rem', margin: '5px 0', color: COLORS.primary }}><strong>{t('first_name')}:</strong> {user.firstName}</p>
            <p style={{ fontSize: '0.9rem', margin: '5px 0', color: COLORS.primary }}><strong>{t('last_name')}:</strong> {user.lastName}</p>
            <p style={{ fontSize: '0.9rem', margin: '5px 0', color: COLORS.primary }}><strong>{t('email')}:</strong> {user.email}</p>
            {isOwnProfile && (
              <button 
                onClick={() => setIsEditing(true)} 
                style={{ padding: '8px 16px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontSize: '0.85rem', fontWeight: 'bold' }}
              >
                {t('edit_profile')}
              </button>
            )}
            {!isOwnProfile && storedUser?.role === 'admin' && (
              <button 
                onClick={handleDeleteUser} 
                style={{ padding: '8px 16px', backgroundColor: '#c41c1c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', marginLeft: '10px', fontSize: '0.85rem', fontWeight: 'bold' }}
              >
                {t('delete_user') || 'Kullanıcıyı Sil'}
              </button>
            )}
          </>
        ) : (
          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              value={editData.firstName} 
              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
              placeholder={t('first_name')}
              style={{ padding: '8px 10px', borderRadius: '5px', border: 'none', fontSize: '0.9rem', backgroundColor: '#444', color: COLORS.primary }}
            />
            <input 
              value={editData.lastName} 
              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
              placeholder={t('last_name')}
              style={{ padding: '8px 10px', borderRadius: '5px', border: 'none', fontSize: '0.9rem', backgroundColor: '#444', color: COLORS.primary }}
            />
            <textarea 
              value={editData.bio} 
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              placeholder={t('bio') || 'Biyografi'}
              style={{ padding: '8px 10px', borderRadius: '5px', border: 'none', fontSize: '0.9rem', height: '60px', backgroundColor: '#444', color: COLORS.primary, resize: 'none', overflow: 'auto' }}
            />
            <div style={{ padding: '10px', backgroundColor: '#333', borderRadius: '5px' }}>
              <label style={{ fontSize: '0.85rem', color: COLORS.primary, display: 'block', marginBottom: '8px' }}>{t('profile_photo') || 'Profil Fotoğrafı (Zorunlu Değil)'}</label>
              <input 
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ fontSize: '0.8rem', color: 'black', outline: 'none' }}
              />
              {editData.avatar && !editData.avatar.includes('<svg') && (
                <img src={editData.avatar} alt="" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginTop: '8px', border: `2px solid ${COLORS.secondary}` }} />
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ flex: 1, padding: '8px 10px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>{t('save')}</button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '8px 10px', backgroundColor: COLORS.tertiary, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}>{t('cancel')}</button>
            </div>
          </form>
        )}
      </div>

      <div>
        <h2 style={{ color: COLORS.primary, marginBottom: '15px', fontSize: '1.3rem' }}>{isOwnProfile ? t('my_poems') || 'My Poems' : t('user_poems_title', { nickname: user.nickname }) || `${user.nickname}'s Poems`}</h2>
        {myPoems.length > 0 ? (
          myPoems.map(poem => {
            const isExpanded = expandedPoem === poem._id;
            const shouldTruncate = poem.content.length > MAX_PREVIEW_LENGTH;
            const displayContent = isExpanded ? poem.content : poem.content.substring(0, MAX_PREVIEW_LENGTH);
            
            return (
              <div key={poem._id} style={{ backgroundColor: COLORS.darkBg, padding: '12px', borderRadius: '8px', marginBottom: '12px', borderLeft: `3px solid ${COLORS.secondary}` }}>
                {editingPoemId === poem._id ? (
                  <form onSubmit={handleUpdatePoem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      value={editPoemData.title} 
                      onChange={(e) => setEditPoemData({ ...editPoemData, title: e.target.value })}
                      placeholder={t('poem_title')}
                      style={{ padding: '8px 10px', borderRadius: '5px', border: 'none', fontSize: '0.9rem', backgroundColor: '#444', color: COLORS.primary, fontFamily: editPoemData.font }}
                    />
                    <textarea 
                      value={editPoemData.content} 
                      onChange={(e) => setEditPoemData({ ...editPoemData, content: e.target.value })}
                      placeholder={t('poem_content')}
                      style={{ padding: '8px 10px', borderRadius: '5px', border: 'none', height: '100px', fontSize: '0.85rem', backgroundColor: '#444', color: COLORS.primary, fontFamily: editPoemData.font }}
                    />
                    <select 
                      value={editPoemData.font} 
                      onChange={(e) => setEditPoemData({ ...editPoemData, font: e.target.value })}
                      style={{ padding: '8px 10px', borderRadius: '5px', border: 'none', fontSize: '0.85rem', backgroundColor: '#444', color: COLORS.primary }}
                    >
                      {fonts.map(font => (
                        <option key={font} value={font} style={{ color: COLORS.primary }}>{font}</option>
                      ))}
                    </select>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" style={{ flex: 1, padding: '8px 10px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>{t('save')}</button>
                      <button type="button" onClick={() => setEditingPoemId(null)} style={{ flex: 1, padding: '8px 10px', backgroundColor: COLORS.tertiary, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}>{t('cancel')}</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: '0 0 6px 0', color: COLORS.primary, fontSize: '1.05rem' }}>{poem.title}</h3>
                      <div style={{ position: 'relative' }}>
                        <button onClick={() => setOpenMenuId(openMenuId === poem._id ? null : poem._id)} style={{ background: 'none', border: 'none', color: COLORS.primary, fontSize: '1.2rem', cursor: 'pointer', padding: '0 5px' }}>⋮</button>
                        {openMenuId === poem._id && (
                          <div style={{ position: 'absolute', right: 0, top: '100%', backgroundColor: COLORS.dark, borderRadius: '4px', padding: '5px 0', zIndex: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.2)', minWidth: '150px' }}>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.origin + '/?open=' + poem._id);
                                setToast({ message: t('link_copied') || 'Bağlantı kopyalandı!', type: 'success' });
                                setOpenMenuId(null);
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
                    <p style={{ fontSize: '0.9rem', color: COLORS.primary, fontStyle: 'italic', whiteSpace: 'pre-wrap', marginBottom: '6px', fontFamily: poem.font || 'Arial', maxHeight: isExpanded ? 'none' : '80px', overflow: 'hidden' }}>
                      {displayContent}
                      {shouldTruncate && !isExpanded && '...'}
                    </p>
                    {shouldTruncate && (
                      <button 
                        onClick={() => setExpandedPoem(isExpanded ? null : poem._id)}
                        style={{ backgroundColor: 'transparent', color: 'black', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: '0', marginBottom: '6px' }}
                      >
                        {isExpanded ? t('collapse') : t('read_more')}
                      </button>
                    )}
                    <div style={{ color: COLORS.primary, fontSize: '0.8rem', marginTop: '4px' }}>
                      {t('date')}: {new Date(poem.createdAt).toLocaleDateString(i18n.language)}
                    </div>
                    {isOwnProfile && (
                      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleEditPoem(poem)}
                          style={{ padding: '6px 12px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                        >
                          {t('edit')}
                        </button>
                        <button 
                          onClick={() => handleDeletePoem(poem._id)}
                          style={{ padding: '6px 12px', backgroundColor: '#c41c1c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          {t('delete')}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })
        ) : (
          <p style={{ color: COLORS.primary, fontSize: '0.9rem' }}>{t('no_poems_yet')}</p>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: COLORS.primary, marginBottom: '15px', fontSize: '1.3rem' }}>{t('my_comments') || 'Yorumlarım'}</h2>
        {myComments.length > 0 ? (
          myComments.map(comment => (
            <div key={comment._id} style={{ backgroundColor: COLORS.darkBg, padding: '15px', borderRadius: '10px', marginBottom: '15px', borderLeft: `4px solid ${COLORS.secondary}` }}>
              {comment.type === 'reply' && comment.parentCommentText && (
                <div style={{ fontSize: '0.8rem', color: '#ccc', fontStyle: 'italic', marginBottom: '8px', paddingLeft: '8px', borderLeft: '2px solid #555' }}>
                  "{comment.parentCommentText}"
                </div>
              )}
              <div style={{ fontSize: '0.9rem', color: COLORS.primary, marginBottom: '8px', wordBreak: 'break-word' }}>
                {comment.text}
                {comment.edited && <span style={{ fontSize: '0.7rem', color: '#aaa', marginLeft: '6px', fontStyle: 'italic' }}>{t('edited_tag') || '(Düzenlendi)'}</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#ccc' }}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '4px 10px', backgroundColor: COLORS.tertiary, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                    {t('go_to_poem')} "{comment.poemTitle}"
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: COLORS.primary, fontSize: '0.9rem' }}>{t('no_comments_yet') || 'Henüz yorum yapmadınız.'}</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
