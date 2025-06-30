import { Check, ArrowLeft, Calendar, MapPin, Cake, Gift, Info, X, CheckCircle, AlertCircle, Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

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

type CakeItem = {
  cake_name: string;
  cake_price: string;
  weight: string;
  egg_eggless: 'eggless' | 'egg';
};

type SelectedCake = {
  cake: CakeItem;
  quantity: number;
  weight: string;
};

type Addon = {
  addon_name: string;
  addon_price: string;
  quantity: number;
};

type Coupon = {
  id: number;
  coupon_code_name: string;
  coupon_discount: string;
  coupon_type: string;
  coupon_amount: string;
  image_url: string;
  coupon_description: string | null;
  coupon_start_date: string;
  coupon_end_date: string;
  status: string;
};

const Confirmation: React.FC = () => {
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ message: string; isError: boolean } | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [showCoupons, setShowCoupons] = useState<boolean>(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [couponTypes, setCouponTypes] = useState<string[]>([]);
  const [selectedCouponType, setSelectedCouponType] = useState<string>('');

  // Utility function to format coupon type for display
  const formatCouponType = (type: string): string => {
    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Fetch coupon types on component mount
  useEffect(() => {
    const fetchCouponTypes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/coupon-types`);
        if (!response.ok) {
          throw new Error(`Failed to fetch coupon types: ${response.status} ${response.statusText}`);
        }
        const data: string[] = await response.json();
       
        setCouponTypes(data);
        if (data.length > 0) {
          setSelectedCouponType(data[0]);
        }
      } catch (err: any) {
        console.error('Error fetching coupon types:', err);
        setError(`Failed to load coupon types: ${err.message}. Please try again later.`);
      }
    };
    fetchCouponTypes();
  }, []);

  // Fetch coupons when selectedCouponType changes
  useEffect(() => {
    if (!selectedCouponType) return;
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        setError(null);
        setCoupons([]);
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponMessage(null);
        setDiscount(0);

        const response = await fetch(`${API_URL}/api/coupons?coupon_type=${selectedCouponType}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch coupons: ${response.status} ${response.statusText}`);
        }
        const data: Coupon[] = await response.json();
       
        setCoupons(data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching coupons:', err);
        setError(`Unable to load coupons for "${formatCouponType(selectedCouponType)}". The server might be down, or no coupons are available. Please try again later.`);
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [selectedCouponType]);

  const selectedLocation: Location | null = {
    location_name: sessionStorage.getItem('location_name') || 'Not selected',
  };

  const selectedTheater: Theater | null = {
    theater_id: sessionStorage.getItem('selected_theater_id') || 'unknown',
    theater_name: sessionStorage.getItem('theater_name') || 'Not selected',
    theater_cost: sessionStorage.getItem('theater_cost') || '0',
    location_name: sessionStorage.getItem('location_name') || 'Not selected',
    per_persons: sessionStorage.getItem('per_persons') || 'N/A',
    max_persons: sessionStorage.getItem('max_persons') || 'N/A',
    decoration_price: sessionStorage.getItem('decoration_price') || '0',
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
        no_of_names: ['1', '2'].includes(parsedOccasion.no_of_names) ? parsedOccasion.no_of_names : '1',
      };
    } catch (e) {
      console.error('Error parsing saved occasion:', e);
    }
  }

  let selectedCakes: SelectedCake[] = [];
  const savedCakes = sessionStorage.getItem('selected_cakes');
  if (savedCakes) {
    try {
      const cakeEntries = savedCakes.split(', ').map((entry) => {
        const match = entry.match(/^(.+)\s\((\d+)\sx\s([^)]+)\)\s-\s₹([\d.]+)$/);
        if (!match) {
          console.warn(`Could not parse cake entry: ${entry}`);
          return null;
        }

        const [, cakeName, quantityStr, weight, totalPriceStr] = match;
        const quantity = parseInt(quantityStr, 10) || 0;
        const totalPrice = parseFloat(totalPriceStr) || 0;
        const cakePrice = (totalPrice / quantity).toFixed(2);
        const isEggless = sessionStorage.getItem('is_eggless') === 'true';

        return {
          cake: {
            cake_name: cakeName.trim(),
            cake_price: cakePrice,
            weight,
            egg_eggless: isEggless ? 'eggless' : 'egg',
          },
          quantity,
          weight,
        };
      }).filter((entry): entry is SelectedCake => entry !== null);

      selectedCakes = cakeEntries;
    } catch (e) {
      console.error('Error parsing saved cakes:', e);
      selectedCakes = [];
    }
  }

  const isVeg = sessionStorage.getItem('is_eggless') === 'true';

  let selectedAddons: { [key: number]: Addon } = {};
  const savedAddons = sessionStorage.getItem('selected_addons');
  if (savedAddons) {
    try {
      selectedAddons = JSON.parse(savedAddons);
    } catch (e) {
      console.error('Error parsing saved addons:', e);
    }
  }

  const calculatePrice = (basePrice: string, weight: string): number => {
    const base = parseFloat(basePrice) || 0;
    const weightMatch = weight.match(/(\d+(?:\.\d+)?)/);
    const weightValue = weightMatch ? parseFloat(weightMatch[1]) : 500;
    const weightInGrams = weight.toLowerCase().includes('kg') ? weightValue * 1000 : weightValue;
    return base * (weightInGrams / 500);
  };

  const theaterCost = parseFloat(selectedTheater?.theater_cost || '0') || 0;
  const decorationPrice = parseFloat(selectedTheater?.decoration_price || '0') || 0;
  const cakesCost = selectedCakes.reduce((total, { cake, quantity, weight }) => {
    return total + calculatePrice(cake.cake_price, weight) * quantity;
  }, 0);
  const addonsCost = Object.values(selectedAddons).reduce((total, addon) => {
    const price = parseFloat(addon.addon_price) || 0;
    return total + price * addon.quantity;
  }, 0);
  const totalPriceBeforeDiscount = theaterCost + decorationPrice + cakesCost + addonsCost;

  const discountAmount = discount > 0 
    ? (totalPriceBeforeDiscount * discount) / 100 
    : appliedCoupon && coupons.find(c => c.coupon_code_name === appliedCoupon)?.coupon_amount 
      ? parseFloat(coupons.find(c => c.coupon_code_name === appliedCoupon)!.coupon_amount) 
      : 0;
  const finalPrice = totalPriceBeforeDiscount - discountAmount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponMessage({
        message: 'Please enter a coupon code',
        isError: true,
      });
      return;
    }

    const coupon = coupons.find((c) => c.coupon_code_name.toUpperCase() === couponCode.toUpperCase());
    if (coupon) {
      const today = new Date();
      const startDate = new Date(coupon.coupon_start_date);
      const endDate = new Date(coupon.coupon_end_date);
      
     

      if (today >= startDate && today <= endDate) {
        const newDiscount = coupon.coupon_discount && parseFloat(coupon.coupon_discount) > 0 
          ? parseFloat(coupon.coupon_discount) 
          : 0;
        setDiscount(newDiscount);
        setAppliedCoupon(coupon.coupon_code_name);
        setCouponMessage({
          message: `Coupon "${coupon.coupon_code_name}" applied! You saved ${
            newDiscount > 0 ? `${newDiscount}%` : `₹${coupon.coupon_amount}`
          }`,
          isError: false,
        });
        
      } else {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponMessage({
          message: 'Coupon is expired or not yet valid',
          isError: true,
        });
       
      }
    } else {
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponMessage({
        message: 'Invalid coupon code',
        isError: true,
      });
      
    }
  };

  const handleApplyCouponFromList = (coupon: Coupon) => {
    setCouponCode(coupon.coupon_code_name);
    const today = new Date();
    const startDate = new Date(coupon.coupon_start_date);
    const endDate = new Date(coupon.coupon_end_date);
    
   

    if (today >= startDate && today <= endDate) {
      const newDiscount = coupon.coupon_discount && parseFloat(coupon.coupon_discount) > 0 
        ? parseFloat(coupon.coupon_discount) 
        : 0;
      setDiscount(newDiscount);
      setAppliedCoupon(coupon.coupon_code_name);
      setCouponMessage({
        message: `Coupon "${coupon.coupon_code_name}" applied! You saved ${
          newDiscount > 0 ? `${newDiscount}%` : `₹${coupon.coupon_amount}`
        }`,
        isError: false,
      });
      
    } else {
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponMessage({
        message: 'Coupon is expired or not yet valid',
        isError: true,
      });
      
    }
    setShowCoupons(false);
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMessage(null);
    setShowCoupons(false);
    
  };

  const handleProceedToPayment = () => {
    if (termsAccepted) {
      sessionStorage.setItem('final_price', finalPrice.toFixed(2));
      sessionStorage.setItem('applied_coupon', appliedCoupon || 'None');
      sessionStorage.setItem('discount_amount', discountAmount.toFixed(2));
      alert('Proceeding to payment!');
      navigate('/payment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50">
      <section className="relative py-24 md:py-32 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/42/b9/d4/42b9d4744b35452e20dfd1374b9ec0a9.jpg')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-wide animate-fade-in">
            Complete Your Booking
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto animate-slide-up">
            Review your booking details and complete your payment.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate('/select-addons')}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Add-ons
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600">
            <h2 className="text-xl font-bold text-white">Booking and Price Summary</h2>
          </div>
          <div className="p-6 flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-purple-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-gray-900">Location & Theater</h4>
                      <p className="text-gray-600">{selectedLocation?.location_name}</p>
                      <p className="text-gray-600">{selectedTheater?.theater_name}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="text-purple-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-gray-900">Time Slot</h4>
                      <p className="text-gray-600">{selectedTheater?.selected_slot}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start space-x-3">
                    <Gift className="text-purple-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-gray-900">Celebration Type</h4>
                      <p className="text-gray-600">{selectedOccasion?.occasion_name || 'Not selected'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-start space-x-3">
                    <Cake className="text-purple-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-gray-900">Cakes</h4>
                      {/*  ({isVeg ? 'Eggless' : 'Egg-based'}) */}
                      {selectedCakes.length > 0 ? (
                        <ul className="text-gray-600">
                          {selectedCakes.map((item, index) => (
                            <li key={index} className="flex justify-between">
                              <span>
                                {item.cake.cake_name} × {item.quantity} ({item.weight})
                              </span>
                              <span>₹{(calculatePrice(item.cake.cake_price, item.weight) * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">No cakes selected</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start space-x-3">
                    <Gift className="text-purple-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-gray-900">Add-ons</h4>
                      {Object.keys(selectedAddons).length > 0 ? (
                        <ul className="text-gray-600">
                          {Object.values(selectedAddons).map((addon, index) => (
                            <li key={index} className="flex justify-between">
                              <span>{addon.addon_name} × {addon.quantity}</span>
                              <span>₹{(parseFloat(addon.addon_price) * addon.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">No add-ons selected</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Price Summary</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Theater Cost</span>
                  <span className="font-medium">₹{theaterCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Decoration Cost</span>
                  <span className="font-medium">₹{decorationPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cakes Cost</span>
                  <span className="font-medium">₹{cakesCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Add-ons Cost</span>
                  <span className="font-medium">₹{addonsCost.toFixed(2)}</span>
                </div>

                {/* <div className="border-t border-gray-300 pt-4 mt-4 w-[400px]">
                  <h4 className="font-medium text-gray-900 mb-3">Coupons and Offers</h4>
                  <div className="mb-3">
                    <label htmlFor="couponType" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Coupon Type
                    </label>
                    <select
                      id="couponType"
                      value={selectedCouponType}
                      onChange={(e) => setSelectedCouponType(e.target.value)}
                      className=" border border-gray-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={couponTypes.length === 0}
                    >
                      {couponTypes.length === 0 ? (
                        <option value="">No coupon types available</option>
                      ) : (
                        couponTypes.map((type) => (
                          <option key={type} value={type}>
                            {formatCouponType(type)}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  {loading && <p className="text-gray-600">Loading coupons...</p>}
                  {error && <p className="text-red-600">{error}</p>}
                  {!loading && !error && coupons.length === 0 && (
                    <p className="text-gray-600">No coupons available for this type.</p>
                  )}
                  {!loading && !error && coupons.length > 0 && (
                    <>
                      <div className="relative mb-3">
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponMessage(null);
                          }}
                          disabled={!!appliedCoupon}
                          className="  border border-gray-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                        />
                        {!appliedCoupon && (
                          <button 
                            onClick={() => setShowCoupons(!showCoupons)}
                            className="absolute  top-1/2 transform -translate-y-1/2 text-purple-600 "
                          >
                            <Tag size={18} />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        {appliedCoupon ? (
                          <button
                            onClick={handleRemoveCoupon}
                            className="flex items-center bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X size={16} className="mr-1" />
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={handleApplyCoupon}
                            disabled={!couponCode.trim()}
                            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                      
                      {couponMessage && (
                        <div className="flex items-center mb-3 space-x-1">
                          {couponMessage.isError ? (
                            <AlertCircle size={16} className="text-red-600" />
                          ) : (
                            <CheckCircle size={16} className="text-green-600" />
                          )}
                          <p
                            className={`text-sm ${
                              couponMessage.isError ? 'text-red-600' : 'text-green-600'
                            }`}
                          >
                            {couponMessage.message}
                          </p>
                        </div>
                      )}

                      {showCoupons && !appliedCoupon && (
                        <div className="border border-gray-200 rounded-lg bg-white shadow-md mb-4">
                          <div className="p-4 border-b border-gray-200">
                            <h5 className="font-medium text-gray-800">Available Coupons</h5>
                          </div>
                          <div className="p-2 max-h-72 overflow-y-auto">
                            {coupons.map((coupon) => {
                              const startDate = coupon.coupon_start_date ? new Date(coupon.coupon_start_date) : null;
                              const endDate = coupon.coupon_end_date ? new Date(coupon.coupon_end_date) : null;
                              const isValidStartDate = startDate && !isNaN(startDate.getTime());
                              const isValidEndDate = endDate && !isNaN(endDate.getTime());

                              return (
                                <div key={coupon.id} className="p-3 border border-gray-200 rounded-lg mb-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <h6 className="font-bold text-gray-800">{coupon.coupon_code_name}</h6>
                                    <span className="text-green-600 font-medium">
                                      {coupon.coupon_discount && parseFloat(coupon.coupon_discount) > 0 
                                        ? `${coupon.coupon_discount}% off` 
                                        : `₹${coupon.coupon_amount} off`}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{coupon.coupon_description || 'No description available'}</p>
                                  <p className="text-xs text-gray-500 mb-2">
                                    Valid from{' '}
                                    {isValidStartDate ? startDate.toLocaleDateString() : 'N/A'}{' '}
                                    to{' '}
                                    {isValidEndDate ? endDate.toLocaleDateString() : 'N/A'}
                                  </p>
                                  <button
                                    onClick={() => handleApplyCouponFromList(coupon)}
                                    className="text-blue-500 text-sm font-medium hover:text-blue-700"
                                  >
                                    Apply
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div> */}

                <div className="border-t border-gray-300 pt-4 mt-4 w-full max-w-[400px]">
  <h4 className="font-medium text-gray-900 mb-3">Coupons and Offers</h4>
  <div className="mb-3">
    <label htmlFor="couponType" className="block text-sm font-medium text-gray-700 mb-1">
      Select Coupon Type
    </label>
    <select
      id="couponType"
      value={selectedCouponType}
      onChange={(e) => setSelectedCouponType(e.target.value)}
      className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      disabled={couponTypes.length === 0}
    >
      {couponTypes.length === 0 ? (
        <option value="">No coupon types available</option>
      ) : (
        couponTypes.map((type) => (
          <option key={type} value={type}>
            {formatCouponType(type)}
          </option>
        ))
      )}
    </select>
  </div>
  {loading && <p className="text-gray-600">Loading coupons...</p>}
  {error && <p className="text-red-600">{error}</p>}
  {!loading && !error && coupons.length === 0 && (
    <p className="text-gray-600">No coupons available for this type.</p>
  )}
  {!loading && !error && coupons.length > 0 && (
    <>
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value);
            setCouponMessage(null);
          }}
          disabled={!!appliedCoupon}
          className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
        />
        {!appliedCoupon && (
          <button 
            onClick={() => setShowCoupons(!showCoupons)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-700 p-1 rounded-md hover:bg-purple-50 transition-colors"
          >
            <Tag size={18} />
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 mb-3">
        {appliedCoupon ? (
          <button
            onClick={handleRemoveCoupon}
            className="flex items-center bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            <X size={16} className="mr-1" />
            Remove
          </button>
        ) : (
          <button
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim()}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
          >
            Apply
          </button>
        )}
      </div>
      
      {couponMessage && (
        <div className="flex items-center mb-3 space-x-1">
          {couponMessage.isError ? (
            <AlertCircle size={16} className="text-red-600" />
          ) : (
            <CheckCircle size={16} className="text-green-600" />
          )}
          <p
            className={`text-sm ${
              couponMessage.isError ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {couponMessage.message}
          </p>
        </div>
      )}

      {showCoupons && !appliedCoupon && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-md mb-4">
          <div className="p-4 border-b border-gray-200">
            <h5 className="font-medium text-gray-800">Available Coupons</h5>
          </div>
          <div className="p-2 max-h-72 overflow-y-auto">
            {coupons.map((coupon) => {
              const startDate = coupon.coupon_start_date ? new Date(coupon.coupon_start_date) : null;
              const endDate = coupon.coupon_end_date ? new Date(coupon.coupon_end_date) : null;
              const isValidStartDate = startDate && !isNaN(startDate.getTime());
              const isValidEndDate = endDate && !isNaN(endDate.getTime());

              return (
                <div key={coupon.id} className="p-3 border border-gray-200 rounded-lg mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="font-bold text-gray-800">{coupon.coupon_code_name}</h6>
                    <span className="text-green-600 font-medium">
                      {coupon.coupon_discount && parseFloat(coupon.coupon_discount) > 0 
                        ? `${coupon.coupon_discount}% off` 
                        : `₹${coupon.coupon_amount} off`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{coupon.coupon_description || 'No description available'}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    Valid from{' '}
                    {isValidStartDate ? startDate.toLocaleDateString() : 'N/A'}{' '}
                    to{' '}
                    {isValidEndDate ? endDate.toLocaleDateString() : 'N/A'}
                  </p>
                  <button
                    onClick={() => handleApplyCouponFromList(coupon)}
                    className="text-blue-500 text-sm font-medium hover:text-blue-700"
                  >
                    Apply
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  )}
</div>

                <div className="border-t border-gray-300 pt-4 mt-4">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{totalPriceBeforeDiscount.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 mb-2">
                      <span>
                        {discount > 0 
                          ? `Discount (${discount}%)` 
                          : `Discount (${appliedCoupon})`}
                      </span>
                      <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xl text-purple-700 border-t border-gray-200 pt-3">
                    <span>Total Amount</span>
                    <span>₹{finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600">
            <h2 className="text-xl font-bold text-white">Terms & Conditions</h2>
          </div>
          <div className="p-6">
            <div className="h-96 overflow-y-auto mb-6 border border-gray-200 rounded-lg p-4">
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  You are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern CineMates relationship with you in relation to this website and our Services. Do not use CineMates if you do not agree to all of the terms and conditions stated on this page.
                </p>
                
                <div className="space-y-3 text-gray-600">
                  <p>• We do NOT provide any movie/OTT accounts. We will assist to setup using your own OTT accounts/downloaded content.</p>
                  <p>• Smoking and drinking are strictly NOT allowed inside the theatre.</p>
                  <p>• Guests are requested to maintain CLEANLINESS inside the theatre.</p>
                  <p>• Any DAMAGE caused to theatre, including decorative materials, sofas, recliners, floor mats, lights etc will be fined up to Rs.5000.</p>
                  <p>• Party poppers/Snow sprays/Cold Fire/Sparkle candles and any other inflammable items are strictly PROHIBITED inside the theatre. Will be fined Rs.1000.</p>
                  <p>• Any damage to the screen or Projector will be fined Rs.1,00,000.</p>
                  <p>• Must carry AADHAAR CARD. It will be checked during entry. Couples below 18 years age are not allowed to enter the theatre. Under 18 and children will be allowed with adults.</p>
                  <p>• PETS ARE NOT ALLOWED</p>
                  <p>• Outside food is allowed only if approved by us.</p>
                  <p>• Refund will be processed only if the booking is cancelled AT LEAST 72 HOURS BEFORE the booking time.</p>
                  <p>• To cancel your booking, please contact us on WhatsApp (xxxx) with details, so we can make arrangement of your refund.</p>
                  <p>• We will process your refund within 7 business days of receiving your cancellation request.</p>
                  <p>• The duration of the event includes setup and cleanup time. Any additional time required beyond the agreed duration may be subject to additional charges.</p>
                  <p>• Will not be liable for any injury, illness, or loss of property sustained during the event.</p>
                  <p>• Guests must comply with all local laws and regulations, including those related to noise levels.</p>
                  <p className="font-medium text-gray-800 mt-4">
                    <strong>Note:</strong> Company is not responsible for any natural calamities.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700">
                    I have read and agree to the terms and conditions
                  </span>
                </label>
                
                <div className="mt-4 flex items-start space-x-2 text-sm text-gray-500">
                  <Info size={16} className="flex-shrink-0 mt-0.5" />
                  <p>
                    By clicking "Proceed to Payment", you will be redirected to our secure payment gateway to complete your transaction.
                  </p>
                </div>
              </div>

              <div className="w-full lg:w-auto lg:min-w-60">
                <button
                  onClick={handleProceedToPayment}
                  disabled={!termsAccepted}
                  className={`w-full flex items-center justify-center py-4 px-8 rounded-lg ${
                    termsAccepted
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors duration-200 font-medium text-lg`}
                >
                  {termsAccepted && <Check size={20} className="mr-2" />}
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;