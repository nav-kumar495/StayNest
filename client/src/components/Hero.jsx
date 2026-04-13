import React from 'react';
import SearchBar from './SearchBar';
import './Hero.css';

const Hero = ({ onSearch }) => {
  return (
    <section className="hero-section">
      {/* Background Image with Ken Burns Effect */}
      <div className="video-background-container">
        <div className="video-overlay"></div>
        <img 
          src="/assets/hero_bg_clear.png" 
          alt="Luxury Aesthetic House"
          className="background-image-animated"
        />
      </div>

      <div className="hero-content" style={{ zIndex: 100 }}>
        <h1 className="hero-title">
          Find your next <br/>
          <span className="text-gradient">Premium Stay</span>
        </h1>
        <p className="hero-subtitle">
          Experience extraordinary architectural homes with unparalleled aesthetics and comfort. Elevate your journey.
        </p>
        
        {/* NEW ADVANCED SEARCH BAR */}
        <SearchBar onSearch={onSearch} />
      </div>
    </section>
  );
};

export default Hero;
