import { Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/global.css';

export default function CustomerLayout() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleAuthDrop = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="glass" style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Store className="text-primary" size={28} color="var(--primary)" />
          <h2 style={{ color: 'var(--secondary)', fontSize: '1.5rem' }}>SmartCommerce</h2>
        </div>
        <nav style={{ display: 'flex', gap: '2.5rem' }}>
          <a href="/" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Home</a>
          <a href="#" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Categories</a>
        </nav>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {isAuthenticated && <span style={{color: 'var(--text-muted)'}}>Welcome, {user?.name}</span>}
          <button onClick={() => navigate('/cart')} style={{
            background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'
          }}>
            <ShoppingCart size={24} color="var(--text-primary)" />
          </button>
          
          <button onClick={handleAuthDrop} style={{
            background: isAuthenticated ? 'var(--bg-primary)' : 'var(--primary)',
            color: isAuthenticated ? 'var(--danger)' : 'white',
            border: isAuthenticated ? '1px solid var(--border-light)' : 'none',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {isAuthenticated ? <><LogOut size={18} /> Logout</> : 'Login'}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}
