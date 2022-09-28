import { Body, Controller, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { BidService } from '../service/bid.service';
import { User } from '../../entity/user.entity';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { BiddingRequestDTO } from '../dto/bid.request.dto';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post(':ProductId')
  @UseGuards(JwtAuthGuard)
  createBidLog(
    @Param('ProductId') ProductId: number,
    @Body() body: BiddingRequestDTO,
    @CurrentUser() user: User,
  ) {
    return this.bidService.createBiddingLog({ ProductId, body, user });
  }
}
