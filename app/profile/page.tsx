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
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">{user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}</div>
            <div>
              <div className="text-lg font-semibold text-white">{user?.name || user?.email}</div>
              <div className="text-sm text-gray-400">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsAddRestaurantModalOpen(true)} className="flex items-center gap-2 bg-white text-black px-3 py-2 rounded-md"> <FaPlus /> Add</button>
            <button onClick={handleLogout} className="flex items-center gap-2 border border-white/10 px-3 py-2 rounded-md text-white"> <FaSignOutAlt /> Sign out</button>
          </div>
        </div>

        <div className="flex gap-6 mb-6">
          <div className="p-4 bg-white/5 rounded-md text-center flex-1">
            <div className="text-sm text-gray-400">Reviews</div>
            <div className="text-xl font-bold text-white">{totalReviews}</div>
          </div>
          <div className="p-4 bg-white/5 rounded-md text-center flex-1">
            <div className="text-sm text-gray-400">Avg Rating</div>
            <div className="text-xl font-bold text-white">{averageRating}</div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Your recent reviews</h3>
          {reviewsLoading ? (
            <div className="text-gray-400">Loading...</div>
          ) : userReviews.length === 0 ? (
            <div className="text-gray-400">You haven't posted any reviews yet.</div>
          ) : (
            <div className="space-y-3">
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
                .map((rev: Review) => {
                  return (
                    <div key={rev._id} className="p-3 bg-white/5 rounded-md flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-white">{rev.restaurant}</div>
                        <div className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold text-yellow-400">{rev.rating}/5</div>
                        <button
                          onClick={async () => {
                            const ok = window.confirm('Delete this review? This cannot be undone.');
                            if (!ok) return;
                            try {
                              const success = await deleteReview(rev._id);
                              if (!success) alert('Unable to delete review');
                            } catch (e) {
                              alert('Unable to delete review');
                            }
                          }}
                          title="Delete review"
                          className="p-2 rounded-md text-sm text-red-400 hover:bg-white/5"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <AddRestaurantModal isOpen={isAddRestaurantModalOpen} onClose={() => setIsAddRestaurantModalOpen(false)} />
      </div>
    </div>
  );
}
              <div className="text-gray-400">You haven't posted any reviews yet.</div>
