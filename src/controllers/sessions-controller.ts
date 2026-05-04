import { Request, Response, NextFunction } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/Utils/AppError";
import { compare } from "bcrypt";
import { authConfig } from "@/configs/auth";
import jwt from "jsonwebtoken"

export class SessionsController {
  async create(req: Request, res: Response, next: NextFunction) {
    const createSessionSchema = z.object({
      email: z.string().email(),
      password: z.string().trim().min(6).max(100)
    });

    const { email, password } = createSessionSchema.parse(req.body);

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new AppError("Invalid email or password", 401);   
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Invalid email or password", 401);   
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = jwt.sign({ role: user.role ?? "CUSTOMER" }, secret, { expiresIn: '1h' });

    const { password: hashedPassword, ...userDataWithoutPw } = user;

    return res.json({ token, ...userDataWithoutPw });
  }
}