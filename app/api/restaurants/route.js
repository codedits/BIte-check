import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import { authOptions } from '@/lib/auth';

 // GET - Fetch all restaurants or a single restaurant by id
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const featuredOnly = searchParams.get('featured');
  const populateImages = searchParams.get('populateImages');

    if (id) {
      // Return single restaurant by id
      const restaurant = await Restaurant.findById(id).lean();
      if (!restaurant) {
        return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
      }
      return NextResponse.json(restaurant);
    }

    // Otherwise return (optionally featured-only) restaurants
    const query = {};
    if (featuredOnly === 'true') {
      query.featured = true;
    }

    // Projection keeps payload small; adjust fields actually used by client cards
    const projection = 'name cuisine location priceRange rating totalReviews image featured createdAt';
    let restaurants = await Restaurant.find(query, projection, { lean: true })
      .sort(featuredOnly === 'true' ? { rating: -1, totalReviews: -1 } : { createdAt: -1 })
      .limit(featuredOnly === 'true' ? 50 : 200); // guardrail to prevent unbounded result growth

    if (populateImages === 'true') {
      // For any restaurant lacking image attempt to pull one review image and persist it
      const lacking = restaurants.filter(r => !r.image || r.image.length < 5);
      if (lacking.length) {
        const Review = (await import('@/models/Review')).default;
        // Fetch recent reviews that actually have images
        const reviews = await Review.find({ restaurant: { $in: lacking.map(r => r.name) }, images: { $exists: true, $ne: [] } })
          .sort({ createdAt: -1 })
          .lean();
        const firstImageByRestaurant = new Map();
        for (const rev of reviews) {
          if (!firstImageByRestaurant.has(rev.restaurant) && Array.isArray(rev.images) && rev.images.length) {
            firstImageByRestaurant.set(rev.restaurant, rev.images[0]);
          }
        }
        if (firstImageByRestaurant.size) {
          // Persist updates in background (best effort) so future fetches don't need populateImages
          const bulkOps = [];
          for (const r of lacking) {
            const img = firstImageByRestaurant.get(r.name);
            if (img) {
              bulkOps.push({
                updateOne: {
                  filter: { _id: r._id },
                  update: { $set: { image: img } }
                }
              });
            }
          }
          if (bulkOps.length) {
            try { await Restaurant.bulkWrite(bulkOps); } catch (e) { console.warn('Bulk image persistence failed', e); }
          }
          restaurants = restaurants.map(r => {
            const img = firstImageByRestaurant.get(r.name);
            return (!r.image || r.image.length < 5) && img ? { ...r, image: img } : r;
          });
        }
      }
    }

  return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}

// POST - Create new restaurant (requires authentication)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { name, cuisine, location, priceRange, description } = await request.json();

    // Validation
    if (!name || !cuisine || !location || !priceRange) {
      return NextResponse.json(
        { error: 'Name, cuisine, location, and price range are required' },
        { status: 400 }
      );
    }

    if (name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Restaurant name cannot be empty' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if restaurant already exists
    const existingRestaurant = await Restaurant.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      location: { $regex: new RegExp(`^${location.trim()}$`, 'i') }
    });

    if (existingRestaurant) {
      return NextResponse.json(
        { error: 'A restaurant with this name already exists in this location' },
        { status: 400 }
      );
    }

    // Create new restaurant
    const newRestaurant = new Restaurant({
      name: name.trim(),
      cuisine: cuisine.trim(),
      location: location.trim(),
      priceRange,
      description: description ? description.trim() : '',
      addedBy: session.user.id,
      rating: 0,
      totalReviews: 0
    });

    await newRestaurant.save();

    return NextResponse.json(
      { 
        message: 'Restaurant created successfully',
        restaurant: newRestaurant
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}

// PATCH - Toggle featured status (admin only)
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    const isAdmin = adminEmails.includes(session.user.email?.toLowerCase());
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin privileges required' }, { status: 403 });
    }

    const { id, featured } = await request.json();
    if (!id || typeof featured !== 'boolean') {
      return NextResponse.json({ error: 'id and featured boolean required' }, { status: 400 });
    }

    await connectDB();
    const updated = await Restaurant.findByIdAndUpdate(id, { featured }, { new: true }).lean();
    if (!updated) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Updated featured status', restaurant: updated });
  } catch (error) {
    console.error('Error updating featured status:', error);
    return NextResponse.json({ error: 'Failed to update featured status' }, { status: 500 });
  }
}
