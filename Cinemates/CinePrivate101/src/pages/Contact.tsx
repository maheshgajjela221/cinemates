import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, Mail,  Calendar ,
  Gift, CheckCircle, Cake, Star, Sparkles,
  MessageSquare,  ChevronDown, ChevronUp
} from 'lucide-react';
import SectionTitle from '../components/ui/SectionTitle';

// Enquiry types
const enquiryTypes = [
  'Event Booking',
  'General Inquiry',
  'Venue Information',
  'Franchise',
  'Support/Technical'
];

// Form options
const eventTypes = [
  'Birthday Celebration',
  'Bride-to-Be Party',
  'Anniversary Event',
  'Corporate Gathering',
  'Other Special Occasion'
];

const guestCounts = [
  '1-10 guests',
  '11-20 guests',
  '21-30 guests',
  '31-40 guests',
  '41-50 guests',
  '50+ guests'
];

const addOns = [
  { id: 'cake', label: 'Custom Cake', icon: <Cake className="w-4 h-4" /> },
  { id: 'decorations', label: 'Premium Decorations', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'catering', label: 'Full Catering Service', icon: <Gift className="w-4 h-4" /> },
  { id: 'photography', label: 'Professional Photography', icon: <Star className="w-4 h-4" /> }
];

// FAQ data
const faqData = [
  {
    id: 1,
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 4-6 weeks in advance for weekend events and 2-4 weeks for weekday events. Popular dates can book up quickly, especially during peak celebration seasons."
  },
  {
    id: 2,
    question: "What's included in the basic package?",
    answer: "Our basic package includes exclusive use of the theatre space, standard decorations, basic sound system, customizable lighting, and a dedicated event coordinator. Catering and additional services are available as add-ons."
  },
  {
    id: 3,
    question: "Can I bring my own food and drinks?",
    answer: "We offer flexibility with catering options. You can choose from our preferred catering partners or bring your own food for a service fee. For alcoholic beverages, please inquire about our licensing requirements."
  },
  {
    id: 4,
    question: "What is your cancellation policy?",
    answer: "We require a 50% deposit to secure your booking. Cancellations made 30+ days before the event receive a full deposit refund. Cancellations 15-29 days before receive a 50% refund. Cancellations less than 14 days before are non-refundable."
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    enquiryType: '',
    name: '',
    email: '',
    phone: '',
    eventType: '',
    date: '',
    guestCount: '',
    message: '',
    addOns: [] as string[]
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (addon: string) => {
    setFormData(prev => {
      const addOns = [...prev.addOns];
      if (addOns.includes(addon)) {
        return { ...prev, addOns: addOns.filter(a => a !== addon) };
      } else {
        return { ...prev, addOns: [...addOns, addon] };
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormStatus('idle');
        setFormData({
          enquiryType: '',
          name: '',
          email: '',
          phone: '',
          eventType: '',
          date: '',
          guestCount: '',
          message: '',
          addOns: []
        });
      }, 3000);
    }, 1500);
  };

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const isEventBooking = formData.enquiryType === 'Event Booking';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header section */}
      <section className="relative py-32 bg-primary">
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/77/17/d2/7717d2f1e1029573864975e2b029b7ea.jpg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-20"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Get in touch for bookings, inquiries, or any questions about our celebration theatre
          </p>
        </div>
      </section>

      {/* Contact forms and info */}
      <section className="section">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Contact information */}
            <div className="lg:col-span-1">
              <SectionTitle 
                title="Get In Touch"
                subtitle="We're here to help you plan your perfect celebration. Contact us with any questions or to check availability."
              />
              
              <div className="space-y-6 mb-8">
                {/* <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-primary mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold mb-1">Corporate Office</h3>
                    <address className="not-italic text-gray-600">
                      123 Celebration Avenue<br />
                      Entertainment District<br />
                      Los Angeles, CA 90210
                    </address>
                  </div>
                </div> */}
                
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-primary mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold mb-1">Phone</h3>
                    <p className="text-gray-600">+91 81210310177</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-primary mt-1 mr-4" />
                  <div>
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-gray-600">enquiry@cinemates.in</p>
                  </div>
                </div>
                
                
              </div>
              
              {/* Map or image */}
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.pexels.com/photos/2923595/pexels-photo-2923595.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                  alt="Our venue"
                  className="w-full h-52 object-cover"
                />
              </div>
            </div>
            
            {/* Contact form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8">
                <h2 className="font-display text-2xl font-bold mb-6">
                  {isEventBooking ? 'Book Your Event' : 'Contact Us'}
                </h2>
                
                {formStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-success/10 p-6 rounded-lg text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                    <p className="text-gray-700">
                      {isEventBooking 
                        ? "Your booking request has been submitted successfully. We'll contact you within 24 hours to confirm details and availability."
                        : "Your inquiry has been submitted successfully. We'll get back to you as soon as possible."
                      }
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Enquiry Type Dropdown - Always First */}
                    <div className="mb-6">
                      <label htmlFor="enquiryType" className="block text-sm font-medium text-gray-700 mb-1">
                        Type of Enquiry *
                      </label>
                      <select
                        id="enquiryType"
                        name="enquiryType"
                        value={formData.enquiryType}
                        onChange={handleInputChange}
                        required
                        className="input"
                      >
                        <option value="">Select Enquiry Type</option>
                        {enquiryTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Basic Contact Information - Always Shown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="input"
                          placeholder="Full Name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="input"
                          placeholder="your@email.com"
                        />
                      </div>
                      
                      <div className={isEventBooking ? '' : 'md:col-span-2'}>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number {isEventBooking ? '*' : '(Optional)'}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required={isEventBooking}
                          className="input"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      
                      {/* Event-specific fields - Only shown for Event Booking */}
                      {isEventBooking && (
                        <>
                          <div>
                            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                              Event Type *
                            </label>
                            <select
                              id="eventType"
                              name="eventType"
                              value={formData.eventType}
                              onChange={handleInputChange}
                              required={isEventBooking}
                              className="input"
                            >
                              <option value="">Select Event Type</option>
                              {eventTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                              Preferred Date *
                            </label>
                            <input
                              type="date"
                              id="date"
                              name="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              required={isEventBooking}
                              className="input"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
                              Number of Guests *
                            </label>
                            <select
                              id="guestCount"
                              name="guestCount"
                              value={formData.guestCount}
                              onChange={handleInputChange}
                              required={isEventBooking}
                              className="input"
                            >
                              <option value="">Select Guest Count</option>
                              {guestCounts.map(count => (
                                <option key={count} value={count}>{count}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Additional Services - Only shown for Event Booking */}
                    {isEventBooking && (
                      <div className="mb-6">
                        <label htmlFor="addons" className="block text-sm font-medium text-gray-700 mb-3">
                          Additional Services (Optional)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {addOns.map(addon => (
                            <div key={addon.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={addon.id}
                                checked={formData.addOns.includes(addon.id)}
                                onChange={() => handleCheckboxChange(addon.id)}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                              <label htmlFor={addon.id} className="ml-2 flex items-center">
                                <span className="mr-2 text-primary">{addon.icon}</span>
                                {addon.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Message field - Always shown but with dynamic label */}
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        {isEventBooking ? 'Additional Information' : 'Your Message *'}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required={!isEventBooking}
                        rows={4}
                        className="input"
                        placeholder={isEventBooking 
                          ? "Tell us more about your event, special requests, or questions..."
                          : "Please describe your inquiry in detail..."
                        }
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className={`btn-primary w-[200px] flex items-center justify-center  ${
                        formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          {isEventBooking ? (
                            <>
                              <Calendar className="w-5 h-5 mr-2" />
                              Book Your Celebration
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section with Accordion */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <SectionTitle 
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about booking our private theatre for your celebrations"
            center
          />
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <motion.div 
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card overflow-hidden"
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <h3 className="text-lg font-bold pr-4">{faq.question}</h3>
                  {openFaq === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === faq.id ? 'auto' : 0,
                    opacity: openFaq === faq.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;