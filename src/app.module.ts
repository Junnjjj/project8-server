import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { AlarmModule } from './alarm/alarm.module';
import { Alarm } from './entity/alarm.entity';
import { QnaModule } from './qna/qna.module';
import { Qna } from './entity/qna.entity';

import { AdminModule } from '@adminjs/nestjs';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import AdminJS from 'adminjs';
import { UserAuthority } from './entity/userAuthority.entity';
import { News } from './entity/news.entity';
import { NewsModule } from './news/news.module';
import { NewsFile } from './entity/newsFile.entity';
import { StorageModule } from './storage/storage.module';
import { MediaModule } from './media/media.module';
import { NewsComment } from './entity/newsComment.entity';
import { NewsCommentFavorite } from './entity/newsCommentFavorite.entity';
import { NewsCommentReport } from './entity/newsCommentReport.entity';
import { ReportModule } from './report/report.module';
import { NewsFavorite } from './entity/NewsFavorite.entity';
import { QnaReport } from './entity/qnaReport.entity';
import { authenticate } from './authenticate_admin';

// const DEFAULT_ADMIN = {
//   email: 'admin@example.com',
//   password: '123123',
// };
//
// const authenticate = async (email: string, password: string) => {
//   if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
//     return Promise.resolve(DEFAULT_ADMIN);
//   }
//   return null;
// };

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
});

@Module({
  imports: [
    AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [
            User,
            Product,
            ProductFile,
            BiddingLog,
            UserProfile,
            ProductFavorite,
            Alarm,
            UserAuthority,
            News,
            NewsFile,
            NewsComment,
            NewsCommentFavorite,
            NewsCommentReport,
            NewsFavorite,
            Qna,
            QnaReport,
          ],
        },
        auth: {
          authenticate,
          cookieName: 'adminjs',
          cookiePassword: 'secret',
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'secret',
        },
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
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
        Alarm,
        UserAuthority,
        News,
        NewsFile,
        NewsComment,
        NewsCommentFavorite,
        NewsCommentReport,
        NewsFavorite,
        Qna,
        QnaReport,
      ],
      logging: ['warn', 'error'],
      synchronize: false,
      migrations: [],
      migrationsTableName: 'custom_migration_table',
    }),
    UserModule,
    AuthModule,
    ProductModule,
    BidModule,
    ScheduleModule.forRoot(),
    CronModule,
    MemberModule,
    FavoriteModule,
    AlarmModule,
    NewsModule,
    StorageModule,
    MediaModule,
    ReportModule,
    QnaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  private readonly isDev: boolean = process.env.MODE === 'DEV' ? true : false;

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
