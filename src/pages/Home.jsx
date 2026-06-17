import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const featuredDresses = [
    { id: '1', name: 'Midnight Sparkle Gown', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price: 2500, category: 'Wedding' },
    { id: '2', name: 'Emerald Velvet Midi', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price: 1800, category: 'Party' },
    { id: '3', name: 'Rose Gold Sequin Dress', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', price: 3200, category: 'Formal' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560457099-64cb8a5eb506?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Hero Fashion" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <span className="text-accent font-semibold tracking-widest uppercase text-sm md:text-base mb-4 block">Premium Rental Boutique</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white font-bold mb-6 leading-tight">
            Rent the Runway, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Own the Moment.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
            Access thousands of designer dresses for a fraction of the retail price. Find your perfect look for any occasion.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/dresses')}
              className="px-8 py-4 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Explore Collection
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              How it Works
            </button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Trending This Week</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Discover the most sought-after styles our community is loving right now.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredDresses.map((dress) => (
              <div key={dress.id} className="group cursor-pointer" onClick={() => navigate('/dresses')}>
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4">
                  <img 
                    src={dress.image} 
                    alt={dress.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="btn-secondary">Quick View</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                    {dress.category}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-gray-900 group-hover:text-primary transition-colors">{dress.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Designer Collection</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">₹{dress.price}<span className="text-sm font-normal text-gray-500">/day</span></p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button onClick={() => navigate('/dresses')} className="btn-secondary">
              View All Dresses
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">How It Works</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary text-2xl font-bold">1</div>
              <h3 className="text-xl font-serif font-semibold mb-3">Rent</h3>
              <p className="text-gray-600">Browse our extensive collection of designer dresses and select your perfect fit for 4 or 8 days.</p>
            </div>
            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary text-2xl font-bold">2</div>
              <h3 className="text-xl font-serif font-semibold mb-3">Wear</h3>
              <p className="text-gray-600">Your dress arrives pristine and ready to wear. Turn heads and make unforgettable memories.</p>
            </div>
            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-accent text-2xl font-bold">3</div>
              <h3 className="text-xl font-serif font-semibold mb-3">Return</h3>
              <p className="text-gray-600">Pack it up in the provided pre-paid envelope and drop it off. We'll handle the dry cleaning!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary z-0"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-10"></div>
        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready to shine?</h2>
          <p className="text-xl text-white/90 mb-10 font-light">Join thousands of women who have discovered a smarter way to dress for special occasions.</p>
          <button onClick={() => navigate('/auth')} className="px-10 py-4 bg-white text-primary font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
            Sign Up Now & Get 20% Off
          </button>
        </div>
      </section>
    </div>
  );
}
