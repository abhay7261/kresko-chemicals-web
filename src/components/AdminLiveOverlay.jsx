import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminLiveOverlay() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      setIsAdmin(sessionStorage.getItem('isAdminLoggedIn') === 'true');
    };
    checkLogin();

    window.addEventListener('adminLoginStatusChange', checkLogin);
    return () => window.removeEventListener('adminLoginStatusChange', checkLogin);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of Admin Live Edit Mode?')) {
      sessionStorage.removeItem('isAdminLoggedIn');
      window.dispatchEvent(new Event('adminLoginStatusChange'));
      alert('Logged out from Admin Mode.');
      navigate('/');
    }
  };

  const handleResetTexts = () => {
    if (window.confirm('Are you sure you want to reset all inline text edits back to their original defaults?')) {
      localStorage.removeItem('kresko_editable_texts');
      alert('All texts reset. Reloading page...');
      window.location.reload();
    }
  };

  if (!isAdmin) return null;

  // Render overlay toolbar only if admin is logged in
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 99999,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(245, 158, 11, 0.5)',
      borderRadius: '8px',
      padding: '1rem',
      color: '#ffffff',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35), 0 0 15px rgba(245, 158, 11, 0.15)',
      fontFamily: 'sans-serif',
      fontSize: '0.8rem',
      maxWidth: '300px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.5rem' }}>
        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', animate: 'pulse 1.5s infinite' }}></span>
        <strong style={{ color: '#f59e0b', fontSize: '0.85rem' }}>🛠️ Admin Live Edit Mode</strong>
      </div>
      
      <p style={{ margin: '0 0 0.75rem 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.75rem', lineHeight: '1.4' }}>
        Click any text boxed in <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>dashed borders</span> to edit live. Blur focus to save.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button 
          onClick={() => navigate('/admin')}
          style={{
            width: '100%',
            padding: '0.4rem 0.8rem',
            backgroundColor: 'var(--color-accent, #f59e0b)',
            border: 'none',
            borderRadius: '4px',
            color: '#000000',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.75rem',
            textAlign: 'center'
          }}
        >
          <i className="fa-solid fa-gauge" style={{ marginRight: '0.4rem' }}></i> Open Admin Panel
        </button>

        <button 
          onClick={handleResetTexts}
          style={{
            width: '100%',
            padding: '0.4rem 0.8rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '0.75rem',
            textAlign: 'center'
          }}
        >
          <i className="fa-solid fa-rotate-left" style={{ marginRight: '0.4rem' }}></i> Reset Live Texts
        </button>

        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.4rem 0.8rem',
            backgroundColor: '#dc2626',
            border: 'none',
            borderRadius: '4px',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '0.75rem',
            textAlign: 'center',
            fontWeight: 600
          }}
        >
          <i className="fa-solid fa-right-from-bracket" style={{ marginRight: '0.4rem' }}></i> End Session
        </button>
      </div>
    </div>
  );
}
