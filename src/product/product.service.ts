import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { Inventory } from '../../generated/prisma/client';
import { CreateProductRequest } from './dto/create-product-request';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private inventoryService: InventoryService,
  ) {}

  constructInventoryObject(inventory: Inventory[]) {
    const stock = {
      totalQuantity: 0,
      sizes: {
        EXTRA_SMALL: 0,
        SMALL: 0,
        MEDIUM: 0,
        LARGE: 0,
        EXTRA_LARGE: 0,
      },
    };
    for (const item of inventory) {
      stock.totalQuantity += item.quantity;
      stock.sizes[item.size] = item.quantity;
    }
    return stock;
  }

  async getProductWithInventory(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { uuid: productId },
    });
    if (!product) {
      throw new Error('Product not found');
    }
    const inventory = await this.inventoryService.get(productId);
    const stock = this.constructInventoryObject(inventory);
    return { ...product, stock };
  }

  async createProduct(productRequest: CreateProductRequest) {
    const product = await this.prisma.product.create({
      data: {
        name: productRequest.name,
        price: productRequest.price,
        asset: productRequest.asset,
      },
    });
    if (product) {
      if (productRequest.stock) {
        const sizes = Object.keys(productRequest.stock) as Array<
          keyof typeof productRequest.stock
        >;
        for (const size of sizes) {
          const quantity = productRequest.stock[size];

          if (quantity > 0) {
            const inventoryItem = {
              size,
              quantity,
              product: {
                connect: { uuid: product.uuid },
              },
            };

            await this.inventoryService.create(inventoryItem, product);
          }
        }
      }
      return product;
    }
  }
}
