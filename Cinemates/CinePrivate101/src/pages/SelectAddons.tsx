import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import BookingSummary from './summaryCrad';

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
  cake_name: string;
  cake_price: string;
  egg_eggless?: 'eggless' | 'egg';
};

const SelectAddons: React.FC = () => {
  const [addons, setAddons] = useState<any[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<{ [key: number]: any }>({});
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

  // Retrieve total_cake_price from sessionStorage
  const totalCakePrice = sessionStorage.getItem('total_cake_price') || '0';

  // Initialize selectedCakes with the required properties for BookingSummary
  let selectedCakes: { cake: Cake; quantity: number; weight: string; price: string }[] = [];
  const savedCakes = sessionStorage.getItem('selected_cakes');

  if (savedCakes && savedCakes !== 'null' && savedCakes !== '') {
    try {
      const parsedCakes = JSON.parse(savedCakes);
     

      if (Array.isArray(parsedCakes) && parsedCakes.length > 0) {
        selectedCakes = parsedCakes.map((item: any) => {
        
          const cakeItem = {
            cake: {
              cake_name: item.cake_name || item.name || item.cake?.cake_name || 'Unknown',
              cake_price: item.cake_price || item.price || item.cake?.cake_price || '0',
              egg_eggless: item.egg_eggless || item.cake?.egg_eggless || (sessionStorage.getItem('is_veg') === 'true' ? 'eggless' : 'egg'),
            },
            quantity: parseInt(item.quantity, 10) || 1,
            weight: item.weight || '1kg',
            price: item.cake_price || item.price || item.cake?.cake_price || '0',
          };
          
          return cakeItem;
        });
      } else if (parsedCakes && typeof parsedCakes === 'object' && !Array.isArray(parsedCakes)) {
        // Handle single cake object
        
        selectedCakes = [{
          cake: {
            cake_name: parsedCakes.cake_name || parsedCakes.name || parsedCakes.cake?.cake_name || 'Unknown',
            cake_price: parsedCakes.cake_price || parsedCakes.price || parsedCakes.cake?.cake_price || '0',
            egg_eggless: parsedCakes.egg_eggless || parsedCakes.cake?.egg_eggless || (sessionStorage.getItem('is_veg') === 'true' ? 'eggless' : 'egg'),
          },
          quantity: parseInt(parsedCakes.quantity, 10) || 1,
          weight: parsedCakes.weight || '1kg',
          price: parsedCakes.cake_price || parsedCakes.price || parsedCakes.cake?.cake_price || '0',
        }];
      } else {
        console.warn('parsedCakes is not a valid array or object:', parsedCakes);
      }
    } catch (e) {
      console.error('Error parsing saved cakes:', e);
      // Enhanced parsing for comma-separated cake entries
      const cakeEntries = savedCakes.split(',').map(entry => entry.trim());
     

      selectedCakes = cakeEntries.map((entry: string) => {
       
        const cakeMatch1 = entry.match(/^(.+?)\s*\((\d+)\s*x\s*([^)]+)\)\s*-\s*[₹$]?([\d.]+)$/);
       
        const cakeMatch2 = entry.match(/^(.+?)\s*\((\d+)\)\s*-\s*[₹$]?([\d.]+)$/);
       
        const nameMatch = entry.match(/^([^(]+)/);
        const priceMatch = entry.match(/[₹$]([\d.]+)/);
        const quantityMatch = entry.match(/\((\d+)/);

        if (cakeMatch1) {
          const [, cakeName, quantity, weight, price] = cakeMatch1;
        
          return {
            cake: {
              cake_name: cakeName.trim(),
              cake_price: price,
              egg_eggless: sessionStorage.getItem('is_veg') === 'true' ? 'eggless' : 'egg',
            },
            quantity: parseInt(quantity, 10) || 1,
            weight: weight.trim(),
            price: price,
          };
        } else if (cakeMatch2) {
          const [, cakeName, quantity, price] = cakeMatch2;
        
          return {
            cake: {
              cake_name: cakeName.trim(),
              cake_price: price,
              egg_eggless: sessionStorage.getItem('is_veg') === 'true' ? 'eggless' : 'egg',
            },
            quantity: parseInt(quantity, 10) || 1,
            weight: '1kg', // default weight
            price: price,
          };
        } else if (nameMatch && priceMatch) {
          
          return {
            cake: {
              cake_name: nameMatch[1].trim(),
              cake_price: priceMatch[1],
              egg_eggless: sessionStorage.getItem('is_veg') === 'true' ? 'eggless' : 'egg',
            },
            quantity: quantityMatch ? parseInt(quantityMatch[1], 10) : 1,
            weight: '500 grams', // default based on your data
            price: priceMatch[1],
          };
        } else {
          console.warn('Failed to parse cake entry:', entry);
          return null;
        }
      }).filter((cake: any) => cake !== null); // Filter out any failed parses
    }
  } else {
    
  }

  

  // Handle isVeg with explicit true/false
  const isVeg = sessionStorage.getItem('is_veg') === 'true' ? true : sessionStorage.getItem('is_veg') === 'false' ? false : false;

  

  useEffect(() => {
    axios
      .get(`${API_URL}/api/addons`)
      .then((res) => {
        setAddons(res.data);
      })
      .catch((err) => {
        console.error('Error fetching add-ons:', err);
      });
  }, []);

  const incrementQuantity = (addon: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAddons((prev) => {
      const currentQuantity = prev[addon.addon_id]?.quantity || 0;
      return {
        ...prev,
        [addon.addon_id]: {
          ...addon,
          quantity: currentQuantity + 1,
        },
      };
    });
  };

  const decrementQuantity = (addonId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAddons((prev) => {
      const currentAddon = prev[addonId];
      if (!currentAddon || currentAddon.quantity <= 1) {
        const newSelected = { ...prev };
        delete newSelected[addonId];
        return newSelected;
      }
      return {
        ...prev,
        [addonId]: {
          ...currentAddon,
          quantity: currentAddon.quantity - 1,
        },
      };
    });
  };

  const getAddonQuantity = (addonId: number) => {
    return selectedAddons[addonId]?.quantity || 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedCustId = sessionStorage.getItem('cust_id');

    if (!storedCustId) {
      alert('Customer ID not found. Please log in.');
      return;
    }

    if (Object.keys(selectedAddons).length === 0) {
      alert('Please select at least one add-on.');
      return;
    }

    try {
      for (const addonId in selectedAddons) {
        const addon = selectedAddons[addonId];
        await axios.post(`${API_URL}/api/save-addon`, {
          cust_id: storedCustId,
          addon_name: addon.addon_name,
          quantity: addon.quantity.toString(),
          addons_price: addon.addon_price,
        });
      }

      sessionStorage.setItem('selected_addons', JSON.stringify(selectedAddons));
      alert('Add-ons saved successfully');
      navigate('/confirmation');
    } catch (err) {
      console.error('Error saving add-ons:', err);
      alert('Error saving add-ons details');
    }
  };

  const groupedAddons = addons.reduce((groups: any, addon: any) => {
    if (!groups[addon.category_name]) {
      groups[addon.category_name] = [];
    }
    groups[addon.category_name].push(addon);
    return groups;
  }, {});

  const totalSelectedAddons = Object.keys(selectedAddons).length;

  return (
    <div>
      {/* Header Section */}
      <section className="relative py-24 bg-gradient-to-b from-purple-700 to-purple-900">
        <div className="absolute inset-0">
          <img
            src="https://i.pinimg.com/736x/fc/c5/b2/fcc5b285dd23386a6544e0cb28dc1324.jpg?auto=compress&cs=tinysrgb&w=1600"
            alt="Background"
            className="w-full h-full object-cover object-center opacity-20"
            loading="lazy"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Select Your Add-Ons
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Enhance your celebration with these exciting add-ons.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/select-cakes')}
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
              Back to Cakes
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add-ons Section (Left) */}
            <div className="lg:col-span-2">
              {Object.keys(groupedAddons).map((category) => (
                <div key={category} className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">{category}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedAddons[category].map((addon: any) => (
                      <div
                        key={addon.addon_id}
                        className={`relative bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                          selectedAddons[addon.addon_id] ? 'ring-4 ring-purple-300' : ''
                        }`}
                      >
                        {/* Selected Badge */}
                        {selectedAddons[addon.addon_id] && (
                          <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            Selected
                          </span>
                        )}
                        <img
                          src={addon.addon_image_url}
                          alt={addon.addon_name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                          loading="lazy"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">{addon.addon_name}</h3>
                        <p className="text-gray-600 mb-4">Price: ${addon.addon_price}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                            <button
                              onClick={(e) => decrementQuantity(addon.addon_id, e)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-full transition"
                            >
                              -
                            </button>
                            <span className="px-3 text-gray-800 font-medium">
                              {getAddonQuantity(addon.addon_id)}
                            </span>
                            <button
                              onClick={(e) => incrementQuantity(addon, e)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-full transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Booking Summary (Right) */}
            <div className="lg:col-span-1">
              <BookingSummary
                selectedLocation={selectedLocation}
                selectedTheater={selectedTheater}
                selectedOccasion={selectedOccasion}
                selectedCakes={selectedCakes}
                isVeg={isVeg}
                selectedAddons={selectedAddons}
                totalCakePrice={parseFloat(totalCakePrice)} // Pass totalCakePrice as a prop
              />
              {totalSelectedAddons > 0 && (
                <form onSubmit={handleFormSubmit} className="mt-6">
                  <button
                    type="submit"
                    className="w-[200px] bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg ml-16"
                  >
                    Proceed
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectAddons;