import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, Clock, DollarSign } from 'lucide-react';
import api from '../../services/api';

export default function VendorDashboard() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    // Assuming backend returns simple mapped aggregates matching VendorMetrics
    api.get('/analytics/vendor/dashboard')
      .then(res => setMetrics(res.data.data))
      .catch(err => console.error("Metrics abstraction halted", err));
  }, []);

  // Mock data mapping Recharts to ensure layout holds true to Architect blueprints
  const data = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>Vendor Dashboard</h1>
        <button style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer' }}>
          Generate Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Total Revenue</div>
            <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}><DollarSign size={20} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>${metrics?.totalRevenue || '12,450.00'}</div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><TrendingUp size={16} /> +14.5%</div>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Total Sales</div>
            <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}><Package size={20} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{metrics?.totalSales || '245'}</div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><TrendingUp size={16} /> +5.2%</div>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Pending Orders</div>
            <div style={{ padding: '0.5rem', background: 'var(--warning-bg)', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}><Clock size={20} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>12</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Awaiting Fulfillment</div>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', height: '400px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Revenue Analytics</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'var(--bg-primary)' }} />
            <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
