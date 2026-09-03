import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Centralized error handler for Express, mapping Prisma & internal errors to HTTP statuses
 */
export const errorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[Error Handler]', err);

  // Prisma unique constraint violation (e.g., duplicate email)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || 'record';
      res.status(409).json({
        success: false,
        error: `A conflict occurred with unique field: ${target}`,
      });
      return;
    }

    // Prisma record not found
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'The requested resource was not found.',
      });
      return;
    }
  }

  // Fallback internal server error
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error occurred.'
        : err.message,
  });
};
