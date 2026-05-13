import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Check } from 'lucide-react';
import API_BASE from '../config';
import './HostDashboard.css';

const HostDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(150);
  const [imageUrl, setImageUrl] = useState('');
  const [amenities, setAmenities] = useState('WiFi, Air Conditioning, Kitchen, Pool');
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    
    // Safety check, user state might take a moment to populate from App.jsx
    if (user !== null) {
      if (!user.isHost) {
        alert("You must be an approved Host to access this dashboard.");
        navigate('/');
      } else {
        setLoading(false);
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    const token = localStorage.getItem('token');
    const amenityArray = amenities.split(',').map(a => a.trim()).filter(a => a.length > 0);
    
    try {
      const res = await fetch(`${API_BASE}/api/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          location,
          pricePerNight: price,
          images: imageUrl ? [imageUrl] : [],
          amenities: amenityArray
        })
      });
      
      if (res.ok) {
        setSubmitStatus('success');
        setTimeout(() => {
          navigate('/'); // redirect to home to let them see their new creation!
          window.location.reload(); // Hard reload to fetch the new properties immediately
        }, 1500);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create listing');
        setSubmitStatus(null);
      }
    } catch(err) {
      console.error(err);
      alert('Error creating listing');
      setSubmitStatus(null);
    }
  };

  if (loading) return <div className="page-loading">Authorizing Host Access...</div>;

  return (
    <main className="host-dashboard-page">
      <div className="host-header">
        <h1>Welcome back, {user?.name.split(' ')[0]}</h1>
        <p>Manage your luxury properties and publish new experiences.</p>
      </div>

      <div className="host-content">
        <form className="host-form glass-panel" onSubmit={handleSubmit}>
          <h2><PlusCircle size={24} style={{ marginRight: '8px', verticalAlign: 'middle', color: 'var(--accent-primary)' }}/> Create New Listing</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Property Title</label>
              <input type="text" className="input-premium" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Neon Oasis Penthouse" required />
            </div>
            
            <div className="form-group">
              <label>Nightly Price ($)</label>
              <input type="number" className="input-premium" value={price} onChange={e => setPrice(Number(e.target.value))} min={1} required />
            </div>

            <div className="form-group full-width">
              <label>Location / City</label>
              <input type="text" className="input-premium" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Neo Tokyo, Japan" required />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea className="input-premium" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the luxury experience..." rows={4} required />
            </div>

            <div className="form-group full-width">
              <label>Primary Image URL</label>
              <input type="url" className="input-premium" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/photo-..." required />
              {imageUrl && <img src={imageUrl} alt="Preview" className="img-preview" onError={(e) => e.target.style.display='none'} onLoad={(e) => e.target.style.display='block'} />}
            </div>

            <div className="form-group full-width">
              <label>Amenities (comma separated)</label>
              <input type="text" className="input-premium" value={amenities} onChange={e => setAmenities(e.target.value)} placeholder="WiFi, Pool, Pet friendly..." required />
            </div>
          </div>
          
          <button type="submit" className={`btn-primary submit-btn ${submitStatus === 'success' ? 'success' : ''}`} disabled={submitStatus !== null}>
            {submitStatus === 'submitting' ? 'Publishing...' : submitStatus === 'success' ? <><Check size={18}/> Published successfully!</> : 'Publish Listing'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default HostDashboard;
