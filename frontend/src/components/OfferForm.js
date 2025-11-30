import { useState } from 'react';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';

const OfferForm = ({ onClose, isModal = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    agreedToTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreedToTerms) {
      toast.error('Please agree to the Privacy Policy and Terms and Conditions');
      return;
    }

    setIsSubmitting(true);

    try {
      const message = `Property Address: ${formData.address}`;
      await axios.post(`${API}/contact`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: message
      });
      
      toast.success('Your request has been submitted! We\'ll contact you within 24 hours.');
      setFormData({ name: '', address: '', email: '', phone: '', agreedToTerms: false });
      
      if (onClose) {
        setTimeout(() => onClose(), 1500);
      }
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
      console.error('Error submitting offer form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={isModal ? 'offer-form-modal-content' : 'offer-form-container'} data-testid="offer-form">
      <div className="offer-form-header">
        <h3 className="offer-form-title" data-testid="offer-form-title">Complete form to start the process</h3>
        {isModal && (
          <button className="modal-close" onClick={onClose} data-testid="modal-close-button">✕</button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="offer-form" data-testid="offer-form-element">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleInputChange}
            required
            data-testid="offer-form-name-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Home Location</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter your complete address here"
            value={formData.address}
            onChange={handleInputChange}
            required
            data-testid="offer-form-address-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Your email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            data-testid="offer-form-email-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleInputChange}
            required
            data-testid="offer-form-phone-input"
          />
        </div>

        <div className="form-group-checkbox">
          <label className="checkbox-label" data-testid="offer-form-terms-label">
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleInputChange}
              required
              data-testid="offer-form-terms-checkbox"
            />
            <span>
              I have read and agree to the{' '}
              <a href="#" className="form-link">Privacy Policy</a>
              {' '}and{' '}
              <a href="#" className="form-link">Terms and Conditions</a>.
            </span>
          </label>
        </div>

        <p className="form-disclaimer" data-testid="offer-form-disclaimer">
          By submitting the contact form and signing up for texts, you consent to receive marketing text messages from BH Investments at the number provided. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. You can unsubscribe at any time by replying STOP. Text HELP to get help. Please read our Privacy Policy for more details.
        </p>

        <button 
          type="submit" 
          className="btn-primary btn-full-width" 
          disabled={isSubmitting}
          data-testid="offer-form-submit-button"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default OfferForm;
