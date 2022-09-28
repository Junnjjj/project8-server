import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../product.repository';
import { ProductRequestDto } from '../dto/product.request.dto';
import { User } from '../../entity/user.entity';
import { ProductFileRepository } from '../productFile.repository';
import { CronService } from '../../common/scheduler/cron.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productFileRepository: ProductFileRepository,
    private readonly cronService: CronService,
  ) {}

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
    const owner = user.id;

    const {
      eType,
      name,
      description,
      startPrice,
      endTime,
      bidUnit,
      imagesName,
      uploadImgFromServer,
    } = body;

    const newProduct = await this.productRepository.createPost({
      eType,
      name,
      description,
      startPrice,
      nowPrice: startPrice,
      endTime,
      bidUnit,
      owner,
    });

    // uploadImgFromServer : string[] => 외래키 참조
    const result = await this.productFileRepository.setFKActive({
      uploadImgFromServer,
      imagesName,
      newProduct,
    });

    console.log('url', result);

    const urlQueryResult = await this.productRepository.updateMainURL(
      result,
      newProduct.id,
    );

    await this.cronService.addBiddingEndCronJob(
      newProduct.id,
      new Date(endTime),
    );

    return urlQueryResult;
  }

  async saveProductImg(file, productName) {
    //  save img url to Database
    return await this.productFileRepository.saveProductImg(file, productName);
  }
}
