import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function BookingConfirmation() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentProcessing, setPaymentProcessing] = useState(false);

    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            const response = await api.get(`/api/bookings/${bookingId}`);
            setBooking(response.data);
        } catch (err) {
            setError('Failed to fetch booking details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setPaymentProcessing(true);
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            await api.put(`/api/bookings/${bookingId}/payment`, {
                paymentStatus: 'COMPLETED',
                paymentId: 'DEMO_' + Date.now()
            });

            await fetchBookingDetails();
        } catch (err) {
            setError('Payment failed. Please try again.');
            console.error(err);
        } finally {
            setPaymentProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        </div>
    );

    if (error || !booking) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="glass-card p-8 text-center max-w-md w-full mx-4">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-600 mb-6">{error || 'Unable to locate this booking.'}</p>
                <button onClick={() => navigate('/bookings')} className="btn-secondary w-full">Go to My Bookings</button>
            </div>
        </div>
    );

    const rentalDays = booking.rentalDays;
    const startDate = new Date(booking.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const endDate = new Date(booking.endDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {booking.paymentStatus === 'COMPLETED' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-center animate-fade-in">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-green-900 mb-1">Payment Successful!</h2>
                        <p className="text-green-700">Your order is confirmed and will be delivered on {new Date(booking.startDate).toLocaleDateString()}.</p>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-slide-up">
                    <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white text-center">
                        <h1 className="text-3xl font-serif font-bold mb-2">Order Summary</h1>
                        <p className="text-white/80 font-mono text-sm tracking-widest uppercase">Order #{booking.id}</p>
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Dress Details</h3>
                                <div className="space-y-2">
                                    <p className="text-lg font-serif font-bold text-gray-900">{booking.dressName}</p>
                                    <p className="text-gray-600">Size: <span className="font-medium text-gray-900">{booking.selectedSize}</span></p>
                                    <p className="text-gray-600">Color: <span className="font-medium text-gray-900">{booking.selectedColor}</span></p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Rental Period</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>From:</span>
                                        <span className="font-medium text-gray-900">{startDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>To:</span>
                                        <span className="font-medium text-gray-900">{endDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Duration:</span>
                                        <span className="font-medium text-gray-900">{rentalDays} days</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100 mb-8" />

                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Delivery & Return</h3>
                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-3">
                                <div>
                                    <span className="font-medium text-gray-900 block mb-1">Delivery Address:</span>
                                    {booking.deliveryAddress || 'Not provided'}
                                </div>
                                {booking.returnAddress !== booking.deliveryAddress && (
                                    <div>
                                        <span className="font-medium text-gray-900 block mb-1">Return Address:</span>
                                        {booking.returnAddress}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Cost Breakdown</h3>
                            <div className="space-y-3 text-sm text-gray-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Rental ({rentalDays} days × ₹{booking.rentalPrice / rentalDays})</span>
                                    <span className="font-medium text-gray-900">₹{booking.rentalPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Refundable Deposit</span>
                                    <span className="font-medium text-gray-900">₹{booking.depositAmount}</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">Total Amount</span>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${booking.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {booking.paymentStatus}
                                    </span>
                                </div>
                                <span className="text-3xl font-bold text-gray-900">₹{booking.totalAmount}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {booking.paymentStatus === 'PENDING' && (
                                <button 
                                    onClick={handlePayment} 
                                    disabled={paymentProcessing}
                                    className="flex-1 btn-primary"
                                >
                                    {paymentProcessing ? 'Processing...' : 'Complete Payment'}
                                </button>
                            )}
                            <button 
                                onClick={() => navigate('/dresses')} 
                                className={`btn-secondary ${booking.paymentStatus === 'PENDING' ? 'flex-1' : 'w-full'}`}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p className="mb-2">Need help with your order?</p>
                    <a href="#" className="text-primary hover:underline font-medium">Contact Customer Support</a>
                </div>
            </div>
        </div>
    );
}
