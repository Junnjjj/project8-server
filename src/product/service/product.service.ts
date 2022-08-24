import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productsRepository: ProductRepository) {}

  async showAllProducts() {
    const productList = await this.productsRepository.findAllProducts();
    return productList;
  }
}
