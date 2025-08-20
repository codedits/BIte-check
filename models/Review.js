import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  restaurant: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  images: {
    type: [String],
    trim: true,
    default: []
  },
  // legacy detailedRatings removed (was unused)
  rating_breakdown: {
    taste: { type: Number, min: 1, max: 5 },
    presentation: { type: Number, min: 1, max: 5 },
    service: { type: Number, min: 1, max: 5 },
    ambiance: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 }
  }
  
}, {
  timestamps: true
});

// Create indexes (query patterns: fetch by user, by restaurant, recent reviews)
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ restaurant: 1, createdAt: -1 });
reviewSchema.index({ createdAt: -1 });
// Optimizes image fallback lookup in /api/restaurants when populateImages=true:
//   Review.find({ restaurant: { $in: [...] }, images: { $exists: true, $ne: [] } }).sort({ createdAt: -1 })
// Using images.0 leverages existence of first element (faster than $exists/$ne filter during index scan)
try {
  reviewSchema.index({ restaurant: 1, 'images.0': 1, createdAt: -1 }, { name: 'restaurant_image_createdAt' });
} catch (_) {
  // defensive: ignore redefinition errors in hot reload
}

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;
