import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, Tag, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/admin/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/vendors',     icon: Users,           label: 'Vendors' },
  { to: '/admin/categories',  icon: Tag,             label: 'Categories' },
  { to: '/admin/commissions', icon: ShieldCheck,     label: 'Commission Rules' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-admin, var(--bg-main))' }}>
      <aside style={{
        width: '260px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-light)',
        padding: '2rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SmartCommerce
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.125rem', letterSpacing: '0.05em' }}>
            ADMIN PANEL
          </div>
        </div>

        {/* User Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 400,
                background: isActive ? 'var(--primary-light)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontSize: '0.9375rem',
                transition: 'all 0.15s',
              })}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 500 }}
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', maxWidth: 'calc(100vw - 260px)' }}>
        <Outlet />
      </main>
    </div>
  );
}
