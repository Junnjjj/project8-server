import { IsNotEmpty, IsString } from 'class-validator';

export class QnaRequestDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
