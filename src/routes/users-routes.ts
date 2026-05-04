import { Router } from "express";

import { UsersController } from "@/controllers/users-controller";

export const userRoutes = Router();

const usersController = new UsersController();

userRoutes.post("/", usersController.create);