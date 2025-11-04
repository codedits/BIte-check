#!/usr/bin/env node
/**
 * One-off reconciliation script.
 * Scans all restaurants found in the reviews collection and ensures
 * Restaurant documents have consistent rating and totalReviews values.
 * Run locally: node ./scripts/reconcile-restaurants.js
 */
const connectDB = require('../lib/mongodb').default || require('../lib/mongodb');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');

async function reconcile() {
  try {
    await connectDB();
    console.log('Connected to DB, starting reconciliation...');

    // Get distinct restaurant names from reviews
    const restaurantNames = await Review.distinct('restaurant');
    console.log('Found', restaurantNames.length, 'restaurants in reviews collection');

    for (const name of restaurantNames) {
      const reviews = await Review.find({ restaurant: name }).select('rating images').lean();
      const count = reviews.length;
      const avg = count > 0 ? Math.round((reviews.reduce((s, r) => s + (r.rating || 0), 0) / count) * 10) / 10 : 0;
      const update = { rating: avg, totalReviews: count };
      // attempt to set a representative image if missing
      const existing = await Restaurant.findOne({ name });
      if ((!existing || !existing.image) && reviews.length) {
        const withImage = reviews.find(r => Array.isArray(r.images) && r.images.length > 0);
        if (withImage) update.image = withImage.images[0];
      }

      await Restaurant.findOneAndUpdate({ name }, update, { upsert: true });
      console.log(`Reconciled ${name}: totalReviews=${count}, rating=${avg}`);
    }

    console.log('Reconciliation complete.');
    process.exit(0);
  } catch (err) {
    console.error('Reconcile error:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

reconcile();
