import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useDressAPI } from '../api/useDressAPI';
import api from '../api/axiosInstance';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const {
    getAllDressesAdmin,
    getDressStatistics,
    getStockSummary,
    loading,
  } = useDressAPI();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dresses, setDresses] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [stockSummary, setStockSummary] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
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

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
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
      Object.keys(formData).forEach(key => formDataMultipart.append(key, formData[key]));
      if (file) formDataMultipart.append('file', file);

      await api.post('/api/admin/dress', formDataMultipart, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showMessage('Dress added successfully!', 'success');
      resetForm();
      setActiveTab('view');
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
      Object.keys(formData).forEach(key => formDataMultipart.append(key, formData[key]));
      if (file) formDataMultipart.append('file', file);

      await api.put(`/api/admin/dress/${editingId}`, formDataMultipart, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showMessage('Dress updated successfully!', 'success');
      resetForm();
      setActiveTab('view');
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
      name: '', occasion: 'Wedding', rentalPricePerDay: '', depositAmount: '',
      description: '', totalStock: '', material: '', colors: '', sizes: '', categoryId: 'cat_wedding'
    });
    setFile(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold font-serif">Admin Portal</h2>
          <p className="text-sm text-gray-400 mt-1">LuxeRentals Management</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white font-medium' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${activeTab === 'view' ? 'bg-primary text-white font-medium' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Manage Dresses
          </button>
          <button
            onClick={() => { setEditingId(null); resetForm(); setActiveTab('form'); }}
            className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${activeTab === 'form' ? 'bg-primary text-white font-medium' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Add New Dress
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 w-full overflow-x-auto">
        
        {/* Top bar with message */}
        <div className="mb-8">
          {message.text && (
            <div className={`p-4 rounded-lg flex items-center mb-6 animate-fade-in ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              <span className="font-medium">{message.text}</span>
            </div>
          )}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && statistics && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-xl font-bold">{statistics.totalDresses}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Catalog</p>
                  <p className="text-xl font-bold text-gray-900">Items</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <span className="text-green-600 text-xl font-bold">{statistics.activeDresses}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Active Items</p>
                  <p className="text-xl font-bold text-gray-900">Published</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                  <span className="text-orange-600 text-xl font-bold">{statistics.inactiveDresses}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Inactive Items</p>
                  <p className="text-xl font-bold text-gray-900">Drafts</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4 mt-10">Inventory Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Total Stock</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalStock}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Available to Rent</p>
                <p className="text-3xl font-bold text-green-600">{statistics.availableStock}</p>
              </div>
              <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500 shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Currently Booked</p>
                <p className="text-3xl font-bold text-purple-600">{statistics.bookedStock}</p>
              </div>
            </div>

            {stockSummary && (stockSummary.lowStockCount > 0 || stockSummary.outOfStockCount > 0) && (
              <div className="mt-8 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Alerts</h3>
                </div>
                <div className="p-6 space-y-4">
                  {stockSummary.outOfStockCount > 0 && (
                    <div className="flex items-start p-4 bg-red-50 rounded-lg">
                      <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <div>
                        <h4 className="text-sm font-bold text-red-800">Out of Stock ({stockSummary.outOfStockCount} items)</h4>
                        <p className="text-sm text-red-600 mt-1">{stockSummary.outOfStockItems.map(i => i.name).join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {stockSummary.lowStockCount > 0 && (
                    <div className="flex items-start p-4 bg-yellow-50 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <div>
                        <h4 className="text-sm font-bold text-yellow-800">Low Stock ({stockSummary.lowStockCount} items)</h4>
                        <p className="text-sm text-yellow-600 mt-1">{stockSummary.lowStockItems.map(i => i.name).join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW DRESSES TAB */}
        {activeTab === 'view' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Inventory Catalog</h2>
              <button onClick={() => { setEditingId(null); resetForm(); setActiveTab('form'); }} className="btn-primary py-2 px-4 text-sm">
                + Add Dress
              </button>
            </div>
            
            {loading2 ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div></div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4">Dress Info</th>
                      <th className="px-6 py-4">Occasion</th>
                      <th className="px-6 py-4">Price/Day</th>
                      <th className="px-6 py-4 text-center">Stock (Avail/Total)</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dresses.length > 0 ? dresses.map(dress => (
                      <tr key={dress._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {dress.name}
                        </td>
                        <td className="px-6 py-4">{dress.occasion}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">₹{dress.rentalPricePerDay}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`font-medium ${dress.availableStock === 0 ? 'text-red-500' : 'text-gray-900'}`}>{dress.availableStock}</span> / <span className="text-gray-500">{dress.totalStock}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${dress.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {dress.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => handleEditDress(dress)} className="text-primary hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-md transition-colors">Edit</button>
                          <button onClick={() => handleDeleteDress(dress._id)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors">Delete</button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500">No dresses found. Add one to get started!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ADD/EDIT DRESS FORM TAB */}
        {activeTab === 'form' && (
          <div className="animate-fade-in max-w-4xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Dress Details' : 'Add New Dress'}</h2>
                <p className="text-sm text-gray-500 mt-1">{editingId ? 'Update the information below' : 'Fill in the details to add a new item to the catalog'}</p>
              </div>
              
              <form onSubmit={editingId ? handleUpdateDress : handleAddDress} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="label">Dress Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="input-field" placeholder="e.g. Midnight Sparkle Gown" />
                  </div>
                  <div>
                    <label className="label">Occasion <span className="text-red-500">*</span></label>
                    <select name="occasion" value={formData.occasion} onChange={handleInputChange} required className="input-field">
                      <option value="Wedding">Wedding</option>
                      <option value="Party">Party</option>
                      <option value="Formal">Formal</option>
                      <option value="Casual">Casual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="label">Rental Price / Day (₹) <span className="text-red-500">*</span></label>
                    <input type="number" name="rentalPricePerDay" value={formData.rentalPricePerDay} onChange={handleInputChange} required className="input-field" placeholder="e.g. 1500" />
                  </div>
                  <div>
                    <label className="label">Deposit Amount (₹) <span className="text-red-500">*</span></label>
                    <input type="number" name="depositAmount" value={formData.depositAmount} onChange={handleInputChange} required className="input-field" placeholder="e.g. 5000" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="label">Description <span className="text-red-500">*</span></label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required className="input-field" rows="4" placeholder="Describe the dress, style, and fit..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="label">Total Stock Quantity <span className="text-red-500">*</span></label>
                    <input type="number" name="totalStock" value={formData.totalStock} onChange={handleInputChange} required className="input-field" placeholder="e.g. 5" />
                  </div>
                  <div>
                    <label className="label">Material</label>
                    <input type="text" name="material" value={formData.material} onChange={handleInputChange} className="input-field" placeholder="e.g. Velvet, Silk" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="label">Colors (comma separated)</label>
                    <input type="text" name="colors" value={formData.colors} onChange={handleInputChange} className="input-field" placeholder="e.g. Red, Black, Gold" />
                  </div>
                  <div>
                    <label className="label">Sizes (comma separated)</label>
                    <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} className="input-field" placeholder="e.g. XS, S, M, L" />
                  </div>
                </div>

                {!editingId && (
                  <div className="mb-8 p-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                    <label className="label mb-2">Upload Image</label>
                    <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-purple-600" />
                  </div>
                )}

                <div className="flex gap-4 border-t border-gray-100 pt-6">
                  <button type="submit" disabled={loading2} className="btn-primary px-8">
                    {loading2 ? 'Saving...' : (editingId ? 'Update Dress' : 'Add to Catalog')}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { resetForm(); setActiveTab('view'); }} className="btn-secondary px-8">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
