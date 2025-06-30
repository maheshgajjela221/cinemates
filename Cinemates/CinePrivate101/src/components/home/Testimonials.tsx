import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { API_URL } from '../../config';

interface Review {
  id: number;
  name: string;
  review_text: string;
  rating: number;
  created_at: string;
  avatar?: string;
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <Star
      key={index}
      className={`w-4 h-4 ${index < rating ? 'text-accent fill-accent' : 'text-gray-300'}`}
    />
  ));
};

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/get_reviews`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="section bg-primary/5 overflow-hidden">
      <div className="container-custom">
        <SectionTitle
          title="What Our Guests Say"
          subtitle="Hear from clients who celebrated their special moments at our private theatre"
          center
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {loading ? (
            <p className="text-center text-gray-600">Loading reviews...</p>
          ) : (
            <>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                pagination={{ clickable: true }}
                onSwiper={(swiper) => setSwiperInstance(swiper)}
                className="pb-12"
              >
                {reviews.map((review) => (
                  <SwiperSlide key={review.id}>
                    <div className="h-[250px] w-full glass-card p-6 flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          <img
                            src={
                              review.avatar ||
                              'https://ui-avatars.com/api/?name=' +
                                encodeURIComponent(review.name)
                            }
                            alt={review.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-sm">{review.name}</h4>
                          <p className="text-xs text-gray-600">{review.created_at.split('T')[0]}</p>
                        </div>
                      </div>

                      <div className="flex mb-3">
                        {renderStars(review.rating)}
                      </div>

                      <blockquote className="text-gray-700 text-sm italic flex-grow overflow-hidden">
                        "{review.review_text}"
                      </blockquote>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => swiperInstance?.slidePrev()}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => swiperInstance?.slideNext()}
                  className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;