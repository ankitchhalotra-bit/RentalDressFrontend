import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDressAPI } from '../api/useDressAPI';

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        const newFilters = { ...filters, [name]: parseInt(value) || 0 };
        setFilters(newFilters);

        // Optional: debounce this or add an apply button to prevent too many requests
        const results = await getDressesByPriceRange(newFilters.minPrice, newFilters.maxPrice);
        setDresses(results || []);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="glass-card p-8 text-center">
                <h2 className="text-xl font-bold text-red-600 mb-2">Oops! Something went wrong.</h2>
                <p className="text-gray-600">{error}</p>
                <button onClick={fetchDresses} className="mt-4 btn-secondary">Try Again</button>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">The Collection</h1>
                    <p className="text-gray-500">Discover your perfect look from our curated selection.</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{dresses.length} Results</span>
                    <button 
                        className="md:hidden flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        Filters
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className={`w-full md:w-64 flex-shrink-0 space-y-8 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
                    {/* Search */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Search</h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search styles..."
                                onChange={handleSearch}
                                value={filters.searchTerm}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>

                    {/* Occasion */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Occasion</h3>
                        <div className="space-y-2">
                            {['ALL', 'Wedding', 'Party', 'Casual', 'Formal'].map(occ => (
                                <label key={occ} className="flex items-center group cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="occasion" 
                                        value={occ} 
                                        checked={filters.occasion === occ}
                                        onChange={() => handleOccasionFilter(occ)}
                                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary cursor-pointer" 
                                    />
                                    <span className={`ml-3 text-sm transition-colors ${filters.occasion === occ ? 'text-primary font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                        {occ === 'ALL' ? 'All Occasions' : occ}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Price Range (₹)</h3>
                        <div className="flex items-center space-x-2">
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Min"
                                value={filters.minPrice}
                                onChange={handlePriceFilter}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Max"
                                value={filters.maxPrice}
                                onChange={handlePriceFilter}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>
                </aside>

                {/* Dresses Grid */}
                <div className="flex-1">
                    {dresses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {dresses.map((dress, idx) => (
                                <div key={dress._id || dress.id} className="animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <DressCard dress={dress} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900">No dresses found</h3>
                            <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
                            <button 
                                onClick={() => {
                                    setFilters({ searchTerm: '', occasion: 'ALL', minPrice: 0, maxPrice: 10000 });
                                    fetchDresses();
                                }}
                                className="mt-6 text-primary hover:text-secondary font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DressCard({ dress }) {
    const navigate = useNavigate();

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 cursor-pointer" onClick={() => navigate(`/dresses/${dress._id || dress.id}`)}>
                <img
                    src={dress.imageUrls?.[0] || 'https://via.placeholder.com/400x600?text=Dress'}
                    alt={dress.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-800 shadow-sm">
                        {dress.occasion}
                    </span>
                    {dress.availableStock <= 2 && dress.availableStock > 0 && (
                        <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm uppercase tracking-wider">
                            Only {dress.availableStock} left
                        </span>
                    )}
                </div>

                {/* Hover Quick Action */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/60 to-transparent">
                    <button 
                        className="w-full py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dresses/${dress._id || dress.id}`);
                        }}
                    >
                        View Details
                    </button>
                </div>
            </div>
            
            <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 
                        className="text-lg font-serif font-bold text-gray-900 group-hover:text-primary transition-colors cursor-pointer line-clamp-1"
                        onClick={() => navigate(`/dresses/${dress._id || dress.id}`)}
                        title={dress.name}
                    >
                        {dress.name}
                    </h3>
                </div>
                
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                    {dress.description || 'A beautiful dress for your special occasion.'}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                        <span className="text-xl font-bold text-gray-900">₹{dress.rentalPricePerDay}</span>
                        <span className="text-xs text-gray-500 ml-1">/ day</span>
                    </div>
                    <div className="flex items-center bg-gray-50 px-2 py-1 rounded-md">
                        <svg className="w-3.5 h-3.5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{dress.averageRating || 'N/A'}</span>
                        <span className="text-xs text-gray-400 ml-1">({dress.totalReviews || 0})</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
