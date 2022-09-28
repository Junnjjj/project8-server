import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { ProductController } from './controller/product.controller';
import { ProductRepository } from './product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ProductFile } from '../entity/productFile.entity';
import { Product } from '../entity/product.entity';
import { ProductFileRepository } from './productFile.repository';
import { CronModule } from '../common/scheduler/cron.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    TypeOrmModule.forFeature([Product, ProductFile]),
    forwardRef(() => CronModule),
  ],
  providers: [ProductService, ProductRepository, ProductFileRepository],
  controllers: [ProductController],
  exports: [ProductService, ProductRepository],
})
export class ProductModule {}
