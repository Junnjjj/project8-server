import { Module } from '@nestjs/common';
import { NewsController } from './controller/news.controller';
import { NewsService } from './service/news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { NewsRepository } from './news.repository';
import { NewsFileRepository } from './newsFile.repository';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  providers: [NewsService, NewsRepository, NewsFileRepository],
  controllers: [NewsController],
  exports: [NewsService, NewsRepository, NewsFileRepository],
})
export class NewsModule {}
