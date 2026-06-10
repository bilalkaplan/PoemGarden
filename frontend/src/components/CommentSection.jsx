import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const COLORS = {
  primary: '#ffffff',
  secondary: '#8b7355',
  tertiary: '#6b8e6f',
  accent: '#8b7355'
};

const DEFAULT_AVATAR = "/default-avatar.svg";

function CommentSection({ poem, user, onUpdate, setToast }) {
  const { t } = useTranslation();
  const [commentInput, setCommentInput] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [replyingTo, setReplyingTo] = useState({});
  const token = localStorage.getItem('token');

  const handleAddComment = async () => {
    if (!commentInput || commentInput.trim() === '') return;
    try {
        await axios.post(`http://127.0.0.1:5000/api/poems/${poem._id}/comments`, { text: commentInput }, {
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
        await axios.post(`http://127.0.0.1:5000/api/poems/${poem._id}/comments/${commentId}/replies`, { text }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setReplyInputs({ ...replyInputs, [commentId]: '' });
        setReplyingTo({ ...replyingTo, [commentId]: false });
        if (onUpdate) onUpdate();
    } catch (error) {
      if (setToast) setToast({ message: t('reply_add_failed') || "Yanıt eklenemedi.", type: 'error' });
    }
  };

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ marginBottom: '8px' }}>
        {poem.comments && poem.comments.map(comment => (
            <div key={comment._id} style={{ backgroundColor: '#333', padding: '8px 10px', borderRadius: '5px', marginBottom: '6px', borderLeft: `2px solid ${COLORS.accent}` }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                  <img src={comment.author?.avatar || DEFAULT_AVATAR} alt="Commenter" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${COLORS.secondary}` }} />
                  <Link to={`/profile/${comment.author?._id}`} style={{ textDecoration: 'none', color: COLORS.secondary }}>
                    <small style={{ color: COLORS.secondary, fontWeight: 'bold', fontSize: '0.8rem' }}>{comment.author?.nickname}: </small>
                  </Link>
                </div>
                <span style={{ fontSize: '0.85rem', color: COLORS.primary }}>{comment.text}</span>
                
                {comment.replies && comment.replies.length > 0 && (
                  <div style={{ marginTop: '6px', paddingLeft: '10px', borderLeft: `2px solid ${COLORS.tertiary}` }}>
                    {comment.replies.map(reply => (
                      <div key={reply._id} style={{ marginBottom: '4px' }}>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
                          <img src={reply.author?.avatar || DEFAULT_AVATAR} alt="Replier" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }} style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${COLORS.secondary}` }} />
                          <Link to={`/profile/${reply.author?._id}`} style={{ textDecoration: 'none', color: COLORS.tertiary }}>
                            <small style={{ color: COLORS.tertiary, fontWeight: 'bold', fontSize: '0.75rem' }}>{reply.author?.nickname}:</small>
                          </Link>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: COLORS.primary, margin: '0 0 0 24px' }}>{reply.text}</p>
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
