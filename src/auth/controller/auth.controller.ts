import { Body, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { RolesGuard } from '../role/roles.guard';
import { RoleType } from '../role-types';
import { Roles } from '../../common/decorators/role.decorator';

@Controller('auth')
export class AuthController {
  @Get('/admin-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  adminRole(@Req() req): any {
    const role_admin = req.user.authorities.filter(
      (item) => item.authorityName === 'ROLE_ADMIN',
    );
    return role_admin[0];
  }
}
