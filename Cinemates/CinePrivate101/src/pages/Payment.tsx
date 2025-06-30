import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

// Mock API_URL for demo - replace with your actual API URL


type OrderResponse = {
  order_id: string;
  amount: number;
  currency: string;
  status?: string;
};

const Payment: React.FC = () => {
  // Mock navigate function for demo - replace with useNavigate() from react-router-dom
  const navigate = (path: string) => {
 
    // In real app: useNavigate()(path);
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrder = async () => {
    try {
      const finalPrice = sessionStorage.getItem('final_price') || '0';
      const amount = Math.round(parseFloat(finalPrice) * 100);

      // Validate amount
      if (amount <= 0) {
        throw new Error('Invalid amount. Please check your booking details.');
      }


      const response = await fetch(`${API_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const data = await response.json();
     

      if (!response.ok) {
        throw new Error(data.error || `Failed to create order: ${response.status} ${response.statusText}`);
      }

      return data;
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(`Failed to initiate payment: ${err.message}. Please try again later.`);
      setLoading(false);
      return null;
    }
  };

  const initiatePayment = async () => {
    // Check if required data exists
    const finalPrice = sessionStorage.getItem('final_price');
    const custId = sessionStorage.getItem('cust_id');
    const theaterId = sessionStorage.getItem('selected_theater_id');
    const locId = sessionStorage.getItem('selected_loc_id');
    const bookingName = sessionStorage.getItem('booking_nickname');
    const selectedDate = sessionStorage.getItem('selected_date');
    const selectedSlot = sessionStorage.getItem('selected_slot');

    if (!finalPrice || !custId || !theaterId || !locId || !bookingName || !selectedDate || !selectedSlot) {
      setError('Missing booking details. Please go back and complete your booking.');
      setLoading(false);
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Failed to load Razorpay SDK. Please check your internet connection and try again.');
      setLoading(false);
      return;
    }

    const order = await createOrder();
    if (!order) return;



    const options = {
      key: 'rzp_live_WONtbIG5GVVkfH', // Use test key for development
      amount: order.amount,
      currency: order.currency,
      name: 'CineMates',
      description: 'Theater Booking Payment',
      image: 'https://your-logo-url.com/logo.png',
      order_id: order.order_id,
      handler: async (response: any) => {
        try {
        
          
          const bookingData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            cust_id: custId,
            theater_id: theaterId,
            loc_id: locId,
            booking_name: bookingName,
            booking_dates: selectedDate,
            booking_slot: selectedSlot,
          };
          
       

          const verifyResponse = await fetch(`${API_URL}/api/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
          });

          const verifyResult = await verifyResponse.json();
        

          if (!verifyResponse.ok) {
            throw new Error(`Verification failed: ${verifyResult.error || 'Unknown error'}`);
          }

          if (verifyResult.status === 'success') {
            setPaymentStatus('Payment successful! Your booking is confirmed.');
            
            // Clear session storage
            sessionStorage.removeItem('final_price');
            sessionStorage.removeItem('applied_coupon');
            sessionStorage.removeItem('discount_amount');
            sessionStorage.removeItem('cust_id');
            sessionStorage.removeItem('selected_theater_id');
            sessionStorage.removeItem('selected_loc_id');
            sessionStorage.removeItem('booking_nickname');
            sessionStorage.removeItem('selected_date');
            sessionStorage.removeItem('selected_slot');
            
            setTimeout(() => navigate('/booking-confirmation'), 2000);
          } else {
            setError(`Payment verification failed: ${verifyResult.error || 'Unknown error'}`);
          }
        } catch (err: any) {
          console.error('Client-side error:', err.message);
          setError(`Payment verification failed: ${err.message}. Please contact support.`);
        }
        setLoading(false);
      },
      prefill: {
        name: bookingName || 'Guest',
        email: JSON.parse(sessionStorage.getItem('booking_details') || '{}')?.email || '',
        contact: sessionStorage.getItem('customer_contact') || '',
      },
      notes: {
        booking_id: sessionStorage.getItem('booking_id') || 'N/A',
      },
      theme: {
        color: '#6B46C1',
      },
      modal: {
        ondismiss: () => {
          setError('Payment was cancelled. Please try again.');
          setLoading(false);
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    initiatePayment();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50">
      <section className="relative py-24 md:py-32 bg-gradient-to-r from-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/42/b9/d4/42b9d4744b35452e20dfd1374b9ec0a9.jpg')] bg-cover bg-center opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-wide animate-fade-in">
            Payment Processing
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto animate-slide-up">
            Complete your payment securely with Razorpay.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate('/confirmation')}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Confirmation
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6">
          {loading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-gray-600 text-lg">Initiating payment, please wait...</p>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
          {paymentStatus && (
            <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
              <CheckCircle size={20} />
              <p>{paymentStatus}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;