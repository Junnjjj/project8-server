import { HttpException, Injectable, forwardRef, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ProductService } from '../product/service/product.service';
import { NewsService } from '../news/service/news.service';

@Injectable()
export class CacheService {
  private readonly redisClient: Redis;
  constructor(
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
    @Inject(forwardRef(() => NewsService))
    private readonly newsService: NewsService,
  ) {
    this.redisClient = redisService.getClient();
  }

  async get(key: string) {
    try {
      return this.redisClient.get(key);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async set(key: string, value, expire?: number) {
    try {
      return this.redisClient.set(key, value, 'EX', expire ?? 3600 * 96);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async hSet(key: string, field: string, value) {
    try {
      return this.redisClient.hset(key, field, value);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async hGet(key: string, field: string) {
    try {
      return this.redisClient.hget(key, field);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async hGetAll(key: string) {
    try {
      return this.redisClient.hgetall(key);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async del(key: string): Promise<number> {
    try {
      return this.redisClient.del(key);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async setProductVisitor(productId) {
    try {
      // 레디스에 해당 프로덕트의 조회수가 존재하지 않는다면
      if (!this.redisClient.exists('visitors:product:' + productId)) {
        //데이터베이스의 product의 조회수에서 가져와서 레디스에 저장
        const visitors = this.productService.getVisitors(productId);
        await this.set('visitors:product:' + productId, visitors);
      }
      //레디스에서 해당 프로덕트의 조회수 증가
      this.redisClient.incr('visitors:product:' + productId);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  //해당 물품의 조회수 레디스에서 조회
  async getProductVisitor(productId) {
    try {
      if (!this.redisClient.exists('visitors:product:' + productId)) {
        //데이터베이스의 news의 조회수 반환
        return this.productService.getVisitors(productId);
      } else {
        return this.get('visitors:product:' + productId);
      }
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async setNewsVisitor(newsId) {
    try {
      // 레디스에 해당 뉴스의 조회수가 존재하지 않는다면
      if (!this.redisClient.exists('visitors:news:' + newsId)) {
        //데이터베이스의 news의 조회수에서 가져와서 레디스에 저장
        const visitors = this.newsService.getVisitors(newsId);
        await this.set('visitors:news:' + newsId, visitors);
      }
      //레디스에서 해당 프로덕트의 조회수 증가
      this.redisClient.incr('visitors:news:' + newsId);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async getNewsVisitor(newsId) {
    try {
      // 레디스에 해당 뉴스의 조회수가 존재하지 않는다면
      if (!this.redisClient.exists('visitors:news:' + newsId)) {
        //데이터베이스의 news의 조회수 반환
        return this.newsService.getVisitors(newsId);
      } else {
        return this.get('visitors:news:' + newsId);
      }
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async updateAllVisitors() {
    try {
      const productVisitors: string[] = await this.redisClient.keys(
        'visitors:product*',
      );
      const newsVisitors: string[] = await this.redisClient.keys(
        'visitors:news*',
      );
      for (const visitor of productVisitors) {
        await this.productService.setVisitors(
          visitor.split(':')[2],
          await this.getProductVisitor(visitor.split(':')[2]),
        );
      }

      for (const visitor of newsVisitors) {
        await this.newsService.setVisitors(
          visitor.split(':')[2],
          await this.getNewsVisitor(visitor.split(':')[2]),
        );
      }
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
