import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  subtitle, 
  center = false,
  light = false
}) => {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''}`}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className={`section-title ${light ? 'text-white' : ''}`}
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className={`section-subtitle ${light ? 'text-white/80' : ''} ${center ? 'mx-auto text-center' : ''}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionTitle;