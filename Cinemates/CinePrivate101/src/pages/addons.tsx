import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';
import SectionTitle from '../components/ui/SectionTitle';
import { Gift, Sparkles, Cake, Star, } from 'lucide-react';

interface Addon {
  id: number;
  category_name: string;
  addon_name: string;
  addon_image_url: string;
  addon_price: string;
}

// Category to icon mapping
const categoryIcons: Record<string, JSX.Element> = {
  'Cake': <Cake className="w-5 h-5" />,
  'Decoration': <Sparkles className="w-5 h-5" />,
  'Gift': <Gift className="w-5 h-5" />,
  'Photography': <Star className="w-5 h-5" />,
  // Add more mappings as needed
};

// Default icon for unknown categories
const defaultIcon = <Gift className="w-5 h-5" />;

const AddonsList: React.FC = () => {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/addons`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch addons');
        }
        return response.json();
      })
      .then(data => {
        setAddons(data);
        
        // Extract unique categories with proper typing
        const uniqueCategories: string[] = Array.from(
          new Set(data.map((addon: Addon) => addon.category_name))
        ) as string[];
        setCategories(['All', ...uniqueCategories]);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter addons by selected category
  const filteredAddons = selectedCategory === 'All' 
    ? addons 
    : addons.filter(addon => addon.category_name === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header section */}
      <section className="relative py-32 bg-primary">
        <div className="absolute inset-0 bg-[url('https://cdn.pixabay.com/photo/2017/09/01/03/26/decorating-2702974_1280.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Enhance Your Celebration
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Browse our premium collection of add-ons to make your event truly special
          </p>
        </div>
      </section>

      {/* Addons section */}
      <section className="section">
        <div className="container-custom">
          <SectionTitle
            title="Available Add-ons"
            subtitle="Select from our curated collection of enhancement options for your celebration"
            center
          />

          {/* Category filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Loading and error states */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading add-ons...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-red-600">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Addons grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAddons.length > 0 ? (
                filteredAddons.map((addon, index) => (
                  <motion.div
                    key={addon.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index % 3 * 0.1 }}
                    className="glass-card overflow-hidden rounded-xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={addon.addon_image_url}
                        alt={addon.addon_name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-primary text-white py-1 px-3 rounded-full text-sm font-medium">
                        ₹{addon.addon_price}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <span className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                          {categoryIcons[addon.category_name] || defaultIcon}
                        </span>
                        <span className="text-sm text-gray-500">{addon.category_name}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-3">{addon.addon_name}</h3>
                      
                    
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No add-ons found in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="glass-card p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-4">Need Custom Add-ons?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Don't see what you're looking for? Contact our event specialists to discuss 
              custom decorations, entertainment options, or special requests for your celebration.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center"
            >
              <Gift className="w-5 h-5 mr-2" />
              Contact for Custom Options
            </motion.a>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default AddonsList;