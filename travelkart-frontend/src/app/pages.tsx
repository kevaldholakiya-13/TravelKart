'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiCheckCircle, FiStar, FiUsers } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

// About Page Component
export function AboutPage() {
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-dark-900"
    >
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-r from-primary-50 to-accent-50 dark:from-dark-800 dark:to-dark-900">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About TravelKart</h1>
            <p className="text-xl text-dark-600 dark:text-dark-300 mb-8">
              Your trusted companion for premium travel essentials and adventure gear
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="page-container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-dark-600 dark:text-dark-400 mb-4 leading-relaxed">
                TravelKart was founded with a simple mission: to make quality travel gear accessible to everyone. 
                We believe that great adventures start with the right equipment.
              </p>
              <p className="text-dark-600 dark:text-dark-400 mb-4 leading-relaxed">
                Since our inception in 2020, we've served over 50,000 happy travelers and continue to curate 
                the finest selection of travel essentials, camping gear, and adventure equipment.
              </p>
              <p className="text-dark-600 dark:text-dark-400 leading-relaxed">
                From backpackers exploring Southeast Asia to business travelers seeking comfort, 
                TravelKart has the perfect solution for every journey.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative h-96 bg-gradient-to-br from-primary-400 to-accent-400 rounded-2xl overflow-hidden"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=600&fit=crop)',
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-dark-50 dark:bg-dark-800/50">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">
              These core values guide everything we do
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: FiStar,
                title: 'Quality First',
                description: 'We carefully curate every product to ensure premium quality',
              },
              {
                icon: FiUsers,
                title: 'Customer Focus',
                description: 'Your satisfaction is our top priority',
              },
              {
                icon: FiCheckCircle,
                title: 'Trust & Reliability',
                description: 'Secure transactions and reliable support',
              },
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="card p-8 text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white"
                  >
                    <Icon size={32} />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-dark-600 dark:text-dark-400">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <div className="page-container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            {[
              { number: '50K+', label: 'Happy Customers' },
              { number: '10K+', label: 'Products' },
              { number: '4.8★', label: 'Average Rating' },
              { number: '24/7', label: 'Support' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center"
              >
                <p className="text-4xl font-bold gradient-text mb-2">{stat.number}</p>
                <p className="text-dark-600 dark:text-dark-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

// Contact Page Component
export function ContactPage() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.subject && formData.message) {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      toast.error('Please fill all fields');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-dark-900"
    >
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-r from-primary-50 to-accent-50 dark:from-dark-800 dark:to-dark-900">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-dark-600 dark:text-dark-300">
              Have questions? We'd love to hear from you. Send us a message!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full input-glass"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full input-glass"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full input-glass"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full input-glass"
                    placeholder="Your message..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary w-full"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold">Contact Information</h2>

              {[
                {
                  icon: FiMapPin,
                  title: 'Address',
                  content: '123 Travel Street, Ahmedabad, Gujarat 380001',
                },
                {
                  icon: FiPhone,
                  title: 'Phone',
                  content: '+91 98765 43210',
                },
                {
                  icon: FiMail,
                  title: 'Email',
                  content: 'support@travelkart.com',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-dark-600 dark:text-dark-400">{item.content}</p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h4 className="font-bold mb-4">Business Hours</h4>
                <div className="space-y-2 text-sm text-dark-600 dark:text-dark-400">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-dark-50 dark:bg-dark-800/50">
        <div className="page-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden h-96 bg-dark-200 dark:bg-dark-700"
          >
            <div className="w-full h-full flex items-center justify-center text-dark-600 dark:text-dark-400">
              <p>Map integration coming soon...</p>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
