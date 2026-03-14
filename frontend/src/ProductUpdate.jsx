import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';

function ProductUpdate() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const [providers, setProviders] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        provider_id: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await api.get(`/products/${id}`);
                const product = productResponse.data.data;
                
                const providersResponse = await api.get('/providers');
                const fetchedProviders = providersResponse.data.data;
                setProviders(fetchedProviders);

                const isValidProvider = fetchedProviders.some(p => p.id === product.provider_id);

                setFormData({
                    name: product.name,
                    price: product.price,
                    description: product.description || '',
                    provider_id: isValidProvider ? product.provider_id : '' 
                });
                
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data", error);
                alert("Error loading data!");
                navigate('/');
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/products/${id}`, {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                provider_id: parseInt(formData.provider_id, 10)
            });
            navigate('/'); 
        } catch (error) {
            console.error(error);
            alert("Failed to update product. Did you select a valid provider?");
        }
    };

    if (loading) return <div>Loading product data...</div>;

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Product Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Price ($) *</label>
                    <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
                </div>
                
                
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Provider *</label>
                    <select 
                        name="provider_id" 
                        value={formData.provider_id || ''}
                        onChange={handleChange} 
                        required 
                        style={{ width: '100%', padding: '8px', backgroundColor: 'white' }}
                    >
                        <option value="" disabled>Select a Provider</option>
                        {providers.map(provider => (
                            <option key={provider.id} value={provider.id}>
                                {provider.name} (ID: {provider.id})
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default ProductUpdate;