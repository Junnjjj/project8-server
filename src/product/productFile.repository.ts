import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductFile } from '../entity/productFile.entity';

@Injectable()
export class ProductFileRepository {
  constructor(
    @InjectRepository(ProductFile)
    private productFileRepository: Repository<ProductFile>,
  ) {}

  async saveProductImg(file) {
    try {
      const url =
        process.env.MODE === 'DEV'
          ? 'http://localhost:8080'
          : process.env.ORIGIN;
      const newImgFile = new ProductFile();
      newImgFile.imgURL = `${url}/media/products/${file.filename}`;
      newImgFile.originalName = file.originalname;
      newImgFile.fileName = file.filename;
      await this.productFileRepository.save(newImgFile);
      return file.filename;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
