import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsFile } from '../entity/newsFile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsFileRepository {
  constructor(
    @InjectRepository(NewsFile)
    private newsFileRepository: Repository<NewsFile>,
  ) {}

  async saveNewsImg(file, imgName) {
    try {
      const url =
        process.env.MODE === 'DEV'
          ? 'http://localhost:8080'
          : process.env.ORIGIN;

      const newImgFile = new NewsFile();
      newImgFile.imgURL = `${url}/media/products/${file.filename}`;
      newImgFile.originalName = imgName;
      newImgFile.fileName = file.filename;
      await this.newsFileRepository.save(newImgFile);
      return file.filename;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
}
