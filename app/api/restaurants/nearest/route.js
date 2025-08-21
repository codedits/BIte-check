import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';

// GET /api/restaurants/nearest?lat=..&lng=..&limit=..&radiusKm=..
// Note: Uses simple Haversine on (latitude, longitude) fields (non-GeoJSON).
export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const lat = Number(searchParams.get('lat'));
		const lng = Number(searchParams.get('lng'));
		const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 50);
		const radiusKm = Number(searchParams.get('radiusKm'));

		if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
			return NextResponse.json({ error: 'Valid lat and lng are required' }, { status: 400 });
		}

		await connectDB();

		// Optional coarse bounding box to reduce scanned docs when radiusKm provided
		let query = { latitude: { $ne: null }, longitude: { $ne: null } };
		if (Number.isFinite(radiusKm) && radiusKm > 0) {
			const latDelta = radiusKm / 111; // ~111km per degree latitude
			const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180) || 1);
			query = {
				latitude: { $gte: lat - latDelta, $lte: lat + latDelta },
				longitude: { $gte: lng - lngDelta, $lte: lng + lngDelta },
			};
		}

		const projection = '_id name cuisine location priceRange rating totalReviews image featured createdAt latitude longitude';
		const maxDocs = 1000; // guardrail
		const docs = await Restaurant.find(query, projection, { lean: true }).limit(maxDocs);

		const toRad = (d) => (d * Math.PI) / 180;
		const haversineKm = (aLat, aLng, bLat, bLng) => {
			const R = 6371;
			const dLat = toRad(bLat - aLat);
			const dLng = toRad(bLng - aLng);
			const A = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
			const c = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
			return R * c;
		};

		const withDistance = docs
			.filter((r) => typeof r.latitude === 'number' && typeof r.longitude === 'number')
			.map((r) => ({ ...r, distanceKm: haversineKm(lat, lng, r.latitude, r.longitude) }))
			.sort((a, b) => a.distanceKm - b.distanceKm)
			.slice(0, limit);

		const res = NextResponse.json(withDistance);
		res.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
		return res;
	} catch (error) {
		console.error('Nearest restaurants error:', error);
		return NextResponse.json({ error: 'Failed to find nearest restaurants' }, { status: 500 });
	}
}

