import { HttpException, Injectable } from '@nestjs/common';
import { UsersRequestDto } from './dto/user.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { UserAuthority } from '../entity/userAuthority.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(user) {
    try {
      const result = await this.usersRepository.save(user);
      const response = {
        message: 'SignUp success',
        loginId: result.loginId,
        userId: result.id,
      };

      return response;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({
        where: { loginId: email },
        relations: {
          authorities: true,
        },
      });
      return user;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async findUserById(id: number): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: id },
      });
      return user;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  // UseGuards
  async findUserByIdWithoutPassword(userId: number): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({
        select: {
          loginId: true,
          id: true,
          name: true,
          passwd: false,
        },
        where: { id: userId },
        relations: { profile: true, authorities: true },
      });
      return user;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async setRefreshToken(loginId: string, token: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { loginId: loginId },
      });
      await this.usersRepository.save({
        ...user,
        currentHashedRefreshToken: token,
      });
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async deleteToken(loginId: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { loginId },
      });
      await this.usersRepository.save({
        ...user,
        currentHashedRefreshToken: null,
      });
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async findUserProductData(id: number) {
    try {
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findProfileId(userId) {
    try {
      const result = await this.usersRepository.findOne({
        where: { id: userId },
        relations: { profile: true },
      });
      return result.profile;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
}
