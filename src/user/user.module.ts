import { forwardRef, Module } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { UserRepository } from './user.repository';
import { AuthModule } from '../auth/auth.module';
import { UserProfileRepository } from './userProfile.repository';
import { UserProfile } from '../entity/userProfile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, UserRepository, UserProfileRepository],
  controllers: [UserController],
  exports: [UserService, UserRepository, UserProfileRepository],
})
export class UserModule {}
