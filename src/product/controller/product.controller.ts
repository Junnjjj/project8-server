import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { Product } from '../product.entity';
import { ProductRequestDto } from '../dto/product.request.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async showAllProducts(): Promise<Product[]> {
    return this.productsService.showAllProducts();
  }

  @Get(':id')
  showProduct(@Param('id') id: number): Promise<Product> {
    return this.productsService.showOneProduct(id);
  }

  @Post()
  createPost(@Body() body: ProductRequestDto) {
    return this.productsService.createPost(body);
  }
}
