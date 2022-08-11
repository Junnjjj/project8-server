import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UsersRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  loginId: string;

  @IsNotEmpty()
  @IsString()
  passwd: string;

  // Tel number
  @IsNotEmpty()
  @IsNumber()
  tel1: number;
  @IsNotEmpty()
  @IsNumber()
  tel2: string;
  @IsNotEmpty()
  @IsNumber()
  tel3: string;

  // id: string;
  // createDate: string;
  // outdate: string;
  // ssn: string; // : 주민등록 번호 : 인증 후 디비 저장
  // remark: string; // :  특이사항
}
