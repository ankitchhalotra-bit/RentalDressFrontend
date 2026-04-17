import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';

const initialForm = { name: '', type: '', price: '', description: '', file: null };

export default function AdminDashboard() {
    const [dresses, setDresses] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add'
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const showSuccess = (msg) => {
        setSuccess(msg);
        setError('');
        setTimeout(() => setSuccess(''), 3000);
    };

    const showError = (msg) => {
        setError(msg);
        setSuccess('');
    };

    // ── Fetch all dresses ──────────────────────────────────────
    const fetchDresses = useCallback(async () => {
        setListLoading(true);
        try {
            const res = await api.get('/api/admin/dresses');
            setDresses(res.data);
        } catch (e) {
            showError('Failed to load dresses: ' + (e?.response?.data?.error || e.message));
        } finally {
            setListLoading(false);
        }
    }, []);

    useEffect(() => { fetchDresses(); }, [fetchDresses]);

    // ── Handle form field changes ──────────────────────────────
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm(f => ({ ...f, [name]: files ? files[0] : value }));
    };

    // ── Submit: Add or Edit ────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('type', form.type);
            fd.append('price', form.price);
            fd.append('description', form.description);
            if (form.file) fd.append('file', form.file);

            if (editId) {
                await api.put(`/api/admin/dress/${editId}`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showSuccess('Dress updated successfully!');
            } else {
                await api.post('/api/admin/dress', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showSuccess('Dress added successfully!');
            }
            setForm(initialForm);
            setEditId(null);
            setActiveTab('list');
            fetchDresses();
        } catch (e) {
            showError(e?.response?.data?.error || e.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    // ── Start editing a dress ──────────────────────────────────
    const startEdit = (dress) => {
        setForm({
            name: dress.name || '',
            type: dress.type || '',
            price: dress.price || '',
            description: dress.description || '',
            file: null,
        });
        setEditId(dress.id);
        setActiveTab('add');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Delete a dress ─────────────────────────────────────────
    const confirmDelete = async (id) => {
        try {
            await api.delete(`/api/admin/dress/${id}`);
            showSuccess('Dress deleted successfully!');
            setDeleteConfirm(null);
            fetchDresses();
        } catch (e) {
            showError(e?.response?.data?.error || 'Delete failed');
            setDeleteConfirm(null);
        }
    };

    const cancelEdit = () => {
        setForm(initialForm);
        setEditId(null);
        setActiveTab('list');
    };

    // ────── STYLES ─────────────────────────────────────────────
    const colors = {
        bg: '#0f0f1a',
        card: '#1a1a2e',
        border: '#2a2a4a',
        accent: '#7c3aed',
        accentHover: '#6d28d9',
        accentLight: '#ede9fe',
        text: '#e2e8f0',
        muted: '#94a3b8',
        danger: '#ef4444',
        dangerHover: '#dc2626',
        success: '#22c55e',
    };

    const s = {
        page: { minHeight: '100vh', background: colors.bg, color: colors.text, fontFamily: "'Inter', sans-serif", padding: '24px' },
        header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', paddingBottom: '16px', borderBottom: `1px solid ${colors.border}` },
        title: { fontSize: '26px', fontWeight: '700', background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
        badge: { background: '#7c3aed22', border: '1px solid #7c3aed55', color: '#a78bfa', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
        tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
        tab: (active) => ({ padding: '10px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s', background: active ? colors.accent : colors.card, color: active ? '#fff' : colors.muted, border: `1px solid ${active ? colors.accent : colors.border}` }),
        alert: (type) => ({ padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', fontWeight: '500', background: type === 'success' ? '#14532d33' : '#7f1d1d33', border: `1px solid ${type === 'success' ? '#22c55e55' : '#ef444455'}`, color: type === 'success' ? colors.success : colors.danger }),
        form: { background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '24px', maxWidth: '520px' },
        formTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: colors.text },
        inputGroup: { marginBottom: '14px' },
        label: { display: 'block', fontSize: '13px', fontWeight: '600', color: colors.muted, marginBottom: '6px' },
        input: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${colors.border}`, background: '#0f0f1acc', color: colors.text, fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' },
        textarea: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${colors.border}`, background: '#0f0f1acc', color: colors.text, fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box' },
        btnRow: { display: 'flex', gap: '10px', marginTop: '20px' },
        btnPrimary: { flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: `linear-gradient(135deg, ${colors.accent}, #6d28d9)`, color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
        btnSecondary: { padding: '11px 20px', borderRadius: '8px', border: `1px solid ${colors.border}`, background: 'transparent', color: colors.muted, fontWeight: '600', fontSize: '14px', cursor: 'pointer' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' },
        card: { background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' },
        cardImg: { width: '100%', height: '180px', objectFit: 'cover', background: '#1e1e3a' },
        cardImgPlaceholder: { width: '100%', height: '180px', background: 'linear-gradient(135deg, #1e1e3a, #2a1a4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' },
        cardBody: { padding: '16px' },
        cardName: { fontWeight: '700', fontSize: '16px', marginBottom: '4px' },
        cardMeta: { fontSize: '13px', color: colors.muted, marginBottom: '12px' },
        cardPrice: { fontSize: '18px', fontWeight: '800', color: '#a78bfa', marginBottom: '12px' },
        cardActions: { display: 'flex', gap: '8px' },
        btnEdit: { flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${colors.accent}`, background: '#7c3aed22', color: '#a78bfa', fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
        btnDelete: { flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${colors.danger}`, background: '#ef444422', color: colors.danger, fontWeight: '600', fontSize: '13px', cursor: 'pointer' },
        modal: { position: 'fixed', inset: 0, background: '#00000099', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
        modalBox: { background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '28px', maxWidth: '380px', width: '90%', textAlign: 'center' },
        emptyState: { textAlign: 'center', padding: '60px 20px', color: colors.muted },
    };

    return (
        <div style={s.page}>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />

            {/* Header */}
            <div style={s.header}>
                <span style={s.title}>⚡ Admin Dashboard</span>
                <span style={s.badge}>Total: {dresses.length} dresses</span>
            </div>

            {/* Alerts */}
            {success && <div style={s.alert('success')}>✅ {success}</div>}
            {error && <div style={s.alert('error')}>❌ {error}</div>}

            {/* Tabs */}
            <div style={s.tabs}>
                <button style={s.tab(activeTab === 'list')} onClick={() => { cancelEdit(); setActiveTab('list'); }}>
                    📋 All Dresses
                </button>
                <button style={s.tab(activeTab === 'add')} onClick={() => setActiveTab('add')}>
                    {editId ? '✏️ Edit Dress' : '➕ Add New Dress'}
                </button>
            </div>

            {/* ── ADD / EDIT FORM ── */}
            {activeTab === 'add' && (
                <div style={s.form}>
                    <div style={s.formTitle}>{editId ? '✏️ Edit Dress' : '➕ Add New Dress'}</div>
                    <form onSubmit={handleSubmit}>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Dress Name *</label>
                            <input style={s.input} name="name" value={form.name} placeholder="e.g. Floral Summer Dress" required onChange={handleChange} />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Type / Category *</label>
                            <input style={s.input} name="type" value={form.type} placeholder="e.g. Casual, Formal, Party" required onChange={handleChange} />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Price (₹) *</label>
                            <input style={s.input} name="price" value={form.price} type="number" min="0" step="0.01" placeholder="e.g. 1499" required onChange={handleChange} />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Description *</label>
                            <textarea style={s.textarea} name="description" value={form.description} placeholder="Describe the dress..." required onChange={handleChange} />
                        </div>
                        <div style={s.inputGroup}>
                            <label style={s.label}>Image {editId ? '(leave empty to keep current)' : '*'}</label>
                            <input style={s.input} name="file" type="file" accept="image/*" required={!editId} onChange={handleChange} />
                        </div>
                        <div style={s.btnRow}>
                            <button type="submit" style={s.btnPrimary} disabled={loading}>
                                {loading ? 'Saving...' : editId ? 'Update Dress' : 'Add Dress'}
                            </button>
                            {editId && (
                                <button type="button" style={s.btnSecondary} onClick={cancelEdit}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* ── DRESS LIST ── */}
            {activeTab === 'list' && (
                <>
                    {listLoading ? (
                        <div style={s.emptyState}>Loading dresses...⏳</div>
                    ) : dresses.length === 0 ? (
                        <div style={s.emptyState}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👗</div>
                            <div style={{ fontSize: '18px', fontWeight: '600' }}>No dresses yet</div>
                            <div style={{ marginTop: '8px' }}>Click "Add New Dress" to get started!</div>
                        </div>
                    ) : (
                        <div style={s.grid}>
                            {dresses.map(dress => (
                                <div key={dress.id} style={s.card}>
                                    {dress.file ? (
                                        <img src={dress.file} alt={dress.name} style={s.cardImg} />
                                    ) : (
                                        <div style={s.cardImgPlaceholder}>👗</div>
                                    )}
                                    <div style={s.cardBody}>
                                        <div style={s.cardName}>{dress.name}</div>
                                        <div style={s.cardMeta}>{dress.type}</div>
                                        <div style={s.cardPrice}>₹{dress.price}</div>
                                        <div style={{ fontSize: '13px', color: colors.muted, marginBottom: '12px', lineHeight: '1.5' }}>
                                            {dress.description?.length > 80 ? dress.description.slice(0, 80) + '...' : dress.description}
                                        </div>
                                        <div style={s.cardActions}>
                                            <button style={s.btnEdit} onClick={() => startEdit(dress)}>✏️ Edit</button>
                                            <button style={s.btnDelete} onClick={() => setDeleteConfirm(dress)}>🗑️ Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ── DELETE CONFIRM MODAL ── */}
            {deleteConfirm && (
                <div style={s.modal} onClick={() => setDeleteConfirm(null)}>
                    <div style={s.modalBox} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗑️</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Delete Dress?</div>
                        <div style={{ color: colors.muted, marginBottom: '24px', fontSize: '14px' }}>
                            Are you sure you want to delete <strong style={{ color: colors.text }}>{deleteConfirm.name}</strong>? This will also remove the image from Cloudinary.
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                style={{ ...s.btnDelete, flex: 1, padding: '12px' }}
                                onClick={() => confirmDelete(deleteConfirm.id)}
                            >
                                Yes, Delete
                            </button>
                            <button
                                style={{ ...s.btnSecondary, flex: 1 }}
                                onClick={() => setDeleteConfirm(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}