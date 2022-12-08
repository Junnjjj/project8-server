import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AlarmService } from '../service/alarm.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../../entity/user.entity';
import { Alarm } from '../../entity/alarm.entity';

@Controller('alarm')
export class AlarmController {
  constructor(private readonly alarmService: AlarmService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserAlarm(@CurrentUser() user: User): Promise<Alarm[]> {
    return this.alarmService.getUserAlarm(user);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  getUserAlarmCount(@CurrentUser() user: User) {
    return this.alarmService.getUserAlarmCount(user);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  readAlarm(@CurrentUser() user: User, @Param('id') id: number) {
    return this.alarmService.readAlarm({ user, id });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteAlarm(@CurrentUser() user: User, @Param('id') id: number) {
    return this.alarmService.deleteAlarm({ user, id });
  }
}
