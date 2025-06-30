import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

interface MenuItem {
  food_id: string;
  food_item_name: string;
  food_item_url: string | null;
  create_date: string;
  food_price: string | null;
  tag_line_1: string | null;
  tag_line_2: string | null;
  tag_line_3: string | null;
}

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/food-items`);
        setMenuItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items. Please try again later.');
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <section className="relative py-24 bg-gradient-to-r from-indigo-900 to-purple-900">
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
            Theatre Menu
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Explore our delicious food and beverage options to enhance your theatre experience.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          {/* <div className="mb-8">
            <Link
              to="/"
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
              Back to Home
            </Link>
          </div> */}

          {/* Menu Items */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-2 text-gray-600">Loading menu items...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No menu items available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div
                  key={item.food_id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <img
                    src={item.food_item_url || 'https://via.placeholder.com/500x300?text=No+Image'}
                    alt={item.food_item_name}
                    className="w-full h-52 object-cover rounded-xl mb-4 transition duration-200 hover:opacity-90"
                    loading="lazy"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{item.food_item_name}</h3>
                  <p className="text-purple-700 font-medium mb-2">
                    {item.food_price ? `₹${item.food_price}` : 'Price not available'}
                  </p>
                  {item.tag_line_1 && <p className="text-gray-500 text-sm mb-1">{item.tag_line_1}</p>}
                  {item.tag_line_2 && <p className="text-gray-500 text-sm mb-1">{item.tag_line_2}</p>}
                  {item.tag_line_3 && <p className="text-gray-500 text-sm mb-1">{item.tag_line_3}</p>}

                  {/* Optional Button */}
                  {/* <button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 mt-4 rounded-lg transition-all"
                    onClick={() => alert(`Added ${item.food_item_name} to your cart!`)}
                  >
                    Add to Cart
                  </button> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
