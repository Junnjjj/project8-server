import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { MemberService } from '../service/member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // 입찰 중인 물건
  @Get('/biddingProducts')
  @UseGuards(JwtAuthGuard)
  getBiddingProductsList(@CurrentUser() user) {
    return this.memberService.getBiddingProductList(user);
  }

  // 판매중인 물건
  @Get('/onSaleProducts')
  @UseGuards(JwtAuthGuard)
  getOnSaleProducts(@CurrentUser() user) {
    return this.memberService.getOnSaleProductLists(user);
  }

  // 입찰 성공한 물건(구매한 물건)
  @Get('/biddingSuccess')
  @UseGuards(JwtAuthGuard)
  getBiddingSuccessProducts(@CurrentUser() user) {
    return this.memberService.getBiddingSuccessProducts(user);
  }

  // 판매한 물건
  @Get('/saleProducts')
  @UseGuards(JwtAuthGuard)
  getSaledProducts(@CurrentUser() user) {
    return this.memberService.getSaleProducts(user);
  }
}
