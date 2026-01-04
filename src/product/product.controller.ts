import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product-request';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Post()
  createProduct(@Body() productRequest: CreateProductRequest) {
    return this.productService.createProduct(productRequest);
  }

  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productService.getProductWithInventory(id);
  }
}
