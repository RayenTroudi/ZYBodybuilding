'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';

const AboutUs = () => {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section id="about" className="bg-black text-white py-16 px-6 lg:px-48">
      <div className="container mx-auto space-y-16">

        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-12"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="lg:w-1/2">
            <Image
              src="/images/3.jpg"
              alt="Salle de sport"
              width={600}
              height={400}
              className="w-full h-full object-cover transform transition duration-500 hover:scale-105"
            />
          </div>
          <div className="lg:w-1/2 space-y-4">
            <motion.h2
              className="section-header"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t.about.block1Title.replace('\n', ' ')}
            </motion.h2>
            <div className="divider-primary mb-6"></div>
            <motion.p
              className="text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t.about.block1Desc1}
            </motion.p>
            <motion.p
              className="text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {t.about.block1Desc2}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-12"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="lg:w-1/2 space-y-4">
            <motion.h2
              className="section-header"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {t.about.block2Title.replace('\n', ' ')}
            </motion.h2>
            <div className="divider-primary mb-6"></div>
            <motion.p
              className="text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t.about.block2Desc1}
            </motion.p>
            <motion.p
              className="text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {t.about.block2Desc2}
            </motion.p>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="/images/2.jpg"
              alt="Équipement de gym"
              width={600}
              height={400}
              className="w-full h-full object-cover transform transition duration-500 hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
