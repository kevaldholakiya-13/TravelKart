'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiMapPin, FiPhone, FiMail, FiArrowLeft } from 'react-icons/fi';
import { useStore } from '../../store';
import toast from 'react-hot-toast';
import Link from 'next/link';

const CheckoutPage = () => {
  const items = useStore((state) => state.items);
  const getCartTotal = useStore((state) => state.getCartTotal());
  const clearCart = useStore((state) => state.clearCart);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    isDeliverable: false,
    estimatedDays: 0,
    checking: false,
  });

  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getCartTotal;
  const shipping = 299;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkDelivery = async () => {
    if (!formData.pincode) {
      toast.error('Please enter pincode');
      return;
    }

    setDeliveryInfo({ ...deliveryInfo, checking: true });
    
    // Mock API call
    setTimeout(() => {
      const deliverablePincodes = ['380001', '380002', '380015', '380019', '380006', '380008'];
      const isDeliverable = deliverablePincodes.includes(formData.pincode);
      
      setDeliveryInfo({
        isDeliverable,
        estimatedDays: isDeliverable ? 3 : 0,
        checking: false,
      });

      if (isDeliverable) {
        toast.success('Delivery available at your location!');
      } else {
        toast.error('We currently do not deliver to this pincode');
      }
    }, 1500);
  };

  const handlePlaceOrder = async () => {
    if (!formData.firstName || !formData.email || !formData.address || !formData.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!deliveryInfo.isDeliverable) {
      toast.error('Please check delivery availability');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      toast.success('Order placed successfully!');
      setStep(4);
    }, 3000);
  };

  const paymentMethods = [
    { id: 'stripe', name: 'Credit/Debit Card (Stripe)', icon: '💳' },
    { id: 'razorpay', name: 'Razorpay', icon: '🏦' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
    { id: 'upi', name: 'UPI', icon: '📱' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
  ];

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  if (items.length === 0 && step !== 4) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center section-padding"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-dark-600 dark:text-dark-400 mb-8">Add items to proceed with checkout</p>
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
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
          <Link href="/cart" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 w-fit">
            <FiArrowLeft size={20} />
            <span>Back to Cart</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">Secure Checkout</h1>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {[
              { num: 1, title: 'Shipping' },
              { num: 2, title: 'Payment' },
              { num: 3, title: 'Review' },
              { num: 4, title: 'Confirmation' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center gap-4 min-w-fit">
                <motion.div
                  animate={{
                    backgroundColor: step >= s.num ? 'rgb(6, 182, 212)' : 'rgb(229, 231, 235)',
                    color: step >= s.num ? 'white' : 'rgb(107, 114, 128)',
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                >
                  {step > s.num ? <FiCheck size={20} /> : s.num}
                </motion.div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold">{s.title}</p>
                </div>
                {idx < 3 && <div className="hidden sm:block w-12 h-1 bg-dark-200 dark:bg-dark-700" />}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold mb-8">Shipping Address</h2>

                  <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name *"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-glass"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-glass"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-glass sm:col-span-2"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-glass sm:col-span-2"
                    />
                    <textarea
                      name="address"
                      placeholder="Complete Address *"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="input-glass sm:col-span-2"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input-glass"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="input-glass"
                    />
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode *"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="input-glass"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={checkDelivery}
                      disabled={deliveryInfo.checking}
                      className="btn-secondary disabled:opacity-50"
                    >
                      {deliveryInfo.checking ? 'Checking...' : 'Check Delivery'}
                    </motion.button>
                  </div>

                  {deliveryInfo.isDeliverable && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg mb-8"
                    >
                      <p className="text-green-700 dark:text-green-300">
                        ✓ Delivery available! Estimated delivery: {deliveryInfo.estimatedDays} business days
                      </p>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    disabled={!deliveryInfo.isDeliverable}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    Continue to Payment
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold mb-8">Select Payment Method</h2>

                  <div className="grid gap-4 mb-8">
                    {paymentMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                          paymentMethod === method.id
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-dark-200 dark:border-dark-700 hover:border-primary-300'
                        }`}
                      >
                        <span className="text-3xl">{method.icon}</span>
                        <div>
                          <p className="font-semibold">{method.name}</p>
                          <p className="text-sm text-dark-600 dark:text-dark-400">
                            {method.id === 'cod' ? 'Pay when you receive' : 'Secure payment'}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(1)}
                      className="btn-secondary flex-1"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(3)}
                      className="btn-primary flex-1"
                    >
                      Continue
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold mb-8">Review Order</h2>

                  {/* Order Items */}
                  <div className="mb-8 pb-8 border-b border-dark-200 dark:border-dark-700">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4 mb-6">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-dark-600 dark:text-dark-400">Qty: {item.quantity}</p>
                          <p className="font-bold gradient-text mt-2">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  <div className="mb-8 pb-8 border-b border-dark-200 dark:border-dark-700">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <FiMapPin size={18} />
                      Shipping Address
                    </h4>
                    <p className="text-dark-700 dark:text-dark-300">
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p className="text-dark-600 dark:text-dark-400 text-sm">{formData.address}</p>
                    <p className="text-dark-600 dark:text-dark-400 text-sm">
                      {formData.city}, {formData.state} - {formData.pincode}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-8">
                    <h4 className="font-bold mb-3">Payment Method</h4>
                    <p className="text-dark-700 dark:text-dark-300">
                      {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(2)}
                      className="btn-secondary flex-1"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="card p-8 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-6xl mb-6"
                  >
                    ✓
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
                  <p className="text-dark-600 dark:text-dark-400 mb-8">
                    Thank you for your purchase. You'll receive a confirmation email shortly.
                  </p>
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg mb-8">
                    <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">Order Number</p>
                    <p className="font-bold text-lg gradient-text">TK{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>
                  <Link href="/dashboard" className="btn-primary w-full">
                    View Order Status
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-dark-200 dark:border-dark-700">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-600 dark:text-dark-400">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-600 dark:text-dark-400">Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-600 dark:text-dark-400">Tax (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-8">
                <span className="text-dark-600 dark:text-dark-400">Total</span>
                <span className="text-3xl font-bold gradient-text">₹{total.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-dark-600 dark:text-dark-400">
                  <span>✓</span> Secure Payment
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-600 dark:text-dark-400">
                  <span>✓</span> 30-Day Returns
                </div>
                <div className="flex items-center gap-2 text-xs text-dark-600 dark:text-dark-400">
                  <span>✓</span> Order Tracking
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
