import React, { useState, useContext } from 'react';
import api from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

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
        <div className="auth-bg">
            <div className="auth-card">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                {error && (
                    <div className="error">{error}</div>
                )}
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <button className="switch-btn" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                    Switch to {isLogin ? 'Register' : 'Login'}
                </button>
                <button
                    type="button"
                    className="google-login-btn"
                    onClick={() => {
                        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
                    }}
                    style={{ marginBottom: '10px', background: '#fff', color: '#444', border: '1px solid #ddd', borderRadius: '6px', padding: '10px 0', fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(102,126,234,0.06)' }}
                >
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: 22, height: 22 }} />
                    Login with Google
                </button>
            </div>
        </div>
    );
}