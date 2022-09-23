import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsArray()
  imagesName: string[];

  @IsArray()
  uploadImgFromServer: string[];

  //id: string
  //createDate: string
  //buyer: string
}
