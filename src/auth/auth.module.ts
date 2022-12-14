import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './controller/auth.controller';
import { UserAuthorityRepository } from './userAuthority.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthority } from '../entity/userAuthority.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserAuthority]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),

    forwardRef(() => UserModule),
  ],
  providers: [AuthService, JwtStrategy, UserAuthorityRepository],
  exports: [AuthService, UserAuthorityRepository],
  controllers: [AuthController],
})
export class AuthModule {}
