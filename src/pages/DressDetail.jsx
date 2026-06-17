import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDressAPI } from '../api/useDressAPI';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';

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
    const [isAvailable, setIsAvailable] = useState(null);
    const [calculatedCost, setCalculatedCost] = useState(0);

    useEffect(() => {
        fetchDressDetails();
    }, [dressId]);

    const fetchDressDetails = async () => {
        const dressData = await getDressById(dressId);
        if (dressData) {
            setDress(dressData);
            // Auto-select first size/color if available
            if (dressData.sizes?.length > 0) setBooking(prev => ({ ...prev, selectedSize: dressData.sizes[0] }));
            if (dressData.colors?.length > 0) setBooking(prev => ({ ...prev, selectedColor: dressData.colors[0] }));
        } else {
            setError(apiError || 'Failed to fetch dress details');
        }
    };

    const checkAvailability = async () => {
        if (!booking.startDate || !booking.endDate) {
            setError('Please select both start and end dates');
            return;
        }

        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);

        if (start >= end) {
            setError('End date must be after start date');
            return;
        }

        try {
            const availability = await checkDressAvailability(dressId, 1);
            if (availability && availability.isAvailable) {
                const startTime = start.getTime();
                const endTime = end.getTime();
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
        // Reset availability if dates change
        if (name === 'startDate' || name === 'endDate') {
            setIsAvailable(null);
            setCalculatedCost(0);
        }
    };

    const handleBooking = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }

        if (!isAvailable) {
            checkAvailability();
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
                returnAddress: booking.returnAddress || booking.deliveryAddress,
                notes: booking.notes
            };

            const response = await api.post('/api/bookings', bookingData);
            navigate(`/bookings/${response.data.id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking');
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        </div>
    );

    if (error && !dress) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="glass-card p-8 text-center max-w-md w-full">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Dress Not Found</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button onClick={() => navigate('/dresses')} className="btn-primary w-full">Back to Collection</button>
            </div>
        </div>
    );

    if (!dress) return null;

    const images = dress.imageUrls?.length > 0 ? dress.imageUrls : ['https://via.placeholder.com/800x1200?text=No+Image'];

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav className="flex text-sm text-gray-500 mb-8 animate-fade-in">
                    <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Home</button>
                    <span className="mx-2">/</span>
                    <button onClick={() => navigate('/dresses')} className="hover:text-primary transition-colors">Collection</button>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium truncate">{dress.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Image Gallery */}
                    <div className="w-full lg:w-3/5 animate-slide-up">
                        <div className="flex flex-col-reverse md:flex-row gap-4">
                            {/* Thumbnails */}
                            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[800px] scrollbar-hide py-1 md:py-0 md:w-24 flex-shrink-0">
                                {images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative rounded-lg overflow-hidden flex-shrink-0 w-20 h-28 border-2 transition-all duration-200 ${selectedImage === idx ? 'border-primary ring-2 ring-primary/30' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                            
                            {/* Main Image */}
                            <div className="relative flex-1 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-[3/4] md:aspect-auto md:h-[800px]">
                                <img 
                                    src={images[selectedImage]} 
                                    alt={dress.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Details & Booking */}
                    <div className="w-full lg:w-2/5 flex flex-col">
                        <div className="sticky top-24 space-y-8 animate-fade-in">
                            {/* Header Info */}
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">{dress.name}</h1>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
                                    <span className="px-3 py-1 bg-gray-100 rounded-full font-medium text-gray-800">{dress.occasion}</span>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        {dress.averageRating || 'New'} <span className="ml-1 text-gray-400">({dress.totalReviews || 0} reviews)</span>
                                    </span>
                                </div>
                                
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-3xl font-bold text-gray-900">₹{dress.rentalPricePerDay}</span>
                                    <span className="text-gray-500">/ day rental</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">Refundable deposit: ₹{dress.depositAmount}</p>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-serif font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed font-light">{dress.description}</p>
                                
                                <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                                    <li><span className="font-medium text-gray-900">Condition:</span> {dress.condition}</li>
                                    <li><span className="font-medium text-gray-900">Material:</span> {dress.material}</li>
                                    <li><span className="font-medium text-gray-900">Available:</span> <span className={dress.availableStock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{dress.availableStock} in stock</span></li>
                                </ul>
                            </div>

                            {/* Booking Form Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                                <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Reserve this dress</h3>
                                
                                {error && (
                                    <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-start">
                                        <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-5">
                                    {/* Selectors */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Size</label>
                                            <select name="selectedSize" value={booking.selectedSize} onChange={handleBookingChange} className="input-field py-2.5">
                                                <option value="" disabled>Select Size</option>
                                                {dress.sizes?.map(size => <option key={size} value={size}>{size}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label">Color</label>
                                            <select name="selectedColor" value={booking.selectedColor} onChange={handleBookingChange} className="input-field py-2.5">
                                                <option value="" disabled>Select Color</option>
                                                {dress.colors?.map(color => <option key={color} value={color}>{color}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Dates */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label">Start Date</label>
                                            <input type="date" name="startDate" value={booking.startDate} onChange={handleBookingChange} min={new Date().toISOString().split('T')[0]} className="input-field py-2.5" />
                                        </div>
                                        <div>
                                            <label className="label">End Date</label>
                                            <input type="date" name="endDate" value={booking.endDate} onChange={handleBookingChange} min={booking.startDate || new Date().toISOString().split('T')[0]} className="input-field py-2.5" />
                                        </div>
                                    </div>

                                    {/* Addresses */}
                                    {isAvailable && (
                                        <div className="space-y-4 animate-fade-in pt-4 border-t border-gray-100">
                                            <div>
                                                <label className="label">Delivery Address</label>
                                                <input type="text" name="deliveryAddress" placeholder="Enter delivery address" value={booking.deliveryAddress} onChange={handleBookingChange} className="input-field" />
                                            </div>
                                            <div>
                                                <label className="label">Special Instructions (Optional)</label>
                                                <textarea name="notes" placeholder="Any special requests?" value={booking.notes} onChange={handleBookingChange} rows="2" className="input-field resize-none"></textarea>
                                            </div>
                                        </div>
                                    )}

                                    {/* Cost Summary */}
                                    {calculatedCost > 0 && isAvailable && (
                                        <div className="bg-gray-50 rounded-xl p-4 mt-6 animate-fade-in">
                                            <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                                            <div className="space-y-2 text-sm text-gray-600 mb-3">
                                                <div className="flex justify-between">
                                                    <span>Rental Cost ({Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} days)</span>
                                                    <span className="font-medium text-gray-900">₹{calculatedCost - dress.depositAmount}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Refundable Deposit</span>
                                                    <span className="font-medium text-gray-900">₹{dress.depositAmount}</span>
                                                </div>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                                <span className="font-bold text-gray-900">Total Amount</span>
                                                <span className="text-xl font-bold text-primary">₹{calculatedCost}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <button 
                                        onClick={isAvailable ? handleBooking : checkAvailability} 
                                        className="w-full btn-primary py-4 text-lg mt-2"
                                        disabled={dress.availableStock <= 0}
                                    >
                                        {dress.availableStock <= 0 ? 'Out of Stock' : (isAvailable ? 'Confirm Booking' : 'Check Availability')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
