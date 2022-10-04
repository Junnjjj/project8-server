import { HttpException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../product.repository';
import { ProductRequestDto } from '../dto/product.request.dto';
import { User } from '../../entity/user.entity';
import { ProductFileRepository } from '../productFile.repository';
import { CronService } from '../../common/scheduler/cron.service';
import { UserProfileRepository } from '../../user/userProfile.repository';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../user/user.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productFileRepository: ProductFileRepository,
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly cronService: CronService,
    private dataSource: DataSource,
  ) {}

  async showAllProducts() {
    const productList = await this.productRepository.findAllProducts();
    return productList;
  }

  async showProductsByPage(pageNum: number) {
    const productList = await this.productRepository.findProductsByPage(
      pageNum,
    );
    return productList;
  }

  async showOneProduct(productId) {
    const product = await this.productRepository.findProductById(productId);
    return product;
  }

  async createPost(body: ProductRequestDto, user: User) {
    const userId = user.id;

    const {
      eType,
      name,
      description,
      startPrice,
      endHour,
      bidUnit,
      imagesName,
      uploadImgFromServer,
    } = body;

    const createdDate = new Date(Date.now());
    const endDateTime = new Date(Date.now() + 3600 * 1000 * parseInt(endHour));

    // transaction 생성
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1. product 생성
      const newProduct = await this.productRepository.createPost(queryRunner, {
        createdDate,
        eType,
        name,
        description,
        startPrice,
        nowPrice: startPrice,
        endHour,
        bidUnit,
        endTime: endDateTime,
        user: userId,
      });

      // 2. 이미지 파일들 외래키 설정
      // uploadImgFromServer : string[] => 외래키 참조
      const result = await this.productFileRepository.setFKActive(queryRunner, {
        uploadImgFromServer,
        imagesName,
        newProduct,
      });

      // 3. product mainImg 삽입
      await this.productRepository.updateMainURL(
        queryRunner,
        result,
        newProduct.id,
      );

      // 4. user_profile 에 onSaleProduct +1 추가
      const userProfile = await this.userRepository.findProfileId({ userId });

      await this.userProfileRepository.plusOnSaleProduct(
        queryRunner,
        userProfile,
      );

      // 5. cron 스케줄러 설정 (종료이벤트)
      await this.cronService.addBiddingEndCronJob(newProduct.id, endDateTime);

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new HttpException(error, 400);
    } finally {
      await queryRunner.release();
    }
  }

  async saveProductImg(file, productName) {
    //  save img url to Database
    return await this.productFileRepository.saveProductImg(file, productName);
  }
}
