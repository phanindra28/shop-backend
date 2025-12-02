import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { InventoryService } from '../inventory/inventory.service';

@Module({
  providers: [ProductService, InventoryService],
  controllers: [ProductController],
})
export class ProductModule {}
