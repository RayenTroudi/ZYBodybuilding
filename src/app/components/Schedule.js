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
  const filteredClasses = classes.filter(cls => cls.dayOfWeek === activeTab);

  return (
    <section id="schedule" className="bg-[#080808] text-white py-20 lg:py-32 px-6 lg:px-20">
      <div className="container mx-auto">

        {/* Header */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">Planning hebdomadaire</p>
          <h2
            className="text-white font-black uppercase leading-none mb-4"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            Programme des<br />Cours Collectifs
          </h2>
          <div className="divider-primary mb-4" />
          <p className="text-neutral-500 text-sm max-w-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Rejoignez nos cours animés par des coachs professionnels certifiés
          </p>
        </motion.div>

        {/* Day Tabs */}
        <div className="flex overflow-x-auto gap-0 pb-0 mb-10 border-b border-[#1a1a1a]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {days.map((day, index) => (
            <motion.button
              key={day}
              onClick={() => setActiveTab(day)}
              className="relative flex-shrink-0 py-3 px-5 sm:px-7 text-xs font-bold uppercase transition-colors duration-200 whitespace-nowrap"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: '0.12em',
                color: activeTab === day ? '#fff' : '#4A4A4A',
                borderRadius: 0,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {day}
              {activeTab === day && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-t-2 border-primary animate-spin rounded-full" />
            <span className="text-neutral-600 text-xs uppercase tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Chargement...
            </span>
          </div>
        )}

        {/* Classes */}
        {!loading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="grid gap-px bg-[#111111]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {filteredClasses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-[#080808] py-20 text-center"
                >
                  <p
                    className="text-neutral-700 text-xs uppercase tracking-widest"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Aucun cours prévu pour ce jour
                  </p>
                </motion.div>
              ) : (
                filteredClasses.map((classItem, index) => {
                  const imageUrl = classItem.imageFileId
                    ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_TRAINER_IMAGES_BUCKET_ID}/files/${classItem.imageFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
                    : null;

                  return (
                    <motion.div
                      key={classItem.$id}
                      className="group relative bg-[#0e0e0e] border-b border-[#161616] hover:bg-[#111] transition-colors duration-200"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07, duration: 0.35 }}
                    >
                      {/* Red left accent on hover */}
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                      <div className="flex items-center gap-6 px-6 py-5 pl-8">

                        {/* Time column */}
                        <div className="flex-shrink-0 w-24 sm:w-28">
                          <div
                            className="text-white font-black leading-none"
                            style={{
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                            }}
                          >
                            {classItem.startTime}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-3 h-px bg-neutral-700" />
                            <span
                              className="text-neutral-600 text-[10px]"
                              style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                              {classItem.endTime}
                            </span>
                          </div>
                        </div>

                        {/* Vertical divider */}
                        <div className="hidden sm:block w-px self-stretch bg-[#1a1a1a] flex-shrink-0" />

                        {/* Class image */}
                        {imageUrl && (
                          <div className="hidden sm:block flex-shrink-0 w-14 h-14 overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={classItem.title}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                          </div>
                        )}

                        {/* Class info */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-white font-black uppercase leading-none truncate"
                            style={{
                              fontFamily: "'Barlow Condensed', sans-serif",
                              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                              letterSpacing: '0.02em',
                            }}
                          >
                            {classItem.title}
                          </h3>
                        </div>

                        {/* Trainer */}
                        {classItem.trainer && (
                          <div className="flex-shrink-0 flex items-center gap-3">
                            {classItem.trainer.imageUrl ? (
                              <div className="relative w-14 h-14 overflow-hidden flex-shrink-0 ring-1 ring-[#2a2a2a] group-hover:ring-primary/40 transition-all duration-300">
                                <Image
                                  src={classItem.trainer.imageUrl}
                                  alt={classItem.trainer.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div
                                className="w-14 h-14 bg-primary flex items-center justify-center text-white text-lg font-black flex-shrink-0"
                                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                              >
                                {classItem.trainer.name.charAt(0)}
                              </div>
                            )}
                            <div className="hidden md:block text-right">
                              <p
                                className="text-neutral-300 text-xs font-semibold uppercase"
                                style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em' }}
                              >
                                {classItem.trainer.name}
                              </p>
                              {classItem.trainer.specialty && (
                                <p
                                  className="text-primary text-[10px] uppercase mt-0.5"
                                  style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em' }}
                                >
                                  {classItem.trainer.specialty}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default Schedule;
