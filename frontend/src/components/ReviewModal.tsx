'use client';

import React, { useState } from 'react';
import { Goal, PeerReview } from '../types';
import { X, Star, MessageSquareQuote, Check, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface ReviewModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (goalId: string, review: PeerReview) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Needs Improvement',
  2: 'Fair Progress',
  3: 'Good / On Track',
  4: 'Very Strong',
  5: 'Exceptional Impact',
};

export const ReviewModal: React.FC<ReviewModalProps> = ({
  goal,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [reviewerName, setReviewerName] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reviewerName.trim()) {
      setError('Please provide your name or role as reviewer.');
      return;
    }

    if (!feedback.trim() || feedback.trim().length < 5) {
      setError('Please provide detailed feedback (at least 5 characters).');
      return;
    }

    try {
      setIsSubmitting(true);
      const newReview = await api.submitPeerReview(goal.id, {
        reviewerName: reviewerName.trim(),
        rating,
        feedback: feedback.trim(),
      });

      onReviewSubmitted(goal.id, newReview);
      onClose();
      // Reset form
      setReviewerName('');
      setFeedback('');
      setRating(5);
    } catch (err: any) {
      setError(err.message || 'Failed to submit peer review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700/80 bg-[#0f172a] p-6 shadow-2xl shadow-indigo-950/40 transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <MessageSquareQuote className="h-4 w-4" />
            <span>360° Peer Review Evaluation</span>
          </div>
          <h2 className="mt-1 text-lg font-bold text-white">
            Review Goal: &ldquo;{goal.title}&rdquo;
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Assigned to <span className="font-semibold text-slate-200">{goal.employee?.name}</span> ({goal.employee?.department?.name})
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Reviewer Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Your Name & Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="reviewer-name-input"
              type="text"
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="e.g. Alex Rivera (Lead Product Architect)"
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Rating (Interactive 1-5 Star Picker) */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Performance Rating <span className="text-rose-400">*</span>
              </label>
              <span className="text-xs font-semibold text-amber-400">
                {RATING_LABELS[activeRating]}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="rounded-lg p-1.5 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= activeRating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-mono text-sm font-bold text-slate-200">
                {activeRating} / 5
              </span>
            </div>
          </div>

          {/* Feedback Textarea */}
          <div>
            <label className="block text-xs font-medium text-slate-300">
              360° Peer Feedback <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="review-feedback-input"
              rows={4}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide constructive feedback on quality, collaboration, execution velocity, and architectural impact..."
              className="mt-1.5 w-full resize-none rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              id="submit-review-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Submit Peer Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
