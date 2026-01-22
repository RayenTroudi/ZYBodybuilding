'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const images = [
    { src: '/images/stronger.jpg', alt: 'Hero Image 1' },
    { src: '/images/zy.jpg', alt: 'Hero Image 2' },
    { src: '/images/2.jpg', alt: 'Hero Image 3' },
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused, images.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section 
      className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
  
      {/* Gradient Overlay - Responsive opacity */}
      <motion.div
        className="absolute inset-0 z-10 bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      ></motion.div>

      {/* Background Images with Smooth Transition */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            className="absolute w-full h-full"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ 
              opacity: { duration: 0.8, ease: 'easeInOut' },
              scale: { duration: 6, ease: 'linear' }
            }}
          >
            <Image
              src={images[currentSlide].src}
              alt={images[currentSlide].alt}
              fill
              style={{ objectFit: 'cover' }}
              priority
              quality={90}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? 'w-12 h-3 bg-primary'
                : 'w-3 h-3 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Hero Content - Fully Responsive */}
      <motion.div
        className="relative z-20 text-center text-white space-y-4 sm:space-y-6 px-4 sm:px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Responsive Heading */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-primary">ZY</span> Bodybuilding
        </motion.h1>
        
        {/* Responsive Subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-xs sm:max-w-md md:max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Transformez votre corps, votre esprit et votre vie.
        </motion.p>
        
        {/* Responsive CTA Button */}
        <motion.a
          href="#join"
          className="btn-primary text-base sm:text-lg md:text-xl shadow-glow inline-block mt-4 px-6 sm:px-8 md:px-10 py-3 sm:py-4 min-w-[200px] sm:min-w-[240px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Rejoignez-nous
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;
