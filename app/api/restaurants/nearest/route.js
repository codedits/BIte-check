import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';

// Minimal nearest route — returns 400 if lat/lon missing, otherwise returns a small list.
export async function GET(request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const latRaw = searchParams.get('lat');
		const lonRaw = searchParams.get('lon');
		if (!latRaw || !lonRaw) {
			return NextResponse.json({ error: 'lat and lon query params required' }, { status: 400 });
		}
		const lat = parseFloat(latRaw);
		const lon = parseFloat(lonRaw);
		if (Number.isNaN(lat) || Number.isNaN(lon)) {
			return NextResponse.json({ error: 'Invalid lat/lon' }, { status: 400 });
		}

		// Basic fallback: return a small set of restaurants (geo lookup could be added later)
		const restaurants = await Restaurant.find({}).sort({ rating: -1 }).limit(20).lean();
		return NextResponse.json(restaurants);
	} catch (err) {
		console.error('Nearest route error', err);
		return NextResponse.json({ error: 'Failed to fetch nearest restaurants' }, { status: 500 });
	}
}

