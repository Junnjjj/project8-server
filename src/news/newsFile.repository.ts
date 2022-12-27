import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsFile } from '../entity/newsFile.entity';
import { Repository } from 'typeorm';
import { ProductFile } from '../entity/productFile.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NewsFileRepository {
  constructor(
    @InjectRepository(NewsFile)
    private newsFileRepository: Repository<NewsFile>,
    private readonly configService: ConfigService,
  ) {}

  async saveNewsImg(file, imgName) {
    try {
      const url =
        process.env.MODE === 'DEV'
          ? 'http://localhost:8080'
          : process.env.ORIGIN;

      const newImgFile = new NewsFile();
      newImgFile.imgURL = `${url}/media/news/${file.filename}`;
      newImgFile.originalName = imgName;
      newImgFile.fileName = file.filename;
      await this.newsFileRepository.save(newImgFile);
      return file.filename;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async saveNewsImgWithGCP(fileName, imgName) {
    try {
      const url = this.configService.get('GCP_URL');
      const newImgFile = new NewsFile();
      newImgFile.imgURL = `${url}/news/${fileName}`;
      newImgFile.originalName = imgName;
      newImgFile.fileName = fileName;
      await this.newsFileRepository.save(newImgFile);
      return fileName;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async setImgFKActive(
    queryRunner,
    { uploadImgFromServer, imagesName, newNews },
  ) {
    // 외래키 설정
    await queryRunner.manager.query(
      `UPDATE news_file SET newsId = ? WHERE fileName IN (?)`,
      [newNews.id, uploadImgFromServer],
    );

    // active 설정
    await queryRunner.manager.query(
      `UPDATE news_file SET active = true WHERE (fileName IN (?) AND originalName IN (?))`,
      [uploadImgFromServer, imagesName],
    );
  }

  async getOneImg(newsId) {
    try {
      const result = await this.newsFileRepository
        .createQueryBuilder('newsFile')
        .where('newsFile.newsId = :newsID', { newsID: newsId })
        .getOne();
      return result.imgURL;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
