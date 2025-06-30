import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Heart, Sparkles, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
}

interface ApiResponse {
  success: boolean;
  data?: MediaItem[];
  message?: string;
}

const Hero = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch media items from API
  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/api/landingpage-images`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.success && data.data) {
          setMediaItems(data.data);
        } else {
          throw new Error(data.message || 'Failed to load media items');
        }
      } catch (err) {
        console.error('Failed to fetch media:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        // Fallback images if API fails
        setMediaItems([
          {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
          },
          {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaItems();
  }, []);

  // Auto-rotate media items
  useEffect(() => {
    if (mediaItems.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    }, 4000);
    
    return () => clearInterval(interval);
  }, [mediaItems]);

  // Show welcome dialog after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcomeDialog(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const closeWelcomeDialog = () => setShowWelcomeDialog(false);

  if (loading) {
    return (
      <div className="relative h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading hero content...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Media Carousel */}
      <div className="absolute inset-0">
        {mediaItems.map((item, index) => (
          <div
            key={`${item.src}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {item.type === 'image' ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${item.src})` }}
              />
            ) : (
              <video
                className="w-full h-full object-cover"
                src={item.src}
                autoPlay
                muted
                loop
                playsInline
              />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-purple-600/70"></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10 mt-16">
        <div className="max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-4 py-1 px-3 bg-yellow-400/90 text-black text-sm rounded-full"
          >
            Experience Magical Celebrations
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6"
          >
            Your Private Theatre
            <span className="block mt-2">For Unforgettable Moments</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
          >
            Create magical celebrations in our exclusive private theatre. Perfect for birthday parties,
            bride-to-be celebrations, anniversaries, and all your special moments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => navigate('/events')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Explore Our Events
            </button>
            <button
              onClick={() => navigate('/book-now')}
              className="bg-yellow-400/90 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Book Your Celebration
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Welcome Dialog */}
      <AnimatePresence>
        {showWelcomeDialog && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeWelcomeDialog}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-sm">
                <div className="bg-gradient-to-r from-purple-600 to-yellow-400 p-4 text-center relative">
                  <button
                    onClick={closeWelcomeDialog}
                    className="absolute top-2 right-2 text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">Welcome Back! ✨</h2>
                  <p className="text-white/90 text-sm">Ready for more celebrations?</p>
                </div>
                <div className="p-4">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">New Events Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-700">Special Offers</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        closeWelcomeDialog();
                        navigate('/events');
                      }}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 text-sm"
                    >
                      Explore Events
                    </button>
                    <button
                      onClick={() => {
                        closeWelcomeDialog();
                        navigate('/book-now');
                      }}
                      className="w-full bg-yellow-400 text-black py-2 px-4 rounded-lg font-medium hover:bg-yellow-500 text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Error Message (if any) */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-30 max-w-xs"
        >
          <p className="text-sm">{error}</p>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;