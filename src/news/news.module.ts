import { forwardRef, Module } from '@nestjs/common';
import { NewsController } from './controller/news.controller';
import { NewsService } from './service/news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entity/news.entity';
import { NewsRepository } from './news.repository';
import { NewsFileRepository } from './newsFile.repository';
import { NewsFile } from '../entity/newsFile.entity';
import { NewsComment } from '../entity/newsComment.entity';
import { NewsCommentRepository } from './newsComment.repository';
import { UserModule } from '../user/user.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([News, NewsFile, NewsComment]),
    forwardRef(() => CacheModule),
  ],
  providers: [
    NewsService,
    NewsRepository,
    NewsFileRepository,
    NewsCommentRepository,
  ],
  controllers: [NewsController],
  exports: [
    NewsService,
    NewsRepository,
    NewsFileRepository,
    NewsCommentRepository,
  ],
})
export class NewsModule {}
