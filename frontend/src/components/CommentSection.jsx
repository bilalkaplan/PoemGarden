import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

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
    <div className="comment-section">
      <div style={{ marginBottom: '16px' }}>
        {poem.comments && poem.comments.map(comment => (
            <div key={comment._id} className="comment-box">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <img src={comment.author?.avatar || DEFAULT_AVATAR} alt="Commenter" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.05)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <Link to={`/profile/${comment.author?._id}`} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>
                      <span style={{ fontSize: '0.95rem' }}>{comment.author?.nickname}</span>
                    </Link>
                    {editingComment === comment._id ? (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                        <input 
                          type="text" 
                          value={editCommentInput} 
                          onChange={(e) => setEditCommentInput(e.target.value)} 
                          className="blog-input"
                          style={{ padding: '6px 10px', marginBottom: 0 }}
                        />
                        <button onClick={() => handleUpdateComment(comment._id)} className="blog-btn blog-btn-primary" style={{ padding: '6px 12px' }}>{t('save')}</button>
                        <button onClick={() => setEditingComment(null)} className="blog-btn blog-btn-ghost" style={{ padding: '6px 12px' }}>{t('cancel')}</button>
                      </div>
                    ) : (
                      <div style={{ marginTop: '4px' }}>
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-main)', wordBreak: 'break-word', lineHeight: 1.5 }}>{comment.text}</span>
                        {comment.edited && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px', fontStyle: 'italic' }}>{t('edited_tag') || '(Düzenlendi)'}</span>}
                      </div>
                    )}
                    
                    {user && (user._id === comment.author?._id || user.role === 'admin') && editingComment !== comment._id && (
                      <div style={{ display: 'inline-flex', gap: '12px', marginTop: '8px' }}>
                        <button onClick={() => { setEditingComment(comment._id); setEditCommentInput(comment.text); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, fontSize: '0.8rem', fontWeight: 500 }}>{t('edit')}</button>
                        <button onClick={() => handleDeleteComment(comment._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0, fontSize: '0.8rem', fontWeight: 500 }}>{t('delete')}</button>
                      </div>
                    )}
                  </div>
                </div>
                
                {comment.replies && comment.replies.length > 0 && (
                  <div style={{ marginTop: '12px', paddingLeft: '16px', borderLeft: '2px solid rgba(0,0,0,0.05)' }}>
                    {comment.replies.map(reply => (
                      <div key={reply._id} style={{ marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <img src={reply.author?.avatar || DEFAULT_AVATAR} alt="Replier" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.05)', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <Link to={`/profile/${reply.author?._id}`} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: '600' }}>
                              <span style={{ fontSize: '0.9rem' }}>{reply.author?.nickname}</span>
                            </Link>
                            {editingReply === reply._id ? (
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                                <input 
                                  type="text" 
                                  value={editReplyInput} 
                                  onChange={(e) => setEditReplyInput(e.target.value)} 
                                  className="blog-input"
                                  style={{ padding: '6px 10px', marginBottom: 0 }}
                                />
                                <button onClick={() => handleUpdateReply(comment._id, reply._id)} className="blog-btn blog-btn-primary" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>{t('save')}</button>
                                <button onClick={() => setEditingReply(null)} className="blog-btn blog-btn-ghost" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>{t('cancel')}</button>
                              </div>
                            ) : (
                              <div style={{ marginTop: '2px' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', wordBreak: 'break-word', lineHeight: 1.5 }}>{reply.text}</span>
                                {reply.edited && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px', fontStyle: 'italic' }}>{t('edited_tag') || '(Düzenlendi)'}</span>}
                              </div>
                            )}

                            {user && (user._id === reply.author?._id || user.role === 'admin') && editingReply !== reply._id && (
                              <div style={{ display: 'inline-flex', gap: '12px', marginTop: '6px' }}>
                                <button onClick={() => { setEditingReply(reply._id); setEditReplyInput(reply.text); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, fontSize: '0.8rem', fontWeight: 500 }}>{t('edit')}</button>
                                <button onClick={() => handleDeleteReply(comment._id, reply._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 0, fontSize: '0.8rem', fontWeight: 500 }}>{t('delete')}</button>
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
                    style={{ backgroundColor: 'transparent', color: 'var(--accent)', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: '4px 0', marginTop: '8px', fontWeight: 600 }}
                  >
                    {t('reply')}
                  </button>
                )}

                {replyingTo[comment._id] && (
                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder={t('reply_placeholder')}
                      value={replyInputs[comment._id] || ''}
                      onChange={(e) => setReplyInputs({ ...replyInputs, [comment._id]: e.target.value })}
                      className="blog-input"
                      style={{ marginBottom: 0, padding: '8px 12px' }}
                    />
                    <button 
                      onClick={() => handleAddReply(comment._id)}
                      className="blog-btn blog-btn-primary"
                      style={{ padding: '8px 16px' }}
                    >
                      {t('send')}
                    </button>
                  </div>
                )}
            </div>
        ))}
      </div>

      {user ? (
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            <input 
                type="text" 
                placeholder={t('write_comment')} 
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="blog-input"
                style={{ marginBottom: 0 }}
            />
            <button 
                onClick={handleAddComment}
                className="blog-btn blog-btn-primary"
            >
                {t('send')}
            </button>
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', marginTop: '24px' }}>
          {t('login_to_comment')}
        </p>
      )}
    </div>
  );
}

export default CommentSection;
