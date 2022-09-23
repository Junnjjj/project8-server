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

  async showProductsByPage(pageNum: number) {
    const productList = await this.productRepository.findProductsByPage(
      pageNum,
    );
    return productList;
  }

  async showOneProduct(productId) {
    const product = await this.productRepository.findProductById(productId);
    return product;
  }

  async createPost(body: ProductRequestDto, user: User) {
    //현재 로그인한 사람의 id를 프로덕트의 owner로 설정g
    const owner = user.id;

    const { etype, name, description, startprice, endtime } = body;

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
