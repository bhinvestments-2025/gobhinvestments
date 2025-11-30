import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
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
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`${API}/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" data-testid="property-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="empty-state" data-testid="property-not-found">
        <h3>Property Not Found</h3>
        <p>The property you're looking for doesn't exist.</p>
        <button className="btn-primary" onClick={() => navigate('/portfolio')}>Back to Portfolio</button>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo" data-testid="property-detail-nav-logo">BH Investment</Link>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link" data-testid="property-detail-nav-home">Home</Link></li>
            <li><Link to="/portfolio" className="nav-link" data-testid="property-detail-nav-portfolio">Portfolio</Link></li>
          </ul>
        </div>
      </nav>

      {/* Property Detail */}
      <section className="property-detail-section" data-testid="property-detail-section">
        <div className="property-detail-container">
          <button className="back-button" onClick={() => navigate('/portfolio')} data-testid="back-to-portfolio">
            ← Back to Portfolio
          </button>
          
          <div className="property-detail-grid">
            <div className="property-detail-image-section">
              <img 
                src={property.image} 
                alt={property.title} 
                className="property-detail-image"
                data-testid="property-detail-image"
              />
            </div>
            
            <div className="property-detail-info">
              <span className="property-status" data-testid="property-detail-status">{property.status}</span>
              <h1 className="property-detail-title" data-testid="property-detail-title">{property.title}</h1>
              <div className="property-address" data-testid="property-detail-address">
                <span>📍</span>
                <span>{property.address}</span>
              </div>
              
              <div className="property-detail-price" data-testid="property-detail-price">{property.price}</div>
              
              <div className="property-detail-specs">
                <div className="property-spec" data-testid="property-detail-bedrooms">
                  <div className="spec-icon">🛏️</div>
                  <div>
                    <div className="spec-value">{property.bedrooms}</div>
                    <div className="spec-label">Bedrooms</div>
                  </div>
                </div>
                <div className="property-spec" data-testid="property-detail-bathrooms">
                  <div className="spec-icon">🛁</div>
                  <div>
                    <div className="spec-value">{property.bathrooms}</div>
                    <div className="spec-label">Bathrooms</div>
                  </div>
                </div>
                <div className="property-spec" data-testid="property-detail-sqft">
                  <div className="spec-icon">📐</div>
                  <div>
                    <div className="spec-value">{property.sqft}</div>
                    <div className="spec-label">Square Feet</div>
                  </div>
                </div>
              </div>
              
              <div className="property-detail-description">
                <h3>About This Property</h3>
                <p data-testid="property-detail-description">{property.description}</p>
              </div>
              
              <div className="property-detail-actions">
                <button className="btn-primary" data-testid="property-detail-contact">Contact Us About This Property</button>
                <button className="btn-secondary" onClick={() => navigate('/portfolio')} data-testid="property-detail-view-more">View More Properties</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
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

export default PropertyDetail;
