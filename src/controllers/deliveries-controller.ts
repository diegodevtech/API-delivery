import { Request, Response, NextFunction } from 'express';
import { prisma } from "@/database/prisma";
import { z } from 'zod';

export class DeliveriesController {

  async getAll(req: Request, res: Response, next: NextFunction) {

    const deliveries = await prisma.delivery.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });

    return res.json(deliveries);
  }

  async create(req: Request, res: Response, next: NextFunction) {

    const deliverySchema = z.object({
      user_id: z.string().uuid(),
      description: z.string().max(255)
    });

    const { user_id, description } = deliverySchema.parse(req.body);

    await prisma.delivery.create({
      data: {
        userId: user_id,
        description,
      }
    });

    return res.status(201).json({ message: 'Delivery created successfully' });
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      status: z.enum(['PENDING','IN_PROGRESS','DELIVERED','CANCELED']),
    });

    const { id } = paramsSchema.parse(req.params);
    const { status } = bodySchema.parse(req.body);

    await prisma.delivery.update({
      where: { id },
      data: { status },
    }); 

    await prisma.deliveryLog.create({
      data: {
        deliveryId: id,
        description: `Status updated to ${status}`,
      }
    });

    return res.json({ message: 'Delivery status updated successfully' });

  }
}