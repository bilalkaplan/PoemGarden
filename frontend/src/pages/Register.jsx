import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const COLORS = {
  primary: '#2d2d2d',
  secondary: '#8b7355',
  tertiary: '#6b8e6f',
  dark: '#919D85',
  darkBg: '#738065',
};

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
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', color: COLORS.primary, backgroundColor: COLORS.dark, minHeight: '100vh', padding: '20px' }}>
      <h2 style={{ color: COLORS.primary, marginBottom: '30px' }}>{t('register')}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          name="firstName" 
          placeholder={t('first_name')} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px', backgroundColor: COLORS.darkBg, border: `1px solid ${COLORS.secondary}`, borderRadius: '5px', color: COLORS.primary, fontSize: '0.95rem' }} 
        />
        <input 
          name="lastName" 
          placeholder={t('last_name')} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px', backgroundColor: COLORS.darkBg, border: `1px solid ${COLORS.secondary}`, borderRadius: '5px', color: COLORS.primary, fontSize: '0.95rem' }} 
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          <span style={{ padding: '10px', fontSize: '1.1rem', fontWeight: 'bold', backgroundColor: COLORS.darkBg, border: `1px solid ${COLORS.secondary}`, borderRadius: '5px 0 0 5px', color: COLORS.primary }}>@</span>
          <input 
            name="nickname" 
            placeholder={t('username')} 
            onChange={handleChange} 
            required 
            style={{ flex: 1, padding: '10px', backgroundColor: COLORS.darkBg, border: `1px solid ${COLORS.secondary}`, borderRadius: '0 5px 5px 0', color: COLORS.primary, fontSize: '0.95rem' }} 
          />
        </div>
        <input 
          name="email" 
          type="email" 
          placeholder={t('email')} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px', backgroundColor: COLORS.darkBg, border: `1px solid ${COLORS.secondary}`, borderRadius: '5px', color: COLORS.primary, fontSize: '0.95rem' }} 
        />
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            name="password"
            type="password"
            placeholder={t('password')}
            onChange={handleChange}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(!!formData.password)}
            required
            style={{ flex: 1, padding: '10px', backgroundColor: COLORS.darkBg, border: `1px solid ${COLORS.secondary}`, borderRadius: '5px', color: COLORS.primary, fontSize: '0.95rem' }}
          />
          {showPasswordInfo && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: passwordValid ? '#2d5a2d' : '#5a5033',
              border: `1px solid ${passwordValid ? COLORS.secondary : COLORS.tertiary}`,
              color: passwordValid ? '#c3f0c3' : '#f5ddb8',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              whiteSpace: 'normal',
              minWidth: '260px'
            }}>
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{passwordValid ? '✅' : '⚠️'}</span>
              <span>{passwordValid ? t('password_valid') : t('password_requirements')}</span>
            </div>
          )}
        </div>
        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold' }}
        >
          {t('register')}
        </button>
        {serverError && <p style={{ color: '#ff9999', fontSize: '0.95rem' }}>{serverError}</p>}
      </form>
    </div>
  );
}
export default Register;
