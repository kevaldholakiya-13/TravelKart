'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiPackage, FiHeart, FiSettings, FiLogOut, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { useAuthStore } from '../../store';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
}

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [userInfo, setUserInfo] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+91 9876543210',
    address: '123 Travel Street, Ahmedabad, Gujarat 380001',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  });

  const [orders] = useState<Order[]>([
    {
      id: 'TK987654321',
      date: '2024-01-15',
      total: 45999,
      status: 'delivered',
      items: 3,
    },
    {
      id: 'TK987654322',
      date: '2024-01-10',
      total: 12999,
      status: 'shipped',
      items: 1,
    },
    {
      id: 'TK987654323',
      date: '2024-01-05',
      total: 24999,
      status: 'delivered',
      items: 2,
    },
  ]);

  const [wishlist] = useState([
    {
      id: '1',
      name: 'Premium Travel Backpack',
      price: 8999,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
    },
    {
      id: '2',
      name: 'Travel Pillow Pro',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=300&fit=crop',
    },
  ]);

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const statusColors = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    shipped: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    delivered: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white dark:bg-dark-900 flex items-center justify-center"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Please log in to continue</h1>
          <p className="text-dark-600 dark:text-dark-400 mb-8">
            You need to be logged in to access your dashboard
          </p>
          <Link href="/login" className="btn-primary">
            Go to Login
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
          <h1 className="text-4xl md:text-5xl font-bold mb-2">My Account</h1>
          <p className="text-dark-600 dark:text-dark-400">Manage your orders and preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card p-6">
              {/* User Card */}
              <div className="mb-8 pb-8 border-b border-dark-200 dark:border-dark-700">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 mb-4 overflow-hidden">
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg mb-1">{userInfo.name}</h3>
                <p className="text-sm text-dark-600 dark:text-dark-400">{userInfo.email}</p>
              </div>

              {/* Navigation */}
              <div className="space-y-2">
                {[
                  { id: 'orders', label: 'My Orders', icon: FiPackage },
                  { id: 'profile', label: 'Profile', icon: FiUser },
                  { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
                  { id: 'settings', label: 'Settings', icon: FiSettings },
                ].map(({ id, label, icon: Icon }) => (
                  <motion.button
                    key={id}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveTab(id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeTab === id
                        ? 'bg-primary-600 text-white'
                        : 'text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </motion.button>
                ))}
              </div>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  logout();
                  toast.success('Logged out successfully');
                }}
                className="w-full mt-8 pt-8 border-t border-dark-200 dark:border-dark-700 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-3"
              >
                <FiLogOut size={18} />
                Logout
              </motion.button>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: 0.1 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold mb-6">My Orders</h2>

                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-6 border border-dark-200 dark:border-dark-700 rounded-xl hover:border-primary-400 transition-colors cursor-pointer"
                      >
                        <div className="grid md:grid-cols-4 gap-4 items-center">
                          <div>
                            <p className="text-sm text-dark-600 dark:text-dark-400">Order ID</p>
                            <p className="font-bold">{order.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-dark-600 dark:text-dark-400">Date</p>
                            <p className="font-bold">
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-dark-600 dark:text-dark-400">Total</p>
                            <p className="font-bold gradient-text">₹{order.total.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-dark-600 dark:text-dark-400">Status</p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize mt-1 ${statusColors[order.status]}`}>
                                {order.status}
                              </span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn-outline text-sm"
                            >
                              Track
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: 0.1 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

                  <div className="space-y-6">
                    {/* Avatar */}
                    <div>
                      <p className="text-sm font-semibold text-dark-600 dark:text-dark-400 mb-3">Profile Picture</p>
                      <div className="flex items-end gap-4">
                        <div className="w-32 h-32 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 overflow-hidden">
                          <img
                            src={userInfo.avatar}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-secondary"
                        >
                          Change Photo
                        </motion.button>
                      </div>
                    </div>

                    {/* Info Fields */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Full Name</label>
                        <input
                          type="text"
                          value={userInfo.name}
                          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                          className="w-full input-glass"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                          className="w-full input-glass"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                          <FiPhone size={16} />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={userInfo.phone}
                          onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                          className="w-full input-glass"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                          <FiMapPin size={16} />
                          Address
                        </label>
                        <textarea
                          value={userInfo.address}
                          onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                          rows={3}
                          className="w-full input-glass"
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toast.success('Profile updated successfully!')}
                      className="btn-primary"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: 0.1 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold mb-6">My Wishlist ({wishlist.length})</h2>

                  {wishlist.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {wishlist.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.05 }}
                          className="rounded-xl overflow-hidden border border-dark-200 dark:border-dark-700"
                        >
                          <div className="h-48 bg-dark-100 dark:bg-dark-800 relative overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold mb-2">{item.name}</h4>
                            <p className="font-bold gradient-text mb-4">₹{item.price.toLocaleString()}</p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn-primary w-full text-sm"
                            >
                              Add to Cart
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-dark-600 dark:text-dark-400 text-center py-12">
                      Your wishlist is empty. Start adding items!
                    </p>
                  )}
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: 0.1 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold mb-6">Settings</h2>

                  <div className="space-y-6">
                    {/* Notifications */}
                    <div className="pb-6 border-b border-dark-200 dark:border-dark-700">
                      <h4 className="font-bold mb-4">Email Notifications</h4>
                      <div className="space-y-3">
                        {[
                          { label: 'Order updates', checked: true },
                          { label: 'Promotional emails', checked: true },
                          { label: 'Newsletter', checked: false },
                        ].map((item, idx) => (
                          <label key={idx} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={item.checked}
                              className="w-5 h-5 rounded accent-primary-600"
                            />
                            <span className="font-medium">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Privacy */}
                    <div className="pb-6 border-b border-dark-200 dark:border-dark-700">
                      <h4 className="font-bold mb-4">Privacy</h4>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-outline"
                      >
                        Change Password
                      </motion.button>
                    </div>

                    {/* Danger Zone */}
                    <div>
                      <h4 className="font-bold text-red-600 mb-4">Danger Zone</h4>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Delete Account
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
