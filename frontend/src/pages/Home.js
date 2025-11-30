import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      icon: '🏠',
      title: 'Submit Your Property',
      description: 'Fill out our simple form with your property details and we\'ll reach out within 24 hours.'
    },
    {
      icon: '💰',
      title: 'Get a Fair Offer',
      description: 'Receive a competitive cash offer based on current market value and property condition.'
    },
    {
      icon: '📋',
      title: 'Close the Deal',
      description: 'Choose your closing date and we\'ll handle all the paperwork for a hassle-free transaction.'
    }
  ];

  const faqs = [
    {
      question: 'How quickly can you buy my house?',
      answer: 'We can close in as little as 7 days or on your timeline. You choose the closing date that works best for you.'
    },
    {
      question: 'Do I need to make repairs before selling?',
      answer: 'No! We buy houses in any condition. You don\'t need to spend money on repairs, cleaning, or staging.'
    },
    {
      question: 'Are there any fees or commissions?',
      answer: 'No hidden fees or commissions. The offer you receive is the amount you\'ll get at closing.'
    },
    {
      question: 'What types of properties do you buy?',
      answer: 'We buy all types of residential properties including single-family homes, condos, townhouses, and multi-family properties.'
    },
    {
      question: 'How do you determine your offer price?',
      answer: 'Our offers are based on the property\'s location, condition, needed repairs, and current market value in your area.'
    }
  ];

  return (
    <div>
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo" data-testid="nav-logo">BH Investment</Link>
          <ul className="nav-menu">
            <li><span className="nav-link" onClick={() => scrollToSection('home')} data-testid="nav-home">Home</span></li>
            <li><span className="nav-link" onClick={() => scrollToSection('how-it-works')} data-testid="nav-how-it-works">How It Works</span></li>
            <li><span className="nav-link" onClick={() => scrollToSection('faq')} data-testid="nav-faq">FAQ</span></li>
            <li><span className="nav-link" onClick={() => scrollToSection('contact')} data-testid="nav-contact">Contact</span></li>
            <li><Link to="/portfolio" className="nav-link" data-testid="nav-portfolio">Portfolio</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section" data-testid="hero-section">
        <div className="hero-content">
          <h1 className="hero-title" data-testid="hero-title">Sell Your Home Fast, Fair, and Simple</h1>
          <p className="hero-subtitle" data-testid="hero-subtitle">
            We buy houses in any condition. No repairs, no fees, no hassle. Get a fair cash offer in 24 hours.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => scrollToSection('contact')} data-testid="hero-cta-primary">Get Your Offer</button>
            <Link to="/portfolio" className="btn-secondary" data-testid="hero-cta-secondary">View Portfolio</Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section" data-testid="how-it-works-section">
        <div className="section-container">
          <h2 className="section-title" data-testid="how-it-works-title">How It Works</h2>
          <p className="section-subtitle" data-testid="how-it-works-subtitle">
            Selling your home doesn't have to be complicated. Our simple 3-step process makes it easy.
          </p>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card" data-testid={`step-card-${index}`}>
                <div className="step-icon" style={{ position: 'relative' }} data-testid={`step-icon-${index}`}>
                  <span>{step.icon}</span>
                  <div className="step-number" data-testid={`step-number-${index}`}>{index + 1}</div>
                </div>
                <h3 className="step-title" data-testid={`step-title-${index}`}>{step.title}</h3>
                <p className="step-description" data-testid={`step-description-${index}`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section" data-testid="faq-section">
        <div className="section-container">
          <h2 className="section-title" data-testid="faq-title">Frequently Asked Questions</h2>
          <p className="section-subtitle" data-testid="faq-subtitle">
            Got questions? We've got answers. Here are some of the most common questions we receive.
          </p>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                data-testid={`faq-item-${index}`}
              >
                <button 
                  className="faq-question" 
                  onClick={() => toggleFaq(index)}
                  data-testid={`faq-question-${index}`}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon" data-testid={`faq-icon-${index}`}>
                    {activeFaq === index ? '−' : '+'}
                  </span>
                </button>
                <div className="faq-answer" data-testid={`faq-answer-${index}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section" data-testid="contact-section">
        <div className="section-container">
          <h2 className="section-title" data-testid="contact-title">Get In Touch</h2>
          <p className="section-subtitle" data-testid="contact-subtitle">
            Ready to sell your property? Contact us today for a free, no-obligation cash offer.
          </p>
          <div className="contact-container">
            <div className="contact-info">
              <div className="contact-item" data-testid="contact-phone-item">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h4>Phone</h4>
                  <p>(555) 123-4567</p>
                </div>
              </div>
              <div className="contact-item" data-testid="contact-email-item">
                <div className="contact-icon">📧</div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>info@bhinvestment.com</p>
                </div>
              </div>
              <div className="contact-item" data-testid="contact-address-item">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h4>Office</h4>
                  <p>123 Business Ave, Suite 100<br />City, State 12345</p>
                </div>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit} data-testid="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  data-testid="contact-name-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  data-testid="contact-email-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  data-testid="contact-phone-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  data-testid="contact-message-input"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isSubmitting}
                data-testid="contact-submit-button"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" data-testid="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>BH Investment</h3>
            <p>We buy houses fast for cash. No fees, no commissions, no hassle. Get your fair offer today.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <span className="nav-link" onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>Home</span>
              <span className="nav-link" onClick={() => scrollToSection('how-it-works')} style={{ cursor: 'pointer' }}>How It Works</span>
              <Link to="/portfolio">Portfolio</Link>
              <span className="nav-link" onClick={() => scrollToSection('contact')} style={{ cursor: 'pointer' }}>Contact</span>
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

export default Home;
