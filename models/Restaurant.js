import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cuisine: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  priceRange: {
    type: String,
    required: true,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  // Pre-generated or derived thumbnail (smaller size for cards)
  imageThumb: {
    type: String,
    default: ''
  },
  // Blur placeholder (base64 tiny image) for next/image blurDataURL
  imageBlur: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for performance
try {
  restaurantSchema.index({ name: 1, location: 1 }, { unique: true }); // prevent duplicates
  restaurantSchema.index({ featured: 1, rating: -1, totalReviews: -1 }); // featured listing sorts
  restaurantSchema.index({ rating: -1, totalReviews: -1 }); // top restaurants queries
  restaurantSchema.index({ createdAt: -1 }); // recent additions
  // Support quick filter + recent sort when fetching featured only
  restaurantSchema.index({ featured: 1, createdAt: -1 });
  // Partial index for restaurants missing images to accelerate fallback population (only docs lacking image)
  restaurantSchema.index({ createdAt: -1 }, { partialFilterExpression: { image: { $in: ['', null] } }, name: 'no_image_recent' });
  restaurantSchema.index({ name: 'text', cuisine: 'text', location: 'text', description: 'text' }); // text search
} catch (_) {
  // ignore index redefinition errors on hot reload in dev
}

const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;



