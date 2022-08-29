import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductRequestDto {
  @IsNotEmpty()
  @IsNumber()
  etype: number;

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
  @IsNumber()
  owner: number;

  //id: string
  //createDate: string
  //buyer: string
}
