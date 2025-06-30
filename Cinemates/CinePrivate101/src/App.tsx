import  { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Cursor from './components/ui/Cursor';
import ScrollToTop from './components/ui/ScrollToTop';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Locations from './pages/Locations';
import BookNowForm from './pages/BookNowForm';
import Theaters from './pages/theaters';
import Occasions from './pages/Occasions';
import SelectCakes from './pages/SelectCakes';
import SelectAddons from './pages/SelectAddons';
import MyBookings from './pages/myBookings';
import RefundPolicy from './pages/refundPolicy';
import AddonsList from './pages/addons';
import Confirmation from './pages/confirmation';
import Menu from './pages/Menu';
import Payment from './pages/Payment';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-primary flex items-center justify-center z-50">
        <div className="text-white text-center">
          <div className="mb-6 animate-pulse-slow">
            <h1 className="font-display text-4xl md:text-6xl">
              Celebrations
              <span className="block mt-2 text-accent">Private Theatre</span>
            </h1>
          </div>
          <div className="flex justify-center">
            <div className="w-16 h-1 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Cursor />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/book-now" element={<BookNowForm />} />
          <Route path="/theaters" element={<Theaters />} />
          <Route path="/occasions" element={<Occasions />} />
          <Route path="/select-cakes" element={<SelectCakes />} />
          <Route path="/select-addons" element={<SelectAddons />} />
         <Route path="/mybookings" element={<MyBookings />} />
          <Route path="/refundpolicy" element={<RefundPolicy />} />
          <Route path="/addons" element={<AddonsList />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/menu" element={<Menu/>} />
          <Route path="/payment" element={<Payment/>} />




          {/* Add more routes as needed */}
        </Routes>
      </AnimatePresence>
      <ScrollToTop />
      <Footer />
    </div>
  );
}

export default App;