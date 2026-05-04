import { Router } from "express";
import { DeliveriesController } from "../controllers/deliveries-controller";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyAuthorization } from "@/middlewares/verifyAuthorization";

export const deliveriesRoutes = Router();
const deliveriesController = new DeliveriesController();

deliveriesRoutes.get("/", ensureAuthenticated, deliveriesController.getAll);
deliveriesRoutes.post("/", ensureAuthenticated, verifyAuthorization(["SALE", "CUSTOMER"]), deliveriesController.create);
deliveriesRoutes.patch("/:id/status", deliveriesController.updateStatus);