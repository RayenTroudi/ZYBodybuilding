'use client';

import { motion } from 'framer-motion';
import Image from 'next/image'; 

const Hero = () => {
  const images = [
    { src: '/images/fitness2.jpg', alt: 'Hero Image 1' },
    { src: '/images/fitness1.jpg', alt: 'Hero Image 2' },
  ];

  return (
    <section className="relative min-h-screen h-screen flex items-center justify-center overflow-hidden">
  
      {/* Gradient Overlay - Responsive opacity */}
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-r from-dark/95 via-dark/80 sm:via-dark/70 to-primary/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      ></motion.div>

      {/* Background Images with Animation */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="absolute w-full h-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 3,
                delay: index * 2,
                repeat: Infinity,
                repeatType: 'reverse',
              },
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0} 
              quality={75} 
            />
          </motion.div>
        ))}
      </motion.div>

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
          <span className="text-gradient">ZY</span> Bodybuilding
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
