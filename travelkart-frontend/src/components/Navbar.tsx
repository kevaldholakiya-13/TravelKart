'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, useAuthStore } from '../store';
import { FiShoppingCart, FiHeart, FiSearch, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const cartCount = useStore((state) => state.getCartCount());
  const wishlistCount = useStore((state) => state.getWishlistCount());
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const categories = [
    'Backpacks',
    'Luggage',
    'Accessories',
    'Electronics',
    'Camping',
    'Shoes',
    'Clothing',
    'Water Bottles',
  ];

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      {/* Premium Navigation */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        transition={{ duration: 0.6 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-dark-900/95 backdrop-blur-md shadow-md'
            : 'bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm'
        }`}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TK</span>
                </div>
                <span className="hidden sm:inline font-display font-bold text-xl gradient-text">
                  TravelKart
                </span>
              </Link>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {categories.map((category) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={`/products?category=${category.toLowerCase()}`}
                    className="px-3 py-2 text-sm font-medium text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {category}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-4 py-2 rounded-lg bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500"
                  >
                    <FiSearch size={18} />
                  </button>
                </form>
              </div>

              {/* Icons */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
              >
                <FiSearch size={20} />
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link href="/wishlist" className="relative p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors">
                  <FiHeart size={20} />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-accent-500 text-white text-xs flex items-center justify-center rounded-full font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link href="/cart" className="relative p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors">
                  <FiShoppingCart size={20} />
                  {mounted && cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-primary-500 text-white text-xs flex items-center justify-center rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </motion.div>

              {/* Auth */}
              {mounted && user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <FiUser size={18} />
                    {user.name}
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      logout();
                      toast.success('Logged out successfully');
                    }}
                    className="p-2 text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                  >
                    <FiLogOut size={20} />
                  </motion.button>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/login" className="btn-primary text-sm">
                    Sign In
                  </Link>
                </motion.div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Search */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden pb-4"
              >
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-dark-100 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500"
                  >
                    <FiSearch size={18} />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-dark-200 dark:border-dark-700 py-4 space-y-2"
              >
                {categories.map((category, index) => (
                  <motion.div
                    key={category}
                    initial="hidden"
                    animate="visible"
                    variants={menuItemVariants}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={`/products?category=${category.toLowerCase()}`}
                      className="block px-4 py-2 text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
