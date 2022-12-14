import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../../auth/role-types';

export const Roles = (...roles: RoleType[]): any => SetMetadata('roles', roles);
