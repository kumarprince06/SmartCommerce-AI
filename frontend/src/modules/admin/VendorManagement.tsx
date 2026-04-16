import { useState } from 'react';

export default function VendorManagement() {
  const [vendors, setVendors] = useState([
    { id: 1, name: 'Fashion Hub', email: 'vendor@fashion.com', status: 'PENDING' },
    { id: 2, name: 'Tech Store', email: 'info@techstore.com', status: 'APPROVED' },
    { id: 3, name: 'Home Needs', email: 'contact@homeneeds.com', status: 'REJECTED' },
  ]);

  const updateStatus = (id: number, newStatus: string) => {
    // Normally tracking PATCH /vendors/{id}/status securely here natively.
    setVendors(vendors.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)', marginBottom: '2rem' }}>Vendor Oversight Pipeline</h1>
      
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Vendor Profile</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Email Limits</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Current Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{vendor.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{vendor.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: 'var(--radius-xl)', 
                    fontSize: '0.875rem',
                    background: vendor.status === 'APPROVED' ? 'var(--success-bg)' : vendor.status === 'REJECTED' ? 'var(--danger-bg)' : 'var(--warning-bg)',
                    color: vendor.status === 'APPROVED' ? 'var(--success)' : vendor.status === 'REJECTED' ? 'var(--danger)' : 'var(--warning)',
                    fontWeight: 600
                  }}>
                    {vendor.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  {vendor.status === 'PENDING' && (
                    <>
                      <button onClick={() => updateStatus(vendor.id, 'APPROVED')} style={{ padding: '0.5rem 1rem', background: 'var(--success)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
                      <button onClick={() => updateStatus(vendor.id, 'REJECTED')} style={{ padding: '0.5rem 1rem', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
                    </>
                  )}
                  {vendor.status !== 'PENDING' && (
                    <button style={{ padding: '0.5rem 1rem', background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>View Details</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
