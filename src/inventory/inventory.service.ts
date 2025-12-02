import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Inventory, Product } from '../../generated/prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}
  async get(productId: string): Promise<Inventory[]> {
    return this.prisma.inventory.findMany({
      where: { productId },
    });
  }

  async create(
    inventoryRequest: Prisma.InventoryCreateInput,
    product: Product,
  ): Promise<Inventory> {
    return this.prisma.inventory.create({
      data: {
        ...inventoryRequest,
        product: {
          connect: { uuid: product.uuid },
        },
      },
    });
  }
  async update(
    inventoryRequest: Prisma.InventoryCreateInput,
    product: Product,
  ): Promise<Inventory> {
    const inventory = await this.prisma.inventory.findUnique({
      where: {
        uuid: inventoryRequest.uuid,
        size: inventoryRequest.size,
      },
    });
    if (inventory) {
      return this.prisma.inventory.update({
        where: {
          uuid: inventoryRequest.uuid,
          size: inventoryRequest.size,
        },
        data: {
          quantity: inventoryRequest.quantity,
        },
      });
    } else {
      return this.create(inventoryRequest, product);
    }
  }
}
