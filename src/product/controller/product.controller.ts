import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { Product } from '../../entity/product.entity';
import { ProductRequestDto } from '../dto/product.request.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../../entity/user.entity';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { multerOptions } from '../../common/utils/multer.options';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async showAllProducts(): Promise<Product[]> {
    return this.productsService.showAllProducts();
  }

  @Get('page:id')
  async showProductsByPage(@Param('id') id: number): Promise<Product[]> {
    return this.productsService.showProductsByPage(id);
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

  // todo : multerOption 아이디 추가하여 upload/{id}/file.name 저장될 수 있게
  @Post('upload/:productName')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('image', 5, multerOptions(`products`)))
  uploadImg(
    @Param('productName') productName: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    return this.productsService.saveProductImg(files[0], productName);
  }
}
