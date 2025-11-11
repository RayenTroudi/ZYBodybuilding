import { motion } from 'framer-motion';

export default function Programs() {
  return (
    <section id="programs" className="py-12 sm:py-16 md:py-20 bg-secondary text-text-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Section Header */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-12" style={{ textShadow: 'var(--neon-glow)' }}>
          Our Programs
        </h2>
        
        {/* Responsive Grid - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {[
            {
              title: 'Strength Training',
              desc: 'Build strength and stamina.',
              icon: '💪',
            },
            {
              title: 'Cardio Workouts',
              desc: 'Boost your endurance.',
              icon: '🏃',
            },
            {
              title: 'Body Building',
              desc: 'Achieve your dream physique.',
              icon: '🏋️',
            },
            {
              title: 'Weight Loss',
              desc: 'Lose weight effectively.',
              icon: '⚖️',
            },
          ].map((program, index) => (
            <motion.div
              key={index}
              className="p-6 sm:p-8 bg-secondary border-2 border-primary-color rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-h-[180px] sm:min-h-[200px] flex flex-col justify-between"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Icon - Responsive Size */}
              <div className="text-4xl sm:text-5xl md:text-6xl mb-4 text-center">
                {program.icon}
              </div>
              
              {/* Title - Responsive Text */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-center">
                {program.title}
              </h3>
              
              {/* Description - Responsive Text */}
              <p className="text-base sm:text-lg md:text-xl text-center text-neutral-300">
                {program.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
