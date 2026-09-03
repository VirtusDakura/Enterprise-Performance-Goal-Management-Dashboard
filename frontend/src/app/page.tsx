'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  AnalyticsData,
  Department,
  Employee,
  Goal,
  PeerReview,
  SortOption,
  StatusFilter,
} from '../types';
import { api } from '../lib/api';
import { Navbar } from '../components/Navbar';
import { AnalyticsWidgets } from '../components/AnalyticsWidgets';
import { GoalFilters } from '../components/GoalFilters';
import { GoalCard } from '../components/GoalCard';
import { GoalTable } from '../components/GoalTable';
import { ReviewModal } from '../components/ReviewModal';
import { CreateGoalModal } from '../components/CreateGoalModal';
import { Toast, ToastMessage } from '../components/Toast';
import {
  RefreshCw,
  Target,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('DEADLINE_ASC');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [activeReviewGoal, setActiveReviewGoal] = useState<Goal | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadData = useCallback(
    async (isBackgroundRefresh = false) => {
      try {
        if (!isBackgroundRefresh) setLoading(true);
        else setRefreshing(true);
        setError(null);

        const [goalsData, analyticsData, deptData, empData] = await Promise.all([
          api.getGoals(),
          api.getAnalytics(),
          api.getDepartments(),
          api.getEmployees(),
        ]);

        setGoals(goalsData);
        setAnalytics(analyticsData);
        setDepartments(deptData);
        setEmployees(empData);
      } catch (err: any) {
        console.error('Data fetch failure:', err);
        setError(
          err.message ||
            'Unable to connect to the backend API service. Please verify server connectivity.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProgressUpdate = async (goalId: string, newProgress: number) => {
    // Optimistic local update
    setGoals((prevGoals) =>
      prevGoals.map((g) =>
        g.id === goalId ? { ...g, progress: newProgress } : g
      )
    );

    try {
      const updated = await api.updateGoalProgress(goalId, newProgress);

      setGoals((prevGoals) =>
        prevGoals.map((g) => (g.id === goalId ? updated : g))
      );

      api.getAnalytics().then(setAnalytics).catch(console.error);

      addToast(
        `Updated "${updated.title}" to ${newProgress}%`,
        newProgress === 100 ? 'success' : 'info'
      );
    } catch (err: any) {
      addToast(`Failed to update progress: ${err.message}`, 'error');
      loadData(true);
    }
  };

  const handleOpenReviewModal = (goal: Goal) => {
    setActiveReviewGoal(goal);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmitted = (goalId: string, newReview: PeerReview) => {
    setGoals((prevGoals) =>
      prevGoals.map((g) => {
        if (g.id === goalId) {
          const updatedReviews = [newReview, ...(g.reviews || [])];
          return { ...g, reviews: updatedReviews };
        }
        return g;
      })
    );

    api.getAnalytics().then(setAnalytics).catch(console.error);
    addToast('Peer review submitted successfully', 'success');
  };

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals((prev) => [newGoal, ...prev]);
    api.getAnalytics().then(setAnalytics).catch(console.error);
    addToast(`Goal "${newGoal.title}" created and assigned`, 'success');
  };

  const filteredGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        if (
          selectedDepartment !== 'ALL' &&
          goal.employee?.departmentId !== selectedDepartment
        ) {
          return false;
        }

        if (selectedStatus === 'IN_PROGRESS' && goal.progress >= 100) {
          return false;
        }
        if (selectedStatus === 'COMPLETED' && goal.progress < 100) {
          return false;
        }

        if (searchQuery.trim()) {
          const term = searchQuery.toLowerCase().trim();
          const matchTitle = goal.title.toLowerCase().includes(term);
          const matchDesc = goal.description.toLowerCase().includes(term);
          const matchEmp =
            goal.employee?.name.toLowerCase().includes(term) || false;
          const matchDept =
            goal.employee?.department?.name.toLowerCase().includes(term) ||
            false;

          if (!matchTitle && !matchDesc && !matchEmp && !matchDept) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'DEADLINE_ASC':
            return (
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
            );
          case 'DEADLINE_DESC':
            return (
              new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
            );
          case 'PROGRESS_DESC':
            return b.progress - a.progress;
          case 'PROGRESS_ASC':
            return a.progress - b.progress;
          case 'NEWEST':
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          default:
            return 0;
        }
      });
  }, [goals, selectedDepartment, selectedStatus, searchQuery, sortBy]);

  return (
    <div className="flex min-h-screen flex-col bg-[#090d16]">
      <Toast toasts={toasts} onDismiss={removeToast} />

      <Navbar
        onOpenCreateGoal={() => setIsCreateModalOpen(true)}
        totalActiveGoals={analytics?.totalActiveGoals}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadData()}
              className="rounded-lg bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-500/30"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Performance & Goal Management
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Departmental objective tracking, execution velocity, and 360-degree peer feedback.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white disabled:opacity-50"
              title="Synchronize metrics"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}
              />
              <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>
        </div>

        <section className="mb-8" aria-label="Performance Metrics">
          <AnalyticsWidgets data={analytics} loading={loading} />
        </section>

        <section className="space-y-6" aria-label="Goal Management">
          <GoalFilters
            departments={departments}
            selectedDepartment={selectedDepartment}
            onSelectDepartment={setSelectedDepartment}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalFiltered={filteredGoals.length}
            totalAll={goals.length}
          />

          {loading ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-xl border border-slate-800 bg-slate-900/50 p-5"
                />
              ))}
            </div>
          ) : filteredGoals.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">
                No matching goals found
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Adjust search queries, status filters, or department parameters.
              </p>
              <button
                onClick={() => {
                  setSelectedDepartment('ALL');
                  setSelectedStatus('ALL');
                  setSearchQuery('');
                }}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onProgressUpdate={handleProgressUpdate}
                  onOpenReviewModal={handleOpenReviewModal}
                />
              ))}
            </div>
          ) : (
            <GoalTable
              goals={filteredGoals}
              onProgressUpdate={handleProgressUpdate}
              onOpenReviewModal={handleOpenReviewModal}
            />
          )}
        </section>
      </main>

      <ReviewModal
        goal={activeReviewGoal}
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setActiveReviewGoal(null);
        }}
        onReviewSubmitted={handleReviewSubmitted}
      />

      <CreateGoalModal
        isOpen={isCreateModalOpen}
        employees={employees}
        onClose={() => setIsCreateModalOpen(false)}
        onGoalCreated={handleGoalCreated}
      />
    </div>
  );
}
