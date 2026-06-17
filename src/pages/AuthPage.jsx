import React, { useState, useContext } from 'react';
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'ROLE_USER' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                const res = await api.post('/api/auth/login', {
                    email: formData.email,
                    password: formData.password,
                });
                login(res.data.token);
                navigate('/');
            } else {
                await api.post('/api/auth/register', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                });
                alert('Registration successful! Please login.');
                setIsLogin(true);
                setFormData({ name: '', email: '', password: '', role: 'ROLE_USER' });
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'Authentication failed. Please check your credentials.';
            setError(msg);
            console.error('Auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Fashion" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-12 text-white">
                    <h2 className="text-4xl font-serif font-bold mb-4">Elevate Your Wardrobe</h2>
                    <p className="text-lg text-white/90 font-light max-w-md">Experience the luxury of designer fashion without the commitment. Rent your dream dress today.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50">
                <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                            {isLogin ? 'Welcome Back' : 'Create an Account'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {isLogin ? 'Enter your details to access your account' : 'Join LuxeRentals and start renting'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label className="label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Jane Doe"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        )}
                        <div>
                            <label className="label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="jane@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-primary mt-6"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Please wait...
                                </span>
                            ) : isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
                                    window.location.href = `${baseUrl}/oauth2/authorization/google`;
                                }}
                                className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-5 w-5 mr-2" />
                                Google
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button 
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="font-medium text-primary hover:text-secondary transition-colors focus:outline-none"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}