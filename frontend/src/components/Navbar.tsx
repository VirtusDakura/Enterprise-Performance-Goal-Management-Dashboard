'use client';

import React from 'react';
import { Target, Plus } from 'lucide-react';

interface NavbarProps {
  onOpenCreateGoal: () => void;
  totalActiveGoals?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateGoal,
  totalActiveGoals,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#090d16]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-md shadow-indigo-500/20">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white sm:text-lg">
                Enterprise Performance
              </span>
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-400">
                System
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Goal Management & 360° Review Hub
            </p>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-3">
          {/* Live Sync Status */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 md:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>Live Sync Active</span>
            {typeof totalActiveGoals === 'number' && (
              <span className="text-emerald-300/70">
                • {totalActiveGoals} Active Goals
              </span>
            )}
          </div>

          {/* Quick Action: Create Goal */}
          <button
            id="create-goal-btn"
            onClick={onOpenCreateGoal}
            className="group flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-all duration-150 hover:bg-indigo-500 active:scale-95"
          >
            <Plus className="h-4 w-4 transition-transform duration-150 group-hover:rotate-90" />
            <span>New Goal</span>
          </button>
        </div>
      </div>
    </header>
  );
};
