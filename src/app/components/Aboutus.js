'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const AboutUs = () => {
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
              src="/images/fitness1.jpg" 
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
              À propos de notre salle de sport
            </motion.h2>
            <div className="divider-primary mb-6"></div>
            <motion.p
              className="text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Nous offrons une expérience de fitness moderne et motivante. Que vous soyez débutant ou confirmé, notre salle de sport est équipée pour répondre à tous vos besoins d'entraînement.
            </motion.p>
            <motion.p
              className="text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Rejoignez notre communauté et bénéficiez de l'accompagnement de nos entraîneurs qualifiés pour atteindre vos objectifs.
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
              Nos valeurs et notre approche
            </motion.h2>
            <div className="divider-primary mb-6"></div>
            <motion.p
              className="text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Chez nous, chaque membre est une priorité. Nous offrons des programmes d'entraînement personnalisés et une ambiance conviviale pour vous permettre de vous surpasser.
            </motion.p>
            <motion.p
              className="text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Notre équipe est là pour vous guider et vous motiver, dans un espace équipé avec des machines de haute qualité.
            </motion.p>
          </div>
          <div className="lg:w-1/2">
            <Image 
              src="/images/fitness2.jpg" 
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
