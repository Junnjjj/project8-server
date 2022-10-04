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

  async setFKActive(
    queryRunner,
    { uploadImgFromServer, imagesName, newProduct },
  ) {
    await queryRunner.manager.query(
      `UPDATE product_file SET productId = ? WHERE fileName IN (?)`,
      [newProduct.id, uploadImgFromServer],
    );

    await queryRunner.manager.query(
      `UPDATE product_file SET active = true WHERE (fileName IN (?) AND originalName IN (?))`,
      [uploadImgFromServer, imagesName],
    );

    const mainURL = await queryRunner.manager.query(
      `SELECT * FROM product_file WHERE active=true AND fileName IN (?)`,
      uploadImgFromServer,
    );
    return mainURL[0];
  }
}
