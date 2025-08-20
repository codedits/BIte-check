"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import StarRating from './StarRating';
import { computeWeightedRating } from '@/lib/ratings';
import { Review } from '@/types';

interface EditReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
	review: Review | null;
	onSubmit: (payload: { id: string; rating: number; comment: string; images?: string[]; rating_breakdown: any }) => Promise<void> | void;
}

export default function EditReviewModal({ isOpen, onClose, review, onSubmit }: EditReviewModalProps) {
	const [formData, setFormData] = useState({
		taste: 0,
		presentation: 0,
		service: 0,
		ambiance: 0,
		value: 0,
		comment: ''
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
				comment: review.comment || ''
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
				rating_breakdown: { taste: formData.taste, presentation: formData.presentation, service: formData.service, ambiance: formData.ambiance, value: formData.value }
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
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
					onClick={handleClose}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className="glass-modal w-full max-w-md"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold text-white">Edit Review</h2>
							<button onClick={handleClose} className="glass-button p-2 hover:bg-red-500/20 hover:text-red-400"><FaTimes /></button>
						</div>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 gap-3">
								{(['taste','presentation','service','ambiance','value'] as const).map(key => (
									<div key={key} className="flex items-center justify-between">
										<span className="text-sm text-gray-300 capitalize">{key}</span>
										<div className="flex items-center gap-3">
											<StarRating rating={(formData as any)[key]} onRatingChange={(r) => setFormData({ ...formData, [key]: r })} />
											<span className="text-white font-medium">{(formData as any)[key] || '-'}</span>
										</div>
									</div>
								))}
								<div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
									<span className="text-sm text-gray-300">Overall (weighted)</span>
									<div className="text-white font-semibold">{overallValue > 0 ? `${overallValue} / 5` : '- / 5'}</div>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">Comment</label>
								<textarea value={formData.comment} onChange={(e)=> setFormData({ ...formData, comment: e.target.value })} className="glass-input w-full h-24 resize-none text-sm" required />
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">Add More Photos (optional)</label>
								<input type="file" multiple accept="image/*" onChange={(e)=> setFiles(e.target.files ? Array.from(e.target.files).slice(0,3) : [])} className="w-full text-sm file:rounded file:bg-white/10 file:text-white file:py-2 file:px-3" />
								{files.length > 0 && <div className="mt-2 text-xs text-gray-400">New files: {files.map(f=> f.name).join(', ')}</div>}
								{(review.images && review.images.length > 0) && <div className="mt-2 text-xs text-gray-400">Existing images: {review.images.length}</div>}
								{uploading && <div className="text-xs text-gray-400 mt-1">Uploading...</div>}
							</div>
							{error && <div className="text-red-400 text-sm bg-red-400/10 p-2 rounded">{error}</div>}
							<motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={uploading} className="glass-button w-full bg-white text-black font-semibold py-2 disabled:opacity-50 disabled:cursor-not-allowed">Save Changes</motion.button>
						</form>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

