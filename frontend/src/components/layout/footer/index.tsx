import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Footer: React.FC = () => {
  const socialIcons = [
    { icon: faFacebookF, href: "#", label: "Facebook" },
    { icon: faInstagram, href: "#", label: "Instagram" },
    { icon: faLinkedinIn, href: "#", label: "LinkedIn" },
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-[#3367d6] to-[#4285F4] text-white py-6 md:py-8 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <Image
              src="/logo-light-transparent.png"
              alt="StudyMate AI Logo"
              width={180}
              height={45}
              className="h-auto w-auto"
              priority
            />
          </motion.div>

          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-5 md:gap-8"
          >
            <a 
              href="mailto:support@studymate.ai" 
              className="flex items-center space-x-2 text-sm hover:text-white group transition duration-300"
            >
              <div className="p-2 bg-white bg-opacity-20 rounded-full group-hover:bg-opacity-30 transition duration-300">
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
              </div>
              <span className="font-medium">support@studymate.ai</span>
            </a>
            <a 
              href="tel:(92) 111-222-333" 
              className="flex items-center space-x-2 text-sm hover:text-white group transition duration-300"
            >
              <div className="p-2 bg-white bg-opacity-20 rounded-full group-hover:bg-opacity-30 transition duration-300">
                <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
              </div>
              <span className="font-medium">(92) 111-222-333</span>
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center space-x-6 my-5"
        >
          {socialIcons.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 hover:transform hover:scale-110 transition duration-300"
              aria-label={social.label}
            >
              <FontAwesomeIcon icon={social.icon} className="w-4 h-4" />
            </motion.a>
          ))}
        </motion.div>

        <div className="border-t border-white border-opacity-20 pt-4 mt-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-white text-opacity-70"
          >
            &copy; {new Date().getFullYear()} StudyMate AI. All rights reserved.
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;