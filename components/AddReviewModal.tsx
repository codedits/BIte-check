"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaImage, FaStar, FaTrash, FaCheckCircle } from "react-icons/fa";
import StarRating from "./StarRating";
import { useAuth } from "@/contexts/AuthContext";
import { computeWeightedRating } from "@/lib/ratings";

interface RatingBreakdown {
  taste: number;
  presentation: number;
  service: number;
  ambiance: number;
  value: number;
}

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    username?: string;
    rating: number;
    comment: string;
    images?: string[];
    rating_breakdown: RatingBreakdown;
  }) => Promise<void> | void;
  restaurantName?: string;
}

const MAX_IMAGES = 3;

export default function AddReviewModal({ isOpen, onClose, onSubmit, restaurantName }: AddReviewModalProps) {
  const { user, isAuthenticated } = useAuth() as any;
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [ratings, setRatings] = useState<RatingBreakdown>({ taste: 0, presentation: 0, service: 0, ambiance: 0, value: 0 });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // compute overall rating using existing util to keep behaviour consistent
  const overall = useMemo(() => computeWeightedRating(ratings), [ratings]);

  useEffect(() => {
    // generate previews when files change
    const urls = files.map((f) => URL.createObjectURL(f));
    // revoke previous
    previews.forEach((u) => URL.revokeObjectURL(u));
    setPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    if (!isOpen) {
      // reset when closed
      setUsername("");
      setComment("");
      setRatings({ taste: 0, presentation: 0, service: 0, ambiance: 0, value: 0 });
      setFiles([]);
      setPreviews([]);
      setUploading(false);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  const handleFiles = (selected: File[]) => {
    const pick = selected.slice(0, MAX_IMAGES);
    setFiles(pick);
  };

  const handleInputFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    handleFiles(Array.from(e.target.files));
  };

  const removeImage = (idx: number) => {
    const nextFiles = files.filter((_, i) => i !== idx);
    setFiles(nextFiles);
  };

  const setRating = (key: keyof RatingBreakdown, value: number) => {
    setRatings((s) => ({ ...s, [key]: value }));
  };

  const validate = () => {
    if (!isAuthenticated && !username.trim()) {
      setError("Please provide a name or sign in.");
      return false;
    }
    if (!comment.trim()) {
      setError("Please write a short review.");
      return false;
    }
    const hasRating = Object.values(ratings).some((r) => r > 0);
    if (!hasRating) {
      setError("Please rate at least one category.");
      return false;
    }
    return true;
  };

  const uploadImage = async (file: File) => {
    // Keep same API contract as previous implementation
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await fetch("/api/review-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: dataUrl }),
    });
    if (!res.ok) throw new Error("Upload failed");
    const body = await res.json();
    return body?.secure_url || null;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!validate()) return;
    setUploading(true);
    try {
      const images: string[] = [];
      if (files.length > 0) {
        for (const f of files.slice(0, MAX_IMAGES)) {
          const url = await uploadImage(f);
          if (url) images.push(url);
        }
      }

      await Promise.resolve(
        onSubmit({
          username: isAuthenticated ? user?.username : username,
          rating: overall,
          comment: comment.trim(),
          images,
          rating_breakdown: ratings,
        })
      );

      setSuccess(true);
      // short success state then close
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 900);
    } catch (err: any) {
      setError(err?.message || "Submission failed");
    } finally {
      setUploading(false);
    }
  };

  // small, modern modal design with glass and soft accents
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => onClose()}
        >
          <motion.div
            initial={{ y: "10%", scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: "10%", scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl mx-4 sm:mx-0 bg-gradient-to-b from-white/3 to-white/2 border border-white/6 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/6">
              <div>
                <h3 className="text-lg font-semibold text-white">Write a review</h3>
                {restaurantName && <p className="text-xs text-white/60">{restaurantName}</p>}
              </div>
              <button
                aria-label="Close review dialog"
                onClick={() => onClose()}
                className="p-2 rounded-md text-white/70 hover:bg-white/5"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
              {!isAuthenticated && (
                <div>
                  <label className="block text-xs text-white/70 mb-2">Your name</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Name or nickname"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/6 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">Rate categories</h4>
                  <div className="text-xs text-white/60">Overall {overall > 0 ? overall.toFixed(1) : '-'}/5</div>
                </div>

                <div className="grid gap-3">
                  {([
                    ['taste', 'Taste'],
                    ['presentation', 'Presentation'],
                    ['service', 'Service'],
                    ['ambiance', 'Ambiance'],
                    ['value', 'Value'],
                  ] as [keyof RatingBreakdown, string][]).map(([k, label]) => (
                    <div key={k} className="flex items-center justify-between bg-white/3 border border-white/6 rounded-xl p-3">
                      <div className="text-sm text-white">{label}</div>
                      <div className="flex items-center gap-3">
                        <StarRating rating={ratings[k]} onRatingChange={(r) => setRating(k, r)} />
                        <div className="text-sm text-white/80 w-6 text-right">{ratings[k] || '-'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-2">Your review</label>
                <textarea
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others what you liked and what could be improved"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/6 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400/30 resize-none"
                />
                <div className="text-xs text-white/50 mt-1">{comment.length} characters</div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-white">Photos</label>
                  <div className="text-xs text-white/50">Optional, up to {MAX_IMAGES}</div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  {previews.map((p, i) => (
                    <div key={p} className="relative rounded-lg overflow-hidden h-24">
                      <img src={p} alt={`preview-${i}`} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/40 text-white"
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}

                  {previews.length < MAX_IMAGES && (
                    <label className="flex items-center justify-center border border-white/6 rounded-lg h-24 cursor-pointer bg-white/3 hover:bg-white/4">
                      <input ref={inputRef} onChange={handleInputFiles} type="file" accept="image/*" multiple className="hidden" />
                      <div className="text-center text-white/70">
                        <FaImage className="mx-auto mb-1 text-2xl" />
                        <div className="text-xs">Add photo</div>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {error && <div className="p-3 bg-red-600/10 text-red-300 rounded-lg">{error}</div>}
              {success && <div className="p-3 bg-green-600/10 text-green-300 rounded-lg">Review submitted</div>}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                  disabled={uploading}
                  className="flex-1 inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Submit review
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onClose()}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/6 text-white/80 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
