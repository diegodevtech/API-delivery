import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { hash } from "bcrypt"
import { prisma } from "@/database/prisma";
import { AppError } from "@/Utils/AppError";

export class UsersController {
  async create(req: Request, res: Response, next: NextFunction) {
    const createUserSchema = z.object({
      name: z.string().trim().min(3).max(100),
      email: z.string().email(),
      password: z.string().trim().min(6).max(100)
    });

    const { name, email, password } = createUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new AppError("Email is already in use", 409);
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });

    const { password: _, ...userDataWithoutPw } = user;

    return res.status(201).json(userDataWithoutPw);
  }
}