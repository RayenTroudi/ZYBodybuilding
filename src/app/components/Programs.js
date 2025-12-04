'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/programs');
      const data = await response.json();
      
      if (data.success) {
        setPrograms(data.programs);
      } else {
        setError(data.error || 'Failed to load programs');
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
      setError('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="programs" className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-12 xl:px-48">
      <div className="container mx-auto space-y-8 sm:space-y-12 md:space-y-16">
        
        {/* Section Header */}
        <div className="text-center">
          <motion.h2
            className="section-header text-3xl sm:text-4xl md:text-5xl mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Nos Programmes
          </motion.h2>
          <div className="divider-primary mx-auto mb-6 sm:mb-8"></div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-neutral-300">Chargement des programmes...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Programs Grid */}
        {!loading && !error && (
          <motion.div
            className="mt-6 sm:mt-8 space-y-4 sm:space-y-5"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {programs.map((program, index) => (
              <motion.div
                key={program.$id}
                className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/50"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -3 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Mobile Layout - Stacked */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  
                  {/* Icon */}
                  <motion.div
                    className="flex items-center gap-2 sm:gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <span className="text-3xl sm:text-4xl md:text-5xl" style={{ color: program.color || '#CC1303' }}>
                      {program.icon || '🏋️'}
                    </span>
                  </motion.div>
                  
                  {/* Program Title */}
                  <motion.div
                    className="text-lg sm:text-xl md:text-2xl font-bold flex-1"
                    style={{ color: program.color || '#CC1303' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {program.title}
                  </motion.div>
                  
                  {/* Description */}
                  <motion.div
                    className="flex items-center gap-2 sm:gap-3 flex-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <p className="text-base sm:text-lg md:text-xl text-neutral-300">
                      {program.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && programs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-400 text-lg">Aucun programme disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
