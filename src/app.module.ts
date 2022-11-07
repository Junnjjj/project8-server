import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/controller/user.controller';
import { UserService } from './user/service/user.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { Product } from './entity/product.entity';
import { ProductFile } from './entity/productFile.entity';
import { BiddingLog } from './entity/biddingLog.entity';
import { BidModule } from './bid/bid.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserProfile } from './entity/userProfile.entity';
import { CronModule } from './common/scheduler/cron.module';
import { MemberModule } from './member/member.module';
import { FavoriteModule } from './favorite/favorite.module';
import { ProductFavorite } from './entity/productFavorite.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWD,
      database: process.env.DB_DATABASE,
      entities: [
        User,
        Product,
        ProductFile,
        BiddingLog,
        UserProfile,
        ProductFavorite,
      ],
      logging: ['warn', 'error'],
      synchronize: false,
    }),
    UserModule,
    AuthModule,
    ProductModule,
    BidModule,
    ScheduleModule.forRoot(),
    CronModule,
    MemberModule,
    FavoriteModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {
  private readonly isDev: boolean = process.env.MODE === 'DEV' ? true : false;

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
