import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookingSummary from './summaryCrad';
import { API_URL } from '../config';

type Location = {
  loc_id: string;
  location_name: string;
  loc_latitude: string;
  loc_longitude: string;
  location_overview?: string;
  google_reviews?: string;
  parking_available: string;
  new_flag: string;
  loc_img_url?: string;
};

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'grid'>('list');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/locations`)
      .then((res) => {
        setLocations(res.data);
      })
      .catch((err) => console.error('Error loading locations:', err));
  }, []);

  const handleLocationClick = (locId: string) => {
    const location = locations.find((loc) => loc.loc_id === locId);
    if (location) {
      setSelectedLocation(location);
      sessionStorage.setItem('selected_loc_id', locId);
      sessionStorage.setItem('location_name', location.location_name);
    }
  };

  const handleProceed = (locId: string) => {
    const location = locations.find((loc) => loc.loc_id === locId);
    if (location) {
      setSelectedLocation(location);
      sessionStorage.setItem('selected_loc_id', locId);
      sessionStorage.setItem('location_name', location.location_name);
      navigate('/theaters');
    }
  };

  return (
    <div className="font-sans bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/42/b9/d4/42b9d4744b35452e20dfd1374b9ec0a9.jpg')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-wide animate-fade-in">
            Explore Epic Venues
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto animate-slide-up">
            Scroll through our stunning locations to find the perfect setting for your event.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Navigation and View Toggle */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => navigate('/book-now')}
              className="flex items-center text-purple-700 hover:text-purple-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Booking
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView('list')}
                className={`p-2 rounded ${
                  activeView === 'list' ? 'bg-indigo-600' : 'bg-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              <button
                onClick={() => setActiveView('grid')}
                className={`p-2 rounded ${
                  activeView === 'grid' ? 'bg-indigo-600' : 'bg-gray-700'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
            </div>
          </div>

          {/* Content Layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Locations Display */}
            <div className="w-full lg:w-2/3">
              {activeView === 'list' ? (
                <div className="space-y-4">
                  {locations.map((loc) => (
                    <div 
                      key={loc.loc_id}
                      className={`bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all cursor-pointer ${
                        selectedLocation?.loc_id === loc.loc_id ? 'ring-2 ring-indigo-500' : ''
                      }`} 
                      onClick={() => handleLocationClick(loc.loc_id)}
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Location Image */}
                        <div className="w-full sm:w-1/3 h-48 sm:h-auto">
                          {loc.loc_img_url ? (
                            <img
                              src={loc.loc_img_url}
                              alt={loc.location_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                              <span className="text-gray-400 text-sm">No Image</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Location Details - Reduced spacing */}
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="mb-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xl font-semibold text-white">
                                {loc.location_name}
                                {loc.new_flag === 'Y' && (
                                  <span className="ml-2 inline-block bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                                    New
                                  </span>
                                )}
                              </h3>
                              <a
                                href={`https://www.google.com/maps?q=${loc.loc_latitude},${loc.loc_longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-white hover:text-indigo-300 p-1"
                              >
                                <MapPin className="w-5 h-5" />
                              </a>
                            </div>
                            
                            {loc.location_overview && (
                              <p className="text-gray-300 mt-1 line-clamp-2">{loc.location_overview}</p>
                            )}
                          </div>
                          
                          {/* Reduced gap here */}
                          <div className="mt-1 flex justify-between items-center">
                            <div className="flex gap-4 text-sm">
                              {loc.google_reviews && (
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                  <span>{loc.google_reviews}</span>
                                </div>
                              )}
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                Parking: {loc.parking_available === 'Y' ? 'Available' : 'Not Available'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Grid View - Reduced spacing
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {locations.map((loc) => (
                    <div
                      key={loc.loc_id}
                      className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 h-60 flex flex-col ${
                        selectedLocation?.loc_id === loc.loc_id ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      onClick={() => handleLocationClick(loc.loc_id)}
                    >
                      {/* Image */}
                      <div className="relative h-36 w-full">
                        {loc.loc_img_url ? (
                          <img
                            src={loc.loc_img_url}
                            alt={loc.location_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No Image</span>
                          </div>
                        )}
                        {loc.new_flag === 'Y' && (
                          <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                            New
                          </span>
                        )}
                      </div>
                      
                      {/* Content - Reduced spacing */}
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-md font-semibold text-white truncate">
                              {loc.location_name}
                            </h3>
                            <a
                              href={`https://www.google.com/maps?q=${loc.loc_latitude},${loc.loc_longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-white hover:text-indigo-300"
                            >
                              <MapPin className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                        
                        {/* Minimal spacing here */}
                        <div className="mt-1 flex justify-between items-center text-xs">
                          {loc.google_reviews && (
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 mr-1" />
                              <span>{loc.google_reviews}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Summary - Fixed for mobile */}
            {/* <div className="w-full lg:w-1/3 lg:ml-20 order-first lg:order-last">
              <div className="lg:sticky "> */}
                <BookingSummary
                  selectedLocation={selectedLocation}
                  selectedOccasion={null}
                  selectedTheater={null}
                  onProceed={(e) => {
                    if (selectedLocation) {
                      handleProceed(selectedLocation.loc_id);
                    }
                  }}
                  isProceedDisabled={!selectedLocation}
                />
              {/* </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar and Animation Styles */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        .animate-slide-up {
          animation: slideUp 1s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Locations;