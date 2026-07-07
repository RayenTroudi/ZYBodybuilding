'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('Lundi');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date();
    const dayIndex = today.getDay();
    const frenchDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    setActiveTab(frenchDays[dayIndex]);
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/classes');
      const data = await response.json();
      if (data.success && data.classes) setClasses(data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const filteredClasses = classes.filter(cls => cls.dayOfWeek === activeTab);

  return (
    <section id="schedule" className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-12 xl:px-48">
      <div className="container mx-auto space-y-8 sm:space-y-12">

        {/* Section Header */}
        <div className="text-center">
          <motion.h2
            className="section-header text-3xl sm:text-4xl md:text-5xl mb-4 text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Programme des Cours Collectifs
          </motion.h2>
          <div className="divider-primary mx-auto mb-6 sm:mb-8"></div>
          <motion.p
            className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Rejoignez nos cours animés par des coachs professionnels certifiés
          </motion.p>
        </div>

        {/* Day Tabs */}
        <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-4 scrollbar-hide snap-x snap-mandatory md:justify-center md:flex-wrap md:overflow-visible">
          {days.map((day, index) => (
            <motion.button
              key={day}
              onClick={() => setActiveTab(day)}
              className={`flex-shrink-0 snap-center py-3 px-6 sm:px-8 text-sm sm:text-base font-bold transition-all duration-300 whitespace-nowrap rounded-xl min-w-[110px] sm:min-w-[130px] ${
                activeTab === day
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-neutral-800/50 backdrop-blur-sm text-neutral-300 hover:bg-neutral-700/50 hover:text-white border border-neutral-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {day}
            </motion.button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            <p className="mt-4 text-neutral-300 text-lg">Chargement des cours...</p>
          </div>
        )}

        {/* Classes Grid */}
        {!loading && (
          <motion.div
            className="grid gap-4 sm:gap-5 md:gap-6 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="wait">
              {filteredClasses.map((classItem) => {
                const imageUrl = classItem.imageFileId
                  ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_TRAINER_IMAGES_BUCKET_ID}/files/${classItem.imageFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
                  : null;

                return (
                  <motion.div
                    key={classItem.$id}
                    variants={cardVariants}
                    layout
                    className="group bg-neutral-900 backdrop-blur-md rounded-2xl overflow-hidden border border-neutral-800 hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20"
                  >
                    <div className="p-4 sm:p-5 flex items-center gap-4 sm:gap-5">

                      {/* Coach Portrait — the dominant image */}
                      {classItem.trainer ? (
                        <div className="relative flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden ring-2 ring-primary/60 shadow-lg">
                          {classItem.trainer.imageUrl ? (
                            <Image
                              src={classItem.trainer.imageUrl}
                              alt={classItem.trainer.name}
                              fill
                              sizes="(max-width: 640px) 96px, 144px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-3xl sm:text-4xl">
                              {classItem.trainer.name.charAt(0)}
                            </div>
                          )}

                          {/* Class Thumbnail — small badge in the corner */}
                          {imageUrl && (
                            <div className="absolute right-1.5 bottom-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden ring-2 ring-neutral-900 shadow-md">
                              <Image
                                src={imageUrl}
                                alt={classItem.title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      ) : imageUrl && (
                        <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden ring-2 ring-neutral-800">
                          <Image
                            src={imageUrl}
                            alt={classItem.title}
                            fill
                            sizes="(max-width: 640px) 64px, 80px"
                            className="object-cover"
                          />
                        </div>
                      )}

                      {/* Class Info */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 truncate">
                            {classItem.title}
                          </h3>
                          <p className="text-neutral-400 text-sm">
                            {classItem.startTime} - {classItem.endTime}
                          </p>
                        </div>

                        {/* Trainer Info */}
                        {classItem.trainer && (
                          <div>
                            <p className="text-white font-bold text-base sm:text-lg truncate">{classItem.trainer.name}</p>
                            {classItem.trainer.specialty && (
                              <p className="text-primary text-xs sm:text-sm uppercase tracking-wide truncate">{classItem.trainer.specialty}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Empty State */}
            {filteredClasses.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-neutral-400 text-lg">Aucun cours prévu pour ce jour.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Custom Scrollbar Hide */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Schedule;
