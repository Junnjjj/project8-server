// import { Injectable } from '@nestjs/common';
// import {
//   RedisOptionsFactory,
//   RedisModuleOptions,
// } from '@liaoliaots/nestjs-redis';
// import { ConfigService } from '@nestjs/config';
//
// @Injectable()
// export class RedisConfigService implements RedisOptionsFactory {
//   constructor(private configService: ConfigService) {}
//
//   async createRedisOptions(): Promise<RedisModuleOptions> {
//     return {
//       config: {
//         host: this.configService.get<string>('localhost'),
//         port: this.configService.get<number>('6379'),
//         //password: this.configService.get<string>(process.env.REDIS_PASSWORD),
//       },
//     };
//   }
// }
