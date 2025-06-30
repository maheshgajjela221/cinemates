import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/1487029390/photo/arch-with-bears-on-background-balloons-photo-wall-decoration-space-or-place-with-beige-brown.jpg?s=612x612&w=0&k=20&c=UGYT1zK2ltzXpgYRF7QIyV2UCwGJZCVxAfv-ParSIJo=')] bg-cover bg-fixed bg-center">
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Calendar className="w-16 h-16 mx-auto mb-6 text-accent" />
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Create Unforgettable Memories?
            </h2>
            
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Book your private theatre celebration today and give your special occasion 
              the magical atmosphere it deserves.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/book-now" 
                className="btn bg-accent text-black transition-colors"
              >
                Book Your Celebration
                {/* <ChevronRight className="w-5 h-5 ml-2" /> */}
              </Link>
              <Link 
                to="/events" 
                className="btn border-2 border-white text-white hover:bg-white hover:text-black transition-colors"
              >
                Explore Our Events
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;