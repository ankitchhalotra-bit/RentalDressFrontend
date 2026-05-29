import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useDressAPI } from '../api/useDressAPI';
import api from '../api/axiosInstance';
import './AdminPanel.css';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const {
    getAllDressesAdmin,
    getDressStatistics,
    getStockSummary,
    loading,
    error: apiError
  } = useDressAPI();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dresses, setDresses] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [stockSummary, setStockSummary] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading2, setLoading2] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    occasion: 'Wedding',
    rentalPricePerDay: '',
    depositAmount: '',
    description: '',
    totalStock: '',
    material: '',
    colors: '',
    sizes: '',
    categoryId: 'cat_wedding'
  });

  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Load dresses when tab changes
  useEffect(() => {
    if (activeTab === 'view') {
      loadDresses();
    } else if (activeTab === 'dashboard') {
      loadDashboard();
    }
  }, [activeTab]);

  const loadDresses = async () => {
    setLoading2(true);
    try {
      const data = await getAllDressesAdmin();
      setDresses(data || []);
    } catch (err) {
      showMessage('Failed to load dresses', 'error');
    } finally {
      setLoading2(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const stats = await getDressStatistics();
      const stock = await getStockSummary();
      setStatistics(stats);
      setStockSummary(stock);
    } catch (err) {
      showMessage('Failed to load statistics', 'error');
    }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ADD DRESS
  const handleAddDress = async (e) => {
    e.preventDefault();
    setLoading2(true);

    try {
      const formDataMultipart = new FormData();
      formDataMultipart.append('name', formData.name);
      formDataMultipart.append('occasion', formData.occasion);
      formDataMultipart.append('rentalPricePerDay', formData.rentalPricePerDay);
      formDataMultipart.append('depositAmount', formData.depositAmount);
      formDataMultipart.append('description', formData.description);
      formDataMultipart.append('totalStock', formData.totalStock);
      if (file) formDataMultipart.append('file', file);

      const response = await api.post('/api/admin/dress', formDataMultipart, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showMessage('Dress added successfully!', 'success');
      resetForm();
      loadDresses();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to add dress', 'error');
    } finally {
      setLoading2(false);
    }
  };

  // UPDATE DRESS
  const handleUpdateDress = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading2(true);
    try {
      const formDataMultipart = new FormData();
      formDataMultipart.append('name', formData.name);
      formDataMultipart.append('occasion', formData.occasion);
      formDataMultipart.append('rentalPricePerDay', formData.rentalPricePerDay);
      formDataMultipart.append('depositAmount', formData.depositAmount);
      formDataMultipart.append('description', formData.description);
      formDataMultipart.append('totalStock', formData.totalStock);
      formDataMultipart.append('material', formData.material);
      formDataMultipart.append('colors', formData.colors);
      formDataMultipart.append('sizes', formData.sizes);
      formDataMultipart.append('categoryId', formData.categoryId);
      if (file) formDataMultipart.append('file', file);

      await api.put(`/api/admin/dress/${editingId}`, formDataMultipart, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showMessage('Dress updated successfully!', 'success');
      resetForm();
      loadDresses();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to update dress', 'error');
    } finally {
      setLoading2(false);
    }
  };

  // DELETE DRESS
  const handleDeleteDress = async (dressId) => {
    if (!window.confirm('Are you sure you want to delete this dress?')) return;

    setLoading2(true);
    try {
      await api.delete(`/api/dresses/${dressId}`);
      showMessage('Dress deleted successfully!', 'success');
      loadDresses();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to delete dress', 'error');
    } finally {
      setLoading2(false);
    }
  };

  // EDIT DRESS
  const handleEditDress = (dress) => {
    setEditingId(dress._id);
    setFormData({
      name: dress.name,
      occasion: dress.occasion,
      rentalPricePerDay: dress.rentalPricePerDay,
      depositAmount: dress.depositAmount,
      description: dress.description,
      totalStock: dress.totalStock,
      material: dress.material || '',
      colors: dress.colors?.join(', ') || '',
      sizes: dress.sizes?.join(', ') || '',
      categoryId: dress.categoryId || 'cat_wedding'
    });
    setActiveTab('form');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      occasion: 'Wedding',
      rentalPricePerDay: '',
      depositAmount: '',
      description: '',
      totalStock: '',
      material: '',
      colors: '',
      sizes: '',
      categoryId: 'cat_wedding'
    });
    setFile(null);
    setEditingId(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="admin-panel">
      <nav className="admin-navbar">
        <div className="admin-header">
          <h1>👔 Admin Dashboard</h1>
          <div className="admin-user-info">
            <span>Welcome, {user?.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            👗 View Dresses
          </button>
          <button
            className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => { setEditingId(null); resetForm(); setActiveTab('form'); }}
          >
            ➕ Add Dress
          </button>
        </div>
      </nav>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="admin-content dashboard">
          <h2>Dashboard Statistics</h2>

          {statistics && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Dresses</h3>
                <p className="stat-value">{statistics.totalDresses}</p>
              </div>
              <div className="stat-card">
                <h3>Active Dresses</h3>
                <p className="stat-value">{statistics.activeDresses}</p>
              </div>
              <div className="stat-card">
                <h3>Inactive Dresses</h3>
                <p className="stat-value">{statistics.inactiveDresses}</p>
              </div>
              <div className="stat-card">
                <h3>Total Stock</h3>
                <p className="stat-value">{statistics.totalStock}</p>
              </div>
              <div className="stat-card">
                <h3>Available Stock</h3>
                <p className="stat-value highlight-green">{statistics.availableStock}</p>
              </div>
              <div className="stat-card">
                <h3>Booked Stock</h3>
                <p className="stat-value highlight-red">{statistics.bookedStock}</p>
              </div>
            </div>
          )}

          {stockSummary && (
            <div className="stock-section">
              <h3>📦 Stock Summary</h3>
              {stockSummary.lowStockCount > 0 && (
                <div className="low-stock alert">
                  <h4>⚠️ Low Stock Items ({stockSummary.lowStockCount})</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Dress Name</th>
                        <th>Available</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockSummary.lowStockItems?.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.availableStock}</td>
                          <td>{item.totalStock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {stockSummary.outOfStockCount > 0 && (
                <div className="out-stock alert">
                  <h4>🚫 Out of Stock ({stockSummary.outOfStockCount})</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Dress Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockSummary.outOfStockItems?.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW DRESSES TAB */}
      {activeTab === 'view' && (
        <div className="admin-content view-dresses">
          <h2>All Dresses</h2>
          {loading2 ? (
            <p>Loading...</p>
          ) : dresses.length > 0 ? (
            <div className="dresses-table-container">
              <table className="dresses-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Occasion</th>
                    <th>Price/Day</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dresses.map(dress => (
                    <tr key={dress._id}>
                      <td>{dress.name}</td>
                      <td>{dress.occasion}</td>
                      <td>₹{dress.rentalPricePerDay}</td>
                      <td>{dress.availableStock}/{dress.totalStock}</td>
                      <td>
                        <span className={`status ${dress.active ? 'active' : 'inactive'}`}>
                          {dress.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          onClick={() => handleEditDress(dress)}
                          className="btn-edit"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDress(dress._id)}
                          className="btn-delete"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No dresses found</p>
          )}
        </div>
      )}

      {/* ADD/EDIT DRESS TAB */}
      {activeTab === 'form' && (
        <div className="admin-content dress-form">
          <h2>{editingId ? '✏️ Edit Dress' : '➕ Add New Dress'}</h2>
          <form onSubmit={editingId ? handleUpdateDress : handleAddDress}>
            <div className="form-row">
              <div className="form-group">
                <label>Dress Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter dress name"
                />
              </div>
              <div className="form-group">
                <label>Occasion *</label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Party">Party</option>
                  <option value="Formal">Formal</option>
                  <option value="Casual">Casual</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rental Price/Day (₹) *</label>
                <input
                  type="number"
                  name="rentalPricePerDay"
                  value={formData.rentalPricePerDay}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 5000"
                />
              </div>
              <div className="form-group">
                <label>Deposit Amount (₹) *</label>
                <input
                  type="number"
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 10000"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Describe the dress"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Stock *</label>
                <input
                  type="number"
                  name="totalStock"
                  value={formData.totalStock}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 10"
                />
              </div>
              <div className="form-group">
                <label>Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder="e.g., Silk, Cotton"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Colors (comma separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  placeholder="e.g., Red, Gold, Silver"
                />
              </div>
              <div className="form-group">
                <label>Sizes (comma separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  placeholder="e.g., XS, S, M, L, XL"
                />
              </div>
            </div>

            {!editingId && (
              <div className="form-group">
                <label>Upload Image</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={loading2}
              >
                {loading2 ? 'Processing...' : editingId ? '💾 Update' : '➕ Add'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    resetForm();
                    setActiveTab('view');
                  }}
                >
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
