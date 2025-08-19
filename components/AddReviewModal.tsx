'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import StarRating from './StarRating';
import { useAuth } from '@/contexts/AuthContext';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: { username: string; rating: number; comment: string; images?: string[] }) => void;
  restaurantName: string;
}

export default function AddReviewModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  restaurantName 
}: AddReviewModalProps) {
  const [formData, setFormData] = useState({
    username: '',
  // category ratings: 1-5
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

  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('Please sign in to add a review');
      return;
    }

    const categories = ['taste','presentation','service','ambiance','value'] as const;
    const anyZero = categories.some((c) => (formData as any)[c] === 0);
    if (anyZero || !formData.comment.trim()) {
      setError('Please rate all categories and provide a comment');
      return;
    }

    const images: string[] = [];
    try {
      if (files && files.length > 0) {
        setUploading(true);
        // limit to 3 files
        const toUpload = files.slice(0, 3);
        for (const f of toUpload) {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(f);
          });

          const uploadRes = await fetch('/api/review-upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: dataUrl })
          });

          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData?.secure_url) {
            images.push(uploadData.secure_url);
          }
        }
      }

      // Submit review to API as JS version did
      // compute weighted overall rating (out of 5)
      const weights: Record<string, number> = { taste: 40, presentation: 15, service: 15, ambiance: 15, value: 15 };
      const totalWeight = Object.values(weights).reduce((s, v) => s + v, 0);
      const weightedSum = Object.entries(weights).reduce((sum, [k, w]) => sum + ((formData as any)[k] || 0) * w, 0);
      const overallRating = Math.round((weightedSum / totalWeight) * 10) / 10; // one decimal, still on 1-5 scale

  const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurant: restaurantName,
          username: user?.username || formData.username,
          rating: overallRating,
          comment: formData.comment.trim(),
      images
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit review');

  onSubmit({ username: user?.username || formData.username, rating: overallRating, comment: formData.comment.trim(), images });
  setFormData({ username: '', taste: 0, presentation: 0, service: 0, ambiance: 0, value: 0, comment: '' });
      setFiles([]);
      setError('');
      onClose();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message?: unknown }).message) : 'Submission failed';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
  setFormData({ username: '', taste: 0, presentation: 0, service: 0, ambiance: 0, value: 0, comment: '' });
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
  {isOpen && (
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="glass-modal w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Review {restaurantName}
              </h2>
              <button
                onClick={handleClose}
                className="glass-button p-2 hover:bg-red-500/20 hover:text-red-400"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* If signed in show user info, otherwise username input */}
              {!isAuthenticated ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="glass-input w-full text-sm sm:text-base"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              ) : (
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-sm text-gray-300">Reviewing as: <span className="text-white font-medium">{user?.username}</span></p>
                </div>
              )}

              {/* Structured category ratings */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category ratings</label>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Taste</span>
                    <div className="flex items-center gap-3">
                      <StarRating rating={formData.taste} onRatingChange={(r) => setFormData({ ...formData, taste: r })} />
                      <span className="text-white font-medium">{formData.taste || '-'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Presentation</span>
                    <div className="flex items-center gap-3">
                      <StarRating rating={formData.presentation} onRatingChange={(r) => setFormData({ ...formData, presentation: r })} />
                      <span className="text-white font-medium">{formData.presentation || '-'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Service</span>
                    <div className="flex items-center gap-3">
                      <StarRating rating={formData.service} onRatingChange={(r) => setFormData({ ...formData, service: r })} />
                      <span className="text-white font-medium">{formData.service || '-'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Ambiance</span>
                    <div className="flex items-center gap-3">
                      <StarRating rating={formData.ambiance} onRatingChange={(r) => setFormData({ ...formData, ambiance: r })} />
                      <span className="text-white font-medium">{formData.ambiance || '-'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Value</span>
                    <div className="flex items-center gap-3">
                      <StarRating rating={formData.value} onRatingChange={(r) => setFormData({ ...formData, value: r })} />
                      <span className="text-white font-medium">{formData.value || '-'}</span>
                    </div>
                  </div>

                  {/* computed overall display */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <span className="text-sm text-gray-300">Overall (weighted)</span>
                    <div className="text-white font-semibold">
                      {(() => {
                        const weights: Record<string, number> = { taste: 40, presentation: 15, service: 15, ambiance: 15, value: 15 };
                        const total = Object.values(weights).reduce((s, v) => s + v, 0);
                        const sum = Object.entries(weights).reduce((acc, [k, w]) => acc + ((formData as any)[k] || 0) * w, 0);
                        const val = total ? Math.round((sum / total) * 10) / 10 : 0;
                        return val > 0 ? `${val} / 5` : '- / 5';
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Comment
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="glass-input w-full h-20 sm:h-24 resize-none text-sm sm:text-base"
                  placeholder="Share your experience..."
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Photos (optional, up to 3)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const list = e.target.files ? Array.from(e.target.files) : [];
                    setFiles(list.slice(0, 3));
                  }}
                  className="w-full text-sm sm:text-base file:rounded file:bg-white/10 file:text-white file:py-2 file:px-3"
                />
                {files.length > 0 && (
                  <div className="text-sm text-gray-300 mt-2">Selected: {files.map((f) => f.name).join(', ')}</div>
                )}
                {uploading && <div className="text-sm text-gray-400 mt-2">Uploading images...</div>}
              </div>

              {/* Submit Button */}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-lg">
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!formData.username || ['taste','presentation','service','ambiance','value'].some((c) => (formData as any)[c] === 0) || !formData.comment}
                className="glass-button w-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-2.5 sm:py-3 text-sm sm:text-base"
              >
                Submit Review
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
