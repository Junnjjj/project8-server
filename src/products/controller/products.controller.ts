import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  //constructor() {}

  @Get()
  async showAllProducts() {
    console.log('모든 제품 보기');
  }

  @Get(':id')
  showProduct(@Param('id') id: string): string {
    console.log('제품 하나 보기');
    return `This action returns a #${id} cat`;
  }
}
