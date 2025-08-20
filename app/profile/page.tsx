'use client';

import { FaSignOutAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AddRestaurantModal from '@/components/AddRestaurantModal';
import { Review } from '@/types';

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);

  // Keep fetching user reviews so stats remain accurate
  const { reviews: userReviews = [], loading: reviewsLoading, deleteReview } = useReviews(user?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Checking authentication…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/auth/signin');
    return null;
  }

  const totalReviews = userReviews.length || 0;
  const averageRating = userReviews.length > 0 ? (userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length).toFixed(1) : '0.0';

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="space-y-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-semibold text-white truncate">{user?.name || user?.email}</h1>
              <p className="text-sm text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddRestaurantModalOpen(true)}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md text-sm font-medium w-full xs:w-auto justify-center"
            >
              <FaPlus /> Add
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-white/15 px-4 py-2 rounded-md text-white text-sm font-medium w-full xs:w-auto justify-center"
            >
              <FaSignOutAlt /> Sign out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-10">
          <div className="p-4 sm:p-5 bg-white/5 rounded-lg text-center flex flex-col gap-1">
            <span className="text-[11px] tracking-wide uppercase text-gray-400">Reviews</span>
            <span className="text-2xl font-bold text-white leading-none">{totalReviews}</span>
          </div>
          <div className="p-4 sm:p-5 bg-white/5 rounded-lg text-center flex flex-col gap-1">
            <span className="text-[11px] tracking-wide uppercase text-gray-400">Avg Rating</span>
            <span className="text-2xl font-bold text-white leading-none">{averageRating}</span>
          </div>
        </div>

        {/* Recent Reviews */}
        <section aria-labelledby="recent-reviews" className="mb-6">
          <h2 id="recent-reviews" className="text-lg font-semibold text-white mb-4">Your recent reviews</h2>
          {reviewsLoading ? (
            <div className="text-gray-400 text-sm">Loading…</div>
          ) : userReviews.length === 0 ? (
            <div className="text-gray-500 text-sm">You haven't posted any reviews yet.</div>
          ) : (
            <ul className="space-y-3">
              {userReviews
                .filter((rev: Review) => {
                  const revUserAny: any = rev.userId;
                  const ownerId = revUserAny && typeof revUserAny === 'object' ? (revUserAny._id ?? revUserAny.id ?? revUserAny) : rev.userId;
                  const isOwner = !!(
                    (user?.id && ownerId && String(ownerId) === String(user.id)) ||
                    (rev.username && user?.username && rev.username === user.username) ||
                    (revUserAny && typeof revUserAny === 'object' && revUserAny.email && user?.email && revUserAny.email === user.email)
                  );
                  return isOwner;
                })
                .slice(0, 6)
                .map((rev: Review) => (
                  <li key={rev._id} className="p-3 sm:p-4 bg-white/5 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{rev.restaurant}</div>
                      <div className="text-[11px] uppercase tracking-wide text-gray-400 mt-0.5">{new Date(rev.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-sm font-semibold text-yellow-400 whitespace-nowrap">{rev.rating}/5</div>
                      <button
                        onClick={async () => {
                          const ok = window.confirm('Delete this review? This cannot be undone.');
                          if (!ok) return;
                          try {
                            await deleteReview(rev._id);
                          } catch {
                            alert('Unable to delete review');
                          }
                        }}
                        title="Delete review"
                        className="p-2 rounded-md text-sm text-red-400 hover:bg-white/10 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </section>

        <AddRestaurantModal
          isOpen={isAddRestaurantModalOpen}
          onClose={() => setIsAddRestaurantModalOpen(false)}
        />
      </div>
    </div>
  );
}

