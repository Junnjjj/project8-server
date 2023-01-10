import { IsNotEmpty, IsString } from 'class-validator';

export class IAnswerRequestDto {
  @IsNotEmpty()
  @IsString()
  answer: string;
}
