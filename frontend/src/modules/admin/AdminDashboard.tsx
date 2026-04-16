import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, DollarSign, PackageCheck, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
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

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)', marginBottom: '2rem' }}>Platform Overview (Admin)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Total Ecosystem Revenue</div>
            <div style={{ padding: '0.5rem', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}><DollarSign size={20} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>$1,245,678</div>
          <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginTop: '0.5rem' }}>+12.5% M/M</div>
        </div>
        
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Active Vendors</div>
            <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}><Users size={20} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>1,234</div>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Total Placed Orders</div>
            <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}><PackageCheck size={20} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>12,345</div>
        </div>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--text-secondary)' }}>Pending Vendor Approvals</div>
            <div style={{ padding: '0.5rem', background: 'var(--warning-bg)', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}><AlertTriangle size={20} /></div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>56</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', height: '400px' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '2rem' }}>Volume Revenue Constraints</h2>
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
