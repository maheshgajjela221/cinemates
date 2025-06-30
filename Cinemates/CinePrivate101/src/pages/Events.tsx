import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Baby, Briefcase, GraduationCap, Gift, Cake, Heart, Users } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Mom-to-Be',
    description: 'Celebrate the journey to motherhood with heartfelt cards and a cozy theatre experience.',
    icon: <Baby className="w-10 h-10 text-primary" />,
    image: 'https://images.pexels.com/photos/6149306/pexels-photo-6149306.jpeg?auto=compress&cs=tinysrgb&w=1200',
   
  },
  {
    id: 2,
    title: 'Farewell',
    description: 'Bid a memorable goodbye with a personalized farewell party in an exclusive setting.',
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    image: 'https://images.pexels.com/photos/8815912/pexels-photo-8815912.jpeg?auto=compress&cs=tinysrgb&w=1200',
   
  },
  {
    id: 3,
    title: 'Graduation',
    description: 'Mark your academic milestone with a grand celebration surrounded by friends and family.',
    icon: <GraduationCap className="w-10 h-10 text-primary" />,
    image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1200',
   
  },
  {
    id: 4,
    title: 'Baby Shower',
    description: 'Welcome the little one with a charming baby shower filled with joy and love.',
    icon: <Gift className="w-10 h-10 text-primary" />,
    image: 'https://images.pexels.com/photos/3593434/pexels-photo-3593434.jpeg?auto=compress&cs=tinysrgb&w=1200',
   
  },
  {
    id: 5,
    title: 'Birthday Celebrations',
    description: 'Make your birthday extraordinary with a private theatre experience, custom themes, and VIP treatment.',
    icon: <Cake className="w-10 h-10 text-primary" />,
    image: 'https://i.pinimg.com/736x/33/fb/3a/33fb3a348a77bfb030926ed612495cb8.jpg',
   
  },
  {
    id: 6,
    title: 'Bride-to-Be Parties',
    description: 'Celebrate the bride with an elegant party featuring custom decorations, champagne, and memorable moments.',
    icon: <Heart className="w-10 h-10 text-primary" />,
    image: 'https://i.pinimg.com/736x/e5/c1/48/e5c148df7c72667c6b6c03b1cc8f850b.jpg',
   
  },
  {
    id: 7,
    title: 'Anniversary Events',
    description: 'Commemorate your special milestone with a romantic theatre setting and personalized touches.',
    icon: <Gift className="w-10 h-10 text-primary" />,
    image: 'https://i.pinimg.com/736x/3c/ca/dc/3ccadcf1ee61302f4cd92c0562339d3b.jpg',
   
  },
  {
    id: 8,
    title: 'Special Gatherings',
    description: 'From reunions to celebrations, create unforgettable moments in our exclusive space.',
    icon: <Users className="w-10 h-10 text-primary" />,
    image: 'https://cdn.pixabay.com/photo/2020/06/07/13/33/fireworks-5270439_1280.jpg',
   
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

const FeaturedEvents = () => {
  return (
    <section className="section bg-gray-50 overflow-hidden mt-0 pt-0">
      {/* Header Section */}
      <div className="relative w-full min-h-[150px] md:min-h-[200px]">
        <div className="absolute inset-0 bg-purple-700">
          <img
            src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Background"
            className="w-full h-full object-cover object-center opacity-20"
            loading="lazy"
          />
        </div>
        <section className="relative py-10 md:py-14">
          <div className="container-custom relative z-10 text-center px-4 md:px-0 mt-10  py-6 rounded-lg">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
              Book Your Celebration
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Contact us to check availability and start planning your perfect event
            </p>
          </div>
        </section>
      </div>

      {/* Event Cards and Button */}
      <div className="container-custom">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10"
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={item} className="event-card">
              <div className="relative h-60 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="mb-4">{event.icon}</div>
                <h3 className="text-xl font-display font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
               
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link to="/book-now" className="btn-primary">
            Book Your Celebrations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;