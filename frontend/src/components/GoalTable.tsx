'use client';

import React from 'react';
import { Goal } from '../types';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquarePlus,
  Star,
} from 'lucide-react';
import { formatDate, getDeadlineStatus, getDepartmentBadgeStyle } from '../lib/utils';

interface GoalTableProps {
  goals: Goal[];
  onProgressUpdate: (goalId: string, newProgress: number) => Promise<void>;
  onOpenReviewModal: (goal: Goal) => void;
}

export const GoalTable: React.FC<GoalTableProps> = ({
  goals,
  onProgressUpdate,
  onOpenReviewModal,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 shadow-sm backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3.5">Goal & Department</th>
              <th className="px-4 py-3.5">Assignee</th>
              <th className="px-4 py-3.5">Deadline</th>
              <th className="px-4 py-3.5">Progress Slider</th>
              <th className="px-4 py-3.5">360° Reviews</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {goals.map((goal) => {
              const deptStyle = getDepartmentBadgeStyle(
                goal.employee?.department?.name || 'General'
              );
              const deadlineStatus = getDeadlineStatus(goal.deadline);
              const isCompleted = goal.progress === 100;
              const reviewCount = goal.reviews?.length || 0;
              const avgRating =
                reviewCount > 0
                  ? (
                      goal.reviews.reduce((sum, r) => sum + r.rating, 0) /
                      reviewCount
                    ).toFixed(1)
                  : null;

              return (
                <tr
                  key={goal.id}
                  className="transition-colors hover:bg-slate-800/40"
                >
                  {/* Goal & Department */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-semibold ${deptStyle.bg} ${deptStyle.text}`}
                      >
                        {goal.employee?.department?.name || 'General'}
                      </span>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                          <Clock className="h-2.5 w-2.5" />
                          Active
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-semibold text-white">{goal.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                      {goal.description}
                    </p>
                  </td>

                  {/* Assignee */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      {goal.employee?.avatarUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={goal.employee.avatarUrl}
                          alt={goal.employee.name}
                          className="h-6 w-6 rounded-full border border-slate-700 object-cover"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold">
                          {goal.employee?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-200">
                          {goal.employee?.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {goal.employee?.role}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Deadline */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(goal.deadline)}</span>
                    </div>
                    <span
                      className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        deadlineStatus.isOverdue
                          ? 'bg-rose-500/20 text-rose-400'
                          : deadlineStatus.isUrgent
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {deadlineStatus.text}
                    </span>
                  </td>

                  {/* Progress Slider */}
                  <td className="px-4 py-3.5 min-w-[180px]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-indigo-400">
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-emerald-400' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) =>
                        onProgressUpdate(goal.id, parseInt(e.target.value, 10))
                      }
                      className="mt-1 w-full"
                    />
                  </td>

                  {/* 360 Reviews */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {reviewCount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-amber-400">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span className="ml-1 font-bold">{avgRating}</span>
                        </div>
                        <span className="text-slate-400">
                          ({reviewCount})
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500">None yet</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onOpenReviewModal(goal)}
                      className="inline-flex items-center gap-1 rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20 hover:text-white"
                    >
                      <MessageSquarePlus className="h-3 w-3" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
