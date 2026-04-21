import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import './DressList.css';

export default function DressList() {
    const navigate = useNavigate();
    const [dresses, setDresses] = useState([]);
    // ...existing code...
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        searchTerm: '',
        occasion: 'ALL',
        minPrice: 0,
        maxPrice: 10000
    });

    useEffect(() => {
        fetchDresses();
    }, []);

    const fetchDresses = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/dresses');
            setDresses(response.data);
        } catch (err) {
            setError('Failed to fetch dresses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        setFilters({ ...filters, searchTerm });

        if (searchTerm.trim()) {
            try {
                const response = await api.get(`/api/dresses/search?query=${searchTerm}`);
                setDresses(response.data);
            } catch (err) {
                console.error('Search error:', err);
            }
        } else {
            fetchDresses();
        }
    };

    const handleOccasionFilter = async (occasion) => {
        setFilters({ ...filters, occasion });

        if (occasion !== 'ALL') {
            try {
                const response = await api.get(`/api/dresses/filter/occasion?occasion=${occasion}`);
                setDresses(response.data);
            } catch (err) {
                console.error('Filter error:', err);
            }
        } else {
            fetchDresses();
        }
    };

    const handlePriceFilter = async (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: parseInt(value) };
        setFilters(newFilters);

        try {
            const response = await api.get(
                `/api/dresses/filter/price?minPrice=${newFilters.minPrice}&maxPrice=${newFilters.maxPrice}`
            );
            setDresses(response.data);
        } catch (err) {
            console.error('Price filter error:', err);
        }
    };

    if (loading) return <div className="dress-list-container"><p>Loading dresses...</p></div>;
    if (error) return <div className="dress-list-container"><p style={{ color: 'red' }}>{error}</p></div>;

    return (
        <div className="dress-list-container">
            <h1>Our Dress Collection</h1>

            {/* Filters Sidebar */}
            <div className="filters-section">
                <div className="filter-group">
                    <label>Search</label>
                    <input
                        type="text"
                        placeholder="Search dresses..."
                        onChange={handleSearch}
                        value={filters.searchTerm}
                    />
                </div>

                <div className="filter-group">
                    <label>Occasion</label>
                    <select value={filters.occasion} onChange={(e) => handleOccasionFilter(e.target.value)}>
                        <option value="ALL">All Occasions</option>
                        <option value="WEDDING">Wedding</option>
                        <option value="PARTY">Party</option>
                        <option value="CASUAL">Casual</option>
                        <option value="FORMAL">Formal</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Price Range</label>
                    <div className="price-range">
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={handlePriceFilter}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={handlePriceFilter}
                        />
                    </div>
                </div>
            </div>

            {/* Dresses Grid */}
            <div className="dresses-grid">
                {dresses.length > 0 ? (
                    dresses.map(dress => (
                        <DressCard key={dress.id} dress={dress} />
                    ))
                ) : (
                    <p>No dresses found</p>
                )}
            </div>
        </div>
    );
}

function DressCard({ dress }) {
    const navigate = useNavigate();

    return (
        <div className="dress-card">
            <div className="dress-image">
                <img
                    src={dress.imageUrls?.[0] || 'https://via.placeholder.com/250x350'}
                    alt={dress.name}
                />
                <span className="availability">{dress.availableStock} Available</span>
            </div>
            <div className="dress-info">
                <h3>{dress.name}</h3>
                <p className="occasion">{dress.occasion}</p>
                <p className="description">{dress.description?.substring(0, 50)}...</p>

                <div className="dress-details">
                    <span className="price">₹{dress.rentalPricePerDay}/day</span>
                    <span className="deposit">Deposit: ₹{dress.depositAmount}</span>
                </div>

                <div className="dress-rating">
                    <span className="stars">⭐ {dress.averageRating || 'N/A'}</span>
                    <span className="reviews">({dress.totalReviews || 0} reviews)</span>
                </div>

                <button
                    className="view-btn"
                    onClick={() => navigate(`/dresses/${dress.id}`)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

