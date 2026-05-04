import { Router } from "express";
import { DeliveryLogsController } from "../controllers/delivery-logs-controller";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyAuthorization } from "@/middlewares/verifyAuthorization";

export const deliveryLogsRoutes = Router();
const deliveryLogsController = new DeliveryLogsController();

deliveryLogsRoutes.post("/", ensureAuthenticated, verifyAuthorization(["SALE"]), deliveryLogsController.create);
deliveryLogsRoutes.get("/:delivery_id", ensureAuthenticated, verifyAuthorization(["SALE", "CUSTOMER"]), deliveryLogsController.getById);