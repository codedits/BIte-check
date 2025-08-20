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

// Create compound index for name and location to prevent duplicates
restaurantSchema.index({ name: 1, location: 1 }, { unique: true });

// Create text index for search functionality
restaurantSchema.index({ name: 'text', cuisine: 'text', location: 'text', description: 'text' });

const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;



