import { Module } from '@nestjs/common';
import { NewsController } from './controller/news.controller';
import { NewsService } from './service/news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { NewsRepository } from './news.repository';
import { NewsFileRepository } from './newsFile.repository';
import { NewsFile } from '../entity/newsFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([News, NewsFile])],
  providers: [NewsService, NewsRepository, NewsFileRepository],
  controllers: [NewsController],
  exports: [NewsService, NewsRepository, NewsFileRepository],
})
export class NewsModule {}
