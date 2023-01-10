import { IsNotEmpty, IsString } from 'class-validator';

export class InquiryRequestDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
