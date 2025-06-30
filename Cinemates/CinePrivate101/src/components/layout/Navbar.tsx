import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavLink {
  name: string;
  path: string;
}

const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'MyBookings', path: '/mybookings' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Refund Policy', path: '/refundpolicy' },
  { name: 'Contact', path: '/contact' },
  { name: 'Add-Ons', path: '/addons' },
  { name: 'Menu', path: '/menu' }, // Added new Menu page
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navbarClass = scrolled
    ? 'py-3 bg-purple-800 shadow-md'
    : 'py-6 bg-transparent';

  const textColor = scrolled || isOpen || location.pathname !== '/' 
    ? 'text-white' 
    : 'text-white';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navbarClass}`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className={`flex items-center space-x-2 ${textColor}`}
          >
            <img 
              src='/cinemates.svg'
              alt="Theatre Logo" 
              className="w-50 h-12" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`navigation-link ${textColor} ${
                  location.pathname === link.path ? 'after:w-full' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/book-now" 
              className="btn bg-accent"
            >
              Book Now
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden z-50 ${isOpen ? 'text-white' : textColor}`}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-80 bg-primary z-40 flex flex-col"
          >
            <div className="flex flex-col items-center justify-center h-full">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white text-2xl font-display py-4 hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/book-now" 
                className="mt-8 btn bg-accent text-primary hover:bg-gray-100"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;