import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';

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

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await api.put(`/api/bookings/${bookingId}/cancel`);
                // Use a non-blocking toast/alert ideally, but alert is fine for now
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

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="glass-card p-8 text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-600">{error}</p>
            </div>
        </div>
    );

    const getStatusStyle = (status) => {
        switch(status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ACTIVE': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'RETURN_INITIATED': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'RETURNED': return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">My Bookings</h1>
                        <p className="text-gray-500">Manage your rentals and returns.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex overflow-x-auto space-x-2 mb-8 pb-2 scrollbar-hide">
                    {['ALL', 'PENDING', 'CONFIRMED', 'ACTIVE', 'RETURNED'].map(f => (
                        <button
                            key={f}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'ALL' ? `All (${bookings.length})` : f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {filteredBookings.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredBookings.map((booking, idx) => (
                            <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-serif font-bold text-gray-900 line-clamp-1" title={booking.dressName}>
                                            {booking.dressName}
                                        </h3>
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Date</span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(booking.startDate).toLocaleDateString(undefined, {month: 'short', day:'numeric'})} - {new Date(booking.endDate).toLocaleDateString(undefined, {month: 'short', day:'numeric'})}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Variant</span>
                                            <span className="font-medium text-gray-900">{booking.selectedColor}, Size {booking.selectedSize}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Payment</span>
                                            <span className={`font-medium ${booking.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {booking.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                                        <span className="text-gray-500 text-sm">Total Amount</span>
                                        <span className="text-lg font-bold text-gray-900">₹{booking.totalAmount}</span>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex space-x-3">
                                    <button
                                        className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                        onClick={() => navigate(`/bookings/${booking.id}`)}
                                    >
                                        View Details
                                    </button>
                                    {booking.status === 'PENDING' && (
                                        <button
                                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                            onClick={() => handleCancelBooking(booking.id)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                        <p className="mt-1 text-gray-500 mb-6">Looks like you haven't rented any dresses yet.</p>
                        <button onClick={() => navigate('/dresses')} className="btn-primary">Start Shopping</button>
                    </div>
                )}
            </div>
        </div>
    );
}
