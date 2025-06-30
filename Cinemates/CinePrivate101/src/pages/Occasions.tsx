import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  theater_id: string;
  theater_name: string;
  theater_cost: string;
  location_name: string;
  per_persons: string;
  max_persons: string;
  decoration_price: string;
  selected_slot?: string;
};

const Occasions: React.FC = () => {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);
  const [nickname, setNickname] = useState('');
  const [partnerNickname, setPartnerNickname] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);

  const navigate = useNavigate();

  // Function to fetch location details
  const fetchLocationDetails = (locationId: string) => {
    axios
      .get(`${API_URL}/api/locations/${locationId}`)
      .then((res) => {
        const storedLocationName = sessionStorage.getItem('selected_loc_id');
        let locationData = Array.isArray(res.data) ? (res.data.length > 0 ? res.data[0] : null) : res.data;

        if (locationData) {
          const locationName =
            locationData.location_name || locationData.name || storedLocationName || 'Unknown Location';

          setSelectedLocation({
            loc_id: locationData.loc_id || locationData.id || locationId,
            location_name: locationName,
            parking_available: locationData.parking_available || locationData.parking || 'N',
            new_flag: locationData.new_flag || locationData.is_new || 'N',
          });

          sessionStorage.setItem('location_name', locationName);
          sessionStorage.setItem('manually_stored_location_name', locationName);
        } else if (storedLocationName) {
          setSelectedLocation({
            loc_id: locationId,
            location_name: storedLocationName,
            parking_available: 'N',
            new_flag: 'N',
          });
        } else {
          setSelectedLocation({
            loc_id: locationId,
            location_name: 'Unknown Location',
            parking_available: 'N',
            new_flag: 'N',
          });
        }
      })
      .catch((err) => {
        const storedLocationName = sessionStorage.getItem('location_name');
        setSelectedLocation({
          loc_id: locationId,
          location_name: storedLocationName || 'Unknown Location',
          parking_available: 'N',
          new_flag: 'N',
        });
      });
  };

  // Function to fetch theater details
  const fetchTheaterDetails = (theaterId: string, selectedSlot: string | null) => {
    axios
      .get(`${API_URL}/api/theaters/${theaterId}`)
      .then((res) => {
        const storedTheaterName = sessionStorage.getItem('theater_name');
        const storedLocationName = sessionStorage.getItem('location_name');
        let theaterData = Array.isArray(res.data) ? (res.data.length > 0 ? res.data[0] : null) : res.data;

        if (theaterData) {
          const theaterName =
            theaterData.theater_name || theaterData.name || storedTheaterName || 'Unknown Theater';

          const theaterCost = theaterData.theater_cost || theaterData.cost || theaterData.price || 'N/A';
          const perPersons = theaterData.per_persons || theaterData.persons_capacity || 'N/A';
          const maxPersons = theaterData.max_persons || theaterData.max_capacity || 'N/A';
          const decorationPrice = theaterData.decoration_price || theaterData.decoration_cost || 'N/A';

          setSelectedTheater({
            theater_id: theaterData.theater_id || theaterData.id || theaterId,
            theater_name: theaterName,
            theater_cost: theaterCost,
            location_name: theaterData.location_name || storedLocationName || 'Unknown Location',
            per_persons: perPersons,
            max_persons: maxPersons,
            decoration_price: decorationPrice,
            selected_slot: selectedSlot || 'N/A',
          });

          sessionStorage.setItem('theater_name', theaterName);
          sessionStorage.setItem('manually_stored_theater_name', theaterName);
          sessionStorage.setItem('theater_cost', theaterCost);
          sessionStorage.setItem('per_persons', perPersons);
          sessionStorage.setItem('max_persons', maxPersons);
          sessionStorage.setItem('decoration_price', decorationPrice);
        } else if (storedTheaterName) {
          setSelectedTheater({
            theater_id: theaterId,
            theater_name: storedTheaterName,
            theater_cost: sessionStorage.getItem('theater_cost') || 'N/A',
            location_name: storedLocationName || 'Unknown Location',
            per_persons: sessionStorage.getItem('per_persons') || 'N/A',
            max_persons: sessionStorage.getItem('max_persons') || 'N/A',
            decoration_price: sessionStorage.getItem('decoration_price') || 'N/A',
            selected_slot: selectedSlot || 'N/A',
          });
        } else {
          setSelectedTheater({
            theater_id: theaterId,
            theater_name: 'Unknown Theater',
            theater_cost: 'N/A',
            location_name: storedLocationName || 'Unknown Location',
            per_persons: 'N/A',
            max_persons: 'N/A',
            decoration_price: 'N/A',
            selected_slot: selectedSlot || 'N/A',
          });
        }
      })
      .catch((err) => {
        console.error('Error loading theater:', err);
        const storedTheaterName = sessionStorage.getItem('theater_name');
        const storedLocationName = sessionStorage.getItem('location_name');
        setSelectedTheater({
          theater_id: theaterId,
          theater_name: storedTheaterName || 'Unknown Theater',
          theater_cost: sessionStorage.getItem('theater_cost') || 'N/A',
          location_name: storedLocationName || 'Unknown Location',
          per_persons: sessionStorage.getItem('per_persons') || 'N/A',
          max_persons: sessionStorage.getItem('max_persons') || 'N/A',
          decoration_price: sessionStorage.getItem('decoration_price') || 'N/A',
          selected_slot: selectedSlot || 'N/A',
        });
      });
  };

  useEffect(() => {
    // Fetch occasions
    axios
      .get(`${API_URL}/api/occasions`)
      .then((res) => {
        // Normalize no_of_names to ensure it's '1' or '2'
        const normalizedOccasions = res.data.map((occasion: Occasion) => {
          const noOfNames = occasion.no_of_names;
          if (!['1', '2'].includes(noOfNames)) {
            console.warn(
              `Invalid no_of_names for occasion ${occasion.occasion_name}: ${noOfNames}. Defaulting to '1'.`
            );
            return { ...occasion, no_of_names: '1' };
          }
          return occasion;
        });
        setOccasions(normalizedOccasions);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching occasions:', err);
        setError('Failed to load occasions. Please try again.');
        setLoading(false);
      });

    // Fetch location and theater details from sessionStorage
    const selectedLocId = sessionStorage.getItem('selected_loc_id');
    const selectedTheaterId = sessionStorage.getItem('selected_theater_id');
    const selectedSlot = sessionStorage.getItem('selected_slot');

    if (!selectedLocId) {
      setError('No location selected. Please select a location.');
      navigate('/locations');
      return;
    }

    if (!selectedTheaterId) {
      setError('No theater selected. Please select a theater.');
      navigate('/theaters');
      return;
    }

    // Fetch location and theater details
    fetchLocationDetails(selectedLocId);
    fetchTheaterDetails(selectedTheaterId, selectedSlot);

    // Check if occasion is already selected in session storage
    const savedOccasion = sessionStorage.getItem('selected_occasion');
    if (savedOccasion) {
      try {
        const parsedOccasion = JSON.parse(savedOccasion);
        // Validate no_of_names
        if (!['1', '2'].includes(parsedOccasion.no_of_names)) {
          console.warn(
            `Invalid no_of_names in session storage for occasion ${parsedOccasion.occasion_name}: ${parsedOccasion.no_of_names}. Defaulting to '1'.`
          );
          parsedOccasion.no_of_names = '1';
        }
        setSelectedOccasion(parsedOccasion);

        // Restore nicknames if available
        const savedNickname = sessionStorage.getItem('booking_nickname');
        const savedPartnerNickname = sessionStorage.getItem('partner_nickname');

        if (savedNickname) setNickname(savedNickname);
        if (savedPartnerNickname && parsedOccasion.no_of_names === '2') {
          setPartnerNickname(savedPartnerNickname);
        }
      } catch (e) {
        console.error('Error parsing saved occasion:', e);
      }
    }
  }, [navigate]);

  const handleOccasionSelect = (occasion: Occasion) => {
    const noOfNames = occasion.no_of_names;
    const normalizedOccasion = !['1', '2'].includes(noOfNames)
      ? { ...occasion, no_of_names: '1' }
      : occasion;

    if (!['1', '2'].includes(noOfNames)) {
      console.warn(
        `Invalid no_of_names for occasion ${occasion.occasion_name}: ${noOfNames}. Defaulting to '1'.`
      );
    }

    setSelectedOccasion(normalizedOccasion);
    sessionStorage.setItem('selected_occasion', JSON.stringify(normalizedOccasion));

    // Clear nicknames when occasion changes
    if (selectedOccasion?.occasion_id !== occasion.occasion_id) {
      setNickname('');
      setPartnerNickname('');
      sessionStorage.removeItem('booking_nickname');
      sessionStorage.removeItem('partner_nickname');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const storedCustId = sessionStorage.getItem('cust_id');

    if (!storedCustId) {
      alert('Customer ID not found. Please log in.');
      return;
    }

    if (!selectedOccasion) {
      alert('Please select an occasion.');
      return;
    }

    if (!nickname) {
      alert('Please enter a nickname.');
      return;
    }

    if (selectedOccasion.no_of_names === '2' && !partnerNickname) {
      alert("Please enter your partner's nickname.");
      return;
    }

    try {
      sessionStorage.setItem('booking_nickname', nickname);
      if (selectedOccasion.no_of_names === '2') {
        sessionStorage.setItem('partner_nickname', partnerNickname);
      } else {
        sessionStorage.removeItem('partner_nickname');
      }

      // Normalize occasion name to fix typo
      const occasionName = selectedOccasion.occasion_name === 'Brithday' ? 'Birthday' : selectedOccasion.occasion_name;

      // Prepare payload
      const payload = {
        cust_id: storedCustId,
        booking_occasion: occasionName,
        booking_nickname: nickname,
        partner_nickname: selectedOccasion.no_of_names === '2' ? partnerNickname : '',
      };
    

      const response = await axios.post(`${API_URL}/api/save-occasion`, payload);

      alert('Occasion details saved successfully');
      navigate('/select-cakes');
    } catch (err) {
      console.error('Error saving occasion:', err);
      alert('Error saving occasion details. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <p className="text-lg">Loading occasions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        <p className="text-lg text-red-400">{error}</p>
        <button
          onClick={() => navigate('/locations')}
          className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Go to Locations
        </button>
      </div>
    );
  }

  return (
    <div className="font-sans bg-white text-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/fc/c5/b2/fcc5b285dd23386a6544e0cb28dc1324.jpg')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-wide animate-fade-in">
            Celebrate Your Moment
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto animate-slide-up">
            Choose the perfect occasion to make your event unforgettable.
          </p>
        </div>
      </section>

      {/* Main Content (Simple UI with Form and Summary on Right) */}
      <div className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/theaters')}
              className="flex items-center text-purple-700 hover:text-purple-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Theaters
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Occasions Section (Left) */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-center mb-6 text-black">Select Your Occasion</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {occasions.map((occasion) => (
                  <div
                    key={occasion.occasion_id}
                    className={`relative rounded-md overflow-hidden cursor-pointer border-2 ${
                      selectedOccasion?.occasion_id === occasion.occasion_id
                        ? 'border-indigo-500'
                        : 'border-gray-700'
                    } hover:border-indigo-400 transition-colors`}
                    onClick={() => handleOccasionSelect(occasion)}
                  >
                    <img
                      src={occasion.occasion_image_url}
                      alt={occasion.occasion_name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
                      <h3 className="text-base font-bold text-white">{occasion.occasion_name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (Form and Booking Summary) */}
            <div className="space-y-6 mt-0 lg:mt-14 mr-4 lg:mr-0 lg:ml-20">
              {/* Booking Summary */}
              <BookingSummary
                selectedLocation={selectedLocation}
                selectedTheater={selectedTheater}
                selectedOccasion={selectedOccasion}
              />

              {/* Form */}
              {selectedOccasion && (
                <div className="w-full max-w-[320px] h-[300px] bg-gray-100 rounded-xl p-6 border border-black shadow-md mx-auto lg:mx-0">
                  <h2 className="text-lg font-semibold text-center mb-4 text-black">
                    Details for {selectedOccasion.occasion_name}
                  </h2>
                  <form onSubmit={handleFormSubmit} className="flex flex-col justify-between h-full">
                    <div>
                      <div className="mb-4">
                        <label
                          className="block text-black text-sm font-medium mb-1"
                          htmlFor="nickname"
                        >
                          Nickname
                        </label>
                        <input
                          type="text"
                          id="nickname"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          className="w-full p-2 border border-gray-600 rounded-md text-black focus:outline-none focus:border-indigo-500"
                          placeholder="Enter nickname"
                          required
                        />
                      </div>

                      {selectedOccasion.no_of_names === '2' && (
                        <div className="mb-4">
                          <label
                            className="block text-black text-sm font-medium mb-1"
                            htmlFor="partnerNickname"
                          >
                            Partner's Nickname
                          </label>
                          <input
                            type="text"
                            id="partnerNickname"
                            value={partnerNickname}
                            onChange={(e) => setPartnerNickname(e.target.value)}
                            className="w-full p-2 border border-gray-600 rounded-md text-black focus:outline-none focus:border-indigo-500"
                            placeholder="Enter partner's nickname"
                            required
                          />
                        </div>
                      )}
                       <div className="flex justify-center lg:ml-20">
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Proceed
                      </button>
                    </div>
                    </div>


                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Occasions;