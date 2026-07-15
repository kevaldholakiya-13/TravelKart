'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBarChart2, FiShoppingBag, FiUsers, FiTrendingUp, FiPlus, FiEdit2, FiTrash2, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  sales: number;
}

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Pro Travel Backpack', price: 12999, stock: 45, category: 'Backpacks', sales: 324 },
    { id: '2', name: 'Durable Travel Luggage', price: 24999, stock: 23, category: 'Luggage', sales: 215 },
    { id: '3', name: 'Premium Camera Bag', price: 8999, stock: 67, category: 'Accessories', sales: 142 },
  ]);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Backpacks' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const stats: DashboardStats = {
    totalSales: 450000,
    totalOrders: 156,
    totalCustomers: 892,
    totalProducts: 234,
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.stock) {
      const product: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: newProduct.name,
        price: parseInt(newProduct.price),
        stock: parseInt(newProduct.stock),
        category: newProduct.category,
        sales: 0,
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', price: '', stock: '', category: 'Backpacks' });
      toast.success('Product added successfully!');
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success('Product deleted successfully!');
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
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark-50 dark:bg-dark-900 flex"
    >
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 280 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-dark-800 shadow-lg flex flex-col fixed h-screen z-40"
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-dark-200 dark:border-dark-700">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TK</span>
          </div>
          {sidebarOpen && <span className="ml-2 font-bold hidden sm:inline">Admin</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: FiBarChart2 },
            { id: 'products', label: 'Products', icon: FiShoppingBag },
            { id: 'orders', label: 'Orders', icon: FiTrendingUp },
            { id: 'customers', label: 'Customers', icon: FiUsers },
          ].map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                activeTab === id
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700'
              }`}
            >
              <Icon size={20} />
              {sidebarOpen && <span className="hidden sm:inline">{label}</span>}
            </motion.button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-dark-200 dark:border-dark-700">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <FiLogOut size={20} />
            {sidebarOpen && <span className="hidden sm:inline">Logout</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarOpen ? 280 : 80,
          transition: 'margin-left 0.3s',
        }}
        className="flex-1 flex flex-col"
      >
        {/* Top Bar */}
        <div className="bg-white dark:bg-dark-800 shadow-md h-20 flex items-center justify-between px-6 sticky top-0 z-30">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>

          <h1 className="text-2xl font-bold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Stats Grid */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                  {[
                    {
                      label: 'Total Sales',
                      value: `₹${stats.totalSales.toLocaleString()}`,
                      icon: FiTrendingUp,
                      color: 'from-primary-500 to-primary-600',
                    },
                    {
                      label: 'Total Orders',
                      value: stats.totalOrders,
                      icon: FiShoppingBag,
                      color: 'from-accent-500 to-accent-600',
                    },
                    {
                      label: 'Total Customers',
                      value: stats.totalCustomers,
                      icon: FiUsers,
                      color: 'from-green-500 to-green-600',
                    },
                    {
                      label: 'Total Products',
                      value: stats.totalProducts,
                      icon: FiBarChart2,
                      color: 'from-blue-500 to-blue-600',
                    },
                  ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={idx}
                        variants={itemVariants}
                        className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-dark-200 dark:border-dark-700"
                      >
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-4`}>
                          <Icon size={24} />
                        </div>
                        <p className="text-dark-600 dark:text-dark-400 text-sm mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Recent Orders */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-dark-800 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-6">Recent Orders</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-dark-200 dark:border-dark-700">
                          <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                          <th className="text-left py-3 px-4 font-semibold">Customer</th>
                          <th className="text-left py-3 px-4 font-semibold">Amount</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'TK123456', customer: 'John Doe', amount: '₹45,999', status: 'Delivered' },
                          { id: 'TK123457', customer: 'Jane Smith', amount: '₹12,999', status: 'Shipped' },
                          { id: 'TK123458', customer: 'Bob Johnson', amount: '₹24,999', status: 'Processing' },
                        ].map((order, idx) => (
                          <tr key={idx} className="border-b border-dark-100 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors">
                            <td className="py-3 px-4">{order.id}</td>
                            <td className="py-3 px-4">{order.customer}</td>
                            <td className="py-3 px-4">{order.amount}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'Delivered'
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : order.status === 'Shipped'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Add Product Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-dark-800 rounded-2xl p-6 mb-8"
                >
                  <h3 className="text-xl font-bold mb-6">Add New Product</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option>Backpacks</option>
                      <option>Luggage</option>
                      <option>Accessories</option>
                    </select>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddProduct}
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      <FiPlus size={18} />
                      Add
                    </motion.button>
                  </div>
                </motion.div>

                {/* Products Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-dark-800 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-6">Products</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-dark-200 dark:border-dark-700">
                          <th className="text-left py-3 px-4 font-semibold">Name</th>
                          <th className="text-left py-3 px-4 font-semibold">Category</th>
                          <th className="text-left py-3 px-4 font-semibold">Price</th>
                          <th className="text-left py-3 px-4 font-semibold">Stock</th>
                          <th className="text-left py-3 px-4 font-semibold">Sales</th>
                          <th className="text-left py-3 px-4 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-dark-100 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors">
                            <td className="py-3 px-4">{product.name}</td>
                            <td className="py-3 px-4">{product.category}</td>
                            <td className="py-3 px-4">₹{product.price.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                product.stock > 50
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                  : product.stock > 20
                                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                              }`}>
                                {product.stock}
                              </span>
                            </td>
                            <td className="py-3 px-4">{product.sales}</td>
                            <td className="py-3 px-4 flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded transition-colors"
                              >
                                <FiEdit2 size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </motion.button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-6">All Orders</h3>
                <p className="text-dark-600 dark:text-dark-400">Order management coming soon...</p>
              </motion.div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <motion.div
                key="customers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-dark-800 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold mb-6">Customers</h3>
                <p className="text-dark-600 dark:text-dark-400">Customer management coming soon...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
