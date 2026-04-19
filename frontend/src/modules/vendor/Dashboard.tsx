import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, Clock, DollarSign, FileText } from 'lucide-react';
import api from '../../services/api';

interface VendorMetrics {
  totalRevenue: number;
  totalSales: number;
  totalOrders: number;
  globalRevenue: number;
}

interface DailyRevenue {
  name: string;
  revenue: number;
}

export default function VendorDashboard() {
  const [metrics, setMetrics] = useState<VendorMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/vendor/dashboard')
      .then(res => setMetrics(res.data.data))
      .catch(err => console.error('Vendor dashboard error', err))
      .finally(() => setLoading(false));
  }, []);

  // Weekly chart uses static shape data; real analytics would need a time-series endpoint
  const weekData: DailyRevenue[] = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  const formatCurrency = (val: number | undefined) =>
    val !== undefined ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)' }}>Vendor Dashboard</h1>
        <button
          style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => window.print()}
        >
          <FileText size={18} /> Generate Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Total Revenue */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Revenue</div>
            <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            {loading ? '...' : formatCurrency(metrics?.globalRevenue)}
          </div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={16} /> +14.5% this month
          </div>
        </div>

        {/* Total Sales (items) */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Items Sold</div>
            <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            {loading ? '...' : (metrics?.totalSales ?? 0)}
          </div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={16} /> +5.2%
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Orders</div>
            <div style={{ padding: '0.5rem', background: 'var(--warning-bg)', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            {loading ? '...' : (metrics?.totalOrders ?? 0)}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Across all time
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', height: '400px' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Weekly Revenue Analytics</h2>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'var(--bg-primary)' }} formatter={(val: number) => [`$${val}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
