import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
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
        <div className="absolute inset-0 bg-[url('https://cdn.pixabay.com/photo/2016/05/14/22/22/paper-1392749_1280.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            How we collect, use, and protect your information
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto space-y-8 text-gray-700">
            <p>
              CineMates, including subsidiaries and affiliates ("Website" or "Website Owner" or "we" or "us" or "our") is committed to protecting the privacy of our users and visitors (referred to as "you" or "your" hereinafter). This Privacy Policy outlines the types of personal information we collect, how it is used, and the choices you have regarding your information. By accessing or using our website, you agree to the terms of this Privacy Policy.
            </p>

            <h3 className="text-xl font-semibold">Information We Collect</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Information:</strong> We may collect your name, email, phone number, and billing details during booking.</li>
              <li><strong>Usage Information:</strong> We may track interactions like pages visited, time spent, and links clicked.</li>
            </ul>

            <h3 className="text-xl font-semibold">Use of Information</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and fulfill your bookings.</li>
              <li>Communicate regarding your bookings or inquiries.</li>
              <li>Send promotional updates and service offers.</li>
              <li>Analyze trends and enhance our website and services.</li>
              <li>Communicate updates, marketing, and support information.</li>
              <li>Send emails.</li>
            </ul>

            <h3 className="text-xl font-semibold">Sharing of Information</h3>
            <p>
              We may share your personal information with trusted third-party service providers for operating the website and providing services. They are obligated to maintain confidentiality. We may disclose information if required by law or to protect rights and safety.
            </p>

            <h3 className="text-xl font-semibold">Log Files</h3>
            <p>
              CineMates uses standard log files like IP addresses, browser types, ISPs, timestamps, referring pages, and clicks. This data is used for trend analysis and site administration, not linked to identifiable information.
            </p>

            <h3 className="text-xl font-semibold">Advertising Partners</h3>
            <p>
              Advertisers may use cookies and web beacons to personalize and measure ads. Their individual privacy policies can be accessed through our site.
            </p>

            <h3 className="text-xl font-semibold">Third Party Privacy Policies</h3>
            <p>
              This policy doesn’t apply to external sites. We recommend reviewing their privacy policies separately.
            </p>

            <h3 className="text-xl font-semibold">Cookies</h3>
            <p>
              We use cookies and similar technologies to enhance your experience. You can disable cookies via browser settings, though it may affect website functionality.
            </p>

            <h3 className="text-xl font-semibold">Data Security</h3>
            <p>
              We take reasonable steps to secure your data. However, no method of online transmission or storage is completely secure.
            </p>

            <h3 className="text-xl font-semibold">Choices</h3>
            <p>
              You may opt out of promotional emails using the unsubscribe link. Disabling cookies in your browser may affect your site experience.
            </p>

            <h3 className="text-xl font-semibold">CCPA Privacy Rights</h3>
            <p>
              California consumers can request:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Details of personal data collected.</li>
              <li>Deletion of collected personal data.</li>
              <li>Opt-out of data sales.</li>
            </ul>
            <p>If you make a request, we will respond within one month. Contact us to exercise these rights.</p>

            <h3 className="text-xl font-semibold">GDPR Data Protection Rights</h3>
            <p>
              We ensure users are aware of their rights, including:
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>The right to access</li>
                <li>The right to rectification</li>
                <li>The right to erasure</li>
                <li>The right to restrict processing</li>
                <li>The right to object to processing</li>
                <li>The right to data portability</li>
              </ul>
              Contact us if you wish to exercise these rights.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default PrivacyPolicy;
