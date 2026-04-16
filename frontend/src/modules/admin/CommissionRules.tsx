import { useState } from 'react';
import api from '../../services/api';

export default function CommissionRules() {
  const [rules, setRules] = useState([
    { type: 'CATEGORY', value: '10', priority: 1 },
    { type: 'PRODUCT', value: '5', priority: 2 },
    { type: 'VENDOR', value: '15', priority: 3 }
  ]);
  const [newType, setNewType] = useState('CATEGORY');
  const [newValue, setNewValue] = useState('');
  
  const handleAddRule = async () => {
    if (!newValue) return;
    try {
      // Mocking POST /commission/rules explicitly mimicking architectural boundaries
      await api.post('/commissions', { type: newType, rate: newValue });
      setRules([...rules, { type: newType, value: newValue, priority: rules.length + 1 }]);
    } catch {
      setRules([...rules, { type: newType, value: newValue, priority: rules.length + 1 }]);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)', marginBottom: '2rem' }}>Global Commission Matrices</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', height: 'max-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Issue Rule</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Rule Scope Engine</label>
              <select value={newType} onChange={e => setNewType(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <option value="CATEGORY">CATEGORY MATCH</option>
                <option value="PRODUCT">PRODUCT OVERRIDE</option>
                <option value="VENDOR">VENDOR BASELINE</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Commission Slice (%)</label>
              <input type="number" value={newValue} onChange={e => setNewValue(e.target.value)} placeholder="e.g. 10.5" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }} />
            </div>
            <button onClick={handleAddRule} style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: '1rem' }}>Deploy Parameters</button>
          </div>
        </div>

        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Active Enforcement Hierarchy</h2>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Target Schema</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Tax Yield</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Evaluation Priority</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{rule.type}</td>
                  <td style={{ padding: '1rem', color: 'var(--danger)' }}>{rule.value}%</td>
                  <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-xl)' }}>Priority {rule.priority}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
