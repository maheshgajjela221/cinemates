import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios'; // Import AxiosError
import { useNavigate } from 'react-router-dom';
import BookingSummary from './summaryCrad';
import { API_URL } from '../config';

// Types from Occasions.tsx
type Location = {
  location_name: string;
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

type Occasion = {
  occasion_id: string;
  occasion_name: string;
  occasion_image_url: string;
  no_of_names: string;
};

type Cake = {
  cake_id: number;
  cake_name: string;
  cake_image_url: string;
  egg_eggless: 'eggless' | 'egg';
  cake_price1?: string;
  cake_quantity1?: string;
  cake_price2?: string;
  cake_quantity2?: string;
  cake_price3?: string;
  cake_quantity3?: string;
  cake_price4?: string;
  cake_quantity4?: string;
  cake_price5?: string;
  cake_quantity5?: string;
  tagline1?: string;
  tagline2?: string;
  tagline3?: string;
};

const SelectCakes: React.FC = () => {
  const [allCakes, setAllCakes] = useState<Cake[]>([]);
  const [displayedCakes, setDisplayedCakes] = useState<Cake[]>([]);
  const [selectedCakes, setSelectedCakes] = useState<
    { cake: Cake; quantity: number; weight: string; price: string }[]
  >([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [weights, setWeights] = useState<{ [key: number]: string }>({});
  const [filterType, setFilterType] = useState<'all' | 'eggless' | 'egg'>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Retrieve data from sessionStorage
  const selectedLocation: Location | null = {
    location_name: sessionStorage.getItem('location_name') || 'Not selected',
  };

  const selectedTheater: Theater | null = {
    theater_id: sessionStorage.getItem('selected_theater_id') || 'unknown',
    theater_name: sessionStorage.getItem('theater_name') || 'Not selected',
    theater_cost: sessionStorage.getItem('theater_cost') || 'N/A',
    location_name: sessionStorage.getItem('location_name') || 'Not selected',
    per_persons: sessionStorage.getItem('per_persons') || 'N/A',
    max_persons: sessionStorage.getItem('max_persons') || 'N/A',
    decoration_price: sessionStorage.getItem('decoration_price') || 'N/A',
    selected_slot: sessionStorage.getItem('selected_slot') || 'Not selected',
  };

  let selectedOccasion: Occasion | null = null;
  const savedOccasion = sessionStorage.getItem('selected_occasion');
  if (savedOccasion) {
    try {
      const parsedOccasion = JSON.parse(savedOccasion);
      selectedOccasion = {
        occasion_id: parsedOccasion.occasion_id || 'unknown',
        occasion_name: parsedOccasion.occasion_name || 'Not selected',
        occasion_image_url: parsedOccasion.occasion_image_url || '',
        no_of_names: ['1', '2'].includes(parsedOccasion.no_of_names)
          ? parsedOccasion.no_of_names
          : '1',
      };
    } catch (e) {
      console.error('Error parsing saved occasion:', e);
    }
  }

  // Helper function to parse weight-price options
  const parseWeightPriceOptions = (cake: Cake): { weight: string; price: string }[] => {
    const options: { weight: string; price: string }[] = [];
    for (let i = 1; i <= 5; i++) {
      const quantity = cake[`cake_quantity${i}` as keyof Cake];
      const price = cake[`cake_price${i}` as keyof Cake];
      if (quantity !== undefined && price !== undefined) {
        options.push({ weight: String(quantity), price: String(price) });
      }
    }
    return options.length > 0 ? options : [{ weight: '500 grams', price: '0' }];
  };

  // Fetch all cakes without filtering by egg/eggless
  const fetchAllCakes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/cakes`);

      const initialQuantities: { [key: number]: number } = {};
      const initialWeights: { [key: number]: string } = {};

      response.data.forEach((cake: Cake) => {
        if (!initialQuantities[cake.cake_id]) {
          initialQuantities[cake.cake_id] = quantities[cake.cake_id] || 0; // Preserve existing quantities
          const weightOptions = parseWeightPriceOptions(cake);
          initialWeights[cake.cake_id] = weights[cake.cake_id] || weightOptions[0].weight; // Preserve existing weights
        } else {
          console.warn(`Duplicate cake ID detected: ${cake.cake_id}`);
        }
      });

      setAllCakes(response.data);
      setQuantities(prev => ({ ...prev, ...initialQuantities }));
      setWeights(prev => ({ ...prev, ...initialWeights }));
    
    } catch (error) {
      console.error('Error fetching cakes:', error);
      alert('Error loading cakes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter displayed cakes based on selected filter
  const filterDisplayedCakes = () => {
    let filtered = allCakes;
    
    if (filterType === 'eggless') {
      filtered = allCakes.filter(cake => cake.egg_eggless === 'eggless');
    } else if (filterType === 'egg') {
      filtered = allCakes.filter(cake => cake.egg_eggless === 'egg');
    }
    
    setDisplayedCakes(filtered);
  };

  useEffect(() => {
    fetchAllCakes();
  }, []);

  useEffect(() => {
    filterDisplayedCakes();
  }, [allCakes, filterType]);

  const getPriceForWeight = (cake: Cake, weight: string): string => {
    const options = parseWeightPriceOptions(cake);
    const selectedOption = options.find((opt) => opt.weight === weight);
    return selectedOption ? selectedOption.price : '0';
  };

  const updateSelectedCakes = () => {
    // Include all cakes with quantity > 0, regardless of current filter
    const updatedSelectedCakes = allCakes
      .filter((cake) => quantities[cake.cake_id] > 0)
      .map((cake) => ({
        cake,
        quantity: quantities[cake.cake_id],
        weight: weights[cake.cake_id] || parseWeightPriceOptions(cake)[0].weight,
        price: getPriceForWeight(cake, weights[cake.cake_id] || parseWeightPriceOptions(cake)[0].weight),
      }));
    setSelectedCakes(updatedSelectedCakes);
    
  };

  useEffect(() => {
    updateSelectedCakes();
  }, [quantities, weights, allCakes]);

  const handleWeightChange = (cakeId: number, newWeight: string) => {
    setWeights((prev) => {
      const newWeights = { ...prev, [cakeId]: newWeight };
   
      return newWeights;
    });
  };

  const incrementQuantity = (cakeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setQuantities((prev) => {
      const newQuantities = { ...prev, [cakeId]: (prev[cakeId] || 0) + 1 };
      
      return newQuantities;
    });
  };

  const decrementQuantity = (cakeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setQuantities((prev) => {
      const newQuantities = { ...prev, [cakeId]: Math.max(0, (prev[cakeId] || 0) - 1) };
     
      return newQuantities;
    });
  };

  const handleCakeClick = (cake: Cake, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Only increment if quantity is 0 to avoid automatic selection
    if (quantities[cake.cake_id] === 0) {
      setQuantities((prev) => {
        const newQuantities = { ...prev, [cake.cake_id]: 1 };
       
        return newQuantities;
      });
    }
  };

  const getTotalCakePrice = (): number => {
    const total = selectedCakes.reduce((total, { quantity, price }) => {
      return total + (parseFloat(price) || 0) * quantity;
    }, 0);
   
    return total;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedCustId = sessionStorage.getItem('cust_id');

    if (!storedCustId) {
      alert('Customer ID not found. Please log in.');
      return;
    }

    if (selectedCakes.length === 0) {
      alert('Please select at least one cake');
      return;
    }

    setLoading(true);
    try {
      // Send each cake individually to match backend expectations
      const savePromises = selectedCakes.map(async ({ cake, quantity, weight, price }) => {
        const cakePayload = {
          cust_id: storedCustId,
          cake_name: cake.cake_name.trim(),
          quantity: quantity.toString(),
          item_price: parseFloat(price).toFixed(2),
          weight: weight || '500 grams',
          egg_eggless: cake.egg_eggless || 'eggless'
        };

        return axios.post(`${API_URL}/api/save-cakes`, cakePayload, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });
      });

      // Wait for all cake saves to complete
      const responses = await Promise.all(savePromises);

      // Check if all requests were successful
      const allSuccessful = responses.every(response => 
        response.data && (response.data.success !== false)
      );

      if (allSuccessful) {
        // Format cake summary for session storage
        const cakesString = selectedCakes
          .map(({ cake, quantity, weight, price }) => {
            const totalPrice = (parseFloat(price) || 0) * quantity;
            return `${cake.cake_name} (${quantity} x ${weight}) - ₹${totalPrice.toFixed(2)}`;
          })
          .join(', ');

        sessionStorage.setItem('selected_cakes', cakesString);
        sessionStorage.setItem('total_cake_price', getTotalCakePrice().toString());

        navigate('/select-addons');
      } else {
        throw new Error('Some cakes failed to save');
      }
    } catch (err: unknown) {
      console.error('Error saving cakes:', err);
      
      let errorMessage = 'Error saving cake details. Please try again.';
      if (err instanceof AxiosError) {
        if (err.response) {
          // Server responded with error status
          errorMessage = err.response.data?.message || errorMessage;
        } else if (err.request) {
          // Request was made but no response
          errorMessage = 'Network error - please check your connection';
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFilterDisplayText = () => {
    switch (filterType) {
      case 'eggless':
        return 'Eggless Cakes';
      case 'egg':
        return 'Egg-based Cakes';
      default:
        return 'All Cakes';
    }
  };

  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/fc/c5/b2/fcc5b285dd23386a6544e0cb28dc1324.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Select Your Perfect Cake
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Choose from our delicious collection of cakes for your special celebration.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button and Filter */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <button
              onClick={() => navigate('/occasions')}
              className="flex items-center text-purple-700 hover:text-purple-900 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Occasions
            </button>

            <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
              <span className="text-sm font-medium text-gray-700">Filter by type:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    filterType === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('egg')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    filterType === 'egg'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Egg-based
                </button>
                <button
                  onClick={() => setFilterType('eggless')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    filterType === 'eggless'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Eggless
                </button>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cakes Section */}
            <div className="lg:col-span-2">
              <h2 className="text-center text-2xl font-semibold mb-6">
                {getFilterDisplayText()}
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="mt-2 text-gray-600">Loading cakes...</p>
                </div>
              ) : displayedCakes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No {filterType === 'all' ? '' : filterType === 'eggless' ? 'eggless' : 'egg-based'} cakes available.
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try switching to a different filter.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedCakes.map((cake) => {
                    const weightOptions = parseWeightPriceOptions(cake);
                    const isSelected = quantities[cake.cake_id] > 0;

                    return (
                      <div
                        key={cake.cake_id}
                        className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                          isSelected
                            ? 'ring-2 ring-indigo-500'
                            : 'hover:shadow-xl hover:-translate-y-1'
                        }`}
                        onClick={(e) => handleCakeClick(cake, e)}
                      >
                        {/* Image Section */}
                        <div className="relative h-48">
                          <img
                            src={cake.cake_image_url}
                            alt={cake.cake_name}
                            className="w-full h-full object-cover"
                          />
                          {/* <span
                            className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold ${
                              cake.egg_eggless === 'eggless'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-orange-50 text-orange-700'
                            }`}
                          >
                            {cake.egg_eggless === 'eggless' ? '🌱 Eggless' : '🥚 Egg-based'}
                          </span> */}
                          {/* {isSelected && (
                            <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-md px-2 py-1 text-xs font-semibold">
                              Qty: {quantities[cake.cake_id]}
                            </div>
                          )} */}
                        </div>

                        {/* Content Section */}
                        <div className="p-3">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {cake.cake_name}
                          </h3>
                          <p className="text-sm font-semibold text-indigo-600 mt-1">
                            ₹{getPriceForWeight(cake, weights[cake.cake_id] || weightOptions[0].weight)}
                          </p>

                          {/* Weight Selector */}
                          <div className="mt-2">
                            <select
                              value={weights[cake.cake_id] || weightOptions[0].weight}
                              onChange={(e) => handleWeightChange(cake.cake_id, e.target.value)}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                              disabled={weightOptions.length === 1}
                              className={`w-full p-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors ${
                                weightOptions.length === 1
                                  ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                                  : 'bg-white hover:bg-gray-50'
                              }`}
                            >
                              {weightOptions.map((option, index) => (
                                <option key={index} value={option.weight}>
                                  {option.weight} (₹{option.price})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-end mt-3 space-x-2">
                            <button
                              onClick={(e) => decrementQuantity(cake.cake_id, e)}
                              className="p-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                              disabled={!quantities[cake.cake_id] || quantities[cake.cake_id] === 0}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="text-sm font-medium text-gray-800 w-8 text-center">
                              {quantities[cake.cake_id] || 0}
                            </span>
                            <button
                              onClick={(e) => incrementQuantity(cake.cake_id, e)}
                              className="p-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Booking Summary - Fixed for mobile */}
            <div className="space-y-6 mt-8 lg:mt-20 lg:ml-20">
              <BookingSummary
                selectedLocation={selectedLocation}
                selectedTheater={selectedTheater}
                selectedOccasion={selectedOccasion}
                selectedCakes={selectedCakes}
                onProceed={handleFormSubmit}
                isProceedDisabled={selectedCakes.length === 0 || loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCakes;