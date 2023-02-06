import {HttpException, Injectable} from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import {ProductService} from "../product/service/product.service";

@Injectable()
export class CacheService {
  private readonly redisClient: Redis;
  constructor(private readonly redisService: RedisService, private readonly productService: ProductService) {
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
      return this.redisClient.set(key, value, 'EX', expire ?? 10);
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

  async setVisitor(productId) {
    try {
      // 레디스에 해당 프로덕트의 조회수가 존재하지 않는다면
      if (!this.redisClient.exists('visitors:'+productId)) {
        //데이터베이스의 product의 조회수에서 가져와서 레디스에 저장
        const visitors = this.productService.getVisitors(productId);
        await this.set('visitors:'+productId, visitors);
      }
      //레디스에서 해당 프로덕트의 조회수 증가
      return this.redisClient.incr('visitors:'+productId);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  //해당 물품의 조회수 레디스에서 조회
  async getVisitor(productId) {
    try {
      return this.get('visitors:' + productId);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
