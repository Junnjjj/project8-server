import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../product.repository';
import { ProductRequestDto } from '../dto/product.request.dto';
import { User } from '../../entity/user.entity';
import { ProductFileRepository } from '../productFile.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productFileRepository: ProductFileRepository,
  ) {}

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

    const {
      etype,
      name,
      description,
      startprice,
      endtime,
      uploadImgFromServer,
    } = body;

    // uploadImgFromServer : string[] => 외래키 참조

    // Image 정보를 바탕으로 main image URI,
    // Product IMG 외래키 설정 ( 트랜잭션 설정 )
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

  async saveProductImg(file) {
    console.log('files', file);
    //  save img url to Database
    return await this.productFileRepository.saveProductImg(file);
  }
}
