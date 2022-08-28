import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../product.repository';
import { ProductRequestDto } from '../dto/product.request.dto';
import { User } from '../../user/user.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async showAllProducts() {
    const productList = await this.productRepository.findAllProducts();
    return productList;
  }

  async showOneProduct(productId) {
    const product = await this.productRepository.findProductById(productId);
    return product;
  }

  async createPost(body: ProductRequestDto, user: User) {
    const owner = user.id;

    const { etype, name, description, startprice, endtime } = body;

    // 수정 필요 - 쿠키에서 로그인정보 가져와서 owner 가져오기
    const newProduct = await this.productRepository.createPost({
      etype,
      name,
      description,
      startprice,
      endtime,
      owner,
    });
    return newProduct;
  }
}
