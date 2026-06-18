import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const COLORS = {
  primary: '#ffffff',
  secondary: '#e6e7e8',
  tertiary: '#6b8e6f',
  accent: '#e6e7e8',
  danger: '#c41c1c'
};

const DEFAULT_AVATAR = "/default-avatar.svg";

function CommentSection({ poem, user, onUpdate, setToast }) {
  const { t } = useTranslation();
  const [commentInput, setCommentInput] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [replyingTo, setReplyingTo] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [editCommentInput, setEditCommentInput] = useState('');
  const [editReplyInput, setEditReplyInput] = useState('');
  const token = localStorage.getItem('token');

  const handleAddComment = async () => {
    if (!commentInput || commentInput.trim() === '') return;
    try {
        await axios.post(`https://poemgarden.onrender.com/api/poems/${poem._id}/comments`, { text: commentInput }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCommentInput('');
        if (onUpdate) onUpdate();
    } catch (error) {
      if (setToast) setToast({ message: t('comment_add_failed') || "Yorum eklenemedi.", type: 'error' });
    }
  };

  const handleAddReply = async (commentId) => {
    const text = replyInputs[commentId];
    if (!text || text.trim() === '') return;
    try {
        await axios.post(`https://poemgarden.onrender.com/api/poems/${poem._id}/comments/${commentId}/replies`, { text }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setReplyInputs({ ...replyInputs, [commentId]: '' });
        setReplyingTo({ ...replyingTo, [commentId]: false });
        if (onUpdate) onUpdate();
    } catch (error) {
      if (setToast) setToast({ message: t('reply_add_failed') || "Yanıt eklenemedi.", type: 'error' });
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentInput || editCommentInput.trim() === '') return;
    try {
        await axios.put(`https://poemgarden.onrender.com/api/poems/${poem._id}/comments/${commentId}`, { text: editCommentInput }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEditingComment(null);
        if (onUpdate) onUpdate();
        if (setToast) setToast({ message: t('comment_updated') || 'Yorum güncellendi', type: 'success' });
    } catch (error) {
        if (setToast) setToast({ message: t('error') || 'Hata oluştu', type: 'error' });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm(t('confirm_delete') || 'Silmek istediğinize emin misiniz?')) return;
    try {
        await axios.delete(`https://poemgarden.onrender.com/api/poems/${poem._id}/comments/${commentId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (onUpdate) onUpdate();
        if (setToast) setToast({ message: t('comment_deleted') || 'Yorum silindi', type: 'success' });
    } catch (error) {
        if (setToast) setToast({ message: t('error') || 'Hata oluştu', type: 'error' });
    }
  };

  const handleUpdateReply = async (commentId, replyId) => {
    if (!editReplyInput || editReplyInput.trim() === '') return;
    try {
        await axios.put(`https://poemgarden.onrender.com/api/poems/${poem._id}/comments/${commentId}/replies/${replyId}`, { text: editReplyInput }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setEditingReply(null);
        if (onUpdate) onUpdate();
        if (setToast) setToast({ message: t('reply_updated') || 'Yanıt güncellendi', type: 'success' });
    } catch (error) {
        if (setToast) setToast({ message: t('error') || 'Hata oluştu', type: 'error' });
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    if (!window.confirm(t('confirm_delete') || 'Silmek istediğinize emin misiniz?')) return;
    try {
        await axios.delete(`https://poemgarden.onrender.com/api/poems/${poem._id}/comments/${commentId}/replies/${replyId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (onUpdate) onUpdate();
        if (setToast) setToast({ message: t('reply_deleted') || 'Yanıt silindi', type: 'success' });
    } catch (error) {
        if (setToast) setToast({ message: t('error') || 'Hata oluştu', type: 'error' });
    }
  };

  return (
    <div style={{ marginTop: '12px', textAlign: 'left' }}>
      <div style={{ marginBottom: '8px' }}>
        {poem.comments && poem.comments.map(comment => (
            <div key={comment._id} style={{ backgroundColor: '#333', padding: '8px 10px', borderRadius: '5px', marginBottom: '6px', borderLeft: `2px solid ${COLORS.accent}` }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <img src={comment.author?.avatar || DEFAULT_AVATAR} alt="Commenter" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${COLORS.secondary}`, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <Link to={`/profile/${comment.author?._id}`} style={{ textDecoration: 'none', color: COLORS.secondary }}>
                      <strong style={{ fontSize: '0.85rem' }}>{comment.author?.nickname}: </strong>
                    </Link>
                    {editingComment === comment._id ? (
                      <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', marginLeft: '4px' }}>
                        <input 
                          type="text" 
                          value={editCommentInput} 
                          onChange={(e) => setEditCommentInput(e.target.value)} 
                          style={{ padding: '2px 4px', fontSize: '0.8rem', borderRadius: '3px', border: 'none', backgroundColor: '#555', color: 'white' }}
                        />
                        <button onClick={() => handleUpdateComment(comment._id)} style={{ padding: '2px 6px', fontSize: '0.75rem', backgroundColor: COLORS.tertiary, color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>{t('save')}</button>
                        <button onClick={() => setEditingComment(null)} style={{ padding: '2px 6px', fontSize: '0.75rem', backgroundColor: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}>{t('cancel')}</button>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontSize: '0.85rem', color: COLORS.primary, wordBreak: 'break-word' }}>{comment.text}</span>
                        {comment.edited && <span style={{ fontSize: '0.7rem', color: '#aaa', marginLeft: '6px', fontStyle: 'italic' }}>{t('edited_tag') || '(Düzenlendi)'}</span>}
                      </>
                    )}
                    
                    {user && (user._id === comment.author?._id || user.role === 'admin') && editingComment !== comment._id && (
                      <div style={{ display: 'inline-flex', gap: '8px', marginLeft: '8px' }}>
                        <button onClick={() => { setEditingComment(comment._id); setEditCommentInput(comment.text); }} style={{ background: 'none', border: 'none', color: COLORS.secondary, cursor: 'pointer', padding: 0, fontSize: '0.75rem' }}>{t('edit')}</button>
                        <button onClick={() => handleDeleteComment(comment._id)} style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer', padding: 0, fontSize: '0.75rem' }}>{t('delete')}</button>
                      </div>
                    )}
                  </div>
                </div>
                
                {comment.replies && comment.replies.length > 0 && (
                  <div style={{ marginTop: '6px', paddingLeft: '10px', borderLeft: `2px solid ${COLORS.tertiary}` }}>
                    {comment.replies.map(reply => (
                      <div key={reply._id} style={{ marginBottom: '6px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <img src={reply.author?.avatar || DEFAULT_AVATAR} alt="Replier" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }} style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${COLORS.secondary}`, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <Link to={`/profile/${reply.author?._id}`} style={{ textDecoration: 'none', color: COLORS.tertiary }}>
                              <strong style={{ fontSize: '0.8rem' }}>{reply.author?.nickname}: </strong>
                            </Link>
                            {editingReply === reply._id ? (
                              <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', marginLeft: '4px' }}>
                                <input 
                                  type="text" 
                                  value={editReplyInput} 
                                  onChange={(e) => setEditReplyInput(e.target.value)} 
                                  style={{ padding: '2px 4px', fontSize: '0.75rem', borderRadius: '3px', border: 'none', backgroundColor: '#555', color: 'white' }}
                                />
                                <button onClick={() => handleUpdateReply(comment._id, reply._id)} style={{ padding: '2px 6px', fontSize: '0.7rem', backgroundColor: COLORS.tertiary, color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>{t('save')}</button>
                                <button onClick={() => setEditingReply(null)} style={{ padding: '2px 6px', fontSize: '0.7rem', backgroundColor: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}>{t('cancel')}</button>
                              </div>
                            ) : (
                              <>
                                <span style={{ fontSize: '0.8rem', color: COLORS.primary, wordBreak: 'break-word' }}>{reply.text}</span>
                                {reply.edited && <span style={{ fontSize: '0.65rem', color: '#aaa', marginLeft: '6px', fontStyle: 'italic' }}>{t('edited_tag') || '(Düzenlendi)'}</span>}
                              </>
                            )}

                            {user && (user._id === reply.author?._id || user.role === 'admin') && editingReply !== reply._id && (
                              <div style={{ display: 'inline-flex', gap: '8px', marginLeft: '8px' }}>
                                <button onClick={() => { setEditingReply(reply._id); setEditReplyInput(reply.text); }} style={{ background: 'none', border: 'none', color: COLORS.secondary, cursor: 'pointer', padding: 0, fontSize: '0.7rem' }}>{t('edit')}</button>
                                <button onClick={() => handleDeleteReply(comment._id, reply._id)} style={{ background: 'none', border: 'none', color: COLORS.danger, cursor: 'pointer', padding: 0, fontSize: '0.7rem' }}>{t('delete')}</button>
                              </div>
                            )}
                          </div>
                      </div>
                    ))}
                  </div>
                )}

                {user && (
                  <button 
                    onClick={() => setReplyingTo({ ...replyingTo, [comment._id]: !replyingTo[comment._id] })}
                    style={{ backgroundColor: 'transparent', color: COLORS.secondary, border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 0', marginTop: '4px', textDecoration: 'underline' }}
                  >
                    {t('reply')}
                  </button>
                )}

                {replyingTo[comment._id] && (
                  <div style={{ marginTop: '6px', display: 'flex', gap: '4px' }}>
                    <input 
                      type="text" 
                      placeholder={t('reply_placeholder')}
                      value={replyInputs[comment._id] || ''}
                      onChange={(e) => setReplyInputs({ ...replyInputs, [comment._id]: e.target.value })}
                      style={{ flex: 1, padding: '4px 6px', borderRadius: '4px', border: 'none', backgroundColor: '#444', color: COLORS.primary, fontSize: '0.8rem' }}
                    />
                    <button 
                      onClick={() => handleAddReply(comment._id)}
                      style={{ padding: '4px 8px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      {t('send')}
                    </button>
                  </div>
                )}
            </div>
        ))}
      </div>

      {user ? (
        <div style={{ display: 'flex', gap: '6px' }}>
            <input 
                type="text" 
                placeholder={t('write_comment')} 
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                style={{ flex: 1, padding: '6px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#444', color: COLORS.primary, fontSize: '0.85rem' }}
            />
            <button 
                onClick={handleAddComment}
                style={{ padding: '6px 12px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
            >
                {t('send')}
            </button>
        </div>
      ) : (
        <small style={{ color: COLORS.primary, fontSize: '0.8rem' }}>{t('login_to_comment')}</small>
      )}
    </div>
  );
}

export default CommentSection;
