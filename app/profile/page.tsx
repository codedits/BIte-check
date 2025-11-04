'use client';

import { FaSignOutAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AddRestaurantModal from '@/components/AddRestaurantModal';
import EditReviewModal from '@/components/EditReviewModal';
import PageSkeleton from '@/components/PageSkeleton';
import { Review } from '@/types';

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Keep fetching user reviews so stats remain accurate
  const { reviews: userReviews = [], loading: reviewsLoading, deleteReview, editReview } = useReviews(user?.id);

  if (loading) {
    return <PageSkeleton variant="profile" />;
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
    <div className="min-h-screen bg-black">
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/10 bg-gradient-to-br from-orange-500/20 to-orange-600/5 text-2xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">{user?.name || user?.email}</h1>
              <p className="text-sm text-white/50">{user?.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddRestaurantModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              <FaPlus className="text-xs" />
              Add review
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
            >
              <FaSignOutAlt className="text-xs" />
              Sign out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">Reviews</span>
            <span className="text-4xl font-semibold text-white">{totalReviews}</span>
          </div>
          <div className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">Avg Rating</span>
            <span className="text-4xl font-semibold text-white">{averageRating}</span>
          </div>
        </div>

        {/* Recent Reviews */}
        <section aria-labelledby="recent-reviews">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 id="recent-reviews" className="text-sm uppercase tracking-[0.4em] text-white/50">Your reviews</h2>
              <p className="mt-2 text-xl font-semibold text-white">Recent contributions</p>
            </div>
          </div>
          {reviewsLoading ? (
            <div className="text-sm text-white/60">Loading…</div>
          ) : userReviews.length === 0 ? (
            <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
              <p className="text-sm text-white/60">You haven't posted any reviews yet.</p>
              <button
                onClick={() => setIsAddRestaurantModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
              >
                <FaPlus className="text-xs" />
                Add your first review
              </button>
            </div>
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
                .slice(0, 10)
                .map((rev: Review) => (
                  <li key={rev._id} className="group flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/10 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-medium text-white">{rev.restaurant}</div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-white/40">{new Date(rev.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">{rev.rating}/5</span>
                      <button
                        onClick={() => { setEditingReview(rev); setIsEditOpen(true); }}
                        title="Edit review"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
                      >
                        <FaEdit />
                      </button>
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
                        className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-red-400/80 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </section>

        <AddRestaurantModal isOpen={isAddRestaurantModalOpen} onClose={() => setIsAddRestaurantModalOpen(false)} />
        <EditReviewModal
          isOpen={isEditOpen}
          onClose={() => { setIsEditOpen(false); setEditingReview(null); }}
          review={editingReview}
          onSubmit={async (payload) => {
            await editReview(payload);
          }}
        />
      </main>
    </div>
  );
}

