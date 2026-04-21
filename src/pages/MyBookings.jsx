import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import './MyBookings.css';

export default function MyBookings() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/bookings');
            setBookings(response.data);
        } catch (err) {
            setError('Failed to fetch bookings');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            'PENDING': '#FFC107',
            'CONFIRMED': '#4CAF50',
            'SHIPPED': '#2196F3',
            'ACTIVE': '#9C27B0',
            'RETURN_INITIATED': '#FF9800',
            'RETURNED': '#607D8B',
            'CANCELLED': '#F44336'
        };
        return statusColors[status] || '#999';
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await api.put(`/api/bookings/${bookingId}/cancel`);
                alert('Booking cancelled successfully');
                fetchBookings();
            } catch (err) {
                alert('Failed to cancel booking');
                console.error(err);
            }
        }
    };

    const filteredBookings = filter === 'ALL'
        ? bookings
        : bookings.filter(b => b.status === filter);

    if (loading) return <div className="my-bookings-container"><p>Loading your bookings...</p></div>;
    if (error) return <div className="my-bookings-container"><p style={{ color: 'red' }}>{error}</p></div>;

    return (
        <div className="my-bookings-container">
            <h1>My Bookings</h1>

            <div className="filter-buttons">
                <button
                    className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setFilter('ALL')}
                >
                    All ({bookings.length})
                </button>
                <button
                    className={`filter-btn ${filter === 'PENDING' ? 'active' : ''}`}
                    onClick={() => setFilter('PENDING')}
                >
                    Pending
                </button>
                <button
                    className={`filter-btn ${filter === 'CONFIRMED' ? 'active' : ''}`}
                    onClick={() => setFilter('CONFIRMED')}
                >
                    Confirmed
                </button>
                <button
                    className={`filter-btn ${filter === 'ACTIVE' ? 'active' : ''}`}
                    onClick={() => setFilter('ACTIVE')}
                >
                    Active
                </button>
                <button
                    className={`filter-btn ${filter === 'RETURNED' ? 'active' : ''}`}
                    onClick={() => setFilter('RETURNED')}
                >
                    Returned
                </button>
            </div>

            {filteredBookings.length > 0 ? (
                <div className="bookings-list">
                    {filteredBookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-header">
                                <h3>{booking.dressName}</h3>
                                <span className="status-badge" style={{ backgroundColor: getStatusColor(booking.status) }}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="booking-details-grid">
                                <div className="detail-item">
                                    <label>Size</label>
                                    <p>{booking.selectedSize}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Color</label>
                                    <p>{booking.selectedColor}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Start Date</label>
                                    <p>{new Date(booking.startDate).toLocaleDateString()}</p>
                                </div>
                                <div className="detail-item">
                                    <label>End Date</label>
                                    <p>{new Date(booking.endDate).toLocaleDateString()}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Duration</label>
                                    <p>{booking.rentalDays} days</p>
                                </div>
                                <div className="detail-item">
                                    <label>Total Amount</label>
                                    <p className="price">₹{booking.totalAmount}</p>
                                </div>
                            </div>

                            <div className="booking-cost">
                                <div className="cost-row">
                                    <span>Rental:</span>
                                    <span>₹{booking.rentalPrice}</span>
                                </div>
                                <div className="cost-row">
                                    <span>Deposit:</span>
                                    <span>₹{booking.depositAmount}</span>
                                </div>
                                <div className="cost-row total">
                                    <span>Payment Status:</span>
                                    <span
                                        style={{
                                            backgroundColor: booking.paymentStatus === 'COMPLETED' ? '#4CAF50' : '#FFC107',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {booking.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="booking-actions">
                                <button
                                    className="detail-btn"
                                    onClick={() => navigate(`/bookings/${booking.id}`)}
                                >
                                    View Details
                                </button>
                                {booking.status === 'PENDING' && (
                                    <button
                                        className="cancel-btn"
                                        onClick={() => handleCancelBooking(booking.id)}
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-bookings">
                    <p>No bookings found</p>
                    <button onClick={() => navigate('/dresses')}>Start Shopping</button>
                </div>
            )}
        </div>
    );
}

