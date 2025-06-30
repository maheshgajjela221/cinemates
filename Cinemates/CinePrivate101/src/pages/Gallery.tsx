import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

interface GalleryImage {
  id: number;
  theater_id: string;
  location_name: string;
  theater_name: string;
  url: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
}

interface ApiResponse {
  success: boolean;
  data: GalleryImage[];
  count: number;
  message?: string;
}

interface LocationsResponse {
  success: boolean;
  data: string[];
  message?: string;
}

interface GalleryProps {
  locationName?: string | null;
}

const Gallery: React.FC<GalleryProps> = ({ locationName = null }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string | null>(locationName);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedInfo, setExpandedInfo] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch available locations
  useEffect(() => {
    const fetchLocations = async (): Promise<void> => {
      try {
        const response = await fetch(`${API_URL}/api/locations-images`);
        const data: LocationsResponse = await response.json();
        
        if (data.success) {
          setAvailableLocations(data.data);
          if (!currentLocation && data.data.length > 0) {
            setCurrentLocation(data.data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };

    fetchLocations();
  }, [currentLocation]);

  // Fetch gallery images based on location
  useEffect(() => {
    const fetchGalleryImages = async (): Promise<void> => {
      if (!currentLocation) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/api/gallery/${encodeURIComponent(currentLocation)}`);
        const data: ApiResponse = await response.json();
        
        if (data.success) {
          setGalleryImages(data.data);
        } else {
          setError(data.message || 'Failed to fetch gallery images');
          setGalleryImages([]);
        }
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery images');
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, [currentLocation]);

  const handleScheduleClick = () => {
  navigate('/contact');
};
  
  const openLightbox = (imageData: GalleryImage): void => {
    setSelectedImage(imageData);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = (): void => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setCurrentLocation(event.target.value);
  };

  const handleRetry = (): void => {
    window.location.reload();
  };

  const toggleExpandInfo = (id: number): void => {
    setExpandedInfo(expandedInfo === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery images...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header section */}
      <section className="relative py-32 bg-primary">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3298041/pexels-photo-3298041.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-20"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our Event Gallery
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-6">
            Browse through images of our private theatres and previous celebrations
          </p>
          {currentLocation && (
            <div className="flex items-center justify-center text-white/90">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">{currentLocation}</span>
            </div>
          )}
        </div>
      </section>

      {/* Gallery section */}
      <section className="section">
        <div className="container-custom">
          <SectionTitle 
            title="Memories Captured"
            subtitle={`Explore the beautiful moments from celebrations at our ${currentLocation || ''} location`}
            center
          />
          
          {/* Location selector (if not specified as prop) */}
          {!locationName && availableLocations.length > 1 && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-medium">Location:</span>
                <select
                  value={currentLocation || ''}
                  onChange={handleLocationChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {availableLocations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={handleRetry}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* No images message */}
          {!error && galleryImages.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Images Found</h3>
              <p className="text-gray-600">
                No gallery images available for {currentLocation}
              </p>
            </div>
          )}
          
          {/* Gallery grid */}
          {galleryImages.length > 0 && (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {galleryImages.map(image => (
                <motion.div
                  key={`${image.theater_id}-${image.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer h-80 flex flex-col"
                >
                  {/* Image container */}
                  <div 
                    className="relative flex-1 overflow-hidden"
                    onClick={() => openLightbox(image)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Info panel - always visible */}
                  <div className="bg-white p-4 border-t border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{image.theater_name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-1">{image.title}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpandInfo(image.id);
                        }}
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        {expandedInfo === image.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    {/* Expanded details */}
                    <AnimatePresence>
                      {expandedInfo === image.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 space-y-1">
                            {image.subtitle && (
                              <p className="text-xs text-gray-500">{image.subtitle}</p>
                            )}
                            {image.description && (
                              <p className="text-xs text-gray-500">{image.description}</p>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openLightbox(image);
                              }}
                              className="mt-2 text-xs font-medium text-primary hover:underline"
                            >
                              View Full Image
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-6 right-6 text-white p-2 z-10 hover:bg-white/20 rounded-full transition-colors"
            onClick={closeLightbox}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="relative max-w-5xl w-full max-h-[90vh]" 
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-6">
              <h3 className="text-white text-xl font-semibold mb-2">{selectedImage.theater_name}</h3>
              <p className="text-white/90 font-medium mb-1">{selectedImage.title}</p>
              {selectedImage.subtitle && (
                <p className="text-white/80 text-sm mb-1">{selectedImage.subtitle}</p>
              )}
              {selectedImage.description && (
                <p className="text-white/70 text-sm">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Photo shoot CTA */}
      <section className="section bg-primary/5">
        <div className="container-custom">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Want to See More?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Contact us to schedule a tour of our private theatre venue and see firsthand 
              how we can transform it for your special celebration.
            </p>
           <button className="btn-primary" onClick={handleScheduleClick}>
  Schedule a Visit
</button>

          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Gallery;