import { useEffect, useState } from 'react';
import { Users, CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../../services/api';

interface Vendor {
  id: number;
  businessName: string;
  gstNumber: string;
  status: string;
  rating: number;
}

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/vendors')
      .then(res => setVendors(res.data.data || []))
      .catch(() => setError('Failed to load vendors.'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/vendors/${id}/status`, { status: newStatus });
      setVendors(vendors.map(v => v.id === id ? { ...v, status: newStatus } : v));
    } catch {
      alert('Failed to update vendor status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      APPROVED: { bg: 'var(--success-bg)', color: 'var(--success)' },
      PENDING: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
      SUSPENDED: { bg: 'var(--danger-bg)', color: 'var(--danger)' },
      REJECTED: { bg: 'var(--danger-bg)', color: 'var(--danger)' },
    };
    const s = styles[status] || styles.PENDING;
    return (
      <span style={{ padding: '0.25rem 0.875rem', borderRadius: 'var(--radius-xl)', fontSize: '0.8125rem', fontWeight: 600, background: s.bg, color: s.color }}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Users size={24} color="var(--primary)" />
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Vendor Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Approve, suspend, or review vendor applications
          </p>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>Loading vendors...</p>
        </div>
      )}

      {error && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Business Name</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>GST Number</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Rating</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No vendors found.
                  </td>
                </tr>
              ) : vendors.map(vendor => (
                <tr key={vendor.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{vendor.businessName}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{vendor.gstNumber}</td>
                  <td style={{ padding: '1rem', color: 'var(--warning, #f59e0b)', fontWeight: 600 }}>
                    ⭐ {vendor.rating?.toFixed(1) || '0.0'}
                  </td>
                  <td style={{ padding: '1rem' }}>{statusBadge(vendor.status)}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {vendor.status !== 'APPROVED' && (
                        <button
                          disabled={updatingId === vendor.id}
                          onClick={() => updateStatus(vendor.id, 'APPROVED')}
                          style={{ padding: '0.4rem 0.875rem', background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                      )}
                      {vendor.status !== 'SUSPENDED' && vendor.status !== 'REJECTED' && (
                        <button
                          disabled={updatingId === vendor.id}
                          onClick={() => updateStatus(vendor.id, 'SUSPENDED')}
                          style={{ padding: '0.4rem 0.875rem', background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid var(--danger)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <XCircle size={14} /> Suspend
                        </button>
                      )}
                      {vendor.status === 'SUSPENDED' && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', padding: '0.4rem 0' }}>No further actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
