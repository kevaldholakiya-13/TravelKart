import { Router } from 'express';
import Product from '../models/Product';
import { sendSuccess, sendError, getPaginationParams } from '../utils/helpers';
import { protect, authorizeAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Get All Products with Filtering
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, rating, search, sort, page, limit } = req.query;
    const { skip, limit: limitNum } = getPaginationParams(page, limit);

    // Build filter
    const filter: any = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }
    if (search) {
      filter.$text = { $search: String(search) };
    }

    // Build sort
    let sortBy: any = { createdAt: -1 };
    if (sort === 'price-low') sortBy = { price: 1 };
    else if (sort === 'price-high') sortBy = { price: -1 };
    else if (sort === 'rating') sortBy = { rating: -1 };
    else if (sort === 'newest') sortBy = { createdAt: -1 };

    const products = await Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum)
      .select('-__v');

    const total = await Product.countDocuments(filter);

    sendSuccess(res, 200, 'Products retrieved', {
      products,
      pagination: {
        total,
        page: Number(page) || 1,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving products', error);
  }
});

// Get Product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews')
      .select('-__v');

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    sendSuccess(res, 200, 'Product retrieved', { product });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving product', error);
  }
});

// Create Product (Admin Only)
router.post('/', protect, authorizeAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      stock,
      images,
      thumbnail,
    } = req.body;

    if (!name || !description || !price || !category || !images) {
      return sendError(res, 400, 'Missing required fields');
    }

    const sku = `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const product = new Product({
      name,
      description,
      price,
      originalPrice: originalPrice || price,
      category,
      stock,
      images,
      thumbnail: thumbnail || images[0],
      sku,
      seller: req.userId,
    });

    await product.save();
    sendSuccess(res, 201, 'Product created successfully', { product });
  } catch (error: any) {
    sendError(res, 500, 'Error creating product', error);
  }
});

// Update Product (Admin Only)
router.put('/:id', protect, authorizeAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    sendSuccess(res, 200, 'Product updated successfully', { product });
  } catch (error: any) {
    sendError(res, 500, 'Error updating product', error);
  }
});

// Delete Product (Admin Only)
router.delete('/:id', protect, authorizeAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    sendSuccess(res, 200, 'Product deleted successfully');
  } catch (error: any) {
    sendError(res, 500, 'Error deleting product', error);
  }
});

// Get Featured Products
router.get('/featured/all', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .limit(6)
      .select('-__v');

    sendSuccess(res, 200, 'Featured products retrieved', { products });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving featured products', error);
  }
});

// Get Trending Products
router.get('/trending/all', async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true })
      .limit(6)
      .select('-__v');

    sendSuccess(res, 200, 'Trending products retrieved', { products });
  } catch (error: any) {
    sendError(res, 500, 'Error retrieving trending products', error);
  }
});

export default router;
