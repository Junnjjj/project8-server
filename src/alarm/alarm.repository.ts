import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alarm } from '../entity/alarm.entity';
import { Repository } from 'typeorm';
import * as http from 'http';
import { BiddingLog } from '../entity/biddingLog.entity';

@Injectable()
export class AlarmRepository {
  constructor(
    @InjectRepository(Alarm) private alarmRepository: Repository<Alarm>,
  ) {}

  async checkAlarmOwner({ userId, id }) {
    try {
      const result = await this.alarmRepository
        .createQueryBuilder('alarm')
        .where('id = :id', { id: id })
        .getOne();
      return result.userId === userId ? true : false;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async createAlarm({ productId, userId, type }) {
    try {
      const result = await this.alarmRepository.save({
        userId: userId,
        type: type,
        productId: productId,
      });
      return result;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async createAlarmWithQueryRunner({ queryRunner, productId, userId, type }) {
    const result = await queryRunner.manager.save(Alarm, {
      userId: userId,
      type: type,
      productId: productId,
    });
    return result;
  }

  async getUserAlarm(userId) {
    try {
      const alarmList = await this.alarmRepository
        .createQueryBuilder('alarm')
        .leftJoinAndSelect('alarm.product', 'product')
        .select([
          'alarm.id',
          'alarm.type',
          'alarm.userId',
          'alarm.createdDate',
          'alarm.productId',
          'alarm.readAlarm',
          'product.name',
        ])
        .where('alarm.userId = :userId', { userId: userId })
        .getMany();
      return alarmList;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async updateReadAlarm(id) {
    try {
      await this.alarmRepository
        .createQueryBuilder('alarm')
        .update(Alarm)
        .set({
          readAlarm: true,
        })
        .where('id = :id', { id: id })
        .execute();
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async deleteAlarm(id) {
    try {
      await this.alarmRepository
        .createQueryBuilder('alarm')
        .delete()
        .from(Alarm)
        .where('id = :id', { id: id })
        .execute();
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
