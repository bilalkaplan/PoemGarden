import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const COLORS = {
  primary: '#2d2d2d',
  secondary: '#8b7355',
  tertiary: '#6b8e6f',
  dark: '#919D85',
  darkBg: '#738065',
};

function Login() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://poemgarden.onrender.com/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      window.location.href = '/';
    } catch (error) {
      alert(t('invalid_login') || 'Error: Invalid login credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', color: COLORS.primary, backgroundColor: COLORS.dark, minHeight: '100vh', padding: '20px' }}>
      <h2 style={{ color: COLORS.primary, marginBottom: '30px' }}>{t('login')}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          name="email" 
          type="email" 
          placeholder={t('email')} 
          onChange={handleChange} 
          required 
          style={{ padding: '10px', backgroundColor: COLORS.darkBg, border: `1px solid ${COLORS.secondary}`, borderRadius: '5px', color: COLORS.primary, fontSize: '0.95rem' }} 
        />
        <div style={{ position: 'relative' }}>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('password')}
            onChange={handleChange}
            required
            style={{ padding: '10px', width: '100%', backgroundColor: COLORS.darkBg, border: `1px solid ${COLORS.secondary}`, borderRadius: '5px', color: COLORS.primary, fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: COLORS.secondary,
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '6px 8px'
            }}
          >
            {showPassword ? t('hide_password') : t('show_password')}
          </button>
        </div>
        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: COLORS.secondary, color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold' }}
        >
          {t('login')}
        </button>
      </form>
    </div>
  );
}
export default Login;
