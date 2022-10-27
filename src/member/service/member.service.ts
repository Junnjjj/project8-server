import { Injectable } from '@nestjs/common';
import { BiddingLogRepository } from '../../bid/biddingLog.repository';
import { ProductRepository } from '../../product/product.repository';
import { leftTime } from '../../common/utils/time.utils';

@Injectable()
export class MemberService {
  constructor(
    private readonly biddingLogRepository: BiddingLogRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  // 입찰 중인 물건
  async getBiddingProductList(user) {
    const userId = user.id;
    // 1. BiddingLog 에서 Bidding Id 중복 제거한 id 리스트 가져오기
    const Logs = await this.biddingLogRepository.getBiddingProducts(userId);

    if (!Logs) {
      return;
    }
    const productIds = [];
    const price = [];
    Logs.forEach((item) => {
      productIds.push(item.productId);
      price.push({ id: item.productId, price: item.price });
    });

    // 2. 위의 리스트를 포함하는 product list 가져오기
    const productLists = await this.productRepository.getProductWhereBiddingOn(
      productIds,
    );

    // 3. 하나로 만들기
    price.forEach((item, idx: number) => {
      for (let i = 0; i < productLists.length; i++) {
        if ((productLists[i]['bidPrice'] = price[i].id)) {
          productLists[i]['bidPrice'] = String(item.price);
        }
      }
    });

    return productLists;
  }

  // 판매 중인 물건
  async getOnSaleProductLists(user) {
    const userId = user.id;

    const productLists = await this.productRepository.getProductOnSale(userId);

    if (!productLists) return;

    for (let i = 0; i < productLists.length; i++) {
      const productId = productLists[i].id;
      const biddingCount = await this.biddingLogRepository.getBiddingCount(
        productId,
      );

      const endTime = productLists[i].endTime;
      productLists[i]['count'] = biddingCount.count;
      productLists[i]['endTime'] = leftTime(endTime) + 'hr';
    }
    return productLists;
  }

  // 구매한 물건
  async getBiddingSuccessProducts(user) {
    const userId = user.id;
    const productLists = await this.productRepository.getBiddingSuccessProducts(
      userId,
    );
    return productLists;
  }

  // 판매 완료한 물건
  async getSaleProducts(user) {
    const userId = user.id;
    const productLists = await this.productRepository.getSaledProducts(userId);

    return productLists;
  }
}
