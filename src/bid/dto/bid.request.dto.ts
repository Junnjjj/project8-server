// BiddingRequestDTO

import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class BiddingRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsBoolean()
  message: boolean;

  @IsNotEmpty()
  @IsNumber()
  shipping: number;
}
