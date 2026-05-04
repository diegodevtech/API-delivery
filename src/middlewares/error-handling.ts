import { AppError } from '@/Utils/AppError';
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandlingMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  if(err instanceof AppError){
    return res.status(err.statusCode).json({ message: err.message });
  }

  if(err instanceof ZodError){
    return res.status(400).json({ message: 'Validation Error', issues: err.format() });
  }

  return res.status(500).json({ message: 'Internal Server Error' });
}