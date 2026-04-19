import { useEffect, useState } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

interface CommissionRule {
  id?: number;
  type: string;
  valueType: string;
  value: number;
  priority: number;
  referenceId?: number | null;
}

export default function CommissionRules() {
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const [form, setForm] = useState<CommissionRule>({
    type: 'GLOBAL',
    valueType: 'PERCENTAGE',
    value: 10,
    priority: 1,
    referenceId: null,
  });

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadRules = () => {
    setLoading(true);
    api.get('/commissions')
      .then(res => setRules(res.data.data))
      .catch(err => console.error('Commission load error', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRules(); }, []);

  const handleCreate = async () => {
    if (!form.value) return;
    setSubmitting(true);
    try {
      await api.post('/commissions', form);
      showToast('Commission rule deployed successfully', true);
      loadRules();
      setForm({ type: 'GLOBAL', valueType: 'PERCENTAGE', value: 10, priority: 1, referenceId: null });
    } catch {
      showToast('Failed to create rule', false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await api.delete(`/commissions/${id}`);
      showToast('Rule removed', true);
      setRules(prev => prev.filter(r => r.id !== id));
    } catch {
      showToast('Failed to delete rule', false);
    }
  };

  const typeLabels: Record<string, string> = {
    GLOBAL: 'Platform Default',
    CATEGORY: 'Category Override',
    PRODUCT: 'Product Override',
    VENDOR: 'Vendor Baseline',
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.75rem', color: 'var(--secondary)', marginBottom: '2rem' }}>
        Commission Rule Engine
      </h1>

      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: toast.ok ? 'var(--success)' : 'var(--danger)',
          color: 'white', padding: '1rem 1.5rem', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)', animation: 'fadeIn 0.3s ease'
        }}>
          {toast.ok ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '2rem' }}>
        {/* CREATE FORM */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', height: 'max-content' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} color="var(--primary)" /> New Rule
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Rule Scope
              </label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              >
                <option value="GLOBAL">Platform Default (Global)</option>
                <option value="CATEGORY">Category Override</option>
                <option value="PRODUCT">Product Override</option>
                <option value="VENDOR">Vendor Baseline</option>
              </select>
            </div>

            {form.type !== 'GLOBAL' && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Reference ID ({form.type === 'CATEGORY' ? 'Category ID' : form.type === 'PRODUCT' ? 'Product ID' : 'Vendor ID'})
                </label>
                <input
                  type="number"
                  value={form.referenceId ?? ''}
                  onChange={e => setForm(f => ({ ...f, referenceId: Number(e.target.value) || null }))}
                  placeholder="Enter the entity ID"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Value Type
              </label>
              <select
                value={form.valueType}
                onChange={e => setForm(f => ({ ...f, valueType: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount ($)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Commission Value
              </label>
              <input
                type="number"
                step="0.1"
                value={form.value}
                onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                placeholder="e.g. 10.5"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Priority (higher = applied first)
              </label>
              <input
                type="number"
                min={1}
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) }))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={submitting}
              style={{ padding: '0.875rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: 600, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1, marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Plus size={18} /> {submitting ? 'Deploying...' : 'Deploy Rule'}
            </button>
          </div>
        </div>

        {/* RULES TABLE */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
            Active Commission Hierarchy ({rules.length} rules)
          </h2>
          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading rules...</p>
          ) : rules.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <p>No commission rules configured.</p>
              <p style={{ fontSize: '0.875rem' }}>Create a GLOBAL rule to set the platform baseline.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  {['Scope', 'Ref ID', 'Value', 'Type', 'Priority', ''].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rules.map(rule => (
                  <tr key={rule.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background var(--transition-fast)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      <span style={{ padding: '0.25rem 0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-xl)', fontSize: '0.8rem' }}>
                        {typeLabels[rule.type] ?? rule.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{rule.referenceId ?? '—'}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--danger)', fontSize: '1.1rem' }}>
                      {rule.valueType === 'PERCENTAGE' ? `${rule.value}%` : `$${rule.value}`}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{rule.valueType}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                        P{rule.priority}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.4rem' }}
                        title="Delete rule"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
