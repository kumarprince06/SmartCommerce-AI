import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, LogOut, User, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/global.css';

export default function CustomerLayout() {
  const { isAuthenticated, logout, user } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
    fontWeight: isActive ? 600 : 500,
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color var(--transition-fast)',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <header style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        {/* Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Store size={28} color="var(--primary)" />
          <h2 style={{ color: 'var(--secondary)', fontSize: '1.5rem', fontWeight: 700 }}>SmartCommerce</h2>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <NavLink to="/" end style={navLinkStyle}>Home</NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" style={navLinkStyle}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Package size={16} /> My Orders
              </span>
            </NavLink>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          {isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <User size={16} />
              <span>{user?.name}</span>
            </div>
          )}

          {/* Cart with badge */}
          <button
            onClick={() => navigate('/cart')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: '0.5rem' }}
            title="Cart"
          >
            <ShoppingCart size={24} color="var(--text-primary)" />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0,
                background: 'var(--primary)', color: 'white',
                borderRadius: '50%', width: '18px', height: '18px',
                fontSize: '0.65rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          <button
            onClick={handleAuth}
            style={{
              background: isAuthenticated ? 'transparent' : 'var(--primary)',
              color: isAuthenticated ? 'var(--danger)' : 'white',
              border: isAuthenticated ? '1px solid var(--danger)' : 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontSize: '0.875rem',
              transition: 'all var(--transition-fast)',
            }}
          >
            {isAuthenticated ? <><LogOut size={16} /> Logout</> : 'Login'}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2.5rem 2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>

      <footer style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-light)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        © 2026 SmartCommerce AI — Multi-Vendor E-Commerce Platform
      </footer>
    </div>
  );
}
