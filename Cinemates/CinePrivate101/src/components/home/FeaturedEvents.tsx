
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gift, Heart, Cake, Users } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';

const events = [
  {
    id: 1,
    title: 'Birthday Celebrations',
    description: 'Make your birthday extraordinary with a private theatre experience, custom themes, and VIP treatment.',
    icon: <Cake className="w-10 h-10 text-primary" />,
    image: 'https://i.pinimg.com/736x/33/fb/3a/33fb3a348a77bfb030926ed612495cb8.jpg',
    link: '/events',
  },
  {
    id: 2,
    title: 'Bride-to-Be Parties',
    description: 'Celebrate the bride with an elegant party featuring custom decorations, champagne, and memorable moments.',
    icon: <Heart className="w-10 h-10 text-primary" />,
    image: 'https://i.pinimg.com/736x/e5/c1/48/e5c148df7c72667c6b6c03b1cc8f850b.jpg',
    link: '/events',
  },
  {
    id: 3,
    title: 'Anniversary Events',
    description: 'Commemorate your special milestone with a romantic theatre setting and personalized touches.',
    icon: <Gift className="w-10 h-10 text-primary" />,
    image: 'https://i.pinimg.com/736x/3c/ca/dc/3ccadcf1ee61302f4cd92c0562339d3b.jpg',
    link: '/events',
  },
  {
    id: 4,
    title: 'Special Gatherings',
    description: 'From reunions to celebrations, create unforgettable moments in our exclusive space.',
    icon: <Users className="w-10 h-10 text-primary" />,
    image: 'https://cdn.pixabay.com/photo/2020/06/07/13/33/fireworks-5270439_1280.jpg',
    link: '/events',
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6 } }
};

const FeaturedEvents = () => {
  return (
    <section className="section bg-gray-50 overflow-hidden">
      <div className="container-custom">
        <SectionTitle 
          title="Celebrate Your Special Moments"
          subtitle="Discover the perfect setting for all your important celebrations and create memories that last a lifetime"
          center
        />
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {events.map((event) => (
            <motion.div 
              key={event.id} 
              variants={item}
              className="event-card"
            >
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
          <Link to="/events" className="btn-primary">
            View All Celebrations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;