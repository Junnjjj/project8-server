import { Module } from '@nestjs/common';
import { NewsController } from './controller/news.controller';
import { NewsService } from './service/news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { NewsRepository } from './news.repository';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  providers: [NewsService, NewsRepository],
  controllers: [NewsController],
  exports: [NewsService, NewsRepository],
})
export class NewsModule {}
