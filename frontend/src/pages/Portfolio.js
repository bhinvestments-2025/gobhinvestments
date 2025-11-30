import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';

const Portfolio = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API}/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo" data-testid="portfolio-nav-logo">BH Investment</Link>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link" data-testid="portfolio-nav-home">Home</Link></li>
            <li><Link to="/portfolio" className="nav-link" data-testid="portfolio-nav-portfolio">Portfolio</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="portfolio-hero" data-testid="portfolio-hero">
        <h1 data-testid="portfolio-hero-title">Our Property Portfolio</h1>
        <p data-testid="portfolio-hero-subtitle">Explore our current collection of investment properties available for purchase</p>
      </section>

      {/* Properties Grid */}
      <section className="portfolio-grid-section" data-testid="portfolio-grid-section">
        {loading ? (
          <div className="loading-container" data-testid="loading-container">
            <div className="loading-spinner" data-testid="loading-spinner"></div>
            <p>Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state" data-testid="empty-state">
            <h3>No properties available</h3>
            <p>Check back soon for new listings</p>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((property) => (
              <div key={property.id} className="property-card" data-testid={`property-card-${property.id}`}>
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="property-image"
                  data-testid={`property-image-${property.id}`}
                />
                <div className="property-content">
                  <h3 className="property-title" data-testid={`property-title-${property.id}`}>{property.title}</h3>
                  <div className="property-address" data-testid={`property-address-${property.id}`}>
                    <span>📍</span>
                    <span>{property.address}</span>
                  </div>
                  <div className="property-price" data-testid={`property-price-${property.id}`}>{property.price}</div>
                  <div className="property-details">
                    <div className="property-detail" data-testid={`property-bedrooms-${property.id}`}>
                      <span>🛏️</span>
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="property-detail" data-testid={`property-bathrooms-${property.id}`}>
                      <span>🚿</span>
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="property-detail" data-testid={`property-sqft-${property.id}`}>
                      <span>📐</span>
                      <span>{property.sqft} sqft</span>
                    </div>
                  </div>
                  <p className="property-description" data-testid={`property-description-${property.id}`}>
                    {property.description}
                  </p>
                  <span className="property-status" data-testid={`property-status-${property.id}`}>{property.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer" data-testid="portfolio-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>BH Investment</h3>
            <p>We buy houses fast for cash. No fees, no commissions, no hassle. Get your fair offer today.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/portfolio">Portfolio</Link>
            </div>
          </div>
          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="footer-links">
              <p>(555) 123-4567</p>
              <p>info@bhinvestment.com</p>
              <p>123 Business Ave, Suite 100</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 BH Investment. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
