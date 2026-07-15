import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  subcategory?: string;
  images: string[];
  thumbnail: string;
  stock: number;
  sku: string;
  rating: number;
  reviews: mongoose.Types.ObjectId[];
  specifications: {
    [key: string]: string;
  };
  tags: string[];
  isFeatured: boolean;
  isTrending: boolean;
  discount: number;
  seller: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Please provide an original price'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Backpacks',
        'Luggage',
        'Accessories',
        'Electronics',
        'Camping',
        'Clothing',
        'Shoes',
        'Water Bottles',
        'Safety Kits',
        'Cameras',
        'Passport Accessories',
        'Hiking Equipment',
      ],
    },
    subcategory: String,
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'Please provide at least one product image',
      },
    },
    thumbnail: {
      type: String,
      required: [true, 'Please provide a thumbnail image'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    sku: {
      type: String,
      unique: true,
      required: [true, 'Please provide a SKU'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: [mongoose.Types.ObjectId],
      ref: 'Review',
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
      default: new Map(),
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    seller: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

export default mongoose.model<IProduct>('Product', productSchema);
