import { HttpException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../../product/product.repository';

@Injectable()
export class BidService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createBidLog({ ProductId, body, user }) {
    const userId = user.id; // userId
    const { price, message, shipping } = body; // Body Data
    const productId = ProductId; // product Id

    // 1. 종료된 입찰인지 확인
    const checkActiveProduct = await this.productRepository.checkActiveById(
      productId,
    );
    if (!checkActiveProduct) {
      throw new HttpException('입찰이 종료된 상품입니다', 401);
    }

    // 2. bidding 가격이 nowPrice 보다 큰지 확인
    const checkBiddingPrice = await this.productRepository.checkBiddingPrice({
      productId,
      biddingPrice: price,
    });
    if (!checkBiddingPrice) {
      throw new HttpException('앞선 입찰이 존재합니다.', 401);
    }

    // 3. bidding log 에 저장

    // 4. product nowPrice 수정

    // todo: user_info 에도 추가 , biddingLog 저장과 transaction 으로 묶기

    return 'ㅇㄹㄴ';
  }
}
