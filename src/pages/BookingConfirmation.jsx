import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import './BookingConfirmation.css';

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
            // TODO: Integrate with Razorpay/Stripe
            // For now, just simulate payment confirmation
            await api.put(`/api/bookings/${bookingId}/payment`, {
                paymentStatus: 'COMPLETED',
                paymentId: 'DEMO_' + Date.now()
            });

            alert('Payment successful!');
            await fetchBookingDetails();
        } catch (err) {
            setError('Payment failed. Please try again.');
            console.error(err);
        } finally {
            setPaymentProcessing(false);
        }
    };

    if (loading) return <div className="booking-confirmation-container"><p>Loading booking details...</p></div>;
    if (error) return <div className="booking-confirmation-container"><p style={{ color: 'red' }}>{error}</p></div>;
    if (!booking) return <div className="booking-confirmation-container"><p>Booking not found</p></div>;

    const rentalDays = booking.rentalDays;
    const startDate = new Date(booking.startDate).toLocaleDateString();
    const endDate = new Date(booking.endDate).toLocaleDateString();

    return (
        <div className="booking-confirmation-container">
            <div className="confirmation-card">
                <div className="confirmation-header">
                    <h1>Booking Confirmation</h1>
                    <p className="booking-id">Booking ID: {booking.id}</p>
                </div>

                <div className="booking-status">
                    <div className={`status-badge ${booking.status.toLowerCase()}`}>
                        {booking.status}
                    </div>
                    <div className={`payment-badge ${booking.paymentStatus.toLowerCase()}`}>
                        Payment: {booking.paymentStatus}
                    </div>
                </div>

                <div className="booking-details">
                    <section>
                        <h3>Dress Details</h3>
                        <p><strong>Dress:</strong> {booking.dressName}</p>
                        <p><strong>Size:</strong> {booking.selectedSize}</p>
                        <p><strong>Color:</strong> {booking.selectedColor}</p>
                    </section>

                    <section>
                        <h3>Rental Period</h3>
                        <p><strong>Start Date:</strong> {startDate}</p>
                        <p><strong>End Date:</strong> {endDate}</p>
                        <p><strong>Duration:</strong> {rentalDays} days</p>
                    </section>

                    <section>
                        <h3>Delivery Details</h3>
                        <p><strong>Delivery Address:</strong> {booking.deliveryAddress || 'Not provided'}</p>
                        <p><strong>Return Address:</strong> {booking.returnAddress || 'Same as delivery'}</p>
                    </section>

                    <section className="cost-breakdown">
                        <h3>Cost Breakdown</h3>
                        <div className="cost-row">
                            <span>Rental ({rentalDays} days × ₹{booking.rentalPrice / rentalDays}):</span>
                            <span>₹{booking.rentalPrice}</span>
                        </div>
                        <div className="cost-row">
                            <span>Deposit:</span>
                            <span>₹{booking.depositAmount}</span>
                        </div>
                        <div className="cost-row total">
                            <span>Total Amount:</span>
                            <span>₹{booking.totalAmount}</span>
                        </div>
                    </section>

                    {booking.notes && (
                        <section>
                            <h3>Notes</h3>
                            <p>{booking.notes}</p>
                        </section>
                    )}
                </div>

                <div className="action-buttons">
                    {booking.paymentStatus === 'PENDING' && (
                        <button
                            onClick={handlePayment}
                            disabled={paymentProcessing}
                            className="pay-btn"
                        >
                            {paymentProcessing ? 'Processing...' : 'Complete Payment'}
                        </button>
                    )}

                    {booking.paymentStatus === 'COMPLETED' && (
                        <div className="success-message">
                            ✓ Payment confirmed! Dress will be delivered on {startDate}
                        </div>
                    )}

                    <button onClick={() => navigate('/')} className="back-btn">
                        Continue Shopping
                    </button>
                </div>

                <div className="note-section">
                    <p><strong>Important:</strong></p>
                    <ul>
                        <li>Your dress will be delivered on the specified date</li>
                        <li>Please inspect the dress upon delivery</li>
                        <li>Return the dress by the end date to avoid late charges</li>
                        <li>Deposit will be refunded after successful return</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

