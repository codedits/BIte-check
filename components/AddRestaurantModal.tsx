'use client';

import { useState } from 'react';
import { eventBus, EVENTS } from '@/lib/eventBus';
import StarRating from './StarRating';

interface AddRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddRestaurantModal({ isOpen, onClose, onSuccess }: AddRestaurantModalProps) {
  const [restaurantName, setRestaurantName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [comment, setComment] = useState('');
  // category ratings
  const [taste, setTaste] = useState(0);
  const [presentation, setPresentation] = useState(0);
  const [service, setService] = useState(0);
  const [ambiance, setAmbiance] = useState(0);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!restaurantName || !cuisine || !restaurantLocation || !priceRange || !comment || taste === 0 || presentation === 0 || service === 0 || ambiance === 0 || value === 0) {
      setError('Please fill in all fields and rate all categories');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, create the restaurant
      const restaurantResponse = await fetch('/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This is crucial for authentication
        body: JSON.stringify({
          name: restaurantName,
          cuisine,
          location: restaurantLocation,
          priceRange,
          description: comment
        }),
      });

      if (!restaurantResponse.ok) {
        const errorData = await restaurantResponse.json();
        throw new Error(errorData.error || 'Failed to create restaurant');
      }

      // Optionally upload image and then create the review with imageUrl
      let imageUrl = '';
      try {
        if (file) {
          setUploading(true);
          // convert to data URL
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const uploadRes = await fetch('/api/review-upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: dataUrl }),
          });

          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData?.secure_url) {
            imageUrl = uploadData.secure_url;
          }
        }
      } catch (err) {
        console.error('Image upload failed', err);
        // proceed without image
      } finally {
        setUploading(false);
      }

      // compute overall weighted rating
      const weights: Record<string, number> = { taste: 40, presentation: 15, service: 15, ambiance: 15, value: 15 };
      const totalWeight = Object.values(weights).reduce((s, v) => s + v, 0);
      const weightedSum = (taste * weights.taste) + (presentation * weights.presentation) + (service * weights.service) + (ambiance * weights.ambiance) + (value * weights.value);
      const overall = Math.round((weightedSum / totalWeight) * 10) / 10;

      // Then, create the review with breakdown
      const reviewResponse = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This is crucial for authentication
        body: JSON.stringify({
          restaurant: restaurantName,
          rating: overall,
          rating_breakdown: { taste, presentation, service, ambiance, value },
          comment,
          images: imageUrl ? [imageUrl] : []
        }),
      });

      if (!reviewResponse.ok) {
        const errorData = await reviewResponse.json();
        throw new Error(errorData.error || 'Failed to create review');
      }

      // Reset form and close modal
      setRestaurantName('');
      setCuisine('');
      setRestaurantLocation('');
      setPriceRange('');
      setComment('');
  setTaste(0);
  setPresentation(0);
  setService(0);
  setAmbiance(0);
  setValue(0);
      onClose();
      
      // Emit events to refresh data across components
      eventBus.emit(EVENTS.RESTAURANT_ADDED);
      eventBus.emit(EVENTS.REVIEW_ADDED);
      eventBus.emit(EVENTS.DATA_REFRESH);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-bold text-white">Add Restaurant & Review</h2>
            <p className="text-gray-300 text-sm">Share your dining experience</p>
          </div>
          <button
            onClick={onClose}
            className="glass-button p-2 hover:bg-red-500/20 hover:text-red-400"
          >
            X
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Restaurant Name *
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="glass-input w-full"
              placeholder="Enter restaurant name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cuisine *
              </label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="glass-input w-full"
                required
              >
                <option value="">Select Cuisine</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Indian">Indian</option>
                <option value="Mexican">Mexican</option>
                <option value="Thai">Thai</option>
                <option value="French">French</option>
                <option value="American">American</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price Range *
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="glass-input w-full"
                required
              >
                <option value="">Select Price Range</option>
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Expensive)</option>
                <option value="$$$$">$$$$ (Very Expensive)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={restaurantLocation}
              onChange={(e) => setRestaurantLocation(e.target.value)}
              className="glass-input w-full"
              placeholder="Enter location (city, neighborhood, etc.)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category ratings *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Taste */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300 w-28">Taste</span>
                <div className="flex-1 flex items-center justify-center">
                  {/* @ts-ignore */}
                  <StarRating rating={taste} onRatingChange={(r) => setTaste(r)} />
                </div>
                <span className="w-8 text-right text-white font-medium">{taste || '-'}</span>
              </div>

              {/* Presentation */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300 w-28">Presentation</span>
                <div className="flex-1 flex items-center justify-center">
                  {/* @ts-ignore */}
                  <StarRating rating={presentation} onRatingChange={(r) => setPresentation(r)} />
                </div>
                <span className="w-8 text-right text-white font-medium">{presentation || '-'}</span>
              </div>

              {/* Service */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300 w-28">Service</span>
                <div className="flex-1 flex items-center justify-center">
                  {/* @ts-ignore */}
                  <StarRating rating={service} onRatingChange={(r) => setService(r)} />
                </div>
                <span className="w-8 text-right text-white font-medium">{service || '-'}</span>
              </div>

              {/* Ambiance */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300 w-28">Ambiance</span>
                <div className="flex-1 flex items-center justify-center">
                  {/* @ts-ignore */}
                  <StarRating rating={ambiance} onRatingChange={(r) => setAmbiance(r)} />
                </div>
                <span className="w-8 text-right text-white font-medium">{ambiance || '-'}</span>
              </div>

              {/* Value spans two columns */}
              <div className="flex items-center gap-4 col-span-2">
                <span className="text-sm text-gray-300 w-28">Value</span>
                <div className="flex-1 flex items-center justify-center">
                  {/* @ts-ignore */}
                  <StarRating rating={value} onRatingChange={(r) => setValue(r)} />
                </div>
                <span className="w-8 text-right text-white font-medium">{value || '-'}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-sm text-gray-300">Overall (weighted)</span>
              <div className="text-white font-semibold">
                {(() => {
                  const weights: Record<string, number> = { taste: 40, presentation: 15, service: 15, ambiance: 15, value: 15 };
                  const total = Object.values(weights).reduce((s, v) => s + v, 0);
                  const sum = (taste * weights.taste) + (presentation * weights.presentation) + (service * weights.service) + (ambiance * weights.ambiance) + (value * weights.value);
                  const val = total ? Math.round((sum / total) * 10) / 10 : 0;
                  return val > 0 ? `${val} / 5` : '- / 5';
                })()}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Review Comment *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="glass-input w-full h-24 resize-none"
              placeholder="Share your experience..."
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm sm:text-base file:rounded file:bg-white/10 file:text-white file:py-2 file:px-3"
            />
            {uploading && <div className="text-sm text-gray-400 mt-2">Uploading image...</div>}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="glass-button bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


