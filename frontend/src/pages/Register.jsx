import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Register() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', nickname: '', email: '', password: '' });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const isPasswordValid = (password) => /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);
  const passwordValid = isPasswordValid(formData.password);
  const showPasswordInfo = passwordFocused || formData.password.length > 0;

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Ad ve soyad alanlarında (tüm dünya dilleri dahil) sadece harf, boşluk ve tireye izin ver
    if (name === 'firstName' || name === 'lastName') {
      value = value.replace(/[^\p{L}\s-]/gu, '');
    }

    setFormData({ ...formData, [name]: value });
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordValid) {
      setPasswordFocused(true);
      return;
    }
    try {
      await axios.post('https://poemgarden.onrender.com/api/auth/register', formData);
      alert(t('register_success') || 'Registration successful!');
      navigate('/login');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Sunucuya ulaşılamadı.');
    }
  };

  return (
    <div className="blog-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh' }}>
      <div className="blog-card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', textAlign: 'center', marginBottom: '32px', color: 'var(--text-main)', fontSize: '1.8rem' }}>
          {t('register')}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              name="firstName" 
              placeholder={t('first_name')} 
              onChange={handleChange} 
              required 
              className="blog-input"
              style={{ marginBottom: 0, flex: 1 }}
            />
            <input 
              name="lastName" 
              placeholder={t('last_name')} 
              onChange={handleChange} 
              required 
              className="blog-input"
              style={{ marginBottom: 0, flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ padding: '14px 16px', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)', borderRight: 'none', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)', color: 'var(--text-muted)' }}>@</span>
            <input 
              name="nickname" 
              placeholder={t('username')} 
              onChange={handleChange} 
              required 
              className="blog-input"
              style={{ flex: 1, marginBottom: 0, borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }} 
            />
          </div>
          <input 
            name="email" 
            type="email" 
            placeholder={t('email')} 
            onChange={handleChange} 
            required 
            className="blog-input"
            style={{ marginBottom: 0 }}
          />
          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type="password"
              placeholder={t('password')}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(!!formData.password)}
              required
              className="blog-input"
              style={{ marginBottom: 0, width: '100%' }}
            />
          </div>
          
          {showPasswordInfo && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: passwordValid ? 'rgba(72, 187, 120, 0.1)' : 'rgba(237, 137, 54, 0.1)',
              border: `1px solid ${passwordValid ? 'rgba(72, 187, 120, 0.4)' : 'rgba(237, 137, 54, 0.4)'}`,
              color: passwordValid ? '#276749' : '#9c4221',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              lineHeight: 1.4
            }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{passwordValid ? '✅' : '⚠️'}</span>
              <span>{passwordValid ? t('password_valid') : t('password_requirements')}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="blog-btn blog-btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '1.05rem' }}
          >
            {t('register')}
          </button>
          
          {serverError && <p style={{ color: 'var(--danger)', fontSize: '0.95rem', textAlign: 'center', marginTop: '8px' }}>{serverError}</p>}
        </form>
      </div>
    </div>
  );
}
export default Register;
