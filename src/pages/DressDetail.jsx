import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDressAPI } from '../api/useDressAPI';
import { AuthContext } from '../context/AuthContext';
import './DressDetail.css';

export default function DressDetail() {
    const { dressId } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { getDressById, checkAvailability: checkDressAvailability, loading, error: apiError } = useDressAPI();

    const [dress, setDress] = useState(null);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);
    const [booking, setBooking] = useState({
        selectedSize: '',
        selectedColor: '',
        startDate: '',
        endDate: '',
        deliveryAddress: '',
        returnAddress: '',
        notes: ''
    });
    const [isAvailable, setIsAvailable] = useState(true);
    const [calculatedCost, setCalculatedCost] = useState(0);

    useEffect(() => {
        fetchDressDetails();
    }, [dressId]);

    const fetchDressDetails = async () => {
        const dressData = await getDressById(dressId);
        if (dressData) {
            setDress(dressData);
        } else {
            setError(apiError || 'Failed to fetch dress details');
        }
    };

    const checkAvailability = async () => {
        if (!booking.startDate || !booking.endDate) {
            setError('Please select both start and end dates');
            return;
        }

        try {
            const availability = await checkDressAvailability(dressId, 1);
            if (availability && availability.isAvailable) {
                const startTime = new Date(booking.startDate).getTime();
                const endTime = new Date(booking.endDate).getTime();
                const days = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
                const cost = (dress.rentalPricePerDay * days) + dress.depositAmount;
                setCalculatedCost(cost);
                setError('');
                setIsAvailable(true);
            } else {
                setError('Dress is not available for selected dates');
                setIsAvailable(false);
            }
        } catch (err) {
            setError('Error checking availability');
            console.error(err);
        }
    };

    const handleBookingChange = (e) => {
        const { name, value } = e.target;
        setBooking({ ...booking, [name]: value });
    };

    const handleBooking = async () => {
        if (!user) {
            setError('Please login to book a dress');
            navigate('/auth');
            return;
        }

        if (!booking.selectedSize || !booking.selectedColor || !booking.startDate || !booking.endDate) {
            setError('Please fill all required fields');
            return;
        }

        try {
            const bookingData = {
                dressId,
                startDate: new Date(booking.startDate).getTime(),
                endDate: new Date(booking.endDate).getTime(),
                selectedSize: booking.selectedSize,
                selectedColor: booking.selectedColor,
                deliveryAddress: booking.deliveryAddress,
                returnAddress: booking.returnAddress,
                notes: booking.notes
            };

            const response = await api.post('/api/bookings', bookingData);
            alert('Booking created successfully!');
            navigate(`/bookings/${response.data.id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking');
            console.error(err);
        }
    };

    if (loading) return <div className="dress-detail-container"><p>Loading dress details...</p></div>;
    if (error && !dress) return <div className="dress-detail-container"><p style={{ color: 'red' }}>{error}</p></div>;
    if (!dress) return <div className="dress-detail-container"><p>Dress not found</p></div>;

    return (
        <div className="dress-detail-container">
            <button onClick={() => navigate(-1)} className="back-btn">← Back</button>

            <div className="detail-content">
                {/* Image Section */}
                <div className="image-section">
                    <div className="main-image">
                        <img src={dress.imageUrls?.[selectedImage] || 'https://via.placeholder.com/500x600'} alt={dress.name} />
                    </div>
                    <div className="thumbnail-images">
                        {dress.imageUrls?.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`${dress.name} ${idx + 1}`}
                                className={selectedImage === idx ? 'active' : ''}
                                onClick={() => setSelectedImage(idx)}
                            />
                        ))}
                    </div>
                </div>

                {/* Details Section */}
                <div className="details-section">
                    <h1>{dress.name}</h1>
                    <p className="occasion">{dress.occasion} • {dress.material}</p>

                    <div className="price-section">
                        <span className="rental-price">₹{dress.rentalPricePerDay} per day</span>
                        <span className="deposit-amount">Deposit: ₹{dress.depositAmount}</span>
                    </div>

                    <div className="rating-section">
                        <span className="stars">⭐ {dress.averageRating || 'N/A'}</span>
                        <span className="reviews">({dress.totalReviews || 0} reviews)</span>
                        <span className="stock">{dress.availableStock} in stock</span>
                    </div>

                    <p className="description">{dress.description}</p>

                    <div className="condition-material">
                        <p><strong>Condition:</strong> {dress.condition}</p>
                        <p><strong>Material:</strong> {dress.material}</p>
                    </div>

                    {/* Booking Section */}
                    <div className="booking-section">
                        <h3>Book This Dress</h3>

                        {error && <p className="error-msg">{error}</p>}

                        <div className="form-row">
                            <div className="form-group">
                                <label>Size</label>
                                <select
                                    name="selectedSize"
                                    value={booking.selectedSize}
                                    onChange={handleBookingChange}
                                >
                                    <option value="">Select Size</option>
                                    {dress.sizes?.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Color</label>
                                <select
                                    name="selectedColor"
                                    value={booking.selectedColor}
                                    onChange={handleBookingChange}
                                >
                                    <option value="">Select Color</option>
                                    {dress.colors?.map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={booking.startDate}
                                    onChange={handleBookingChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={booking.endDate}
                                    onChange={handleBookingChange}
                                />
                            </div>
                        </div>

                        <button onClick={checkAvailability} className="check-availability-btn">
                            Check Availability & Calculate Cost
                        </button>

                        {calculatedCost > 0 && (
                            <div className="cost-summary">
                                <p><strong>Rental Cost:</strong> ₹{dress.rentalPricePerDay * Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))}</p>
                                <p><strong>Deposit:</strong> ₹{dress.depositAmount}</p>
                                <p className="total"><strong>Total:</strong> ₹{calculatedCost}</p>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label>Delivery Address</label>
                                <input
                                    type="text"
                                    name="deliveryAddress"
                                    placeholder="Enter delivery address"
                                    value={booking.deliveryAddress}
                                    onChange={handleBookingChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Return Address (if different)</label>
                                <input
                                    type="text"
                                    name="returnAddress"
                                    placeholder="Enter return address"
                                    value={booking.returnAddress}
                                    onChange={handleBookingChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Notes</label>
                            <textarea
                                name="notes"
                                placeholder="Any special requests?"
                                value={booking.notes}
                                onChange={handleBookingChange}
                            />
                        </div>

                        <button
                            onClick={handleBooking}
                            className="book-btn"
                            disabled={!isAvailable || calculatedCost === 0}
                        >
                            Proceed to Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

