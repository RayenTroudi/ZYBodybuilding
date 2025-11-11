'use client'; 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUserAlt } from 'react-icons/fa';

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('Lundi');

  const scheduleData = [
    { day: 'Lundi', time: '09:00 - 10:00', course: 'Yoga', coach: 'Sarah', id: 1 },
    { day: 'Lundi', time: '10:00 - 11:00', course: 'Pilates', coach: 'Amina', id: 2 },
    { day: 'Lundi', time: '12:00 - 13:00', course: 'Cardio', coach: 'Imène', id: 3 },
    { day: 'Lundi', time: '14:00 - 15:00', course: 'Zumba', coach: 'Khadija', id: 4 },
    { day: 'Lundi', time: '16:00 - 17:00', course: 'HIIT', coach: 'Leila', id: 5 },
    { day: 'Mardi', time: '09:00 - 10:00', course: 'Cardio', coach: 'Sofia', id: 6 },
    { day: 'Mardi', time: '10:00 - 11:00', course: 'Pilates', coach: 'Imène', id: 7 },
    { day: 'Mardi', time: '12:00 - 13:00', course: 'Yoga', coach: 'Sarah', id: 8 },
    { day: 'Mardi', time: '14:00 - 15:00', course: 'Stretching', coach: 'Leila', id: 9 },
    { day: 'Mercredi', time: '09:00 - 10:00', course: 'Zumba', coach: 'Khadija', id: 10 },
    { day: 'Mercredi', time: '11:00 - 12:00', course: 'HIIT', coach: 'Rachida', id: 11 },
    { day: 'Mercredi', time: '13:00 - 14:00', course: 'Boxe', coach: 'Imène', id: 12 },
    { day: 'Jeudi', time: '09:00 - 10:00', course: 'CrossFit', coach: 'Samira', id: 13 },
    { day: 'Jeudi', time: '11:00 - 12:00', course: 'Yoga', coach: 'Sarah', id: 14 },
    { day: 'Jeudi', time: '13:00 - 14:00', course: 'Cardio', coach: 'Sofia', id: 15 },
    { day: 'Vendredi', time: '11:00 - 12:00', course: 'Yoga', coach: 'Sarah', id: 16 },
    { day: 'Vendredi', time: '13:00 - 14:00', course: 'Cardio', coach: 'Sofia', id: 17 }
  ];

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="schedule" className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-12 xl:px-48">
      <div className="container mx-auto space-y-8 sm:space-y-12 md:space-y-16">
       
        {/* Section Header */}
        <div className="text-center">
          <motion.h2
            className="section-header text-3xl sm:text-4xl md:text-5xl mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Programme des Cours Collectifs
          </motion.h2>
          <div className="divider-primary mx-auto mb-6 sm:mb-8"></div>
        </div>

        {/* Day Tabs - Horizontal Scroll on Mobile */}
        <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 scrollbar-hide snap-x snap-mandatory md:justify-center md:flex-wrap md:overflow-visible">
          {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((day) => (
            <motion.button
              key={day}
              onClick={() => setActiveTab(day)}
              className={`flex-shrink-0 snap-center py-2.5 sm:py-3 px-5 sm:px-6 md:px-8 text-base sm:text-lg font-bold transition-all duration-300 whitespace-nowrap rounded-lg min-w-[120px] sm:min-w-[140px] ${
                activeTab === day
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow scale-105'
                  : 'card text-primary hover:border-primary hover:scale-105'
              }`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {day}
            </motion.button>
          ))}
        </div>

        {/* Schedule Cards - Responsive Layout */}
        <motion.div
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-5"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {scheduleData
            .filter((entry) => entry.day === activeTab)
            .map((entry) => (
              <motion.div
                key={entry.id}
                className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/50"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -3 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Mobile Layout - Stacked */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  
                  {/* Time */}
                  <motion.div
                    className="flex items-center gap-2 sm:gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <FaCalendarAlt className="text-primary text-lg sm:text-xl flex-shrink-0" />
                    <p className="text-base sm:text-lg md:text-xl font-medium">
                      {entry.time}
                    </p>
                  </motion.div>
                  
                  {/* Course Name */}
                  <motion.div
                    className="text-lg sm:text-xl md:text-2xl text-primary font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {entry.course}
                  </motion.div>
                  
                  {/* Coach */}
                  <motion.div
                    className="flex items-center gap-2 sm:gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <FaUserAlt className="text-primary text-base sm:text-lg flex-shrink-0" />
                    <p className="text-base sm:text-lg md:text-xl text-neutral-300">
                      {entry.coach}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </div>
      
      {/* Custom Scrollbar Hide for Horizontal Tabs */}
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
