import { HttpException, Injectable } from '@nestjs/common';
import { PFavoriteRepository } from '../PFavorite.repository';
import { ProductRepository } from '../../product/product.repository';
import { NCFavoriteRepository } from '../NCFavorite.repository';
import { NFavoriteRepository } from '../NFavorite.repository';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly pFavoriteRepository: PFavoriteRepository,
    private readonly ncFavoriteRepository: NCFavoriteRepository,
    private readonly nFavoriteRepository: NFavoriteRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async enrollProductFavorite({ user, pid }) {
    const userId = user.id;
    const productId = pid;

    // 1. 자기 자신 product 는 불가
    const myProduct = await this.productRepository.checkProductUserById({
      productId,
      userId,
    });
    if (myProduct) {
      throw new HttpException(
        '자기 자신 물품은 관심목록에 넣을 수 없습니다.',
        400,
      );
    }

    // 2. 이미 Favorite 등록한 경우 => 삭제하기
    const existFavorite = await this.pFavoriteRepository.checkExistFavorite({
      productId,
      userId,
    });

    if (existFavorite) {
      return await this.pFavoriteRepository.deleteFavorite({
        productId,
        userId,
      });
    }

    return await this.pFavoriteRepository.enrollFavorite({ userId, productId });
  }

  async enrollNFavorite({ user, nid }) {
    const userId = user.id;
    const newsId = nid;

    const existFavorite = await this.nFavoriteRepository.checkExistFavorite({
      newsId,
      userId,
    });

    // 1 이미 등록한 경우 => 삭제하기
    if (existFavorite) {
      return await this.nFavoriteRepository.deleteFavorite({ newsId, userId });
    }

    return await this.nFavoriteRepository.enrollFavorite({
      newsId,
      userId,
    });
  }

  async enrollNCFavorite({ user, cid }) {
    const userId = user.id;
    const commentId = cid;

    const existFavorite = await this.ncFavoriteRepository.checkExistFavorite({
      commentId,
      userId,
    });

    // 1. 이미 Favorite 등록한 경우 => 삭제하기
    if (existFavorite) {
      return await this.ncFavoriteRepository.deleteFavorite({
        commentId,
        userId,
      });
    }

    return await this.ncFavoriteRepository.enrollFavorite({
      userId,
      commentId,
    });
  }
}
