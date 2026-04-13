import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Check, ChevronLeft } from 'lucide-react';
import './PropertyDetails.css';
import { MOCK_PROPERTIES } from '../utils/mockData';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingStatus, setBookingStatus] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    const fetchProperty = async () => {
      try {
        // If it's a mock property due to development (ID is a number from 1-13)
        // the backend might not find it if it was cleared. We seeded DB though!
        const res = await fetch(`/api/properties/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProperty({
            id: data._id,
            title: data.title,
            description: data.description,
            location: data.location,
            price: data.pricePerNight,
            hostName: data.host?.name || 'StayNest Host',
            images: data.images,
            amenities: data.amenities || []
          });
        } else {
          // Fallback to mock data if not found in backend DB
          const mockProp = MOCK_PROPERTIES.find(p => p.id === Number(id));
          if (mockProp) {
            setProperty({
              id: mockProp.id,
              title: mockProp.title,
              description: 'Exquisite aesthetic space showcasing premier luxury design. A perfect getaway blending comfort with an unforgettable atmospheric experience.',
              location: mockProp.location,
              price: mockProp.price,
              hostName: 'StayNest Host',
              images: [mockProp.imageUrl, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
              amenities: ['Ultra-fast Wifi', 'Private Pool', 'Chef Kitchen', 'Dedicated Workspace', 'Free Parking']
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch property details:", err);
        const mockProp = MOCK_PROPERTIES.find(p => p.id === Number(id));
        if (mockProp) {
          setProperty({
            id: mockProp.id,
            title: mockProp.title,
            description: 'Exquisite aesthetic space showcasing premier luxury design. A perfect getaway blending comfort with an unforgettable atmospheric experience.',
            location: mockProp.location,
            price: mockProp.price,
            hostName: 'StayNest Host',
            images: [mockProp.imageUrl, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
            amenities: ['Ultra-fast Wifi', 'Private Pool', 'Chef Kitchen', 'Dedicated Workspace', 'Free Parking']
          });
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/property/${id}`);
        if(res.ok) setReviews(await res.json());
      } catch(e) { console.error("Reviews error", e); }
    };

    fetchProperty();
    fetchReviews();
  }, [id]);

  const handleBookNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to book a stay!");
      return;
    }

    if (!checkIn || !checkOut) {
      alert("Please select your dates.");
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    const totalPrice = (nights * property.price) + 120; // + $120 cleaning/service fee

    try {
      setBookingStatus('processing');
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          property: property.id,
          checkIn,
          checkOut,
          totalPrice
        })
      });

      if (res.ok) {
        setBookingStatus('success');
        setTimeout(() => {
          navigate('/trips');
        }, 2000);
      } else {
         const d = await res.json();
         alert(d.message || "Booking failed");
         setBookingStatus(null);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while booking.");
      setBookingStatus(null);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in to leave a review.');
    
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ propertyId: id, rating: newRating, comment: newComment })
      });
      
      if (res.ok) {
        const revsRes = await fetch(`/api/reviews/property/${id}`);
        if(revsRes.ok) setReviews(await revsRes.json());
        setNewComment('');
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to submit review');
      }
    } catch(err) {
      console.error(err);
      alert('Error submitting review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-loading">Loading luxury stay...</div>;
  }

  if (!property) {
    return (
      <div className="page-loading">
        <h2>Property not found</h2>
        <button className="btn-secondary" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  return (
    <main className="property-details-page">
      <div className="back-nav" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} /> Back to explore
      </div>
      
      <div className="pd-header">
        <h1 className="pd-title">{property.title}</h1>
        <div className="pd-meta">
          <div className="pd-rating"><Star size={16} fill="var(--accent-primary)" color="var(--accent-primary)"/> 4.98 · 124 reviews</div>
          <div className="pd-location"><MapPin size={16}/> {property.location}</div>
        </div>
      </div>

      <div className="pd-gallery">
        <img src={property.images[0] || '/assets/prop1.png'} alt={property.title} className="pd-main-img" />
      </div>

      <div className="pd-content">
        <div className="pd-info">
          <h2>Entire premium stay hosted by {property.hostName}</h2>
          <div className="pd-sub">12 guests · 5 bedrooms · 6 beds · 4.5 baths</div>
          
          <hr className="pd-divider" />
          
          <div className="pd-description">
            <h3>About this space</h3>
            <p>{property.description}</p>
          </div>

          <hr className="pd-divider" />

          <div className="pd-amenities">
            <h3>What this place offers</h3>
            <div className="amenities-grid">
              {property.amenities.map(item => (
                <div className="amenity-item" key={item}>
                  <Check size={18} /> {item}
                </div>
              ))}
            </div>
          </div>

          <hr className="pd-divider" />
          
          <div className="pd-reviews">
            <h3>Reviews</h3>
            
            {localStorage.getItem('token') && (
               <form className="review-form" onSubmit={handleReviewSubmit}>
                 <h4>Leave a Review</h4>
                 <div className="rating-select">
                   <label>Rating:</label>
                   <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                     <option value={5}>5 Stars - Excellent</option>
                     <option value={4}>4 Stars - Good</option>
                     <option value={3}>3 Stars - Average</option>
                     <option value={2}>2 Stars - Poor</option>
                     <option value={1}>1 Star - Terrible</option>
                   </select>
                 </div>
                 <textarea 
                   placeholder="Share your experience..." 
                   value={newComment} 
                   onChange={(e) => setNewComment(e.target.value)} 
                   required
                 />
                 <button type="submit" className="btn-secondary" disabled={reviewSubmitting}>
                   {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                 </button>
               </form>
            )}

            {reviews.length === 0 ? (
               <p style={{color: 'var(--text-secondary)'}}>No reviews yet. Be the first to review!</p>
            ) : (
               <div className="reviews-list">
                 {reviews.map(rev => (
                   <div key={rev._id} className="review-item border-bottom">
                     <div className="review-header">
                       <strong>{rev.user?.name || 'Guest'}</strong>
                       <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                     </div>
                     <div className="review-rating">
                       {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="var(--accent-primary)" color="var(--accent-primary)" />)}
                     </div>
                     <p>{rev.comment}</p>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>

        <div className="pd-sidebar">
          <div className="booking-widget glass-panel">
            <div className="bw-header">
              <span className="bw-price">${property.price}</span>
              <span className="bw-night">/ night</span>
            </div>

            <div className="bw-inputs">
              <div className="bw-dates">
                <div className="bw-input-group border-right" onClick={() => { const el = document.getElementById('checkInInput'); if (el && el.showPicker) el.showPicker(); }}>
                  <label htmlFor="checkInInput">CHECK-IN</label>
                  <input id="checkInInput" type="date" value={checkIn} min={new Date().toISOString().split('T')[0]} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div className="bw-input-group" onClick={() => { const el = document.getElementById('checkOutInput'); if (el && el.showPicker) el.showPicker(); }}>
                  <label htmlFor="checkOutInput">CHECKOUT</label>
                  <input id="checkOutInput" type="date" value={checkOut} min={checkIn || new Date().toISOString().split('T')[0]} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
              </div>
              <div className="bw-input-group bw-guests border-top">
                <label>GUESTS</label>
                <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                  <option value={1}>1 guest</option>
                  <option value={2}>2 guests</option>
                  <option value={3}>3 guests</option>
                  <option value={4}>4 guests</option>
                  <option value={5}>5+ guests</option>
                </select>
              </div>
            </div>

            <button 
              className={`btn-primary bw-submit ${bookingStatus === 'success' ? 'success' : ''}`}
              onClick={handleBookNow}
              disabled={bookingStatus === 'processing' || bookingStatus === 'success'}
            >
              {bookingStatus === 'processing' ? 'Processing...' : bookingStatus === 'success' ? 'Booked! Redirecting...' : 'Reserve'}
            </button>
            <p className="bw-note">You won't be charged yet</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetails;
