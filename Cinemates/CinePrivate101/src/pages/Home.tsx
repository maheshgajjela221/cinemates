import React from 'react';
import { motion } from 'framer-motion';

// Components
import Hero from '../components/home/Hero';
import FeaturedEvents from '../components/home/FeaturedEvents';
import Features from '../components/home/Features';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <FeaturedEvents />
      <Features />
      <Testimonials />
      <CTA />
    </motion.div>
  );
};

export default Home;