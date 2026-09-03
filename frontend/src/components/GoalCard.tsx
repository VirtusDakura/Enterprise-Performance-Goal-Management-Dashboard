'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Goal } from '../types';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquarePlus,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  formatDate,
  getDeadlineStatus,
  getDepartmentBadgeStyle,
} from '../lib/utils';

interface GoalCardProps {
  goal: Goal;
  onProgressUpdate: (goalId: string, newProgress: number) => Promise<void>;
  onOpenReviewModal: (goal: Goal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onProgressUpdate,
  onOpenReviewModal,
}) => {
  // Local state for optimistic UI slider updates
  const [localProgress, setLocalProgress] = useState<number>(goal.progress);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

  // Synchronize local progress if goal prop updates from external refresh
  useEffect(() => {
    setLocalProgress(goal.progress);
  }, [goal.progress]);

  // Debounce ref to avoid flooding API while dragging slider
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setLocalProgress(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        setIsUpdating(true);
        await onProgressUpdate(goal.id, value);
      } catch (err) {
        // Rollback to original value on failure
        setLocalProgress(goal.progress);
      } finally {
        setIsUpdating(false);
      }
    }, 350);
  };

  const isCompleted = localProgress === 100;
  const deadlineStatus = getDeadlineStatus(goal.deadline);
  const deptStyle = getDepartmentBadgeStyle(
    goal.employee?.department?.name || 'General'
  );

  // Calculate average rating of peer reviews
  const reviewCount = goal.reviews?.length || 0;
  const averageRating =
    reviewCount > 0
      ? (
          goal.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        ).toFixed(1)
      : null;

  return (
    <div
      className={`glass-card relative flex flex-col justify-between rounded-xl p-5 transition-all duration-200 ${
        isCompleted
          ? 'border-emerald-500/30 shadow-emerald-500/5'
          : 'hover:border-indigo-500/30'
      }`}
    >
      {/* Top Header: Department badge & Status */}
      <div>
        <div className="flex items-center justify-between gap-2">
          {/* Department badge */}
          <span
            className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold ${deptStyle.bg} ${deptStyle.text} ${deptStyle.border}`}
          >
            {goal.employee?.department?.name || 'General'}
          </span>

          {/* Status Badge */}
          {isCompleted ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
              <Clock className="h-3 w-3" />
              In Progress
            </span>
          )}
        </div>

        {/* Goal Title */}
        <h3 className="mt-3 text-base font-semibold leading-snug text-white">
          {goal.title}
        </h3>

        {/* Description (collapsible if long) */}
        <div className="mt-2 text-xs leading-relaxed text-slate-400">
          <p
            className={
              isDescriptionExpanded
                ? ''
                : 'line-clamp-2'
            }
          >
            {goal.description}
          </p>
          {goal.description.length > 110 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
            >
              {isDescriptionExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Employee Assignee & Deadline meta */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-slate-800/80 py-3">
          {/* Assignee */}
          <div className="flex items-center gap-2.5">
            {goal.employee?.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={goal.employee.avatarUrl}
                alt={goal.employee.name}
                className="h-8 w-8 rounded-full border border-slate-700 object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-300">
                {goal.employee?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-slate-200">
                {goal.employee?.name || 'Unassigned'}
              </p>
              <p className="text-[11px] text-slate-400">
                {goal.employee?.role || 'Team Member'}
              </p>
            </div>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-300">{formatDate(goal.deadline)}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                deadlineStatus.isOverdue
                  ? 'bg-rose-500/20 text-rose-400'
                  : deadlineStatus.isUrgent
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {deadlineStatus.text}
            </span>
          </div>
        </div>

        {/* Interactive Progress Section */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-300">Progress</span>
              {isUpdating && (
                <span className="animate-pulse text-[10px] text-indigo-400">
                  (Saving...)
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 font-mono font-bold">
              <span
                className={
                  isCompleted ? 'text-emerald-400' : 'text-indigo-400'
                }
              >
                {localProgress}%
              </span>
            </div>
          </div>

          {/* Live Progress Bar Indicator */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-indigo-500 to-blue-500'
              }`}
              style={{ width: `${localProgress}%` }}
            />
          </div>

          {/* Interactive Range Slider */}
          <div className="pt-1">
            <input
              id={`progress-slider-${goal.id}`}
              type="range"
              min="0"
              max="100"
              step="1"
              value={localProgress}
              onChange={handleSliderChange}
              aria-label={`Update progress for ${goal.title}`}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: 360 Peer Reviews and Review Action */}
      <div className="mt-4 border-t border-slate-800/80 pt-3">
        <div className="flex items-center justify-between">
          {/* Rating Summary / Toggle Reviews Accordion */}
          {reviewCount > 0 ? (
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="group flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
            >
              <div className="flex items-center text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span className="ml-1 font-bold">{averageRating}</span>
              </div>
              <span className="text-slate-400 group-hover:text-slate-300">
                ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </span>
              {showReviews ? (
                <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>
          ) : (
            <span className="text-xs text-slate-400">No peer reviews yet</span>
          )}

          {/* Open 360 Review Modal Button */}
          <button
            id={`open-review-btn-${goal.id}`}
            onClick={() => onOpenReviewModal(goal)}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20 hover:text-white"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            <span>Review</span>
          </button>
        </div>

        {/* Nested Peer Reviews Accordion */}
        {showReviews && reviewCount > 0 && (
          <div className="mt-3 space-y-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              360° Peer Feedback
            </h4>
            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
              {goal.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-md border border-slate-800/80 bg-slate-900/50 p-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">
                      {rev.reviewerName}
                    </span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1.5 italic text-slate-300">
                    &ldquo;{rev.feedback}&rdquo;
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {formatDate(rev.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
