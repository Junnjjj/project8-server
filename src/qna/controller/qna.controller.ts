import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { User } from '../../entity/user.entity';
import { Product } from '../../entity/product.entity';
import { QnaService } from '../service/qna.service';
import { QnaRequestDto } from '../dto/qna.request.dto';

@Controller('qna')
export class QnaController {
  constructor(private readonly qnaService: QnaService) {}
  @Get(':pid')
  getAllQna(@Param('pid') pid: number) {
    return this.qnaService.showAllQnaByPid(pid);
  }

  @Post(':pid')
  @UseGuards(JwtAuthGuard)
  createQuestion(
    @Param('pid') pid: number,
    @Body() body: QnaRequestDto,
    @CurrentUser() user: User,
  ) {
    //Post 요청에 qid가 오지 않으면 question 생성
    return this.qnaService.createQna(body, user, pid, null);
  }

  //product id, question id
  @Post(':pid/:qid')
  @UseGuards(JwtAuthGuard)
  createAnswer(
    @Param('pid') pid: number,
    @Param('qid') qid: number,
    @Body() body: QnaRequestDto,
    @CurrentUser() user: User,
  ) {
    //Post 요청에 qid가 오면 answer 생성
    return this.qnaService.createQna(body, user, pid, qid);
  }

  @Post('/?')
  @UseGuards(JwtAuthGuard)
  async createQnAUseQuery(
    @Query('pid') pid: number,
    @Query('qid') qid: number = null,
    @Body() body: QnaRequestDto,
    @CurrentUser() user: User,
  ) {
    return this.qnaService.createQna(body, user, pid, qid);
  }

  @Patch('/:qid')
  @UseGuards(JwtAuthGuard)
  updateQna(
    @CurrentUser() user: User,
    @Param('qid') id: number,
    @Body() body: QnaRequestDto,
  ) {
    return this.qnaService.updateQna({ user, id }, body);
  }

  @Delete('/:qid')
  @UseGuards(JwtAuthGuard)
  deleteQna(@CurrentUser() user: User, @Param('qid') id: number) {
    return this.qnaService.deleteQna({ user, id });
  }
}
