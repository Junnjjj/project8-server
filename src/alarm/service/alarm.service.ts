import { HttpException, Injectable } from '@nestjs/common';
import { AlarmRepository } from '../alarm.repository';

@Injectable()
export class AlarmService {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  async getUserAlarm(user) {
    const userId = user.id;
    return await this.alarmRepository.getUserAlarm(userId);
  }

  async getUserAlarmCount(user) {
    const userId = user.id;
    const alarmList = await this.alarmRepository.getUserAlarm(userId);
    let count = 0;
    alarmList.forEach((item) => {
      if (!item.readAlarm) {
        count = count + 1;
      }
    });
    return count;
  }

  async readAlarm({ user, id }) {
    const userId = user.id;
    const isMyAlarm = await this.alarmRepository.checkAlarmOwner({
      userId,
      id,
    });
    if (!isMyAlarm) {
      throw new HttpException('알람의 사용자가 아닙니다.', 401);
    }

    return await this.alarmRepository.updateReadAlarm(id);
  }

  async deleteAlarm({ user, id }) {
    const userId = user.id;
    const isMyAlarm = await this.alarmRepository.checkAlarmOwner({
      userId,
      id,
    });
    if (isMyAlarm) {
      throw new HttpException('알람의 사용자가 아닙니다.', 401);
    }

    return await this.alarmRepository.deleteAlarm(id);
  }
}
