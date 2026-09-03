import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getDeadlineStatus(dateString: string): { text: string; isUrgent: boolean; isOverdue: boolean } {
  try {
    const target = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}d overdue`, isUrgent: true, isOverdue: true };
    }
    if (diffDays === 0) {
      return { text: 'Due today', isUrgent: true, isOverdue: false };
    }
    if (diffDays <= 7) {
      return { text: `${diffDays}d left`, isUrgent: true, isOverdue: false };
    }
    return { text: `${diffDays}d left`, isUrgent: false, isOverdue: false };
  } catch {
    return { text: 'Date set', isUrgent: false, isOverdue: false };
  }
}

export function getDepartmentBadgeStyle(departmentName: string): { bg: string; text: string; border: string } {
  const normalized = departmentName.toLowerCase();
  if (normalized.includes('eng')) {
    return { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' };
  }
  if (normalized.includes('product') || normalized.includes('design')) {
    return { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20' };
  }
  if (normalized.includes('sale') || normalized.includes('revenue')) {
    return { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' };
  }
  if (normalized.includes('market') || normalized.includes('growth')) {
    return { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' };
  }
  if (normalized.includes('customer') || normalized.includes('success')) {
    return { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/20' };
  }
  return { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/20' };
}
