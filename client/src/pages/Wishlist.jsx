import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { ChevronLeft } from 'lucide-react';
import API_BASE from '../config';

const Wishlist = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchFavs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const formatted = data.favorites.map(p => ({
            id: p._id,
            title: p.title,
            location: p.location,
            price: p.pricePerNight,
            rating: 4.8,
            imageUrl: (p.images && p.images.length > 0) ? p.images[0] : '/assets/prop1.png'
          }));
          setFavorites(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, []);

  const handleToggle = (id, isFav) => {
    if (!isFav) {
      setFavorites(current => current.filter(f => f.id !== id));
    }
  };

  if (loading) return <div className="page-loading">Loading saved stays...</div>;

  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <div className="page-loading">
        <h2>Please log in to view your wishlist.</h2>
        <button className="btn-primary" style={{marginTop: '16px'}} onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  return (
    <main className="page-content" style={{padding: '120px 5% 60px', maxWidth: '1300px', margin: '0 auto', minHeight: '80vh'}}>
      <div className="back-nav" onClick={() => navigate(-1)} style={{display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '24px'}}>
        <ChevronLeft size={20} /> Back
      </div>
      <h1 style={{fontSize: '32px', marginBottom: '32px'}}>Your Wishlist</h1>
      
      {favorites.length === 0 ? (
        <div style={{padding: '60px', textAlign: 'center', background: 'var(--surface-bg)', borderRadius: '16px', border: '1px solid var(--surface-border)'}}>
          <h3 style={{fontSize: '24px', marginBottom: '8px'}}>No saves yet</h3>
          <p style={{color: 'var(--text-secondary)', marginBottom: '24px'}}>As you search, click the heart icon to save your favorite luxury stays.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Start exploring</button>
        </div>
      ) : (
        <div className="properties-grid">
          {favorites.map(prop => (
            <PropertyCard key={prop.id} {...prop} isFavoriteInit={true} onFavoriteToggle={handleToggle} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Wishlist;
