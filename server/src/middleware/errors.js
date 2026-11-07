import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { HttpError } from '../lib/http-error.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Not found.' });
}

// Turns errors into JSON responses without leaking internals.
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Please check the highlighted fields.',
      errors: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
    });
  }
  if (error instanceof HttpError) return res.status(error.status).json({ message: error.message });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    return res.status(409).json({
      message: 'That slug is already in use (possibly by a deleted entry). Please choose another.',
      errors: [{ field: 'slug', message: 'Already in use.' }],
    });
  }
  // Malformed JSON body
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON.' });

  console.error(error);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
}
