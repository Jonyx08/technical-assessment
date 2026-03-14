import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

function ProviderCreate() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        description: ''
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
          
            await api.post('/providers', formData);
            

            navigate('/providers');
        } catch (error) {
            console.error(error);
            alert("Failed to create provider.");
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Create New Provider</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Provider Name *</label>
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
                    <label style={{ display: 'block', marginBottom: '5px' }}>Address</label>
                    <input 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Phone</label>
                    <input 
                        type="text" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
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

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                >
                    {loading ? 'Creating...' : 'Create Provider'}
                </button>
            </form>
        </div>
    );
}

export default ProviderCreate;