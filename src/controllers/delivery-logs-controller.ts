import { prisma } from "@/database/prisma";
import { AppError } from "@/Utils/AppError";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export class DeliveryLogsController {
  async create(req: Request, res: Response, next: NextFunction) {
    const logSchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string().max(255)
    });

    const { delivery_id, description } = logSchema.parse(req.body);

    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
    });

    if (!delivery) {
      throw new AppError("Delivery not found", 404);
    }

    if(delivery.status === 'CANCELED') {
      throw new AppError("Cannot add log to a canceled delivery", 400);
    }

    if(delivery.status === 'DELIVERED') {
      throw new AppError("Cannot add log to a delivered delivery", 400);
    }
    
    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description,
      }
    });

    return res.status(201).json();
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = z.object({
      delivery_id: z.string().uuid(),
    });

    const { delivery_id } = paramsSchema.parse(req.params); 

    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
      include: { 
        user: true,
        logs: {
          select: {
            description: true,
          }
        } 
      },
    });

    if(req.user?.role === "CUSTOMER" && req.user?.id !== delivery?.userId) {
      throw new AppError("Customers can only see their own deliveries", 403);
    }

    // const logs = await prisma.deliveryLog.findMany({
    //   where: { deliveryId: delivery_id },
    //   orderBy: { createdAt: "asc" },
    // });

    return res.json(delivery);
  }
}