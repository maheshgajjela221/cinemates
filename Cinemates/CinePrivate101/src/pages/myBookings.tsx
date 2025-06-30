import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';


// Define a Payment type for the API response
interface Payment {
  cust_id: string;
  theater_id: string;
  loc_id: string;
  booking_name: string;
  payment_id: string;
  payment_amount: number;
  payment_date: string;
  payment_flag: string;
  coupon_discount: string | null;
  phone_no1: string;
  customer_name: string;
}

const MyBookings: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError(null);
    setPayments([]);

    try {
      // Check if API_URL is defined
      if (!API_URL) {
        throw new Error('API URL is not defined');
      }
      
     
      const response = await fetch(`${API_URL}/api/payment_details?phone_no1=${encodeURIComponent(phoneNumber)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('No payment records found for this phone number');
          setPayments([]);
          setLoading(false);
          return;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter out invalid payment records
      const validPayments = data.filter((payment: Payment) => {
        // Check for valid payment amount
        if (!payment.payment_amount || payment.payment_amount <= 0) {
          return false;
        }
        
        // Check for valid payment date
        if (!payment.payment_date || !isValidDate(payment.payment_date)) {
          return false;
        }
        
        // Check for required fields
        if (!payment.payment_id || !payment.booking_name) {
          return false;
        }
        
        return true;
      });
      
      setPayments(validPayments);

      if (validPayments.length === 0) {
        setError('No valid payment records found for this phone number');
      }
    } catch (err:any) {
      console.error('Fetch error:', err);
      setError(`Connection error: ${err.message || 'Could not connect to payment service'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to check if a date string is valid
  const isValidDate = (dateString: string) => {
    const timestamp = Date.parse(dateString);
    if (isNaN(timestamp)) return false;
    
    // Check if date is not the Unix epoch (1970-01-01)
    const date = new Date(timestamp);
    if (date.getFullYear() === 1970 && date.getMonth() === 0 && date.getDate() === 1) {
      return false;
    }
    
    return true;
  };

  // Format date for better readability
  const formatDate = (dateString: string) => {
    try {
      if (!isValidDate(dateString)) {
        return "Invalid Date";
      }
      
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString; // Return original string if formatting fails
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    try {
      if (!amount || isNaN(amount) || amount <= 0) {
        return "₹0";
      }
      
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount);
    } catch (error) {
      console.error('Currency formatting error:', error);
      return `₹${amount}`; 
    }
  };

 

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <section className="relative py-32 bg-primary">
          <div className="absolute inset-0 bg-[url('https://cdn.pixabay.com/photo/2024/02/17/11/01/immigration-8579109_1280.jpg')] bg-cover bg-center opacity-20"></div>
     
          <div className="container-custom relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            My Bookings
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            View your Booking records
          </p>
        </div>
      </section>

      {/* Phone Input */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="glass-card p-8 md:p-12 max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
              Find Your Booking Records
            </h2>
            <form onSubmit={handlePhoneSubmit} className="flex flex-col items-center gap-4">
              <div className="w-full max-w-md">
                <label htmlFor="phoneNumber" className="block text-left text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Find My Bookings'}
              </motion.button>
            </form>

            {/* Loading / Error / Results */}
            {loading && (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {payments.length > 0 && (
              <div className="mt-8 text-left w-full">
                <h3 className="text-xl font-semibold mb-4">Your Booking Records:</h3>
                <div className="grid gap-6">
                  {payments.map((payment, index) => (
                    <motion.div
                      key={payment.payment_id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 bg-white border rounded-lg shadow-sm hover:shadow"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-semibold mb-2">Booking: {payment.booking_name}</h4>
                          <p className="text-gray-600"><span className="font-medium">Customer:</span> {payment.customer_name}</p>
                          <p className="text-gray-600"><span className="font-medium">Payment ID:</span> {payment.payment_id}</p>
                          <p className="text-gray-600"><span className="font-medium">Theater:</span> {payment.theater_id}</p>
                          <p className="text-gray-600"><span className="font-medium">Location:</span> {payment.loc_id}</p>
                        </div>
                        <div>
                          <p className="text-gray-600"><span className="font-medium">Amount:</span> {formatCurrency(payment.payment_amount)}</p>
                          <p className="text-gray-600"><span className="font-medium">Payment Date:</span> {formatDate(payment.payment_date)}</p>
                          
                          {payment.coupon_discount && (
                            <p className="text-gray-600"><span className="font-medium">Discount:</span> {payment.coupon_discount}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Ready for Another Celebration?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore our event packages and add more moments of joy to your calendar.
              Book your next celebration today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="/events"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Browse Event 
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn bg-white text-primary border-primary hover:bg-gray-50"
              >
                Contact Us
              </motion.a>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default MyBookings;