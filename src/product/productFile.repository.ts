import { HttpException, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductFile } from '../entity/productFile.entity';

@Injectable()
export class ProductFileRepository {
  constructor(
    @InjectRepository(ProductFile)
    private productFileRepository: Repository<ProductFile>,
  ) {}

  async saveProductImg(file, productName) {
    try {
      const url =
        process.env.MODE === 'DEV'
          ? 'http://localhost:8080'
          : process.env.ORIGIN;
      const newImgFile = new ProductFile();
      newImgFile.imgURL = `${url}/media/products/${file.filename}`;
      newImgFile.originalName = productName;
      newImgFile.fileName = file.filename;
      await this.productFileRepository.save(newImgFile);
      return file.filename;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async setFKActive({ uploadImgFromServer, imagesName, newProduct }) {
    try {
      const test = await this.productFileRepository
        .createQueryBuilder('productFile')
        .update()
        .set({ product: newProduct.id })
        .where('fileName IN (:fileName)', {
          fileName: uploadImgFromServer,
        })
        .execute();

      const test2 = await this.productFileRepository
        .createQueryBuilder('productFile')
        .update()
        .set({ active: true })
        .where('fileName IN (:fileName)', {
          fileName: uploadImgFromServer,
        })
        .andWhere('originalName IN (:originalName)', {
          originalName: imagesName,
        })
        .execute();

      const mainURL = await this.productFileRepository
        .createQueryBuilder('productFile')
        .where('active = :active', {
          active: true,
        })
        .andWhere('fileName IN (:fileName)', {
          fileName: uploadImgFromServer,
        })
        .getOne();
      return mainURL;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
