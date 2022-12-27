import { DataSource } from 'typeorm';
import { User } from './entity/user.entity';
import { Product } from './entity/product.entity';
import { ProductFile } from './entity/productFile.entity';
import { BiddingLog } from './entity/biddingLog.entity';
import { UserProfile } from './entity/userProfile.entity';
import { ProductFavorite } from './entity/productFavorite.entity';
import { Alarm } from './entity/alarm.entity';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();
const dataSource = new DataSource({
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
  ],
  migrations: ['./src/migrations/*.ts'],
  charset: 'utf8mb4',
  synchronize: false,
  logging: true,
});

export default dataSource;
