import { Module } from '@nestjs/common';
import { AlarmService } from './service/alarm.service';
import { AlarmController } from './controller/alarm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from '../entity/alarm.entity';
import { AlarmRepository } from './alarm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Alarm])],
  controllers: [AlarmController],
  providers: [AlarmService, AlarmRepository],
  exports: [AlarmService, AlarmRepository],
})
export class AlarmModule {}
