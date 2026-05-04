import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/Utils/AppError';

export function verifyAuthorization(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {

    if(!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    if (!req.user.role) {
      throw new AppError("User role not found", 403);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden: You don't have permission to access this resource", 403);
    }

    return next();
  }
}