'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  const formatPrice = (price) => `${parseFloat(price).toLocaleString('fr-TN')} TND`;

  const getPeriodLabel = (duration) => {
    if (duration <= 7) return 'Par semaine';
    if (duration >= 28 && duration <= 31) return 'Par mois';
    if (duration >= 84 && duration <= 93) return 'Par 3 mois';
    if (duration >= 365 && duration <= 366) return 'Par an';
    return `Pour ${duration} jours`;
  };

  const featuredIndex = plans.length > 2 ? Math.floor(plans.length / 2) : plans.length > 1 ? 1 : 0;

  return (
    <section id="pricing" className="relative bg-[#080808] text-white py-20 lg:py-32 px-4 sm:px-6 dot-grid-bg overflow-hidden">
      <div className="noise-overlay" />
      <div className="container mx-auto relative z-10">

        {/* Header */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">Abonnements</p>
          <h2
            className="text-white font-black uppercase leading-none mb-4"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.8rem, 7vw, 5rem)', letterSpacing: '-0.02em' }}
          >
            Tarifs
          </h2>
          <div className="divider-primary" />
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-primary mb-4" />
            <p className="text-neutral-600 text-sm">Chargement des tarifs...</p>
          </div>
        ) : plans.length === 0 ? (
          <p className="text-center text-neutral-600 py-12">Aucun tarif disponible pour le moment.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plans.map((plan, index) => {
              const isFeatured = index === featuredIndex;
              return (
                <motion.div
                  key={plan.$id || index}
                  className={`relative flex flex-col overflow-hidden group transition-all duration-300 border ${
                    isFeatured
                      ? 'pricing-featured'
                      : 'bg-[#111111] border-[#1e1e1e] hover:border-primary/40'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: isFeatured ? -6 : -4 }}
                >
                  {/* Top bar */}
                  {isFeatured ? (
                    <div className="h-[3px] bg-primary" />
                  ) : (
                    <div className="h-[3px] bg-[#1e1e1e] relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Badge for featured */}
                    {isFeatured && (
                      <div className="mb-3 self-start">
                        <span
                          className="badge-primary text-[9px]"
                          style={{ letterSpacing: '0.18em' }}
                        >
                          Populaire
                        </span>
                      </div>
                    )}

                    {/* Plan name */}
                    <h3
                      className="text-white font-black uppercase mb-1"
                      style={{
                        fontFamily: "'Barlow Condensed', sans-serif",
                        letterSpacing: '0.04em',
                        fontSize: isFeatured ? '1.4rem' : '1.25rem',
                      }}
                    >
                      {plan.name}
                    </h3>

                    {plan.description && (
                      <p
                        className="text-neutral-600 text-xs mb-5 leading-relaxed line-clamp-2 min-h-[32px]"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {plan.description}
                      </p>
                    )}

                    {/* Price block */}
                    <div className={`flex-1 flex flex-col justify-center py-5 my-4 ${isFeatured ? 'border-y border-primary/20' : 'border-y border-[#1a1a1a]'}`}>
                      <div
                        className={`font-black leading-none mb-1 ${isFeatured ? 'text-glow-red' : ''}`}
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: isFeatured ? 'clamp(2rem, 5vw, 2.8rem)' : 'clamp(1.6rem, 4vw, 2.2rem)',
                          color: 'var(--primary-color)',
                        }}
                      >
                        {formatPrice(plan.price)}
                      </div>
                      <div
                        className="text-neutral-500 text-xs mt-1.5"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {getPeriodLabel(plan.duration)}
                      </div>
                      <div
                        className="text-neutral-700 text-xs mt-0.5"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {plan.duration} jour{plan.duration > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <motion.button
                    className={`w-full py-4 text-xs font-bold uppercase transition-all duration-200 ${
                      isFeatured
                        ? 'bg-primary text-white border-t border-primary hover:bg-primary-600'
                        : 'border-t border-[#1e1e1e] text-neutral-500 hover:text-white hover:bg-primary hover:border-primary'
                    }`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.12em' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    S&apos;inscrire
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;
