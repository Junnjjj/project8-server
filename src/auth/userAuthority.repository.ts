import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthority } from '../entity/userAuthority.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAuthorityRepository {
  constructor(
    @InjectRepository(UserAuthority)
    private userAuthorityRepository: Repository<UserAuthority>,
  ) {}

  async createUserAuthority({ userId, auth }) {
    try {
      const userAuthority = await this.userAuthorityRepository.save({
        userId: userId,
        authorityName: auth,
      });
      return userAuthority;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
