import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductRequestDto {
  @IsNotEmpty()
  @IsString()
  etype: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  startprice: string;

  @IsNotEmpty()
  @IsString()
  endtime: string;

  @IsNotEmpty()
  @IsString()
  owner: string;

  //id: string
  //createDate: string
  //buyer: string
}
