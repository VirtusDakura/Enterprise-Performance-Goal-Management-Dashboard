'use client';

import React, { useState } from 'react';
import { Employee, Goal } from '../types';
import { X, Target, Check, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  onGoalCreated: (goal: Goal) => void;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  employees,
  onGoalCreated,
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>(
    employees[0]?.id || ''
  );
  // Default deadline 30 days from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 30);
  const [deadline, setDeadline] = useState<string>(
    defaultDate.toISOString().split('T')[0]
  );
  const [progress, setProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const selectedEmp = employeeId || employees[0]?.id;
    if (!selectedEmp) {
      setError('Please select an employee to assign this goal to.');
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      setError('Goal title must be at least 3 characters long.');
      return;
    }

    if (!description.trim() || description.trim().length < 5) {
      setError('Goal description must be at least 5 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newGoal = await api.createGoal({
        title: title.trim(),
        description: description.trim(),
        deadline: new Date(deadline).toISOString(),
        employeeId: selectedEmp,
        progress,
      });

      onGoalCreated(newGoal);
      onClose();

      // Reset form
      setTitle('');
      setDescription('');
      setProgress(0);
    } catch (err: any) {
      setError(err.message || 'Failed to create goal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-700/80 bg-[#0f172a] p-6 shadow-2xl shadow-indigo-950/40">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <Target className="h-4 w-4" />
            <span>Goal Creation</span>
          </div>
          <h2 className="mt-1 text-lg font-bold text-white">
            Assign New Enterprise Goal
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Define objectives, assign ownership, and configure sprint deadlines.
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

          {/* Goal Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Goal Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="new-goal-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth 2.0 / SSO for Enterprise Customers"
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Employee Assignee */}
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Assignee (Employee & Department) <span className="text-rose-400">*</span>
            </label>
            <div className="relative mt-1.5">
              <select
                id="new-goal-employee"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-100 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} — {emp.role} ({emp.department?.name || 'General'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300">
              Description & Key Results <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="new-goal-description"
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify milestones, acceptance criteria, and expected deliverables..."
              className="mt-1.5 w-full resize-none rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-100 placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Deadline & Initial Progress */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Target Deadline <span className="text-rose-400">*</span>
              </label>
              <input
                id="new-goal-deadline"
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-sm text-slate-100 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Initial Progress
                </label>
                <span className="font-mono text-xs font-bold text-indigo-400">
                  {progress}%
                </span>
              </div>
              <input
                id="new-goal-progress"
                type="range"
                min="0"
                max="100"
                step="5"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value, 10))}
                className="mt-3 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              id="confirm-create-goal-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Creating Goal...</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Create & Assign Goal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
