'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart, FiHeart, FiArrowLeft, FiCheck, FiTruck, FiMapPin, FiRefreshCw } from 'react-icons/fi';
import { useStore } from '../../../store';
import { PRODUCTS, Product } from '../../../store/productsData';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<{
    checked: boolean;
    isDeliverable: boolean;
    estimatedDays: number;
    shippingCharge: number;
  } | null>(null);

  const addToCart = useStore((state) => state.addToCart);
  const addToWishlist = useStore((state) => state.addToWishlist);

  useEffect(() => {
    const foundProduct = PRODUCTS.find((p) => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-dark-900 text-center p-6">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <p className="text-dark-600 dark:text-dark-400 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="btn-primary">
          <FiArrowLeft size={18} /> Back to Products
        </Link>
      </div>
    );
  }

  // Related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const handleDeliveryCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{6}$/.test(pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setCheckingDelivery(true);
    try {
      const response = await axios.post('http://localhost:5000/api/delivery/check', { pincode });
      const data = response.data.data;
      setDeliveryResult({
        checked: true,
        isDeliverable: data.isDeliverable,
        estimatedDays: data.estimatedDays,
        shippingCharge: data.shippingCharge,
      });
      if (data.isDeliverable) {
        toast.success('We deliver to this pincode!');
      } else {
        toast.error('Sorry, we do not deliver to this pincode yet.');
      }
    } catch (error) {
      // Fallback in case backend is offline
      const localDeliverable = ['380001', '380002', '380015', '380019', '380006', '380008'].includes(pincode);
      setDeliveryResult({
        checked: true,
        isDeliverable: localDeliverable,
        estimatedDays: localDeliverable ? 3 : 0,
        shippingCharge: 299,
      });
      if (localDeliverable) {
        toast.success('We deliver to this pincode!');
      } else {
        toast.error('Sorry, we do not deliver to this pincode yet.');
      }
    } finally {
      setCheckingDelivery(false);
    }
  };

  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity,
      });
      toast.success(`${quantity} x ${product.name} added to cart!`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-dark-900 section-padding"
    >
      <div className="page-container max-w-6xl">
        {/* Back navigation */}
        <Link href="/products" className="inline-flex items-center gap-2 text-dark-600 dark:text-dark-400 hover:text-primary-600 font-semibold mb-8 transition-colors group">
          <FiArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to all products
        </Link>

        {/* Product Details Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-[450px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-xl border border-dark-100 dark:border-dark-700 bg-dark-50 dark:bg-dark-800"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
            {product.discount && (
              <div className="absolute top-6 left-6 bg-gradient-to-r from-accent-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                -{product.discount}% OFF
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-2xl uppercase tracking-wider">Out of Stock</span>
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between"
          >
            <div>
              <span className="text-sm font-bold text-accent-600 dark:text-accent-400 uppercase tracking-widest bg-accent-50 dark:bg-accent-950/30 px-3.5 py-1.5 rounded-full mb-4 inline-block">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={18}
                      className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-dark-300'}
                    />
                  ))}
                </div>
                <span className="text-sm text-dark-600 dark:text-dark-400 font-semibold">
                  {product.rating} ({product.reviews} customer reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold gradient-text">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-dark-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-dark-600 dark:text-dark-350 leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            {/* Actions & Checkers */}
            <div className="space-y-6">
              {/* Quantity Selector */}
              {product.inStock && (
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-sm text-dark-600 dark:text-dark-400">Quantity:</span>
                  <div className="flex items-center border border-dark-200 dark:border-dark-700 rounded-xl overflow-hidden bg-dark-50 dark:bg-dark-800">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-dark-100 dark:hover:bg-dark-700 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-dark-100 dark:hover:bg-dark-700 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add / Wishlist Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 btn-primary py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <FiShoppingCart size={20} />
                  Add to Shopping Cart
                </button>
                <button
                  onClick={() => {
                    addToWishlist(product);
                    toast.success('Added to wishlist!');
                  }}
                  className="btn-secondary px-6 py-4 flex items-center justify-center"
                >
                  <FiHeart size={20} />
                </button>
              </div>

              {/* Pincode Delivery Checker */}
              <div className="card p-5 bg-dark-50 dark:bg-dark-800/50 rounded-2xl border border-dark-100 dark:border-dark-750 shadow-inner">
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <FiMapPin className="text-primary-600" />
                  Delivery & Shipping Checker
                </h4>
                <form onSubmit={handleDeliveryCheck} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit pincode (e.g. 380001)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="flex-1 px-4 py-2 text-sm bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={checkingDelivery}
                    className="btn-primary px-4 py-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
                  >
                    {checkingDelivery ? <FiRefreshCw className="animate-spin" /> : 'Check'}
                  </button>
                </form>

                {/* Delivery Checker Results */}
                {deliveryResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs"
                  >
                    {deliveryResult.isDeliverable ? (
                      <div className="space-y-1 text-green-600 dark:text-green-400 font-semibold">
                        <p className="flex items-center gap-1.5">
                          <FiCheck /> Deliverable to this location!
                        </p>
                        <p className="text-dark-500 text-[11px] flex items-center gap-1.5">
                          <FiTruck /> Estimated Delivery: {deliveryResult.estimatedDays} days
                        </p>
                        <p className="text-dark-500 text-[11px]">
                          💸 Shipping Fee: ₹{deliveryResult.shippingCharge} (Free on orders &gt; ₹1000)
                        </p>
                      </div>
                    ) : (
                      <p className="text-red-500 font-semibold">
                        ❌ Delivery unavailable for this pincode yet.
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Tabs (Specs & Features) */}
        <div className="grid md:grid-cols-2 gap-12 border-t border-dark-100 dark:border-dark-800 pt-12 mb-16">
          {/* Key Features */}
          {product.features && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-dark-600 dark:text-dark-400">
                    <span className="mt-1 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center text-primary-600 flex-shrink-0 text-xs">
                      ✓
                    </span>
                    <span className="text-sm font-medium">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {product.specs && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Technical Specifications</h3>
              <div className="border border-dark-100 dark:border-dark-700 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left text-dark-600 dark:text-dark-400">
                  <tbody>
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <tr key={idx} className="border-b last:border-0 border-dark-100 dark:border-dark-700 bg-dark-50/30 dark:bg-dark-800/10">
                        <td className="px-6 py-3 font-semibold text-dark-800 dark:text-white bg-dark-50 dark:bg-dark-800/50 w-1/3">
                          {key}
                        </td>
                        <td className="px-6 py-3">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-dark-100 dark:border-dark-800 pt-12">
            <h3 className="text-3xl font-bold mb-8 text-center md:text-left">Related Products</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((relProduct) => (
                <motion.div
                  key={relProduct.id}
                  whileHover={{ y: -8 }}
                  className="card-interactive overflow-hidden group cursor-pointer relative"
                >
                  <Link href={`/products/${relProduct.id}`} className="block">
                    <div className="relative h-60 overflow-hidden">
                      <Image
                        src={relProduct.image}
                        alt={relProduct.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h4 className="font-bold mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {relProduct.name}
                      </h4>
                      <p className="text-lg font-bold gradient-text">
                        ₹{relProduct.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
