"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import StarRating from './StarRating';
import CloudImage from './CloudImage';
import { computeWeightedRating } from '@/lib/ratings';
import { Review } from '@/types';

interface EditReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	review: Review | null;
	onSubmit: (payload: { id: string; rating: number; comment: string; images?: string[]; rating_breakdown: any; restaurantName?: string; restaurantLocation?: string }) => Promise<void> | void;
}

export default function EditReviewModal({ isOpen, onClose, review, onSubmit }: EditReviewModalProps) {
	const [formData, setFormData] = useState({
		taste: 0,
		presentation: 0,
		service: 0,
		ambiance: 0,
		value: 0,
		comment: '',
		restaurantName: '',
		restaurantLocation: ''
	});
	const [files, setFiles] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (review) {
			setFormData({
				taste: review.rating_breakdown?.taste || 0,
				presentation: review.rating_breakdown?.presentation || 0,
				service: review.rating_breakdown?.service || 0,
				ambiance: review.rating_breakdown?.ambiance || 0,
				value: review.rating_breakdown?.value || 0,
				comment: review.comment || '',
				restaurantName: review.restaurant || '',
				restaurantLocation: (review as any).location || ''
			});
		}
	}, [review]);

	const overallValue = useMemo(() => computeWeightedRating(formData as any), [formData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!review) return;
		if (!formData.comment.trim()) {
			setError('Comment required');
			return;
		}
		const hasAny = ['taste','presentation','service','ambiance','value'].some(k => (formData as any)[k] > 0);
		if (!hasAny) {
			setError('Rate at least one category');
			return;
		}
		const newImages: string[] = (review.images || []).slice();
		try {
			if (files.length) {
				setUploading(true);
				const toUpload = files.slice(0, 3);
				for (const f of toUpload) {
					const dataUrl = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(String(reader.result));
						reader.onerror = reject;
						reader.readAsDataURL(f);
					});
					const uploadRes = await fetch('/api/review-upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ file: dataUrl }) });
						const uploadData = await uploadRes.json();
						if (uploadRes.ok && uploadData?.secure_url) newImages.push(uploadData.secure_url);
				}
			}
			await Promise.resolve(onSubmit({
				id: review._id,
				rating: overallValue,
				comment: formData.comment.trim(),
				images: newImages,
				rating_breakdown: { taste: formData.taste, presentation: formData.presentation, service: formData.service, ambiance: formData.ambiance, value: formData.value },
				restaurantName: formData.restaurantName?.trim(),
				restaurantLocation: formData.restaurantLocation?.trim()
			}));
			onClose();
		} catch (err: any) {
			setError(err?.message || 'Update failed');
		} finally {
			setUploading(false);
		}
	};

	const handleClose = () => {
		setError('');
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && review && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
					onClick={handleClose}
				>
					<motion.div
						initial={{ scale: 0.95, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						exit={{ scale: 0.95, opacity: 0, y: 20 }}
						transition={{ type: 'spring', damping: 30, stiffness: 300 }}
						className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-black/90 backdrop-blur-xl"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="border-b border-white/10 px-6 py-5">
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold text-white">Edit Review</h2>
								<button 
									onClick={handleClose} 
									className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
								>
									<FaTimes />
								</button>
							</div>
						</div>

						{/* Content */}
						<form onSubmit={handleSubmit} className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-6">
							{/* Restaurant Info */}
							<div className="space-y-4">
								<div>
									<label className="mb-2 block text-xs uppercase tracking-wider text-white/50">
										Restaurant Name
									</label>
									<input 
										className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-white/10" 
										value={formData.restaurantName} 
										onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })} 
										placeholder="Enter restaurant name" 
									/>
								</div>
								<div>
									<label className="mb-2 block text-xs uppercase tracking-wider text-white/50">
										Location
									</label>
									<input 
										className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-white/10" 
										value={formData.restaurantLocation} 
										onChange={(e) => setFormData({ ...formData, restaurantLocation: e.target.value })} 
										placeholder="City / Area" 
									/>
								</div>
							</div>

							{/* Ratings */}
							<div>
								<label className="mb-3 block text-xs uppercase tracking-wider text-white/50">
									Rating Breakdown
								</label>
								<div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
									{(['taste', 'presentation', 'service', 'ambiance', 'value'] as const).map(key => (
										<div key={key} className="flex items-center justify-between">
											<span className="text-sm capitalize text-white/80">{key}</span>
											<div className="flex items-center gap-3">
												<StarRating 
													rating={(formData as any)[key]} 
													onRatingChange={(r) => setFormData({ ...formData, [key]: r })} 
												/>
												<span className="w-6 text-right text-sm font-medium text-white">
													{(formData as any)[key] || '-'}
												</span>
											</div>
										</div>
									))}
									<div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
										<span className="text-sm font-medium text-white/90">Overall</span>
										<div className="text-base font-semibold text-white">
											{overallValue > 0 ? `${overallValue} / 5` : '- / 5'}
										</div>
									</div>
								</div>
							</div>

							{/* Comment */}
							<div>
								<label className="mb-2 block text-xs uppercase tracking-wider text-white/50">
									Comment
								</label>
								<textarea 
									value={formData.comment} 
									onChange={(e) => setFormData({ ...formData, comment: e.target.value })} 
									className="h-32 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-white/10" 
									placeholder="Share your experience..."
									required 
								/>
							</div>

							{/* Current Photos */}
							{review.images && review.images.length > 0 && (
								<div>
									<label className="mb-3 block text-xs uppercase tracking-wider text-white/50">
										Current Photos ({review.images.length})
									</label>
									<div className="grid grid-cols-3 gap-3">
										{review.images.map((img, idx) => (
											<div key={idx} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10">
												<CloudImage
													src={img}
													alt={`Review photo ${idx + 1}`}
													width={200}
													height={200}
													fillCrop
													className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
											</div>
										))}
									</div>
								</div>
							)}

							{/* Add More Photos */}
							<div>
								<label className="mb-2 block text-xs uppercase tracking-wider text-white/50">
									Add More Photos (optional)
								</label>
								<input 
									type="file" 
									multiple 
									accept="image/*" 
									onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files).slice(0, 3) : [])} 
									className="w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:transition hover:file:bg-white/20" 
								/>
								{files.length > 0 && (
									<div className="mt-2 text-xs text-white/60">
										Adding {files.length} new {files.length === 1 ? 'photo' : 'photos'}
									</div>
								)}
								{uploading && (
									<div className="mt-2 flex items-center gap-2 text-xs text-white/60">
										<div className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
										Uploading photos...
									</div>
								)}
							</div>

							{/* Error */}
							{error && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
								>
									{error}
								</motion.div>
							)}

							{/* Submit */}
							<motion.button 
								type="submit" 
								whileHover={{ scale: 1.01 }} 
								whileTap={{ scale: 0.99 }} 
								disabled={uploading} 
								className="w-full rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{uploading ? 'Saving...' : 'Save Changes'}
							</motion.button>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

