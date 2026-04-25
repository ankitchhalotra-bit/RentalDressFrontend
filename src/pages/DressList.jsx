import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDressAPI } from '../api/useDressAPI';
import './DressList.css';

export default function DressList() {
    const navigate = useNavigate();
    const [dresses, setDresses] = useState([]);
    const {
        getAllDresses,
        searchDresses,
        getDressesByOccasion,
        getDressesByPriceRange,
        loading,
        error
    } = useDressAPI();

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
        const fetchedDresses = await getAllDresses();
        setDresses(fetchedDresses || []);
    };

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        setFilters({ ...filters, searchTerm });

        if (searchTerm.trim()) {
            const results = await searchDresses(searchTerm);
            setDresses(results || []);
        } else {
            fetchDresses();
        }
    };

    const handleOccasionFilter = async (occasion) => {
        setFilters({ ...filters, occasion });

        if (occasion !== 'ALL') {
            const results = await getDressesByOccasion(occasion);
            setDresses(results || []);
        } else {
            fetchDresses();
        }
    };

    const handlePriceFilter = async (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: parseInt(value) };
        setFilters(newFilters);

        const results = await getDressesByPriceRange(newFilters.minPrice, newFilters.maxPrice);
        setDresses(results || []);
    };

    if (loading) return <div className="dress-list-container"><p>Loading dresses...</p></div>;
    if (error) return <div className="dress-list-container"><p style={{ color: 'red' }}>Error: {error}</p></div>;

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
                        <option value="Wedding">Wedding</option>
                        <option value="Party">Party</option>
                        <option value="Casual">Casual</option>
                        <option value="Formal">Formal</option>
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
                        <DressCard key={dress._id || dress.id} dress={dress} />
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
                    onClick={() => navigate(`/dresses/${dress._id || dress.id}`)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

