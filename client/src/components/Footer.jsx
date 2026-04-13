import React from 'react';
import { Globe, DollarSign, Facebook, Twitter, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">AirCover</a></li>
              <li><a href="#">Anti-discrimination</a></li>
              <li><a href="#">Disability support</a></li>
              <li><a href="#">Cancellation options</a></li>
              <li><a href="#">Report neighborhood concern</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Hosting</h4>
            <ul>
              <li><a href="#">StayNest your home</a></li>
              <li><a href="#">AirCover for Hosts</a></li>
              <li><a href="#">Hosting resources</a></li>
              <li><a href="#">Community forum</a></li>
              <li><a href="#">Hosting responsibly</a></li>
              <li><a href="#">StayNest-friendly apartments</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>StayNest</h4>
            <ul>
              <li><a href="#">Newsroom</a></li>
              <li><a href="#">New features</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Investors</a></li>
              <li><a href="#">Gift cards</a></li>
              <li><a href="#">StayNest.org emergency stays</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>© 2026 StayNest, Inc.</span>
            <span className="dot">·</span>
            <a href="#">Terms</a>
            <span className="dot">·</span>
            <a href="#">Sitemap</a>
            <span className="dot">·</span>
            <a href="#">Privacy</a>
            <span className="dot">·</span>
            <a href="#">Your Privacy Choices</a>
          </div>
          <div className="footer-bottom-right">
            <div className="footer-settings">
              <button className="settings-btn"><Globe size={18} /> English (US)</button>
              <button className="settings-btn"><DollarSign size={18} /> USD</button>
            </div>
            <div className="footer-social">
              <a href="#"><Facebook size={20} /></a>
              <a href="#"><Twitter size={20} /></a>
              <a href="#"><Instagram size={20} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
