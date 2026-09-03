import { z } from 'zod';

export const createGoalSchema = z.object({
  title: z
    .string({ required_error: 'Goal title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters long')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z
    .string({ required_error: 'Goal description is required' })
    .trim()
    .min(5, 'Description must be at least 5 characters long')
    .max(1000, 'Description cannot exceed 1000 characters'),
  deadline: z
    .string({ required_error: 'Deadline is required' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid deadline date format (must be a valid ISO date)',
    }),
  employeeId: z
    .string({ required_error: 'Employee ID is required' })
    .uuid('Invalid employee ID format'),
  progress: z
    .number()
    .int('Progress must be an integer')
    .min(0, 'Progress cannot be less than 0%')
    .max(100, 'Progress cannot exceed 100%')
    .optional()
    .default(0),
});

export const updateProgressSchema = z.object({
  progress: z
    .number({ required_error: 'Progress percentage is required' })
    .int('Progress must be an integer')
    .min(0, 'Progress cannot be less than 0%')
    .max(100, 'Progress cannot exceed 100%'),
});

export const createReviewSchema = z.object({
  reviewerName: z
    .string({ required_error: 'Reviewer name is required' })
    .trim()
    .min(2, 'Reviewer name must be at least 2 characters')
    .max(80, 'Reviewer name cannot exceed 80 characters'),
  feedback: z
    .string({ required_error: 'Feedback text is required' })
    .trim()
    .min(5, 'Feedback must be at least 5 characters')
    .max(1000, 'Feedback cannot exceed 1000 characters'),
  rating: z
    .number({ required_error: 'Rating score is required' })
    .int('Rating must be an integer between 1 and 5')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
});

export const goalIdParamSchema = z.object({
  id: z.string().uuid('Invalid goal ID format'),
});
