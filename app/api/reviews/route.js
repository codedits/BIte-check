import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Restaurant from '@/models/Restaurant';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// GET - Fetch all reviews or filter by userId
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const restaurant = searchParams.get('restaurant');

    let query = {};
    if (userId) {
      query.userId = userId;
    }
    if (restaurant) {
      query.restaurant = restaurant;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'email')
      .lean();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST - Create new review (requires authentication)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

  const body = await request.json();
  const { restaurant, rating, comment, images, rating_breakdown } = body;

    // Validation
  // basic required fields
  if (!restaurant || !rating || !comment) {
      return NextResponse.json(
        { error: 'Restaurant, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (rating_breakdown) {
      const cats = ['taste','presentation','service','ambiance','value'];
      for (const c of cats) {
        const v = rating_breakdown[c];
        if (typeof v !== 'number' || v < 1 || v > 5) {
          return NextResponse.json({ error: `Invalid rating for ${c}` }, { status: 400 });
        }
      }
    }


    if (comment.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment cannot be empty' },
        { status: 400 }
      );
    }

    await connectDB();

    // Create new review
    const newReview = new Review({
      userId: session.user.id,
      username: session.user.username,
      restaurant: restaurant.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      images: Array.isArray(images) ? images.map(String) : []
    });

    // If breakdown present, persist it
    if (rating_breakdown) {
      newReview.rating_breakdown = {
        taste: Number(rating_breakdown.taste),
        presentation: Number(rating_breakdown.presentation),
        service: Number(rating_breakdown.service),
        ambiance: Number(rating_breakdown.ambiance),
        value: Number(rating_breakdown.value)
      };
    }

    await newReview.save();

    // Update restaurant rating after adding the review
    const allReviewsForRestaurant = await Review.find({ restaurant: restaurant.trim() });
    const totalRating = allReviewsForRestaurant.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = totalRating / allReviewsForRestaurant.length;
    
    // Prepare restaurant update payload
    const restaurantUpdate = {
      rating: Math.round(averageRating * 10) / 10,
      totalReviews: allReviewsForRestaurant.length
    };
    // If this review has images and restaurant currently lacks image, set one
    if (Array.isArray(newReview.images) && newReview.images.length > 0) {
      const currentRestaurant = await Restaurant.findOne({ name: restaurant.trim() }).select('image').lean();
      if (currentRestaurant && (!currentRestaurant.image || currentRestaurant.image.length < 5)) {
        restaurantUpdate.image = newReview.images[0];
      }
    }
    await Restaurant.findOneAndUpdate(
      { name: restaurant.trim() },
      restaurantUpdate
    );

    // Populate user info for response
    const populatedReview = await Review.findById(newReview._id)
      .populate('userId', 'email')
      .lean();

    return NextResponse.json(
      { 
        message: 'Review created successfully',
        review: populatedReview
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a review (requires authentication and ownership)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');
    
    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the review and check ownership
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if the user owns this review
    // Convert both to strings for comparison and ensure proper ObjectId handling
    const reviewUserIdStr = review.userId.toString();
    const sessionUserIdStr = session.user.id.toString();
    
    // Also try comparing as ObjectIds if the session user ID is a valid ObjectId
    let isOwner = false;
    
    if (mongoose.Types.ObjectId.isValid(session.user.id)) {
      const sessionUserIdObj = new mongoose.Types.ObjectId(session.user.id);
      isOwner = review.userId.equals(sessionUserIdObj);
    }
    
    // Fallback to string comparison
    if (!isOwner) {
      isOwner = reviewUserIdStr === sessionUserIdStr;
    }
    
    if (!isOwner) {
      return NextResponse.json(
        { error: 'You can only delete your own reviews' },
        { status: 403 }
      );
    }

    // Store the restaurant name before deleting the review
    const restaurantName = review.restaurant;

    // Attempt to delete any uploaded images for this review from Cloudinary
    try {
      // Only proceed if Cloudinary is configured and the review has images
      const hasCloudinaryConfig = !!(process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET));
      if (hasCloudinaryConfig && Array.isArray(review.images) && review.images.length > 0) {
        // Helper to extract Cloudinary public_id from a URL
        const extractPublicId = (imgUrl) => {
          try {
            const u = new URL(imgUrl);
            const path = u.pathname || '';
            const uploadIdx = path.indexOf('/upload/');
            if (uploadIdx === -1) return null;
            let id = path.substring(uploadIdx + '/upload/'.length);
            // strip possible version prefix (v123456/)
            id = id.replace(/^v\d+\//, '');
            // remove extension
            id = id.replace(/\.[^/.]+$/, '');
            // trim leading slashes
            id = id.replace(/^\/+/, '');
            return id || null;
          } catch (e) {
            return null;
          }
        };

        const publicIds = review.images.map(String).map(extractPublicId).filter(Boolean);
        if (publicIds.length > 0) {
          // Configure cloudinary if explicit env vars are present (CLOUDINARY_URL is automatically picked up too)
          if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            cloudinary.config({
              cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
              api_key: process.env.CLOUDINARY_API_KEY,
              api_secret: process.env.CLOUDINARY_API_SECRET,
            });
          }

          // Delete the resources
          try {
            await cloudinary.api.delete_resources(publicIds, { resource_type: 'image' });
            console.log('Deleted Cloudinary images for review', reviewId, publicIds);
          } catch (err) {
            console.warn('Failed to delete Cloudinary images for review', reviewId, err && err.message ? err.message : err);
          }
        }
      }
    } catch (cloudErr) {
      console.warn('Cloudinary cleanup error for review', reviewId, cloudErr && cloudErr.message ? cloudErr.message : cloudErr);
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    // Recalculate restaurant rating after deleting the review
    const remainingReviews = await Review.find({ restaurant: restaurantName });
    
    if (remainingReviews.length > 0) {
      // Calculate new average rating
      const totalRating = remainingReviews.reduce((sum, rev) => sum + rev.rating, 0);
      const averageRating = totalRating / remainingReviews.length;
      
      // Update restaurant with new rating and review count
      await Restaurant.findOneAndUpdate(
        { name: restaurantName },
        { 
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          totalReviews: remainingReviews.length 
        }
      );
    } else {
      // No reviews left, delete the restaurant entirely
      await Restaurant.findOneAndDelete({ name: restaurantName });
    }

    return NextResponse.json(
      { message: 'Review deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
