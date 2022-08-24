import { Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async showAllProducts() {
    return this.productsService.showAllProducts();
  }
  /*
  @Get(':id')
  showProduct(@Param('id') id: string): string {
    console.log('제품 하나 보기');
    return `This action returns a #${id} cat`;
  }
 */
}
