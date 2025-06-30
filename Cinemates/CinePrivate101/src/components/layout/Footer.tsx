import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {  Facebook, Instagram, Twitter, Mail, Phone} from 'lucide-react';
import { API_URL } from '../../config';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    if (!review.trim()) {
      alert('Please enter your review.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, review, rating }),
      });

      if (response.ok) {
        setStatus('success');
        setName('');
        setReview('');
        setRating(0);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-black text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & About */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="cinemates.svg" className="w-20" />
            </Link>
            <p className="text-white/80 mb-4">
              Create unforgettable moments in our private theatre. Perfect for birthdays, 
              bridal parties, anniversaries, and all your special celebrations.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook size={18} />
              </a>
              <a href=" https://www.instagram.com/cinemates_partytheaters/" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-xl mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="inline-block text-white/80 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="inline-block text-white/80 hover:text-white transition-colors">Our Events</Link>
              </li>
              <li>
                <Link to="/gallery" className="inline-block text-white/80 hover:text-white transition-colors">Gallery</Link>
              </li>
              <li>
                <Link to="/contact" className="inline-block text-white/80 hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Celebration Events */}
          <div>
            <h3 className="font-display text-xl mb-6">Celebrations</h3>
            <ul className="space-y-3">
              <li><Link to="/events" className="inline-block text-white/80 hover:text-white transition-colors">Birthday Parties</Link></li>
              <li><Link to="/events" className="inline-block text-white/80 hover:text-white transition-colors">Bride-to-Be Celebrations</Link></li>
              <li><Link to="/events" className="inline-block text-white/80 hover:text-white transition-colors">Anniversary Events</Link></li>
              <li><Link to="/events" className="inline-block text-white/80 hover:text-white transition-colors">Corporate Gatherings</Link></li>
              <li><Link to="/events" className="inline-block text-white/80 hover:text-white transition-colors">Special Occasions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-xl mb-6">Contact Us</h3>
            <ul className="space-y-4">
              {/* <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 text-accent" />
                <span className="text-white/80">
                  123 Celebration Avenue, Entertainment District, CA 90210
                </span>
              </li> */}
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="text-white/80">+91 8121031017</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-white/80">enquiry@cinemates.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Review Submission */}
        <div className="mt-16 max-w-md mx-auto p-4 bg-gray-900 rounded ml-0">
          <h3 className="font-display text-xl mb-4">Leave a Review</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="px-4 py-2 rounded bg-white text-black placeholder-gray-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              placeholder="Add your review..."
              className="px-4 py-2 rounded bg-white text-black placeholder-gray-500 focus:outline-none resize-none"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              required
            />

            {/* Star Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={star <= rating}
                  onClick={() => setRating(star)}
                />
              ))}
              <span className="ml-2 text-sm">{rating} star{rating !== 1 ? 's' : ''}</span>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-2 bg-accent text-black rounded hover:bg-opacity-80 transition"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          {status === 'success' && (
            <p className="mt-2 text-green-400">Thanks for your review!</p>
          )}
          {status === 'error' && (
            <p className="mt-2 text-red-400">You can write up to 150 characters.</p>
          )}
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-white/70 text-sm">
              &copy; {currentYear} Cinemates Private Theatre. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0">
              <ul className="flex space-x-6 text-sm text-white/70">
               
                 <li><Link to="/refundpolicy" className="inline-block text-white/80 hover:text-white transition-colors">Privacy Policy</Link></li>
                
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

function Star({ filled, onClick }: { filled: boolean; onClick: () => void }) {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      className={`w-6 h-6 cursor-pointer ${
        filled ? 'text-yellow-400' : 'text-white/40'
      } hover:text-yellow-500 transition-colors`}
      fill={filled ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.286 7.034a1 1 0 00.95.69h7.39c.969 0 1.371 1.24.588 1.81l-5.982 4.34a1 1 0 00-.364 1.118l2.286 7.033c.3.92-.755 1.688-1.54 1.117l-5.982-4.34a1 1 0 00-1.176 0l-5.982 4.34c-.784.57-1.838-.197-1.539-1.118l2.285-7.034a1 1 0 00-.364-1.118L2.036 12.46c-.783-.57-.38-1.81.588-1.81h7.39a1 1 0 00.95-.69l2.285-7.034z"
      />
    </svg>
  );
}

export default Footer;
