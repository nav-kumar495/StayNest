import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import './PropertyCard.css';

const PropertyCard = ({ id, title, location, price, rating, imageUrl, isFavoriteInit, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInit || false);

  useEffect(() => {
    // Determine initial state from localStorage if not passed
    if (isFavoriteInit === undefined) {
      const savedFavsStr = localStorage.getItem('favorites');
      if (savedFavsStr) {
        try {
          const savedFavs = JSON.parse(savedFavsStr);
          if (savedFavs.includes(id)) {
            setIsFavorite(true);
          }
        } catch (e) {}
      }
    }
  }, [id, isFavoriteInit]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevents routing to PropertyDetails
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to save to your wishlist.");
      return;
    }

    try {
      const res = await fetch(`/api/users/favorites/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
        // Update local storage array
        const savedFavsStr = localStorage.getItem('favorites');
        let savedFavs = [];
        if (savedFavsStr) savedFavs = JSON.parse(savedFavsStr);
        if (!isFavorite) savedFavs.push(id);
        else savedFavs = savedFavs.filter(favId => favId !== id);
        localStorage.setItem('favorites', JSON.stringify(savedFavs));
        
        if (onFavoriteToggle) onFavoriteToggle(id, !isFavorite);
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
    }
  };

  return (
    <Link to={`/property/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="property-card">
        <div className="property-image-container">
          <img src={imageUrl} alt={title} className="property-video" />
          <div className="property-badge">Premium</div>
          
          <button className="favorite-btn" onClick={handleFavoriteClick}>
            <Heart size={24} fill={isFavorite ? "var(--accent-primary)" : "rgba(0,0,0,0.5)"} color="white" />
          </button>
        </div>
        
        <div className="property-details">
          <div className="property-header">
            <h3 className="property-title">{title}</h3>
            <div className="property-rating">
              <Star size={14} fill="var(--accent-primary)" color="var(--accent-primary)" />
              <span>{rating}</span>
            </div>
          </div>
          
          <div className="property-location">
            <MapPin size={14} />
            <span>{location}</span>
          </div>
          
          <div className="property-footer">
            <div className="property-price">
              <span className="price-amount">${price}</span>
              <span className="price-period">/ night</span>
            </div>
            <div className="card-cta">Details</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
