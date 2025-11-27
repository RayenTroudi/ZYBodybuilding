'use client';

import { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaCheckCircle, FaSms } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    smsOptIn: false,
  });

  // Phone verification state
  const [phoneVerificationStep, setPhoneVerificationStep] = useState('input'); // 'input', 'code', 'verified'
  const [verificationCode, setVerificationCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSendVerificationCode = async () => {
    setVerificationMessage({ type: 'info', text: 'Phone verification feature removed. Proceeding without verification.' });
    setPhoneVerificationStep('verified');
  };

  const handleVerifyCode = async () => {
    setVerificationMessage({ type: 'info', text: 'Phone verification feature removed. Proceeding without verification.' });
    setPhoneVerificationStep('verified');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.smsOptIn && phoneVerificationStep !== 'verified') {
      setVerificationMessage({ type: 'error', text: 'Please verify your phone number first' });
      return;
    }

    // Submit form data
    console.log('Form submitted:', formData);
    alert("Formulaire soumis !");

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      smsOptIn: false,
    });
    setPhoneVerificationStep('input');
    setVerificationCode('');
    setVerificationMessage(null);
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
            { icon: <FaPhoneAlt />, text: "+216 123 456 78", label: "Téléphone" },
            { icon: <FaEnvelope />, text: "contact@zybodybuilding.tn", label: "Email" },
            { icon: <FaMapMarkerAlt />, text: "ZY Bodybuilding, Tunisia", label: "Adresse" },
            { icon: <FaGlobe />, text: "ZYbodybuilding.tn", label: "Site Web" },
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
                <div className="flex-grow">
                  <p className="text-xs sm:text-sm text-neutral-500 mb-1">{card.label}</p>
                  <p className="text-sm sm:text-base md:text-lg font-medium break-words">{card.text}</p>
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

              {/* SMS Opt-in Checkbox */}
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="smsOptIn"
                    checked={formData.smsOptIn}
                    onChange={handleInputChange}
                    className="mt-1 mr-3 w-5 h-5 text-primary focus:ring-primary rounded"
                  />
                  <div>
                    <span className="text-base font-medium flex items-center gap-2">
                      <FaSms className="text-primary" />
                      Recevoir des notifications SMS
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                      Recevez des rappels de cours, offres spéciales et notifications importantes
                    </p>
                  </div>
                </label>
              </div>

              {/* Phone Number Field (shown if SMS opt-in is checked) */}
              {formData.smsOptIn && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  <label htmlFor="phone" className="block text-base sm:text-lg font-medium mb-2">
                    Numéro de téléphone
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+216 12 345 678"
                      disabled={phoneVerificationStep === 'verified'}
                      required={formData.smsOptIn}
                      className="input-field flex-1 px-4 py-3 sm:py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {phoneVerificationStep === 'input' && (
                      <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        disabled={sendingCode || !formData.phone}
                        className="btn-primary px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap disabled:opacity-50"
                      >
                        {sendingCode ? 'Envoi...' : 'Vérifier'}
                      </button>
                    )}
                    {phoneVerificationStep === 'verified' && (
                      <div className="flex items-center px-4 bg-green-900/20 border border-green-500 rounded-lg">
                        <FaCheckCircle className="text-green-500 text-xl" />
                      </div>
                    )}
                  </div>

                  {/* Verification Code Input */}
                  {phoneVerificationStep === 'code' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-medium">Code de vérification</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="123456"
                          maxLength={6}
                          className="input-field flex-1 px-4 py-3 text-base sm:text-lg tracking-widest text-center"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyCode}
                          disabled={verifying || !verificationCode}
                          className="btn-primary px-4 sm:px-6 py-3 whitespace-nowrap disabled:opacity-50"
                        >
                          {verifying ? 'Vérification...' : 'Confirmer'}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        disabled={sendingCode}
                        className="text-sm text-primary hover:underline"
                      >
                        Renvoyer le code
                      </button>
                    </motion.div>
                  )}

                  {/* Verification Messages */}
                  {verificationMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg text-sm ${
                        verificationMessage.type === 'success'
                          ? 'bg-green-900/20 border border-green-500 text-green-500'
                          : 'bg-red-900/20 border border-red-500 text-red-500'
                      }`}
                    >
                      {verificationMessage.text}
                    </motion.div>
                  )}
                </motion.div>
              )}

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
              <div className="text-center sm:text-left">
                <motion.button
                  type="submit"
                  className="btn-primary text-base sm:text-lg w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Envoyer
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
