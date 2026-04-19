import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, DollarSign, PackageCheck, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

interface AdminStats {
  totalRevenue: number;
  totalVendors: number;
  totalOrders: number;
  pendingVendors: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalRevenue: 0,
    totalVendors: 0,
    totalOrders: 0,
    pendingVendors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/admin/dashboard')
      .then(res => {
        const d = res.data.data;
        setStats({
          totalRevenue: d.totalRevenue ?? 0,
          totalVendors: d.totalVendors ?? 0,
          totalOrders: d.totalOrders ?? 0,
          pendingVendors: d.pendingVendors ?? 0,
        });
      })
      .catch(err => console.error('Admin dashboard error', err))
      .finally(() => setLoading(false));
  }, []);

  const revenueData = [
    { name: 'Mon', total: 12000 },
    { name: 'Tue', total: 15000 },
    { name: 'Wed', total: 10000 },
    { name: 'Thu', total: 22000 },
    { name: 'Fri', total: 18000 },
    { name: 'Sat', total: 25000 },
    { name: 'Sun', total: 32000 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Fashion', value: 300 },
    { name: 'Home', value: 300 },
    { name: 'Others', value: 200 },
  ];
  const COLORS = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--danger)'];

  const kpiCards = [
    {
      label: 'Total Ecosystem Revenue',
      value: loading ? '...' : `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+12.5% M/M',
      changeColor: 'var(--success)',
      icon: <DollarSign size={20} />,
      iconBg: 'var(--success-bg)',
      iconColor: 'var(--success)',
    },
    {
      label: 'Total Vendors',
      value: loading ? '...' : stats.totalVendors,
      icon: <Users size={20} />,
      iconBg: 'var(--primary-light)',
      iconColor: 'var(--primary)',
    },
    {
      label: 'Total Placed Orders',
      value: loading ? '...' : stats.totalOrders,
      icon: <PackageCheck size={20} />,
      iconBg: 'var(--primary-light)',
      iconColor: 'var(--primary)',
    },
    {
      label: 'Pending Vendor Approvals',
      value: loading ? '...' : stats.pendingVendors,
      icon: <AlertTriangle size={20} />,
      iconBg: 'var(--warning-bg)',
      iconColor: 'var(--warning)',
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)', marginBottom: '2rem' }}>
        Platform Overview (Admin)
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {kpiCards.map((card, i) => (
          <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{card.label}</div>
              <div style={{ padding: '0.5rem', background: card.iconBg, borderRadius: 'var(--radius-md)', color: card.iconColor }}>
                {card.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{card.value}</div>
            {card.change && (
              <div style={{ color: card.changeColor, fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {card.change}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', height: '400px' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>Weekly Revenue Trend</h2>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'var(--bg-primary)' }} />
              <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', height: '400px' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>Top Sales Categories</h2>
          <ResponsiveContainer width="100%" height="70%">
            <PieChart>
              <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {categoryData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            {categoryData.map((entry, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[idx] }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
