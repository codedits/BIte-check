'use client';

import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
			<h1 className="text-3xl font-bold mb-3">Page not found</h1>
			<p className="text-white/70 mb-6">The page you are looking for doesn't exist.</p>
			<Link href="/" className="glass-button bg-white text-black px-5 py-2 rounded">Go home</Link>
		</div>
	);
}

