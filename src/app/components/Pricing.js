'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/plans');
      const data = await response.json();
      setPlans(data.documents || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  // Format price with TND
  const formatPrice = (price) => {
    return `${parseFloat(price).toLocaleString('fr-TN')} TND`;
  };

  // Get period label based on duration
  const getPeriodLabel = (duration) => {
    if (duration <= 7) return 'Par semaine';
    if (duration >= 28 && duration <= 31) return 'Par mois';
    if (duration >= 84 && duration <= 93) return 'Par 3 mois';
    if (duration >= 365 && duration <= 366) return 'Par an';
    return `Pour ${duration} jours`;
  };

  if (loading) {
    return (
      <div id="pricing" className="bg-dark text-white flex flex-col items-center section-padding">
        <motion.h1
          className="section-header mb-4"
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Tarifs
        </motion.h1>
        <div className="divider-primary mb-12"></div>
        <div className="text-center text-neutral-400">
          Chargement des tarifs...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      id="pricing"
      className="bg-dark text-white flex flex-col items-center py-12 sm:py-16 md:py-20 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Section Header */}
      <motion.h1
        className="section-header text-3xl sm:text-4xl md:text-5xl mb-4"
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Tarifs
      </motion.h1>
      <div className="divider-primary mb-8 sm:mb-10 md:mb-12"></div>
      
      {/* Pricing Cards Grid */}
      <motion.div
        className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {plans.length === 0 ? (
          <div className="col-span-full text-center text-neutral-400 py-8">
            Aucun tarif disponible pour le moment.
          </div>
        ) : (
          plans.map((plan, index) => (
            <motion.div
              key={plan.$id || index}
              className="card overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
            >
              <div className="p-6 sm:p-8 flex-grow">
                {/* Plan Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center text-white">
                  {plan.name}
                </h2>
                
                {/* Plan Description */}
                {plan.description && (
                  <p className="text-sm sm:text-base text-neutral-400 text-center mb-4 sm:mb-6 min-h-[40px]">
                    {plan.description}
                  </p>
                )}
                
                {/* Price */}
                <div className="my-6 sm:my-8 text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">
                    {formatPrice(plan.price)}
                  </div>
                  <div className="text-neutral-400 text-sm sm:text-base">
                    {getPeriodLabel(plan.duration)}
                  </div>
                  <div className="text-neutral-500 text-xs sm:text-sm mt-2">
                    Durée: {plan.duration} jour{plan.duration > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <motion.button
                className="w-full bg-gradient-to-r from-primary to-accent text-white text-center py-3 sm:py-4 text-base sm:text-lg font-bold cursor-pointer hover:shadow-glow transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                S'inscrire
              </motion.button>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default Pricing;
