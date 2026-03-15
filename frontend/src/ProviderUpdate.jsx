import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';

function ProviderUpdate() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        description: ''
    });

    // Fetch the existing provider data when the page loads
    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const response = await api.get(`/providers/${id}`);
                const provider = response.data.data;
                
                setFormData({
                    name: provider.name || '',
                    address: provider.address || '',
                    phone: provider.phone || '',
                    description: provider.description || ''
                });
                
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch provider", error);
                alert("Provider not found!");
                navigate('/providers');
            }
        };
        fetchProvider();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the updated data to the backend
            await api.put(`/providers/${id}`, formData);
            
            // Redirect back to the providers list on success
            navigate('/providers'); 
        } catch (error) {
            console.error(error);
            alert("Failed to update provider.");
        }
    };

    if (loading) return <div>Loading provider data...</div>;

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Edit Provider</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Provider Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
                </div>

                <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default ProviderUpdate;