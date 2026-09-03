'use client';

import React from 'react';
import { AnalyticsData } from '../types';
import {
  TrendingUp,
  Award,
  Star,
  Layers,
} from 'lucide-react';

interface AnalyticsWidgetsProps {
  data: AnalyticsData | null;
  loading: boolean;
}

export const AnalyticsWidgets: React.FC<AnalyticsWidgetsProps> = ({
  data,
  loading,
}) => {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-slate-800" />
              <div className="h-8 w-8 rounded-lg bg-slate-800" />
            </div>
            <div className="mt-4 h-8 w-32 rounded bg-slate-800" />
            <div className="mt-2 h-3 w-40 rounded bg-slate-800/60" />
          </div>
        ))}
      </div>
    );
  }

  const completionRate =
    data.totalGoals > 0
      ? Math.round((data.totalCompletedGoals / data.totalGoals) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Active Objectives */}
      <div className="glass-card relative overflow-hidden rounded-xl p-5 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Goals
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <Layers className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white">
            {data.totalActiveGoals}
          </span>
          <span className="text-sm text-slate-400">
            / {data.totalGoals} Total
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Completed: {data.totalCompletedGoals}</span>
          <span className="font-semibold text-emerald-400">
            {completionRate}% finished
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Organizational Velocity */}
      <div className="glass-card relative overflow-hidden rounded-xl p-5 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Company Progress
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white">
            {data.companyAverageProgress}%
          </span>
          <span className="text-xs font-medium text-indigo-400">
            Avg Velocity
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>Enterprise Target: 80%</span>
          <span
            className={`font-semibold ${
              data.companyAverageProgress >= 70
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {data.companyAverageProgress >= 70 ? 'On Track' : 'Needs Focus'}
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.min(100, data.companyAverageProgress)}%` }}
          />
        </div>
      </div>

      {/* Top Department */}
      <div className="glass-card relative overflow-hidden rounded-xl p-5 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Top Department
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <Award className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <span className="block truncate text-xl font-extrabold tracking-tight text-white">
            {data.topDepartment ? data.topDepartment.name : 'N/A'}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            {data.topDepartment
              ? `${data.topDepartment.goalCount} Goals Assigned`
              : 'No goals logged'}
          </span>
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-bold text-amber-300">
            {data.topDepartment
              ? `${data.topDepartment.averageProgress}% Avg`
              : '0%'}
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
            style={{
              width: `${
                data.topDepartment ? data.topDepartment.averageProgress : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* Peer Feedback Score */}
      <div className="glass-card relative overflow-hidden rounded-xl p-5 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            360° Peer Feedback
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Star className="h-4 w-4 fill-emerald-400/20" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white">
            {data.averageReviewRating > 0
              ? data.averageReviewRating.toFixed(1)
              : '5.0'}
          </span>
          <span className="text-sm text-slate-400">/ 5.0</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= Math.round(data.averageReviewRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="font-medium text-slate-300">
            {data.totalReviews} Reviews
          </span>
        </div>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{
              width: `${(data.averageReviewRating / 5) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
