import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, CreditCard, ChevronLeft } from 'lucide-react';
import './MyTrips.css';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
    
    const fetchTrips = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return; // Redirect handled below if no token
      }

      try {
        const res = await fetch('/api/bookings/my', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setTrips(data);
        }
      } catch (err) {
        console.error('Failed to fetch trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) return <div className="page-loading">Loading your past and upcoming adventures...</div>;

  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <div className="page-loading">
        <h2>Please log in to view your trips.</h2>
        <button className="btn-primary" style={{marginTop: '16px'}} onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  return (
    <main className="my-trips-page">
      <div className="back-nav" onClick={() => navigate(-1)}>
        <ChevronLeft size={20} /> Back
      </div>
      <h1 className="trips-title">My Trips</h1>
      
      {trips.length === 0 ? (
        <div className="empty-trips">
          <h3>No trips booked... yet!</h3>
          <p>Time to dust off your bags and start planning your next adventure.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Start searching</button>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map(trip => (
            <div className="trip-card" key={trip._id}>
              <div className="trip-img-wrap">
                <img src={(trip.property?.images && trip.property.images[0]) || '/assets/prop1.png'} alt={trip.property?.title || 'Trip'} />
              </div>
              <div className="trip-info">
                <h3>{trip.property?.title || 'Unknown Property'}</h3>
                <div className="trip-meta">
                  {trip.property?.location && <span className="icon-line"><MapPin size={14}/> {trip.property.location}</span>}
                  <span className="icon-line"><Calendar size={14}/> {new Date(trip.checkIn).toLocaleDateString()} to {new Date(trip.checkOut).toLocaleDateString()}</span>
                  <span className="icon-line"><CreditCard size={14}/> ${trip.totalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyTrips;
