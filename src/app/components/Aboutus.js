'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
  'Équipements dernière génération',
  'Coachs certifiés & expérimentés',
  'Programmes 100% personnalisés',
  'Ambiance motivante & inclusive',
];


const featureVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: 'easeOut' },
  }),
};

const AboutUs = () => {
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
              <p className="section-label">Notre histoire</p>
              <h2
                className="text-white font-black uppercase leading-none mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}
              >
                À propos de<br />notre salle
              </h2>
              <div className="divider-primary mb-6" />
            </div>

            <p className="text-neutral-400 text-base leading-relaxed">
              Nous offrons une expérience de fitness moderne et motivante. Que vous soyez débutant ou confirmé, notre salle de sport est équipée pour répondre à tous vos besoins d&apos;entraînement.
            </p>
            <p className="text-neutral-400 text-base leading-relaxed">
              Rejoignez notre communauté et bénéficiez de l&apos;accompagnement de nos entraîneurs qualifiés pour atteindre vos objectifs.
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
              <p className="section-label">Ce qui nous distingue</p>
              <h2
                className="text-white font-black uppercase leading-none mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}
              >
                Nos valeurs &<br />notre approche
              </h2>
              <div className="divider-primary mb-6" />
            </div>

            <p className="text-neutral-400 text-base leading-relaxed">
              Chez nous, chaque membre est une priorité. Nous offrons des programmes d&apos;entraînement personnalisés et une ambiance conviviale pour vous permettre de vous surpasser.
            </p>
            <p className="text-neutral-400 text-base leading-relaxed">
              Notre équipe est là pour vous guider et vous motiver, dans un espace équipé avec des machines de haute qualité.
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
