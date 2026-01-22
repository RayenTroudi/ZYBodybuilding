'use client'; 
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaFire, FaUsers, FaTrophy, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Image from 'next/image';

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('Lundi');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
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

  const toggleCard = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-500';
      case 'Intermédiaire': return 'bg-yellow-500';
      case 'Avancé': return 'bg-red-500';
      default: return 'bg-neutral-500';
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
              {filteredClasses.map((classItem, index) => {
                const isExpanded = expandedCards[classItem.$id];
                
                return (
                  <motion.div
                    key={classItem.$id}
                    variants={cardVariants}
                    layout
                    className="bg-neutral-900 backdrop-blur-md rounded-2xl overflow-hidden border border-neutral-800 hover:border-primary/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-primary/20"
                  >
                    {/* Main Card Content */}
                    <div 
                      className="p-5 sm:p-6 cursor-pointer"
                      onClick={() => toggleCard(classItem.$id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        
                        {/* Class Icon & Time */}
                        <div className="flex items-center gap-4">
                          <div 
                            className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg"
                            style={{ 
                              backgroundColor: `${classItem.color}20`,
                              border: `2px solid ${classItem.color}`
                            }}
                          >
                            {classItem.icon}
                          </div>
                          
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-neutral-400 text-sm mb-1">
                              <FaClock className="text-primary" />
                              <span className="font-medium">{classItem.startTime} - {classItem.endTime}</span>
                              <span className="text-xs bg-neutral-700 px-2 py-0.5 rounded-full">
                                {classItem.duration} min
                              </span>
                            </div>
                            <h3 
                              className="text-xl sm:text-2xl font-bold mb-1"
                              style={{ color: classItem.color }}
                            >
                              {classItem.title}
                            </h3>
                          </div>
                        </div>

                        {/* Badges & Stats */}
                        <div className="flex flex-wrap gap-2 sm:ml-auto">
                          <span className={`${getDifficultyColor(classItem.difficulty)} px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1`}>
                            <FaTrophy className="text-xs" />
                            {classItem.difficulty}
                          </span>
                          {classItem.category && (
                            <span className="bg-primary/20 border border-primary text-primary px-3 py-1 rounded-full text-xs font-bold">
                              {classItem.category}
                            </span>
                          )}
                          {classItem.caloriesBurn > 0 && (
                            <span className="bg-orange-500/20 border border-orange-500 text-orange-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <FaFire />
                              {classItem.caloriesBurn} cal
                            </span>
                          )}
                          {classItem.availableSpots > 0 && (
                            <span className="bg-green-500/20 border border-green-500 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                              <FaUsers />
                              {classItem.availableSpots - (classItem.bookedSpots || 0)} places
                            </span>
                          )}
                        </div>

                        {/* Expand Button */}
                        <motion.div
                          className="sm:ml-4 flex items-center justify-center"
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FaChevronDown className="text-primary text-xl" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-neutral-700/50"
                        >
                          <div className="p-5 sm:p-6 bg-neutral-900/50">
                            {/* Trainer Info */}
                            {classItem.trainer && (
                              <div className="flex items-center gap-4 mb-4 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700/30">
                                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-primary/50">
                                  {classItem.trainer.imageUrl ? (
                                    <Image
                                      src={classItem.trainer.imageUrl}
                                      alt={classItem.trainer.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-primary flex items-center justify-center text-2xl font-bold">
                                      {classItem.trainer.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-neutral-400 text-sm mb-1">Coach</p>
                                  <p className="text-white font-bold text-lg">{classItem.trainer.name}</p>
                                  {classItem.trainer.specialty && (
                                    <p className="text-primary text-sm">{classItem.trainer.specialty}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Description */}
                            {classItem.description && (
                              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                                {classItem.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                <div className="text-6xl mb-4">📅</div>
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
