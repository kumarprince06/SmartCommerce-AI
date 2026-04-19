import { useEffect, useState } from 'react';
import { Tag, Plus, Folder, FolderTree, Loader } from 'lucide-react';
import api from '../../services/api';

interface Category {
  id: number;
  name: string;
  level: number;
  parentId: number | null;
  parentName?: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [newName, setNewName] = useState('');
  const [parentId, setParentId] = useState<number | ''>('');

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories')
      .then(res => setCategories(res.data.data || []))
      .catch(() => setError('Failed to load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) { setError('Category name is required.'); return; }
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.post('/categories', {
        name: newName.trim(),
        parentId: parentId === '' ? null : Number(parentId),
      });
      setSuccess(`Category "${newName.trim()}" created successfully!`);
      setNewName('');
      setParentId('');
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-light)',
    background: 'var(--bg-main)',
    color: 'var(--text-primary)',
    fontSize: '0.9375rem',
    boxSizing: 'border-box' as const,
    outline: 'none',
  };

  // Group by level
  const rootCats = categories.filter(c => c.level === 0);
  const subCats = categories.filter(c => c.level > 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <FolderTree size={24} color="var(--primary)" />
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Category Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
            Manage the product category tree
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>

        {/* ── Create Form ── */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} color="var(--primary)" /> Add Category
          </h2>

          {error && (
            <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              ✓ {success}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Category Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="cat-name"
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Smartphones"
                style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Parent Category <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
              </label>
              <select
                id="cat-parent"
                value={parentId}
                onChange={e => setParentId(e.target.value === '' ? '' : Number(e.target.value))}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">— Root category (no parent) —</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {'  '.repeat(cat.level)}{cat.level > 0 ? '↳ ' : ''}{cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="create-category"
              onClick={handleCreate}
              disabled={submitting}
              style={{
                marginTop: '0.5rem',
                padding: '0.875rem',
                background: submitting ? 'var(--text-muted)' : 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.9375rem',
              }}
            >
              {submitting ? 'Creating...' : '+ Create Category'}
            </button>
          </div>
        </div>

        {/* ── Category List ── */}
        <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Folder size={20} color="var(--primary)" /> All Categories
              <span style={{ marginLeft: '0.5rem', padding: '0.125rem 0.625rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-xl)', fontSize: '0.8rem', fontWeight: 700 }}>
                {categories.length}
              </span>
            </h2>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Loader size={28} />
              <p style={{ marginTop: '0.75rem' }}>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Tag size={40} style={{ opacity: 0.4, display: 'block', margin: '0 auto 1rem' }} />
              <p>No categories yet. Create your first one!</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Type</th>
                  <th style={{ padding: '0.875rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>Level</th>
                </tr>
              </thead>
              <tbody>
                {/* Root categories first */}
                {rootCats.map(cat => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg-surface)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Folder size={16} color="var(--primary)" /> {cat.name}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <span style={{ padding: '0.2rem 0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-xl)', fontSize: '0.8rem', fontWeight: 600 }}>
                        Root
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Level 0</td>
                  </tr>
                ))}
                {/* Sub-categories */}
                {subCats.map(cat => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', paddingLeft: `${1.25 + cat.level}rem`, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>↳</span>
                      <Tag size={14} color="var(--secondary)" /> {cat.name}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <span style={{ padding: '0.2rem 0.75rem', background: 'rgba(139,92,246,0.12)', color: 'var(--secondary)', borderRadius: 'var(--radius-xl)', fontSize: '0.8rem', fontWeight: 600 }}>
                        Sub-category
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Level {cat.level}</td>
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
