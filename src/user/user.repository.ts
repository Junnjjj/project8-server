import { HttpException, Injectable } from '@nestjs/common';
import { UsersRequestDto } from './dto/user.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(user) {
    try {
      const result = await this.usersRepository.save(user);

      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({
        where: { loginId: email },
      });
      return user;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async findUserByIdWithoutPassword(userId: number): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOne({
        select: {
          loginId: true,
          id: true,
          name: true,
          passwd: false,
          tel1: true,
          tel2: true,
          tel3: true,
        },
        where: { id: userId },
      });
      return user;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
}
