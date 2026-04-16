import { Outlet, useNavigate } from 'react-router-dom';
import { Package, TrendingUp, Settings, LogOut, ShoppingCart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VendorLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-admin)' }}>
      {/* Sidebar Overlay */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-light)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ color: 'var(--success)' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Vendor Panel</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={() => navigate('/vendor/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', cursor: 'pointer' }}>
            <TrendingUp size={20} /> Dashboard
          </button>
          <button onClick={() => navigate('/vendor/products')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Package size={20} /> My Products
          </button>
          <button onClick={() => navigate('/vendor/orders')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <ShoppingCart size={20} /> fulfillment Orders
          </button>
          <button onClick={() => navigate('/vendor/ai')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Sparkles size={20} color="var(--warning)" /> AI Tracking
          </button>
          <button onClick={() => navigate('/vendor/settings')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Settings size={20} /> Settings
          </button>
        </nav>
        
        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
            background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer',
            padding: '0.75rem'
          }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
