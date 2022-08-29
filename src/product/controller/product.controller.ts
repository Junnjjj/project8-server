import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { Product } from '../product.entity';
import { ProductRequestDto } from '../dto/product.request.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../../user/user.entity';

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
  @UseGuards(JwtAuthGuard)
  createPost(@Body() body: ProductRequestDto, @CurrentUser() user: User) {
    return this.productsService.createPost(body, user);
  }
}
