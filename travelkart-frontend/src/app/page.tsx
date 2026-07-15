'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiHeadphones, FiShoppingCart, FiHeart, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { useStore } from '../store';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const addToCart = useStore((state) => state.addToCart);
  const addToWishlist = useStore((state) => state.addToWishlist);

  useEffect(() => { setIsLoading(false); }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const categories = [
    { name: 'Backpacks', emoji: '🎒', color: 'from-emerald-500 to-teal-400', count: 24 },
    { name: 'Luggage', emoji: '🧳', color: 'from-amber-500 to-yellow-400', count: 18 },
    { name: 'Electronics', emoji: '🔌', color: 'from-emerald-600 to-green-400', count: 15 },
    { name: 'Camping', emoji: '⛺', color: 'from-teal-500 to-cyan-400', count: 12 },
    { name: 'Clothing', emoji: '👕', color: 'from-amber-600 to-orange-400', count: 20 },
    { name: 'Accessories', emoji: '🧢', color: 'from-emerald-400 to-lime-400', count: 35 },
  ];

  const testimonials = [
    { name: 'Priya Sharma', location: 'Mumbai', text: 'Best travel gear store! The backpack survived a 15-day trek in Ladakh. Absolutely worth every rupee.', rating: 5, avatar: '👩' },
    { name: 'Rahul Patel', location: 'Ahmedabad', text: 'Amazing quality at budget-friendly prices. The packing cubes changed how I pack forever. Highly recommended!', rating: 5, avatar: '👨' },
    { name: 'Anjali Desai', location: 'Delhi', text: 'Fast delivery and premium packaging. The neck pillow and travel adapter are my flight essentials now.', rating: 4, avatar: '👩' },
  ];

  const featuredProducts = [
    { id: '1', name: 'Pro Travel Backpack', price: 12999, originalPrice: 15999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', rating: 4.5, category: 'Backpacks', badge: 'Bestseller' },
    { id: '2', name: 'Durable Travel Luggage', price: 24999, originalPrice: 29999, image: 'https://images.unsplash.com/photo-1581553680321-4fffae59fccd?w=400&h=400&fit=crop', rating: 4.8, category: 'Luggage', badge: 'Premium' },
    { id: '3', name: 'Premium Camera Bag', price: 8999, originalPrice: 11999, image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&h=400&fit=crop', rating: 4.3, category: 'Accessories', badge: 'New' },
  ];

  const budgetProducts = [
    { id: '11', name: 'Ergonomic Travel Neck Pillow', price: 799, originalPrice: 1199, discount: 33, image: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?w=400&h=400&fit=crop', rating: 4.5, category: 'Accessories' },
    { id: '12', name: 'Universal World Travel Adapter', price: 999, originalPrice: 1499, discount: 33, image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=400&fit=crop', rating: 4.7, category: 'Electronics' },
    { id: '13', name: 'Hanging Toiletries Organizer', price: 649, originalPrice: 899, discount: 27, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop', rating: 4.6, category: 'Accessories' },
    { id: '14', name: 'Compression Packing Cubes (6)', price: 899, originalPrice: 1299, discount: 30, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop', rating: 4.8, category: 'Accessories' },
    { id: '15', name: 'Digital Luggage Scale', price: 499, originalPrice: 799, discount: 37, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop', rating: 4.4, category: 'Electronics' },
    { id: '16', name: 'Quick-Dry Microfiber Towel', price: 399, originalPrice: 599, discount: 33, image: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?w=400&h=400&fit=crop', rating: 4.7, category: 'Accessories' },
  ];

  const handleAddToCart = (product: any) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, quantity: 1 });
    toast.success(`${product.name} added to cart!`);
  };
  const handleAddToWishlist = (product: any) => {
    addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    toast.success('Added to wishlist!');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-dark-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-600 dark:text-dark-400 text-lg">Loading TravelKart...</p>
        </div>
      </div>
    );
  }

  const ProductCard = ({ product, showDiscount = false }: { product: any; showDiscount?: boolean }) => (
    <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="card-interactive overflow-hidden group cursor-pointer relative">
      <Link href={`/products/${product.id}`} className="block">
        {showDiscount && product.discount && (
          <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-amber-500/30">
            -{product.discount}% OFF
          </div>
        )}
        {!showDiscount && product.badge && (
          <div className="absolute top-4 left-4 z-10 bg-dark-900 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {product.badge}
          </div>
        )}
        <div className="relative h-72 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-6 pb-2">
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary-600 transition-colors">{product.name}</h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-dark-300'} />
            ))}
            <span className="text-xs text-dark-500 ml-1">({product.rating})</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold gradient-text">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-sm text-dark-400 line-through">₹{product.originalPrice.toLocaleString()}</span>}
          </div>
        </div>
      </Link>
      <div className="p-6 pt-0">
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
            <FiShoppingCart size={16} /> Add to Cart
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); handleAddToWishlist(product); }} className="p-3 rounded-xl border border-dark-200 dark:border-dark-700 hover:border-accent-400 hover:text-accent-500 transition-colors">
            <FiHeart size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-dark-900 min-h-screen">

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 pt-16 pb-28">
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/40 dark:bg-emerald-800/15 rounded-full blur-3xl" />
        <motion.div animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/30 dark:bg-amber-800/10 rounded-full blur-3xl" />
        <motion.div animate={{ x: [0, 15, 0], y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-40 right-1/4 w-20 h-20 bg-emerald-300/20 rounded-full blur-xl" />

        <div className="page-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="inline-block text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 px-4 py-1.5 rounded-full mb-6 border border-emerald-200 dark:border-emerald-800">
                🌍 India&apos;s #1 Travel Gear Store
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-dark-900 dark:text-white leading-tight">
                Your Perfect{' '}<span className="gradient-text">Travel</span>{' '}<span className="gradient-text">Companion</span>
              </h1>
              <p className="text-xl text-dark-600 dark:text-dark-300 mb-8 max-w-xl leading-relaxed">
                Discover 25+ premium travel essentials — from budget-friendly accessories starting at ₹249 to premium backpacks and luggage for every adventure.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/products" className="btn-primary text-base px-8 py-4">Shop Now <FiArrowRight size={20} /></Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/products" className="btn-outline text-base px-8 py-4">Budget Deals</Link>
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-wrap items-center gap-6 mt-10 text-sm text-dark-600 dark:text-dark-400">
                <span className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> Free Shipping over ₹1000</span>
                <span className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> 7-Day Easy Returns</span>
                <span className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> COD Available</span>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="rounded-2xl overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop" alt="Travel Backpack" className="w-full h-64 object-cover" />
                </motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="rounded-2xl overflow-hidden shadow-2xl mt-8">
                  <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=500&fit=crop" alt="Adventure" className="w-full h-64 object-cover" />
                </motion.div>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="rounded-2xl overflow-hidden shadow-2xl -mt-4">
                  <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop" alt="Travel Shoes" className="w-full h-64 object-cover" />
                </motion.div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} className="rounded-2xl overflow-hidden shadow-2xl mt-4">
                  <img src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=500&fit=crop" alt="Water Bottle" className="w-full h-64 object-cover" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ FEATURES BAR ════════════════════════ */}
      <section className="relative -mt-12 z-20 px-4">
        <div className="page-container">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-4 gap-0 bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-dark-100 dark:border-dark-700 overflow-hidden">
            {[
              { icon: FiTruck, title: 'Fast Delivery', description: 'Free on orders over ₹1000', color: 'text-blue-500' },
              { icon: FiShield, title: 'Secure Payment', description: '100% secure transactions', color: 'text-green-500' },
              { icon: FiStar, title: 'Top Quality', description: 'Premium tested products', color: 'text-yellow-500' },
              { icon: FiHeadphones, title: '24/7 Support', description: 'Dedicated customer care', color: 'text-purple-500' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div key={idx} variants={itemVariants} className={`flex items-center gap-4 p-6 ${idx < 3 ? 'md:border-r border-b md:border-b-0 border-dark-100 dark:border-dark-700' : ''} hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors`}>
                  <div className={`p-3 rounded-xl bg-dark-50 dark:bg-dark-700 ${feature.color}`}><Icon size={24} /></div>
                  <div>
                    <h3 className="font-bold text-sm">{feature.title}</h3>
                    <p className="text-dark-500 dark:text-dark-400 text-xs">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════ CATEGORIES ════════════════════════ */}
      <section className="section-padding">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-dark-900 dark:text-white">Shop by Category</h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-xl mx-auto">Browse through our expertly curated categories to find exactly what you need</p>
          </motion.div>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Link href={`/products`}>
                  <motion.div whileHover={{ y: -8, scale: 1.02 }} whileTap={{ scale: 0.98 }} className="card text-center p-6 cursor-pointer group">
                    <motion.span className="text-4xl block mb-3" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}>{cat.emoji}</motion.span>
                    <h3 className="font-bold text-sm mb-1 group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                    <p className="text-xs text-dark-500 dark:text-dark-400">{cat.count} items</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════ FEATURED PRODUCTS ════════════════════════ */}
      <section className="section-padding bg-dark-50 dark:bg-dark-800/50">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-dark-900 dark:text-white">Featured Products</h2>
              <p className="text-dark-600 dark:text-dark-400">Handpicked bestsellers just for you</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:gap-3 transition-all">View All <FiArrowRight /></Link>
          </motion.div>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, idx) => <ProductCard key={idx} product={product} />)}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex justify-center mt-10 md:hidden">
            <Link href="/products" className="btn-secondary">View All Products <FiArrowRight size={20} /></Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════ BUDGET ESSENTIALS ════════════════════════ */}
      <section className="section-padding">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 px-4 py-1.5 rounded-full mb-4 border border-amber-200 dark:border-amber-800">💰 Budget-Friendly</span>
            <h2 className="text-4xl font-bold mb-4 text-dark-900 dark:text-white">Travel Must-Haves Under ₹1,000</h2>
            <p className="text-dark-600 dark:text-dark-400 max-w-2xl mx-auto">Pack smart without breaking the bank — highly rated essentials for every explorer</p>
          </motion.div>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {budgetProducts.map((product, idx) => <ProductCard key={idx} product={product} showDiscount />)}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════ STATS COUNTER ════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-emerald-900 via-dark-900 to-emerald-900">
        <div className="page-container">
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Happy Travelers', icon: '🎉' },
              { number: '25+', label: 'Travel Products', icon: '🎒' },
              { number: '4.8★', label: 'Average Rating', icon: '⭐' },
              { number: '500+', label: 'Cities Delivered', icon: '🚚' },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants} className="text-center">
                <span className="text-3xl block mb-2">{stat.icon}</span>
                <motion.p className="text-4xl md:text-5xl font-bold text-white mb-2" initial={{ scale: 0.5 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200, delay: idx * 0.1 }}>
                  {stat.number}
                </motion.p>
                <p className="text-dark-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════ TESTIMONIALS ════════════════════════ */}
      <section className="section-padding bg-dark-50 dark:bg-dark-800/30">
        <div className="page-container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-dark-900 dark:text-white">Loved by Travelers</h2>
            <p className="text-dark-600 dark:text-dark-400">Real reviews from our happy customers</p>
          </motion.div>
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div key={idx} variants={itemVariants} whileHover={{ y: -6 }} className="card p-8 relative">
                <div className="absolute -top-3 left-8 text-5xl opacity-10 font-serif">&ldquo;</div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <FiStar key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-dark-600 dark:text-dark-300 mb-6 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-lg">{t.avatar}</div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-dark-500 flex items-center gap-1"><FiMapPin size={10} /> {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════ NEWSLETTER ════════════════════════ */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600" />
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute top-10 left-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl" />
        <motion.div animate={{ x: [0, -20, 0], y: [0, 15, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-10 right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
        <div className="page-container max-w-2xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-5xl block mb-4">✈️</span>
            <h2 className="text-4xl font-bold mb-4 text-white">Ready for Your Next Adventure?</h2>
            <p className="text-emerald-100 mb-8 text-lg">Subscribe for exclusive deals, travel tips, and early access to new arrivals</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-dark-900 text-base" />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-amber-400 text-emerald-900 font-bold px-8 py-4 rounded-xl hover:bg-amber-300 transition-colors text-base shadow-lg shadow-amber-400/20">
                Subscribe
              </motion.button>
            </div>
            <p className="text-emerald-200 text-sm mt-4">Join 10,000+ travelers. No spam, unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
