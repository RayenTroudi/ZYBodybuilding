'use client'; 

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('Lundi');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set initial day based on current day
    const today = new Date();
    const dayIndex = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const frenchDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const weekdayDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    
    const currentDay = frenchDays[dayIndex];
    
    // If today is a weekday, select it; otherwise default to Lundi
    if (weekdayDays.includes(currentDay)) {
      setActiveTab(currentDay);
    } else {
      setActiveTab('Lundi');
    }

    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/classes');
      const data = await response.json();
      
      if (data.success && data.classes) {
        setClasses(data.classes);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

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
                    className="bg-neutral-900 backdrop-blur-md rounded-2xl overflow-hidden border border-neutral-800 hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        
                        {/* Class Image */}
                        {imageUrl && (
                          <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={classItem.title}
                              width={96}
                              height={96}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        
                        {/* Class Info */}
                        <div className="flex-1">
                          <div className="mb-2">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                              {classItem.title}
                            </h3>
                            <p className="text-neutral-400 text-sm">
                              {classItem.startTime} - {classItem.endTime}
                            </p>
                          </div>
                          
                          {/* Trainer Info */}
                          {classItem.trainer && (
                            <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700/30">
                              {classItem.trainer.imageUrl ? (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/50 flex-shrink-0">
                                  <Image
                                    src={classItem.trainer.imageUrl}
                                    alt={classItem.trainer.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                                  {classItem.trainer.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <p className="text-white font-bold text-sm">{classItem.trainer.name}</p>
                                {classItem.trainer.specialty && (
                                  <p className="text-primary text-xs">{classItem.trainer.specialty}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
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
