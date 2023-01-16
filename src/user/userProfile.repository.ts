import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '../entity/userProfile.entity';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserProfileRepository {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async createProfile(tel) {
    try {
      const url =
        process.env.MODE === 'DEV'
          ? 'http://localhost:8080/media/icons/logo.png'
          : process.env.GCP_URL + '/utils/user.png';

      const profile = await this.userProfileRepository.save({
        tel,
        photoImg: url,
      });
      return profile;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async plusBiddingProductCount({ queryRunner, userProfile }) {
    await queryRunner.manager.update(UserProfile, userProfile.id, {
      biddingProduct: () => 'biddingProduct + 1',
    });
  }

  async plusOnSaleProduct(queryRunner, userProfile) {
    await queryRunner.manager.update(UserProfile, userProfile.id, {
      onSaleProduct: () => 'onSaleProduct + 1',
    });
  }

  async minusOnSaleProduct(queryRunner, userProfile) {
    await queryRunner.manager.update(UserProfile, userProfile.id, {
      onSaleProduct: () => 'onSaleProduct - 1',
    });
  }

  async minusBiddingProductCount(queryRunner, userProfile) {
    await queryRunner.manager.update(UserProfile, userProfile.id, {
      biddingProduct: () => 'biddingProduct - 1',
    });
  }
}
