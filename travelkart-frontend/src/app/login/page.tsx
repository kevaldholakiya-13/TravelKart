'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate
    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      setIsLoading(false);
      return;
    }

    if (!isLogin) {
      if (!formData.name) {
        toast.error('Please enter your name');
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setIsLoading(false);
        return;
      }
    }

    // Mock API call
    setTimeout(() => {
      try {
        const mockToken = `token_${Math.random().toString(36).substr(2, 9)}`;
        const mockUser = {
          id: Math.random().toString(36).substr(2, 9),
          email: formData.email,
          name: formData.name || 'User',
          role: 'customer' as const,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        };

        setUser(mockUser);
        setToken(mockToken);
        toast.success(`Welcome ${mockUser.name}!`);
        router.push('/');
        setIsLoading(false);
      } catch (error) {
        toast.error('Authentication failed');
        setIsLoading(false);
      }
    }, 1500);
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-800 dark:via-dark-900 dark:to-dark-800 flex items-center justify-center section-padding"
    >
      {/* Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 right-10 w-72 h-72 bg-primary-200 dark:bg-primary-900/30 rounded-full blur-3xl opacity-30"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 left-10 w-72 h-72 bg-accent-200 dark:bg-accent-900/30 rounded-full blur-3xl opacity-30"
      />

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="card p-8 md:p-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-block w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">TK</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-dark-600 dark:text-dark-400">
              {isLogin
                ? 'Login to continue shopping'
                : 'Join TravelKart and explore amazing products'}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Name Field (Register Only) */}
              {!isLogin && (
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500" size={18} />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500 hover:text-dark-600 dark:hover:text-dark-300"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Confirm Password Field (Register Only) */}
              {!isLogin && (
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* Remember/Forgot */}
              {isLogin && (
                <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded accent-primary-600"
                    />
                    <span className="text-dark-700 dark:text-dark-300">Remember me</span>
                  </label>
                  <Link href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                    Forgot password?
                  </Link>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Login' : 'Create Account'}
                    <FiArrowRight size={18} />
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div className="flex-1 h-px bg-dark-200 dark:bg-dark-700" />
                <span className="text-sm text-dark-600 dark:text-dark-400">OR</span>
                <div className="flex-1 h-px bg-dark-200 dark:bg-dark-700" />
              </motion.div>

              {/* Social Login */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="p-3 border-2 border-dark-200 dark:border-dark-700 rounded-xl hover:border-primary-400 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🔵</span>
                  <span className="text-xs font-semibold hidden sm:inline">Google</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="p-3 border-2 border-dark-200 dark:border-dark-700 rounded-xl hover:border-primary-400 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🐙</span>
                  <span className="text-xs font-semibold hidden sm:inline">GitHub</span>
                </motion.button>
              </motion.div>

              {/* Toggle */}
              <motion.div variants={itemVariants} className="text-center pt-4">
                <p className="text-dark-600 dark:text-dark-400">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setFormData({
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                      });
                    }}
                    className="font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Login'}
                  </motion.button>
                </p>
              </motion.div>
            </motion.form>
          </AnimatePresence>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-8 pt-8 border-t border-dark-200 dark:border-dark-700 text-center"
          >
            <p className="text-xs text-dark-600 dark:text-dark-400">
              By {isLogin ? 'logging in' : 'signing up'}, you agree to our{' '}
              <Link href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                Terms
              </Link>
              {' '}and{' '}
              <Link href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center justify-center gap-6 text-xs text-dark-600 dark:text-dark-400"
        >
          <div className="flex items-center gap-2">
            <span>🔒</span> Secure
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span> Fast
          </div>
          <div className="flex items-center gap-2">
            <span>🛡️</span> Safe
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AuthPage;
