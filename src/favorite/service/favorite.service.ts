import { Injectable } from '@nestjs/common';
import { PFavoriteRepository } from '../PFavorite.repository';

@Injectable()
export class FavoriteService {
  constructor(private readonly pFavoriteRepository: PFavoriteRepository) {}

  async enrollProductFavorite({ user, pid }) {
    const userId = user.id;
    const productId = pid;

    return await this.pFavoriteRepository.enrollFavorite({ userId, productId });
  }
}
