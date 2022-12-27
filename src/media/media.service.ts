import { Injectable } from '@nestjs/common';
import { ProductFileRepository } from '../product/productFile.repository';
import { NewsFileRepository } from '../news/newsFile.repository';

@Injectable()
export class MediaService {
  constructor(
    private readonly productFileRepository: ProductFileRepository,
    private readonly newsFileRepository: NewsFileRepository,
  ) {}

  async saveProductImgToDB(imgName, userName, productName) {
    return await this.productFileRepository.saveProductImgWithGCP(
      imgName,
      userName,
      productName,
    );
  }

  async saveNewsImgToDB(fileName, imgName) {
    return await this.newsFileRepository.saveNewsImgWithGCP(fileName, imgName);
  }
}
