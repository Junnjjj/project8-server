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

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const result = await this.usersRepository.findOne({
        where: { loginId: email },
      });
      return !!result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }

  async createUser(user) {
    try {
      const result = await this.usersRepository.save(user);

      return result;
    } catch (error) {
      throw new HttpException('db error', 400);
    }
  }
}
