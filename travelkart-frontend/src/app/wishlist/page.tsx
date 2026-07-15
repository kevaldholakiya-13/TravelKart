'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiTrash2, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { useStore } from '../../store';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const wishlist = useStore((state) => state.wishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const addToCart = useStore((state) => state.addToCart);

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
    exit: { opacity: 0, x: 20 },
  };

  if (wishlist.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center"
      >
        <div className="page-container text-center py-20">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-dark-100 dark:bg-dark-800 rounded-full flex items-center justify-center text-4xl">
              🤍
            </div>
            <h1 className="text-4xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-dark-600 dark:text-dark-400 text-lg mb-8">
              Save your favorite products to your wishlist for later!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/products" className="btn-primary inline-block">
                Continue Shopping
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-dark-900 section-padding"
    >
      <div className="page-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link href="/" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 w-fit">
            <FiArrowLeft size={20} />
            <span>Back to Shopping</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">My Wishlist</h1>
          <p className="text-dark-600 dark:text-dark-400">{wishlist.length} items saved</p>
        </motion.div>

        {/* Wishlist Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {wishlist.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="card-interactive group"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden rounded-t-2xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    removeFromWishlist(item.id);
                    toast.success(`${item.name} removed from wishlist`);
                  }}
                  className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-dark-800/90 backdrop-blur rounded-lg hover:bg-red-500 text-dark-900 dark:text-white hover:text-white transition-colors"
                >
                  <FiTrash2 size={18} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">{item.category}</p>
                <p className="text-2xl font-bold gradient-text mb-6">₹{item.price.toLocaleString()}</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      image: item.image,
                      category: item.category,
                    });
                    removeFromWishlist(item.id);
                    toast.success(`${item.name} moved to cart`);
                  }}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <FiShoppingCart size={18} />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WishlistPage;
