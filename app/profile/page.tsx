'use client';

import { FaSignOutAlt, FaPlus, FaTrash, FaEdit, FaExclamationTriangle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AddRestaurantModal from '@/components/AddRestaurantModal';
import EditReviewModal from '@/components/EditReviewModal';
import { Review } from '@/types';

export default function ProfilePage() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDangerZone, setShowDangerZone] = useState(false);

  // Keep fetching user reviews so stats remain accurate
  const { reviews: userReviews = [], loading: reviewsLoading, deleteReview, editReview } = useReviews(user?.id);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white mx-auto"></div>
          <p className="text-sm text-white/60">Loading profile...</p>
        </div>
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

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Logout and redirect to home
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Subtle Background - Same as Homepage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[100px]" />
      </div>

      <main className="relative mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-5">
            {user?.image ? (
              <img 
                src={user.image} 
                alt={user?.name || user?.email || 'User'} 
                className="h-20 w-20 flex-shrink-0 rounded-full object-cover ring-2 ring-orange-500/20"
              />
            ) : (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/10 bg-gradient-to-br from-orange-500/20 to-orange-600/5 text-2xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
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
          <div className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-transparent p-6 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">Reviews</span>
            <span className="text-4xl font-semibold text-white">{totalReviews}</span>
          </div>
          <div className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-transparent p-6 text-center">
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
            <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-transparent p-12 text-center">
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
                  <li key={rev._id} className="group flex flex-col gap-4 rounded-3xl border border-white/10 bg-transparent p-5 transition hover:border-white/20 hover:bg-transparent sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-base font-medium text-white">{rev.restaurant}</div>
                      <div className="mt-1 text-xs uppercase tracking-wide text-white/40">{new Date(rev.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-transparent px-3 py-1 text-sm font-medium text-white">{rev.rating}/5</span>
                      <button
                        onClick={() => { setEditingReview(rev); setIsEditOpen(true); }}
                        title="Edit review"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-white/60 transition hover:bg-transparent hover:text-white"
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

        {/* Danger Zone - Delete Account (Collapsible) */}
        <section className="mt-20 border-t border-red-500/20 pt-12">
          <button
            onClick={() => setShowDangerZone(!showDangerZone)}
            className="w-full flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 px-6 py-4 transition-all hover:bg-red-500/10"
          >
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-red-500 text-lg" />
              <div className="text-left">
                <h2 className="text-sm font-semibold text-red-500">Danger Zone</h2>
                <p className="text-xs text-white/50">Account deletion settings</p>
              </div>
            </div>
            {showDangerZone ? (
              <FaChevronUp className="text-red-500" />
            ) : (
              <FaChevronDown className="text-red-500" />
            )}
          </button>

          {showDangerZone && (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <div className="flex items-start gap-4 mb-4">
                <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Permanently Delete Your Account</h3>
                  <p className="text-sm text-white/60 mb-3">
                    Once you delete your account, there is no going back. This will permanently delete:
                  </p>
                  <ul className="text-sm text-white/60 space-y-1 mb-4 ml-4 list-disc">
                    <li>Your profile and account information</li>
                    <li>All your reviews ({totalReviews} review{totalReviews !== 1 ? 's' : ''})</li>
                    <li>Your ratings and contributions</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-600"
              >
                <FaTrash className="text-xs" />
                Delete My Account
              </button>
            </div>
          )}
        </section>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md rounded-2xl border border-red-500/30 bg-black p-6">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                    <FaExclamationTriangle className="text-red-500 text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Delete Account?</h3>
                </div>
                <p className="text-sm text-white/70 mb-4">
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </p>
                <p className="text-sm text-white/60 mb-4">
                  Type <span className="font-bold text-white">DELETE</span> to confirm:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                  }}
                  disabled={isDeleting}
                  className="flex-1 rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-transparent disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}

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

