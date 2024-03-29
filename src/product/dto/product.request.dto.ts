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
  eType: number;

  @IsNotEmpty()
  @IsNumber()
  pType: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  startPrice: string;

  @IsString()
  bidUnit: string;

  @IsNotEmpty()
  @IsString()
  endHour: string;

  @IsArray()
  imagesName: string[];

  @IsArray()
  uploadImgFromServer: string[];

  //id: string
  //createDate: string
  //buyer: string
}
