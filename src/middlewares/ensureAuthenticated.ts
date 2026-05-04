import { Request, Response, NextFunction } from "express";
import { AppError } from "@/Utils/AppError";
import jwt from "jsonwebtoken";
import { authConfig } from "@/configs/auth";

interface TokenPayload {
  role: string;
  sub: string;
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token is missing", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { role, sub } = jwt.verify(token, authConfig.jwt.secret) as TokenPayload;

    req.user = {
      role,
      id: sub
    };

    return next();
  } catch (err) {
    throw new AppError("Invalid token", 401);
  }
}