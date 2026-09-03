'use client';

import React from 'react';
import { Department, SortOption, StatusFilter } from '../types';
import { Search, ArrowUpDown, LayoutGrid, ListFilter } from 'lucide-react';

interface GoalFiltersProps {
  departments: Department[];
  selectedDepartment: string;
  onSelectDepartment: (deptId: string) => void;
  selectedStatus: StatusFilter;
  onSelectStatus: (status: StatusFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  totalFiltered: number;
  totalAll: number;
}

export const GoalFilters: React.FC<GoalFiltersProps> = ({
  departments,
  selectedDepartment,
  onSelectDepartment,
  selectedStatus,
  onSelectStatus,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
  totalAll,
}) => {
  return (
    <div className="space-y-4 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm backdrop-blur-sm">
      {/* Top row: Search and primary controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="goal-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search goals by title, description, or employee name..."
            className="w-full rounded-lg border border-slate-700/80 bg-slate-950/70 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Right side: Sort and View mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowUpDown className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-400" />
            <select
              id="goal-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sort goals by"
              className="appearance-none rounded-lg border border-slate-700/80 bg-slate-950/70 py-2 pl-9 pr-8 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 focus:border-indigo-500 focus:outline-none"
            >
              <option value="DEADLINE_ASC">Deadline: Soonest</option>
              <option value="DEADLINE_DESC">Deadline: Furthest</option>
              <option value="PROGRESS_DESC">Progress: High to Low</option>
              <option value="PROGRESS_ASC">Progress: Low to High</option>
              <option value="NEWEST">Date Added: Newest</option>
            </select>
          </div>

          {/* View mode toggle (Grid / Table) */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950/80 p-1 text-slate-400">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Data Table View"
            >
              <ListFilter className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Filter Pills */}
      <div className="flex flex-col gap-3 border-t border-slate-800/60 pt-3 md:flex-row md:items-center md:justify-between">
        {/* Status filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Status:
          </span>
          <button
            onClick={() => onSelectStatus('ALL')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedStatus === 'ALL'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            All Statuses
          </button>
          <button
            onClick={() => onSelectStatus('IN_PROGRESS')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedStatus === 'IN_PROGRESS'
                ? 'border border-blue-500/40 bg-blue-500/20 text-blue-300 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => onSelectStatus('COMPLETED')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedStatus === 'COMPLETED'
                ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            Completed (100%)
          </button>
        </div>

        {/* Department filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Dept:
          </span>
          <button
            onClick={() => onSelectDepartment('ALL')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              selectedDepartment === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            All Departments
          </button>
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => onSelectDepartment(dept.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                selectedDepartment === dept.id
                  ? 'border border-indigo-500/50 bg-indigo-500/20 text-indigo-300 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </div>

      {/* Result counter indicator */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing <span className="font-semibold text-slate-200">{totalFiltered}</span> of{' '}
          <span className="font-semibold text-slate-200">{totalAll}</span> goals
        </span>
        {(selectedDepartment !== 'ALL' || selectedStatus !== 'ALL' || searchQuery.trim()) && (
          <button
            onClick={() => {
              onSelectDepartment('ALL');
              onSelectStatus('ALL');
              onSearchChange('');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};
