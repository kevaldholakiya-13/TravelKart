'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useStore } from '../../store';
import toast from 'react-hot-toast';

const CartPage = () => {
  const items = useStore((state) => state.items);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const clearCart = useStore((state) => state.clearCart);
  const getCartTotal = useStore((state) => state.getCartTotal());

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const SHIPPING_COST = 299;
  const TAX_RATE = 0.18;

  const subtotal = getCartTotal;
  const discountAmount = (subtotal * discount) / 100;
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + tax + SHIPPING_COST;

  const handleApplyCoupon = () => {
    if (couponCode === 'TRAVEL20') {
      setDiscount(20);
      toast.success('Coupon applied! 20% discount');
    } else if (couponCode === 'TRAVEL10') {
      setDiscount(10);
      toast.success('Coupon applied! 10% discount');
    } else {
      toast.error('Invalid coupon code');
    }
    setCouponCode('');
  };

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
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  if (items.length === 0) {
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
              🛒
            </div>
            <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-dark-600 dark:text-dark-400 text-lg mb-8">
              Discover amazing travel essentials and add them to your cart to get started!
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
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-dark-600 dark:text-dark-400">{items.length} items in your cart</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="md:col-span-2"
          >
            <div className="bg-dark-50 dark:bg-dark-800/50 rounded-2xl p-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    exit={{ opacity: 0, x: -100 }}
                    layout
                    className="flex gap-4 mb-6 pb-6 border-b border-dark-200 dark:border-dark-700 last:mb-0 last:pb-0 last:border-0"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-dark-700">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-dark-600 dark:text-dark-400 mb-3">{item.category}</p>
                      <p className="text-lg font-bold gradient-text">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col justify-between items-end">
                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 bg-white dark:bg-dark-700 rounded-lg p-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-dark-100 dark:hover:bg-dark-600 rounded transition-colors"
                        >
                          <FiMinus size={16} />
                        </motion.button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-dark-100 dark:hover:bg-dark-600 rounded transition-colors"
                        >
                          <FiPlus size={16} />
                        </motion.button>
                      </div>

                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success(`${item.name} removed from cart`);
                        }}
                        className="mt-3 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear Cart */}
              {items.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    clearCart();
                    toast.success('Cart cleared');
                  }}
                  className="mt-6 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                >
                  Clear Cart
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1"
          >
            <div className="card p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              {/* Coupon Code */}
              <div className="mb-6 pb-6 border-b border-dark-200 dark:border-dark-700">
                <p className="text-sm text-dark-600 dark:text-dark-400 mb-3">Have a coupon code?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 bg-dark-100 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleApplyCoupon}
                    className="btn-primary text-sm"
                  >
                    Apply
                  </motion.button>
                </div>
                <p className="text-xs text-dark-500 mt-2">Try: TRAVEL10 or TRAVEL20</p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-dark-200 dark:border-dark-700">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-600 dark:text-dark-400">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-between text-sm text-green-600 dark:text-green-400"
                  >
                    <span>Discount ({discount}%)</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </motion.div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-dark-600 dark:text-dark-400">Shipping</span>
                  <span className="font-semibold">₹{SHIPPING_COST}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-dark-600 dark:text-dark-400">Tax (18%)</span>
                  <span className="font-semibold">₹{tax.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-dark-600 dark:text-dark-400">Total</span>
                  <span className="text-3xl font-bold gradient-text">₹{total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-dark-500">Inclusive of all taxes and fees</p>
              </div>

              {/* Checkout Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/checkout" className="btn-primary w-full text-center block mb-3">
                  Proceed to Checkout
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/products" className="btn-secondary w-full text-center block">
                  Continue Shopping
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-dark-200 dark:border-dark-700 space-y-2">
                <div className="flex items-center gap-2 text-xs text-dark-600 dark:text-dark-400">
                  <span>✓</span> Secure Checkout
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-600 dark:text-dark-400">
                  <span>✓</span> 30-Day Returns
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-600 dark:text-dark-400">
                  <span>✓</span> Free Shipping on Orders ₹500+
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;
