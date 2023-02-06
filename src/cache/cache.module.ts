import { forwardRef, Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheService } from './cache.service';
import { ProductModule } from '../product/product.module';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    forwardRef(() => ProductModule),
    forwardRef(() => NewsModule),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
