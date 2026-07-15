'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-dark-900 dark:bg-black text-white"
    >
      {/* Main Content */}
      <div className="page-container section-padding">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
        >
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20 rounded-lg flex items-center justify-center">
                <span className="font-bold">TK</span>
              </div>
              <span className="font-bold text-lg">TravelKart</span>
            </div>
            <p className="text-dark-400 mb-6">
              Your trusted companion for premium travel essentials and adventure gear.
            </p>
            <div className="flex gap-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <nav className="space-y-3">
              {['Home', 'Products', 'About', 'Contact'].map((link, idx) => (
                <motion.div key={idx} whileHover={{ x: 4 }}>
                  <Link
                    href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                    className="text-dark-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    {link}
                    <FiArrowRight size={14} />
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* Customer Service */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-lg mb-6">Customer Service</h4>
            <nav className="space-y-3">
              {['Contact Us', 'FAQs', 'Returns', 'Track Order'].map((link, idx) => (
                <motion.div key={idx} whileHover={{ x: 4 }}>
                  <a
                    href="#"
                    className="text-dark-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    {link}
                    <FiArrowRight size={14} />
                  </a>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants}>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <nav className="space-y-3">
              {['Privacy Policy', 'Terms & Conditions', 'Shipping Policy', 'Refund Policy'].map((link, idx) => (
                <motion.div key={idx} whileHover={{ x: 4 }}>
                  <a
                    href="#"
                    className="text-dark-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    {link}
                    <FiArrowRight size={14} />
                  </a>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-dark-800 pt-8"
        >
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="text-dark-400 text-sm">
              <p>&copy; 2024 TravelKart. All rights reserved.</p>
            </div>
            <div className="flex gap-6 md:justify-end flex-wrap">
              {[
                { label: '🔒 Secure', desc: 'Secure payments' },
                { label: '📦 Fast', desc: 'Quick delivery' },
                { label: '✓ Verified', desc: 'Trusted seller' },
              ].map((badge, idx) => (
                <div key={idx} className="text-sm text-dark-400 hover:text-white transition-colors">
                  <span className="font-semibold">{badge.label}</span>
                  <p className="text-xs">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-20" />
    </motion.footer>
  );
};

export default Footer;
