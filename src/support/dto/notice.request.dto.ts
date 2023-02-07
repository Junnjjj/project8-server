import { IsNotEmpty, IsString } from 'class-validator';

export class NoticeRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
