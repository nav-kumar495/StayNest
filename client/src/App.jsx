import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Compass, User, LogIn } from 'lucide-react';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import AuthModal from './components/AuthModal';
import PropertyDetails from './pages/PropertyDetails';
import MyTrips from './pages/MyTrips';
import Wishlist from './pages/Wishlist';
import HostDashboard from './pages/HostDashboard';
import Services from './pages/Services';
import Footer from './components/Footer';
import './index.css';
import { MOCK_PROPERTIES } from './utils/mockData';

// Placeholder Components
const NavLink = ({ to, icon, text }) => (
  <Link to={to} className="nav-link">
    {icon}
    <span>{text}</span>
  </Link>
);

const Navbar = ({ user, onLoginClick, onLogout }) => {
  const [activeTab, setActiveTab] = useState('homes');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar glass-panel">
      <div className="nav-logo">
        <Link to="/" style={{textDecoration:'none', display:'flex', alignItems:'center', gap:'8px'}}>
          <img src="/assets/staynest-logo.png" alt="StayNest" className="logo-image" />
          <span className="logo-text" style={{color: 'var(--text-primary)'}}>StayNest</span>
        </Link>
      </div>
      
      <div className="nav-center-tabs">
        <Link to="/" 
          className={`nav-tab ${activeTab === 'homes' ? 'active' : ''}`}
          onClick={() => setActiveTab('homes')}
          style={{textDecoration: 'none'}}
        >
          <span className="tab-text">Stays</span>
        </Link>
        <Link to="/explore" 
          className={`nav-tab ${activeTab === 'experiences' ? 'active' : ''}`}
          onClick={() => setActiveTab('experiences')}
          style={{textDecoration: 'none'}}
        >
          <span className="tab-text">Experiences</span>
        </Link>
        <Link to="/services" 
          className={`nav-tab ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
          style={{textDecoration: 'none'}}
        >
          <span className="tab-text">Services</span>
        </Link>
      </div>

      <div className="nav-right">
        {!user?.isHost && (
           <div className="nav-host-link" onClick={onLoginClick}>StayNest your home</div>
        )}
        
        <div className="profile-menu-container">
          <button className="profile-button glass-panel" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="hamburger-icon">☰</div>
            <div className="user-avatar">
               <User size={18} color="var(--text-primary)" />
            </div>
          </button>

          {isMenuOpen && (
            <div className="profile-dropdown glass-panel">
              {user ? (
                <>
                  <div className="dropdown-header">
                    <strong>Hi, {user.name.split(' ')[0]}</strong>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link to="/trips" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>My Trips</Link>
                  <Link to="/wishlist" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Wishlists</Link>
                  {user.isHost && (
                    <Link to="/host" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Host Dashboard</Link>
                  )}
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => { onLogout(); setIsMenuOpen(false); }}>Log Out</button>
                </>
              ) : (
                <>
                  <button className="dropdown-item bold" onClick={() => { onLoginClick(); setIsMenuOpen(false); }}>Sign up</button>
                  <button className="dropdown-item" onClick={() => { onLoginClick(); setIsMenuOpen(false); }}>Log in</button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item" onClick={() => { onLoginClick(); setIsMenuOpen(false); }}>StayNest your home</button>
                  <button className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Help Center</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};




const HomePage = ({ properties }) => {
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  const handleSearch = (searchData) => {
    // searchData has { location, dates, guests } from the new SearchBar widget
    const location = searchData.location || '';
    const searchTerms = location.toLowerCase().trim();
    
    const filtered = properties.filter(prop => {
      const matchesLocation = searchTerms === '' || 
        (prop.title && prop.title.toLowerCase().includes(searchTerms)) || 
        (prop.location && prop.location.toLowerCase().includes(searchTerms));
      return matchesLocation;
    });
    setFilteredProperties(filtered);
    setHasSearched(true);
  };

  return (
    <main className="page-content">
      <Hero onSearch={handleSearch} />
      <section className="featured-section">
        <div className="section-header">
          <h2>{hasSearched ? "Search Results" : "Premium Destinations"}</h2>
          <p>{hasSearched ? `Found ${filteredProperties.length} stays for your trip.` : "Discover extraordinary homes with modern aesthetics."}</p>
        </div>
        <div className="properties-grid">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(prop => (
              <PropertyCard key={prop.id} {...prop} />
            ))
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-secondary)' }}>
              <h3>No properties found.</h3>
              <p>Try searching for a different location like "Tokyo", "California", or "Alps".</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  useEffect(() => {
    // Check local storage for persistent auth
    const token = localStorage.getItem('token');
    if(token) {
      // Fetch authenticated user info
      fetch('/api/users/me', { headers: { 'Authorization': `Bearer ${token}` }})
        .then(res => res.json())
        .then(data => {
            if (data.name) {
              setUser(data);
              const favIds = (data.favorites || []).map(f => f._id || f);
              localStorage.setItem('favorites', JSON.stringify(favIds));
            }
        })
        .catch(err => console.error(err));
    }

    // Fetch properties from backend
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        if(res.ok) {
           const data = await res.json();
           const formattedDbProps = data.map(p => ({
             id: p._id,
             title: p.title,
             location: p.location,
             price: p.pricePerNight,
             rating: 4.8, // fallback schema rating
             imageUrl: (p.images && p.images.length > 0) ? p.images[0] : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
           }));
           // Fallback to MOCK_PROPERTIES if DB is empty to keep UI populated during development
           setProperties(formattedDbProps.length > 0 ? formattedDbProps : MOCK_PROPERTIES);
        } else {
           setProperties(MOCK_PROPERTIES);
        }
      } catch (err) {
        console.error("Failed to fetch properties from backend:", err);
        setProperties(MOCK_PROPERTIES); // Fallback on network error
      } finally {
        setLoadingProps(false);
      }
    };
    fetchProperties();
  }, []);

  const handleLoginSuccess = (userData, authToken) => {
    setUser(userData);
    const favIds = (userData.favorites || []).map(f => f._id || f);
    localStorage.setItem('favorites', JSON.stringify(favIds));
    localStorage.setItem('token', authToken);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to home so trips unmount
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} onLoginClick={() => setIsAuthModalOpen(true)} onLogout={handleLogout} />
        
        {loadingProps ? (
          <div style={{minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'}}>
            Loading premium stays...
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage properties={properties} />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/trips" element={<MyTrips />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/host" element={<HostDashboard user={user} />} />
            <Route path="/services" element={<Services />} />
            <Route path="/explore" element={<div className="page-content" style={{marginTop: '120px', textAlign: 'center'}}>Explore Page Coming Soon</div>} />
          </Routes>
        )}

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;
