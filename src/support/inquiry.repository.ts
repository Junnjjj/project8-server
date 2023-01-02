import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from '../entity/inquiry.entity';

@Injectable()
export class InquiryRepository {
  constructor(
    @InjectRepository(Inquiry)
    private inquiryRepository: Repository<Inquiry>,
  ) {}

  async fineInquiryByIid(Iid): Promise<Inquiry | null> {
    return;
  }
}
