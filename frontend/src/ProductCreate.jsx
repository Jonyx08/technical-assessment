import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function ProductCreate() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        provider_id: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setLoading(true);

        try {
            await api.post('/products', {
                name: formData.name,
                price: parseFloat(formData.price), 
                description: formData.description,
                provider_id: parseInt(formData.provider_id, 10) 
            });
            
            navigate('/');
        } catch (error) {
            console.error(error);
            alert("Failed to create product. Check the console for errors.");
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Create New Product</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Product Name *</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Price ($) *</label>
                    <input 
                        type="number" 
                        name="price" 
                        step="0.01" 
                        value={formData.price} 
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px', minHeight: '80px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Provider ID *</label>
                    <input 
                        type="number" 
                        name="provider_id" 
                        value={formData.provider_id} 
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                >
                    {loading ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
}

export default ProductCreate;