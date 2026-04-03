'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';

const featureVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: 'easeOut' },
  }),
};

const AboutUs = () => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const features = t.about.features;
  return (
    <section id="about" className="bg-[#080808] text-white py-20 lg:py-32 px-6 lg:px-20">
      <div className="container mx-auto">

        {/* Block 1 */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 lg:mb-32"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Image with corner brackets */}
          <div className="relative">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-[3px] border-l-[3px] border-primary z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[3px] border-r-[3px] border-primary z-10 pointer-events-none" />
            <div className="overflow-hidden">
              <Image
                src="/images/3.jpg"
                alt="Salle de sport"
                width={600}
                height={400}
                className="w-full h-[380px] lg:h-[480px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-primary/8 pointer-events-none" />
          </div>

          {/* Text */}
          <div className="space-y-6">
            <div>
              <p className="section-label">{t.about.block1Label}</p>
              <h2
                className="text-white font-black uppercase leading-none mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}
              >
                {t.about.block1Title.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h2>
              <div className="divider-primary mb-6" />
            </div>

            <p className="text-neutral-400 text-base leading-relaxed">
              {t.about.block1Desc1}
            </p>
            <p className="text-neutral-400 text-base leading-relaxed">
              {t.about.block1Desc2}
            </p>

          </div>
        </motion.div>

        {/* Block 2 */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Text */}
          <div className="space-y-6 order-2 lg:order-1">
            <div>
              <p className="section-label">{t.about.block2Label}</p>
              <h2
                className="text-white font-black uppercase leading-none mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}
              >
                {t.about.block2Title.split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h2>
              <div className="divider-primary mb-6" />
            </div>

            <p className="text-neutral-400 text-base leading-relaxed">
              {t.about.block2Desc1}
            </p>
            <p className="text-neutral-400 text-base leading-relaxed">
              {t.about.block2Desc2}
            </p>

            {/* Feature list */}
            <div className="space-y-3 pt-4">
              {features.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  custom={i}
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 flex items-center gap-1.5">
                    <div className="w-4 h-[2px] bg-primary" />
                    <div className="w-1.5 h-1.5 bg-primary pulse-glow" />
                  </div>
                  <span className="text-neutral-300 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image with corner brackets */}
          <div className="relative order-1 lg:order-2">
            <div className="absolute top-0 right-0 w-10 h-10 border-t-[3px] border-r-[3px] border-primary z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[3px] border-l-[3px] border-primary z-10 pointer-events-none" />
            <div className="overflow-hidden">
              <Image
                src="/images/2.jpg"
                alt="Équipement de gym"
                width={600}
                height={400}
                className="w-full h-[380px] lg:h-[480px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-primary/8 pointer-events-none" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutUs;
