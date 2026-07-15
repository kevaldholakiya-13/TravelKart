'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiHeart, FiFilter, FiX } from 'react-icons/fi';
import { useStore } from '../../store';
import { PRODUCTS, Product } from '../../store/productsData';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const categories = ['All', 'Backpacks', 'Luggage', 'Accessories', 'Electronics', 'Camping', 'Shoes', 'Clothing', 'Water Bottles'];

const ProductsContent = () => {
  const [products] = useState<Product[]>(PRODUCTS);
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    category: 'All',
    priceRange: { min: 0, max: 50000 },
    rating: 0,
    inStock: false,
    search: '',
  });

  // Sync search parameters from Navbar/URL query
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    setFilters((prev) => ({
      ...prev,
      category: categoryParam
        ? (categories.find(c => c.toLowerCase() === categoryParam.toLowerCase()) || 'All')
        : 'All',
      search: searchParam || '',
    }));
  }, [searchParams]);

  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const addToCart = useStore((state) => state.addToCart);
  const addToWishlist = useStore((state) => state.addToWishlist);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesCategory = filters.category === 'All' || product.category === filters.category;
      const matchesPrice = product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
      const matchesRating = product.rating >= filters.rating;
      const matchesStock = !filters.inStock || product.inStock;
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());

      return matchesCategory && matchesPrice && matchesRating && matchesStock && matchesSearch;
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [filters, sortBy, products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center md:text-left"
      >
        <span className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-50 dark:bg-primary-950/30 px-4 py-1.5 rounded-full mb-3 inline-block">Explore Gear</span>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Our Products</h1>
        <p className="text-dark-600 dark:text-dark-400">Discover {filteredProducts.length} amazing travel essentials</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full px-6 py-4 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:block ${showFilters ? 'block' : 'hidden'}`}
        >
          <div className="card p-6 sticky top-24 bg-white dark:bg-dark-800 rounded-2xl border border-dark-100 dark:border-dark-700 shadow-md">
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded">
                <FiX size={20} />
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8 pb-8 border-b border-dark-200 dark:border-dark-700">
              <h4 className="font-bold mb-4">Category</h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ x: 4 }}
                    onClick={() => setFilters({ ...filters, category: cat })}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      filters.category === cat
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-700 dark:text-dark-300'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8 pb-8 border-b border-dark-200 dark:border-dark-700">
              <h4 className="font-bold mb-4">Price Range</h4>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters({ ...filters, priceRange: { ...filters.priceRange, max: parseInt(e.target.value) } })}
                  className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-sm text-dark-500 font-semibold">
                  <span>₹{filters.priceRange.min.toLocaleString()}</span>
                  <span>₹{filters.priceRange.max.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-8 pb-8 border-b border-dark-200 dark:border-dark-700">
              <h4 className="font-bold mb-4">Rating</h4>
              <div className="space-y-1">
                {[0, 4, 4.5].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ x: 4 }}
                    onClick={() => setFilters({ ...filters, rating })}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                      filters.rating === rating
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'hover:bg-dark-100 dark:hover:bg-dark-800 text-dark-700 dark:text-dark-300'
                    }`}
                  >
                    <span>
                      {rating === 0 ? 'All Ratings' : `${rating}★ & Up`}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                  className="w-5 h-5 rounded border-dark-300 text-primary-600 focus:ring-primary-500 accent-primary-600"
                />
                <span className="font-medium text-sm">In Stock Only</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {/* Top Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-between mb-8 flex-wrap gap-4"
          >
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary flex items-center gap-2"
            >
              <FiFilter size={18} />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-dark-50 dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </motion.div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="card-interactive overflow-hidden group cursor-pointer relative"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    {product.discount && (
                      <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-amber-500/30">
                        -{product.discount}% OFF
                      </div>
                    )}
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden rounded-t-2xl">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 pb-2">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{product.name}</h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              size={14}
                              className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-dark-300'}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-dark-600 dark:text-dark-400 font-medium">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold gradient-text">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-dark-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Actions (Outside link so they click properly) */}
                  <div className="p-6 pt-0">
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (product.inStock) {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              quantity: 1,
                              image: product.image,
                              category: product.category,
                            });
                            toast.success('Added to cart!');
                          }
                        }}
                        disabled={!product.inStock}
                        className="flex-1 btn-primary text-sm flex items-center justify-center gap-2 disabled:opacity-50 py-2.5"
                      >
                        <FiShoppingCart size={16} />
                        Add to Cart
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          addToWishlist({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            category: product.category,
                          });
                          toast.success('Added to wishlist!');
                        }}
                        className="btn-secondary p-2.5 flex items-center justify-center"
                      >
                        <FiHeart size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-dark-600 dark:text-dark-400 mb-6">Try adjusting your filters or search term</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-dark-900 section-padding"
    >
      <Suspense fallback={
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-accent-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-600 dark:text-dark-400">Loading products...</p>
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </motion.div>
  );
};

export default ProductsPage;
