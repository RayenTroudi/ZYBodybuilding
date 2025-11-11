'use client';
import { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear(); 

  return (
    <div>

      <footer className="bg-gradient-to-br from-neutral-900 to-dark py-12 sm:py-16 md:py-20 border-t border-primary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
       
            {/* Logo & About Section */}
            <div className="space-y-4 text-center sm:text-left animate__animated animate__fadeIn animate__delay-0.5s">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                <Image 
                  src="/images/logoNobg.png" 
                  alt="ZY Bodybuilding Logo" 
                  width={50} 
                  height={50}
                  className="object-contain sm:w-[60px] sm:h-[60px]"
                />
                <h3 className="text-xl sm:text-2xl font-bold text-gradient">ZY BODYBUILDING</h3>
              </div>
              <div className="divider-primary w-16 mb-4 mx-auto sm:mx-0"></div>
              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
                Transformez votre corps et votre esprit. 
                Notre salle de sport est équipée pour vous aider à atteindre vos objectifs de fitness.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 text-center sm:text-left animate__animated animate__fadeIn animate__delay-1s">
              <h3 className="text-xl sm:text-2xl font-bold text-gradient">Contact</h3>
              <div className="divider-primary w-16 mb-4 mx-auto sm:mx-0"></div>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="text-primary text-lg flex-shrink-0">✉</span> 
                  <a href="mailto:contact@zybodybuilding.tn" className="hover:text-primary transition-colors break-all">
                    contact@zybodybuilding.tn
                  </a>
                </li>
                <li className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-primary text-lg flex-shrink-0">📞</span>
                  <a href="tel:+21612345678" className="hover:text-primary transition-colors">
                    +216 123 456 78
                  </a>
                </li>
                <li className="flex items-start justify-center sm:justify-start gap-2">
                  <span className="text-primary text-lg mt-1 flex-shrink-0">📍</span>
                  <a 
                    href="https://www.google.com/maps/place/ZY.bodybuilding/@36.4272886,10.6763909,17z/data=!3m1!4b1!4m6!3m5!1s0x13029ffe9be4d185:0x7217af0826d0b35c!8m2!3d36.4272843!4d10.673816!16s%2Fg%2F11ygwn70fw?entry=ttu&g_ep=EgoyMDI1MTEwNS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors text-center sm:text-left"
                  >
                    ZY Bodybuilding, Tunisia<br />
                    <span className="text-sm text-neutral-400">Voir sur Google Maps</span>
                  </a>
                </li>
                <li className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-primary text-lg flex-shrink-0">🌐</span>
                  <a href="https://zybodybuilding.tn" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    ZYbodybuilding.tn
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 text-center sm:text-left animate__animated animate__fadeIn animate__delay-1.25s">
              <h3 className="text-xl sm:text-2xl font-bold text-gradient">Liens Rapides</h3>
              <div className="divider-primary w-16 mb-4 mx-auto sm:mx-0"></div>
              <ul className="space-y-3 text-neutral-300">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors inline-block py-1">Accueil</Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-primary transition-colors inline-block py-1">À propos</Link>
                </li>
                <li>
                  <Link href="#schedule" className="hover:text-primary transition-colors inline-block py-1">Programme</Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-primary transition-colors inline-block py-1">Tarifs</Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-primary transition-colors inline-block py-1">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="space-y-4 text-center sm:text-left animate__animated animate__fadeIn animate__delay-1.5s">
              <h3 className="text-xl sm:text-2xl font-bold text-gradient">Suivez-nous</h3>
              <div className="divider-primary w-16 mb-4 mx-auto sm:mx-0"></div>
              <div className="flex space-x-4 sm:space-x-6 justify-center sm:justify-start">
                <a href="#" className="text-neutral-300 hover:text-primary transition duration-300 transform hover:scale-110" aria-label="Facebook">
                  <FaFacebook className="text-2xl sm:text-3xl" />
                </a>
                <a href="#" className="text-neutral-300 hover:text-primary transition duration-300 transform hover:scale-110" aria-label="Twitter">
                  <FaTwitter className="text-2xl sm:text-3xl" />
                </a>
                <a href="#" className="text-neutral-300 hover:text-primary transition duration-300 transform hover:scale-110" aria-label="Instagram">
                  <FaInstagram className="text-2xl sm:text-3xl" />
                </a>
                <a href="#" className="text-neutral-300 hover:text-primary transition duration-300 transform hover:scale-110" aria-label="LinkedIn">
                  <FaLinkedin className="text-2xl sm:text-3xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Bar */}
      <div className="bg-dark py-4 sm:py-5 border-t border-primary/30">
        <div className="container mx-auto text-center px-4">
          <p className="text-neutral-400 text-xs sm:text-sm md:text-base">
            &copy; {currentYear} <span className="text-primary font-semibold">ZY BODYBUILDING</span>. Tous droits réservés. Crée par <span className="text-primary font-semibold">Rayen Troudi</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
