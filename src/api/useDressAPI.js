import { useState, useEffect } from 'react';
import api from './axiosInstance';

/**
 * Custom hook for dress API operations
 * Provides methods for fetching and filtering dresses
 */
export const useDressAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all active dresses (public)
  const getAllDresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/dresses');
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dresses');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get dress by ID
  const getDressById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/dresses/${id}`);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dress');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Search dresses
  const searchDresses = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/dresses/search', {
        params: { query }
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Filter by category
  const getDressesByCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/dresses/category/${categoryId}`);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dresses');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Filter by occasion
  const getDressesByOccasion = async (occasion) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/dresses/filter/occasion', {
        params: { occasion }
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dresses');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Filter by price range
  const getDressesByPriceRange = async (minPrice, maxPrice) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/dresses/filter/price', {
        params: { minPrice, maxPrice }
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dresses');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Check dress availability
  const checkAvailability = async (id, requiredStock = 1) => {
    try {
      const response = await api.get(`/api/dresses/${id}/availability`, {
        params: { requiredStock }
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check availability');
      return null;
    }
  };

  // Admin: Get all dresses (including inactive)
  const getAllDressesAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/admin/dresses');
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dresses');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Admin: Get dresses with pagination
  const getDressesWithPagination = async (page = 0, size = 10, occasion = null, category = null) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, size };
      if (occasion) params.occasion = occasion;
      if (category) params.category = category;

      const response = await api.get('/api/admin/dresses/page', { params });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dresses');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Get dress statistics
  const getDressStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/admin/dresses/stats');
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Get stock summary
  const getStockSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/admin/dresses/stock-summary');
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stock summary');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    // Public methods
    getAllDresses,
    getDressById,
    searchDresses,
    getDressesByCategory,
    getDressesByOccasion,
    getDressesByPriceRange,
    checkAvailability,
    // Admin methods
    getAllDressesAdmin,
    getDressesWithPagination,
    getDressStatistics,
    getStockSummary
  };
};

export default useDressAPI;

