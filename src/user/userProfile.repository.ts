import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfile } from '../entity/userProfile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserProfileRepository {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async createProfile(tel) {
    try {
      const imgUrl = 'http://localhost:8080/media/icons/logo.png';

      const profile = await this.userProfileRepository.save({
        tel,
        photoImg: imgUrl,
      });
      return profile;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
