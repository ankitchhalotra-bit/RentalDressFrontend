import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosInstance';

export default function Shop() {
    const { user, logout } = useContext(AuthContext);

    const handleAddToCart = async (dressId) => {
        try {
            await api.post(`/api/cart/add?userId=${user.userId}&dressId=${dressId}`);
            alert("Added to cart!");
        } catch (error) {
            console.error("Error adding to cart", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dress Catalog</h1>
            {user ? (
                <>
                    <p>Welcome, {user.email} (Role: {user.role})</p>
                    <button onClick={logout}>Logout</button>
                    {/* Example of adding item to cart. You would map through fetched dresses here */}
                    <div style={{ marginTop: '20px', border: '1px solid black', padding: '10px', width: '200px' }}>
                        <h3>Sample Dress</h3>
                        <p>Price: $50</p>
                        <button onClick={() => handleAddToCart('sample-dress-id-123')}>Add to Cart</button>
                    </div>
                </>
            ) : (
                <p>Please log in to view and purchase dresses.</p>
            )}
        </div>
    );
}