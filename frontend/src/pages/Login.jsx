import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
    <div className="blog-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="blog-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', textAlign: 'center', marginBottom: '32px', color: 'var(--text-main)', fontSize: '1.8rem' }}>
          {t('login')}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <input 
              name="email" 
              type="email" 
              placeholder={t('email')} 
              onChange={handleChange} 
              required 
              className="blog-input"
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('password')}
              onChange={handleChange}
              required
              className="blog-input"
              style={{ marginBottom: 0, paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '4px'
              }}
            >
              {showPassword ? 'Gizle' : 'Göster'}
            </button>
          </div>
          <button 
            type="submit" 
            className="blog-btn blog-btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '1.05rem' }}
          >
            {t('login')}
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;
