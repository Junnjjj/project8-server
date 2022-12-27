import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { StorageModule } from '../storage/storage.module';
import { ProductModule } from '../product/product.module';
import { MediaService } from './media.service';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [ProductModule, StorageModule, NewsModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
