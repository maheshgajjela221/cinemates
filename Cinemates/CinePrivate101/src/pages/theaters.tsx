import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import BookingSummary from './summaryCrad';
import { API_URL } from '../config';

type Occasion = {
  occasion_id: string;
  occasion_name: string;
  occasion_image_url: string;
  no_of_names: string;
};

type Location = {
  loc_id: string;
  location_name: string;
  parking_available: string;
  new_flag: string;
};

type Theater = {
  slot?: string;
  theater_id: string;
  theater_name: string;
  theater_cost: string;
  location_name: string;
  per_persons: string;
  max_persons: string;
  decoration_price: string;
  gallery_image_url_1?: string;
  gallery_image_url_2?: string;
  gallery_image_url_3?: string;
  gallery_image_url_4?: string;
  gallery_image_url_5?: string;
  gallery_image_url_6?: string;
  gallery_image_url_7?: string;
  gallery_image_url_8?: string;
  gallery_image_url_9?: string;
  gallery_image_url_10?: string;
  tag_line1?: string;
  tag_line2?: string;
  tag_line3?: string;
  tag_line4?: string;
  tag_line5?: string;
  slot_timing1?: string;
  slot_timing2?: string;
  slot_timing3?: string;
  slot_timing4?: string;
  slot_timing5?: string;
  slot_timing6?: string;
  slot_timing7?: string;
  slot_timing8?: string;
  slot_timing9?: string;
  slot_timing10?: string;
  selected_slot?: string;
};

const Theaters: React.FC = () => {
  const navigate = useNavigate();
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: string[] }>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('2025-05-09');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
  const [activeTheaterIndex, setActiveTheaterIndex] = useState<number>(0);

  useEffect(() => {
    sessionStorage.setItem('selected_date', selectedDate);

    const selectedLocId = sessionStorage.getItem('selected_loc_id');
    if (selectedLocId) {
      axios
        .get(`${API_URL}/api/theaters?loc_id=${selectedLocId}`)
        .then((res) => {
          setTheaters(res.data);
          setLoading(false);
          if (res.data.length > 0) {
            setSelectedLocation({
              loc_id: selectedLocId,
              location_name: res.data[0].location_name || sessionStorage.getItem('location_name') || 'Unknown Location',
              parking_available: sessionStorage.getItem('parking_available') || 'N',
              new_flag: sessionStorage.getItem('new_flag') || 'N',
            });
          }
        })
        .catch((err) => {
          console.error('Error loading theaters:', err);
          setLoading(false);
        });
    }

    axios
      .get(`${API_URL}/api/booked_slots?date=${selectedDate}`)
      .then((res) => {
        const updatedBookedSlots: { [key: string]: string[] } = {};
        res.data.forEach((booking: any) => {
          if (!updatedBookedSlots[booking.theater_id]) {
            updatedBookedSlots[booking.theater_id] = [];
          }
          updatedBookedSlots[booking.theater_id].push(booking.booked_slot);
        });
        setBookedSlots(updatedBookedSlots);
      })
      .catch((err) => {
        console.error('Error fetching booked slots:', err);
      });

    const savedOccasion = sessionStorage.getItem('selected_occasion');
    if (savedOccasion) {
      try {
        setSelectedOccasion(JSON.parse(savedOccasion));
      } catch (e) {
        console.error('Error parsing saved occasion:', e);
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    const selectedTheaterId = sessionStorage.getItem('selected_theater_id');
    if (selectedTheaterId && theaters.length > 0) {
      const theater = theaters.find((t) => t.theater_id === selectedTheaterId);
      if (theater) {
        setSelectedTheater({
          ...theater,
          selected_slot: selectedSlot || sessionStorage.getItem('selected_slot') || undefined,
        });
      }
    }
  }, [theaters, selectedSlot]);

  const handleSelectTheater = (theater: Theater, index: number) => {
    // Preserve the selected slot if it belongs to this theater
    const currentSlot = selectedSlot && theater.theater_id === selectedTheater?.theater_id ? selectedSlot : null;
    
    // Clear selected slot when switching to a different theater
    if (theater.theater_id !== selectedTheater?.theater_id) {
      setSelectedSlot(null);
    }

    setSelectedTheater({
      ...theater,
      selected_slot: currentSlot || theater.selected_slot,
    });
    setActiveTheaterIndex(index);
  };

  const handleSlotSelect = (slot: string, theaterId: string) => {
    setSelectedSlot(slot);

    // Find the theater corresponding to the theaterId
    const theater = theaters.find((t) => t.theater_id === theaterId);
    if (theater) {
      // Update selectedTheater and activeTheaterIndex
      setSelectedTheater({
        ...theater,
        selected_slot: slot,
      });
      const theaterIndex = theaters.findIndex((t) => t.theater_id === theaterId);
      setActiveTheaterIndex(theaterIndex);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleProceed = () => {
    const selectedLocId = sessionStorage.getItem('selected_loc_id');
    const selectedDateFromStorage = sessionStorage.getItem('selected_date');
    const theaterId = selectedTheater?.theater_id;

    if (!selectedLocId || !selectedDateFromStorage || !selectedSlot || !theaterId) {
      alert("Please select a location, date, slot, and theater.");
      return;
    }

    axios
      .post(`${API_URL}/api/check_slot`, {
        theater_id: theaterId,
        loc_id: selectedLocId,
        booked_date: selectedDateFromStorage,
        booked_slot: selectedSlot,
      })
      .then((res) => {
        sessionStorage.setItem('selected_slot', selectedSlot);
        sessionStorage.setItem('selected_theater_id', theaterId);
        sessionStorage.setItem('theater_name', selectedTheater!.theater_name);
        sessionStorage.setItem('theater_cost', selectedTheater!.theater_cost);

        return axios.post(`${API_URL}/api/booked-slots`, {
          theater_id: theaterId,
          loc_id: selectedLocId,
          booked_date: selectedDateFromStorage,
          booked_slot: selectedSlot,
        });
      })
      .then((bookingRes) => {
        if (bookingRes && bookingRes.data.success) {
          setBookedSlots((prev) => ({
            ...prev,
            [theaterId]: [...(prev[theaterId] || []), selectedSlot],
          }));
          alert('Slot booked successfully!');
          navigate('/occasions');
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          alert('This slot is already booked.');
        } else if (err.response && err.response.status === 409) {
          alert('This slot has just been booked by someone else.');
        } else {
          console.error('Error during slot booking process:', err);
          alert('Error checking slot availability or booking the slot.');
        }
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-purple-600 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-purple-600 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-purple-600 rounded"></div>
              <div className="h-4 bg-purple-600 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <section className="relative py-24 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/fc/c5/b2/fcc5b285dd23386a6544e0cb28dc1324.jpg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-20"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Choose Your Perfect Venue
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Discover premium theaters and book your ideal celebration space
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Navigation and Controls Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <button
              onClick={() => navigate('/locations')}
              className="flex items-center text-purple-700 hover:text-purple-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Locations
            </button>
            
            <div className="flex flex-col items-center md:items-end">
              <label htmlFor="date-picker" className="text-lg font-semibold text-gray-700 mb-2">
                Select Your Date
              </label>
              <input
                type="date"
                id="date-picker"
                value={selectedDate}
                onChange={handleDateChange}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Theater Selection */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Theater Cards Grid */}
          <div className="w-full lg:w-3/4">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {selectedLocation?.location_name || 'Available Theaters'}
              </h2>
              <p className="text-gray-600 text-lg">
                {theaters.length} premium venue{theaters.length !== 1 ? 's' : ''} available for your celebration
              </p>
            </div>

            {/* Theater Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {theaters.map((theater, index) => (
                <div 
                  key={theater.theater_id} 
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${
                    activeTheaterIndex === index 
                      ? 'ring-3 ring-purple-500 ring-opacity-60 shadow-purple-200 transform scale-105' 
                      : 'hover:shadow-lg hover:-translate-y-1'
                  }`}
                  onClick={() => handleSelectTheater(theater, index)}
                >
                  {/* Card Header with Image */}
                  <div className="relative h-48">
                    {activeTheaterIndex === index && (
                      <div className="absolute top-3 right-3 z-10">
                        {/* <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          SELECTED
                        </div> */}
                      </div>
                    )}

                    <Swiper
                      modules={[Autoplay, Navigation]}
                      spaceBetween={0}
                      slidesPerView={1}
                      navigation={false}
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                      }}
                      className="h-full"
                    >
                      {[
                        theater.gallery_image_url_1, 
                        theater.gallery_image_url_2, 
                        theater.gallery_image_url_3, 
                        theater.gallery_image_url_4,
                        theater.gallery_image_url_5,
                        theater.gallery_image_url_6,
                        theater.gallery_image_url_7,
                        theater.gallery_image_url_8,
                        theater.gallery_image_url_9,
                        theater.gallery_image_url_10
                      ].filter(Boolean).map((imageUrl, idx) => (
                        <SwiperSlide key={idx}>
                          <img
                            src={imageUrl}
                            alt={`${theater.theater_name} gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    {/* Theater Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{theater.theater_name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl font-bold text-purple-600">₹{theater.theater_cost}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            📍 {theater.location_name}
                          </span>
                        </div>
                        
                     
                          {theater.tag_line1 && ( 
                          <p >
                            {theater.tag_line1}
                          </p>
                        )}
                          {theater.tag_line2 && (
                          <p >
                            {theater.tag_line2}
                          </p>
                        )}
                       
                      </div>
                      
                      {/* Selection Indicator */}
                      <div className={`ml-3 rounded-full h-6 w-6 flex items-center justify-center border-2 flex-shrink-0 ${
                        activeTheaterIndex === index ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                      }`}>
                        {activeTheaterIndex === index && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Time Slots Section */}
                     <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-700 mb-3 text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Available Slots
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          theater.slot_timing1, 
                          theater.slot_timing2, 
                          theater.slot_timing3, 
                          theater.slot_timing4,
                          theater.slot_timing5, 
                          theater.slot_timing6, 
                          theater.slot_timing7, 
                          theater.slot_timing8,
                          theater.slot_timing9,
                          theater.slot_timing10
                        ].filter(Boolean).map((slot, idx) => {
                          if (typeof slot === 'string') {
                            const isBooked = (bookedSlots[theater.theater_id] || []).includes(slot);
                            const isSelected = selectedSlot === slot && activeTheaterIndex === index;
                            
                            return (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  handleSlotSelect(slot, theater.theater_id);
                                }}
                                disabled={isBooked}
                                className={`px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                  isBooked
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-purple-600 text-white shadow-md transform scale-105'
                                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 border border-purple-200'
                                }`}
                              >
                                {slot}
                                {isBooked && (
                                  <div className="text-xs mt-1 opacity-70">Booked</div>
                                )}
                              </button>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Summary Card - Fixed for mobile */}
          <div className="w-full lg:w-1/4 lg:mt-40 lg:ml-20 order-last lg:order-last">
            <div className="lg:sticky lg:top-4">
              {/* <div className="rounded-2xl shadow-lg p-5"> */}
                <BookingSummary
                  selectedLocation={selectedLocation}
                  selectedTheater={selectedTheater}
                  selectedOccasion={selectedOccasion}
                  onProceed={handleProceed}
                  isProceedDisabled={!selectedSlot || !selectedTheater || !selectedTheater.theater_id}
                />
              {/* </div> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Theaters;