import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Shop from './pages/Shop';
import AdminPanel from './pages/AdminPanel';
import DressList from './pages/DressList';
import DressDetail from './pages/DressDetail';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Home from './pages/Home';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/auth" />;
  if (requiredRole && user.role !== requiredRole) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="glass-card p-8 text-center"><h2 className="text-2xl font-bold text-red-600 mb-2">Unauthorized Access</h2><p className="text-gray-600">You do not have permission to view this page.</p></div></div>;
  return children;
};

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="fixed w-full z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              LuxeRentals
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors font-medium">Home</Link>
            <Link to="/dresses" className="text-gray-600 hover:text-primary transition-colors font-medium">Collection</Link>
            {user && <Link to="/bookings" className="text-gray-600 hover:text-primary transition-colors font-medium">My Bookings</Link>}
            {user?.role === 'ROLE_ADMIN' && <Link to="/admin" className="text-gray-600 hover:text-primary transition-colors font-medium">Admin Dashboard</Link>}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Welcome, {user.name || user.email.split('@')[0]}</span>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn-primary text-sm py-2 px-6">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-primary focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-card mx-4 mb-4 p-4 absolute w-[calc(100%-2rem)]">
          <div className="flex flex-col space-y-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-primary font-medium">Home</Link>
            <Link to="/dresses" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-primary font-medium">Collection</Link>
            {user && <Link to="/bookings" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-primary font-medium">My Bookings</Link>}
            {user?.role === 'ROLE_ADMIN' && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-primary font-medium">Admin Dashboard</Link>}
            <hr className="border-gray-200" />
            {user ? (
              <>
                <span className="text-sm text-gray-500">Welcome, {user.email}</span>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left text-red-500 font-medium py-2">Logout</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="text-primary font-medium py-2">Sign In / Register</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <span className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4 block">
              LuxeRentals
            </span>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Experience the luxury of high-end fashion without the commitment. Rent designer dresses for your special occasions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-serif font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/dresses" className="hover:text-white transition-colors">Our Collection</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sizing Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="flex">
              <input type="email" placeholder="Enter your email address" className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary w-full text-sm border border-gray-700" />
              <button className="bg-primary hover:bg-purple-600 text-white px-4 py-2 rounded-r-md transition-colors text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2026 LuxeRentals. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function AppRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20"> {/* Add padding top for fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dresses" element={<DressList />} />
          <Route path="/dresses/:dressId" element={<DressDetail />} />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          <Route path="/bookings/:bookingId" element={
            <ProtectedRoute>
              <BookingConfirmation />
            </ProtectedRoute>
          } />
          <Route path="/shop" element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}