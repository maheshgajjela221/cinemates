import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, Award, Utensils, Music, Film } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';

const features = [
  {
    id: 1,
    icon: <Film className="w-6 h-6" />,
    title: 'Private Theatre',
    description: 'Exclusive access to our stunning theatre venue with premium seating for your guests',
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 2,
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Custom Decorations',
    description: 'Personalized decorations tailored to your event theme and preferences',
    color: 'from-pink-400 to-rose-500'
  },
  {
    id: 3,
    icon: <Utensils className="w-6 h-6" />,
    title: 'Catering Options',
    description: 'Gourmet food and beverage packages to complement your celebration',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 4,
    icon: <Music className="w-6 h-6" />,
    title: 'Entertainment',
    description: 'Choose from various entertainment options to enhance your special occasion',
    color: 'from-purple-400 to-violet-500'
  },
  {
    id: 5,
    icon: <Star className="w-6 h-6" />,
    title: 'VIP Service',
    description: 'Dedicated event coordinator and staff to ensure a seamless experience',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 6,
    icon: <Award className="w-6 h-6" />,
    title: 'Custom Add-ons',
    description: 'Additional services from photographers to custom cakes and special surprises',
    color: 'from-red-400 to-rose-500'
  }
];

// Create a unique animation based on card index
const getAnimationVariant = (index:any) => {
  // Different entry animations based on position
  const animations = [
    // Left column animations
    { hidden: { x: -100, y: 0, opacity: 0, rotateY: -25 }, 
      visible: { x: 0, y: 0, opacity: 1, rotateY: 0 } },
    // Middle column animations
    { hidden: { x: 0, y: 100, opacity: 0, scale: 0.8 }, 
      visible: { x: 0, y: 0, opacity: 1, scale: 1 } },
    // Right column animations  
    { hidden: { x: 100, y: 0, opacity: 0, rotateY: 25 }, 
      visible: { x: 0, y: 0, opacity: 1, rotateY: 0 } }
  ];
  
  // Determine which animation to use based on column position
  const columnPosition = index % 3;
  return animations[columnPosition];
};

// Container stagger animation
const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const Features = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  return (
    <section className="section relative overflow-hidden py-16">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container-custom relative z-10">
        <SectionTitle 
          title="What We Offer"
          subtitle="Our exclusive venue provides everything you need for an unforgettable celebration experience"
          center
        />
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            // Get unique animation for this card based on its position
            const cardAnimation = getAnimationVariant(index);
            
            return (
            <motion.div 
              key={feature.id}
              custom={index}
              variants={cardAnimation}
              transition={{ 
                type: "spring",
                damping: 15,
                stiffness: 80,
                duration: 0.8
              }}
              whileHover={{ 
                scale: 1.05,
                rotate: 0,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredCard(feature.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="glass-card relative p-6 rounded-lg transition-all duration-300 overflow-hidden"
            >
              {/* Gradient background that appears on hover */}
              <motion.div 
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0`}
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredCard === feature.id ? 0.15 : 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Icon with pulse animation */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  delay: 0.4 + index * 0.1,
                  duration: 0.6
                }}
                className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4"
              >
                <motion.div
                  animate={hoveredCard === feature.id ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: hoveredCard === feature.id ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                >
                  {feature.icon}
                </motion.div>
              </motion.div>
              
              {/* Title with slide animation */}
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                className="relative z-10 text-xl font-display font-bold mb-3"
              >
                {feature.title}
              </motion.h3>
              
              {/* Description with fade animation */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                className="relative z-10 text-gray-600"
              >
                {feature.description}
              </motion.p>
              
              {/* Decorative corner accent */}
              <motion.div 
                className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${feature.color} opacity-10 rounded-bl-full`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
              />
            </motion.div>
          )})}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;