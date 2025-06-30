import React, { useState } from 'react';
import axios from 'axios';
import { Phone, Mail, User, Users } from 'lucide-react';
import BookingSummary from './summaryCrad';
import { API_URL } from '../config';

type FormData = {
  bookingName: string;
  email: string;
  phoneNo1: string;
  alternateNo?: string;
  numberOfPersons: string;
  decorationNeeded: boolean;
};

type FormErrors = {
  email?: string;
  phoneNo1?: string;
};

const BookNowForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    bookingName: '',
    email: '',
    phoneNo1: '',
    alternateNo: '',
    numberOfPersons: '',
    decorationNeeded: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors on change
    setFormErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      decorationNeeded: e.target.value === 'Yes',
    }));
  };

  const validate = () => {
    const errors: FormErrors = {};
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(formData.phoneNo1)) {
      errors.phoneNo1 = 'Phone number must be 10 digits.';
    }

    if (!emailRegex.test(formData.email)) {
      errors.email = 'Enter a valid email address.';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleProceed = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      booking_name: formData.bookingName,
      email: formData.email,
      phone_no1: formData.phoneNo1,
      alternate_no: formData.alternateNo,
      number_of_persons: formData.numberOfPersons,
      decoration_needed: formData.decorationNeeded ? 'Y' : 'N',
    };

    try {
      const response = await axios.post(`${API_URL}/api/book-now`, payload);

      if (response.status === 200 && response.data.customerId) {
        sessionStorage.setItem('cust_id', response.data.customerId);
        sessionStorage.setItem('booking_details', JSON.stringify(formData));
        window.location.href = '/locations';
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <section className="relative py-20 md:py-32 bg-primary">
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/13/a4/f2/13a4f2e19e4feb2a61be48df0c602800.jpg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-20"></div>
        <div className="container-custom relative z-10 text-center px-4 md:px-0">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
            Book Your Celebration
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Contact us to check availability and start planning your perfect event
          </p>
        </div>
      </section>

      {/* Form and Summary Section */}
      <div className="container-custom py-12 md:py-24 bg-white px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
          {/* Form Section */}
          <div className="w-full max-w-2xl mx-auto border border-black rounded-xl bg-white p-6 shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-black pb-2">
              Booking Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Booking Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Booking Name *</label>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <input
                    type="text"
                    name="bookingName"
                    value={formData.bookingName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <input
                    type="tel"
                    name="phoneNo1"
                    value={formData.phoneNo1}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    className={`w-full px-3 py-2 text-sm border ${
                      formErrors.phoneNo1 ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-primary focus:outline-none`}
                    placeholder="Enter 10-digit number"
                  />
                </div>
                {formErrors.phoneNo1 && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.phoneNo1}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Id *</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 text-sm border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-primary focus:outline-none`}
                    placeholder="youremail@domain.com"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Number of Persons */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Persons *</label>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <input
                    type="number"
                    name="numberOfPersons"
                    value={formData.numberOfPersons}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="How many people?"
                  />
                </div>
              </div>

              {/* Decoration Needed */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Do you want decoration? *</label>
                <select
                  name="decorationNeeded"
                  value={formData.decorationNeeded ? 'Yes' : 'No'}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summary Card */}
         <BookingSummary
  selectedLocation={null}
  selectedTheater={null}
  selectedOccasion={null}
  onProceed={handleProceed}
  isProceedDisabled={
    isSubmitting ||
    !formData.bookingName ||
    !formData.email ||
    !formData.phoneNo1 ||
    !formData.numberOfPersons
  }
/>
        </div>
      </div>
    </div>
  );
};

export default BookNowForm;
