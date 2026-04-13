import React, { useEffect } from 'react';
import { ChefHat, CarFront, Sparkles, Anchor, Plane, ShieldCheck } from 'lucide-react';
import './Services.css';

const servicesList = [
  { id: 1, title: 'Private Chef', icon: ChefHat, desc: 'Bespoke culinary experiences crafted in your own kitchen by Michelin-starred professionals.', img: '/assets/private_chef.png' },
  { id: 2, title: 'Chauffeur & Transfer', icon: CarFront, desc: 'Premium airport transfers and on-call luxury fleet for seamless city exploration.', img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80' },
  { id: 3, title: 'Spa & Wellness', icon: Sparkles, desc: 'In-villa massages, yoga instructors, and wellness retreats designed exclusively for you.', img: '/assets/spa_wellness.png' },
  { id: 4, title: 'Yacht Charter', icon: Anchor, desc: 'Explore the coastline in absolute privacy aboard our curated fleet of luxury yachts.', img: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80' }
];

const Services = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="services-page">
      <div className="services-hero">
        <h1 className="gradient-text">Elevate Your Stay</h1>
        <p>Curated lifestyle services and elite experiences accessible directly through StayNest.</p>
        <div className="trust-badges">
          <span><ShieldCheck size={16} /> Vetted Professionals</span>
          <span><Sparkles size={16} /> 24/7 Concierge</span>
          <span><Plane size={16} /> Global Reach</span>
        </div>
      </div>
      
      <div className="services-grid">
        {servicesList.map(srv => {
          const Icon = srv.icon;
          return (
            <div className="service-card" key={srv.id}>
              <div className="service-img-wrapper">
                <img src={srv.img} alt={srv.title} className="service-hero-img" />
                <div className="service-icon-badge glass-panel">
                  <Icon size={24} color="var(--accent-primary)" />
                </div>
              </div>
              <div className="service-info glass-panel">
                <h3>{srv.title}</h3>
                <p>{srv.desc}</p>
                <button className="btn-secondary service-btn">Request Service</button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Services;
