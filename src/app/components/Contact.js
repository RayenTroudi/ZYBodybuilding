'use client';

import { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setStatusMessage(data.message || 'Message envoyé avec succès!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
          setStatusMessage('');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setStatusMessage(data.error || 'Une erreur s\'est produite. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setStatusMessage('Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <section id="contact" className="bg-black text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-12">
      <div className="container mx-auto space-y-12 sm:space-y-16">
        
        {/* Contact Info Cards - Responsive Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"  
          viewport={{ once: false, amount: 0.3 }} 
        >
          {[
            { icon: <FaPhoneAlt />, text: "+216 58800554", label: "Téléphone" },
            { icon: <FaEnvelope />, text: "zybodybuildingstudio@gmail.com", label: "Email" },
            { icon: <FaMapMarkerAlt />, text: "ZY Bodybuilding, Tunisia", label: "Adresse" },
            { icon: <FaGlobe />, text: "www.zybodybuilding.space", label: "Site Web" },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="group card p-5 sm:p-6 md:p-8 transition duration-300 hover:bg-gradient-to-br hover:from-primary-900 hover:to-dark hover:shadow-glow min-h-[120px] sm:min-h-[140px] flex flex-col justify-center"
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.8 }}  
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
                <div className="text-3xl sm:text-4xl md:text-5xl text-primary group-hover:text-white transition duration-300 flex-shrink-0">
                  {card.icon}
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className="text-xs sm:text-sm text-neutral-500 mb-1">{card.label}</p>
                  <p className="text-sm sm:text-base md:text-lg font-medium break-words overflow-wrap-anywhere">{card.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

 
        {/* Contact Form and Map - Responsive Layout */}
        <motion.div
          className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-12"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}  
          transition={{ duration: 1 }}
        >
          {/* Contact Form */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="section-header text-3xl sm:text-4xl md:text-5xl">Contactez-nous</h2>
            <div className="divider-primary mb-6 sm:mb-8"></div>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-base sm:text-lg font-medium mb-2">Nom</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field w-full px-4 py-3 sm:py-4 text-base sm:text-lg"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-base sm:text-lg font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-field w-full px-4 py-3 sm:py-4 text-base sm:text-lg"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-base sm:text-lg font-medium mb-2">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+216 58800554"
                  className="input-field w-full px-4 py-3 sm:py-4 text-base sm:text-lg"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-base sm:text-lg font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="input-field w-full px-4 py-3 sm:py-4 text-base sm:text-lg min-h-[120px] sm:min-h-[150px]"
                  rows="4"
                ></textarea>
              </div>

              {/* Status Message */}
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    submitStatus === 'success' 
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                      : 'bg-red-500/20 border border-red-500/50 text-red-400'
                  }`}
                >
                  {submitStatus === 'success' && <FaCheckCircle className="text-2xl flex-shrink-0" />}
                  <p className="text-sm sm:text-base">{statusMessage}</p>
                </motion.div>
              )}

              <div className="text-center sm:text-left">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn-primary text-base sm:text-lg w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Google Maps Embed */}
          <div className="w-full lg:w-1/2">
            <motion.iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.8867284488745!2d10.673816076550808!3d36.827288372237565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13029ffe9be4d185%3A0x7217af0826d0b35c!2sZY.bodybuilding!5e0!3m2!1sen!2sus!4v1699999999999!5m2!1sen!2sus"
              className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            ></motion.iframe>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
