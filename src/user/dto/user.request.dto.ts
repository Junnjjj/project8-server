import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UsersRequestDto {
  @IsNotEmpty()
  @IsEmail()
  loginId: string;

  @IsNotEmpty()
  @IsString()
  passwd: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  // Tel number
  @IsNotEmpty()
  @IsString()
  tel1: string;
  @IsNotEmpty()
  @IsString()
  tel2: string;
  @IsNotEmpty()
  @IsString()
  tel3: string;

  // id: string;
  // createDate: string;
  // outdate: string;
  // ssn: string; // : 주민등록 번호 : 인증 후 디비 저장
  // remark: string; // :  특이사항
}
