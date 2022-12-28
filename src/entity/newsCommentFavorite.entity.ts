import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { NewsComment } from './newsComment.entity';

@Entity()
export class NewsCommentFavorite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => NewsComment,
    (newsComment) => newsComment.newsCommentFavorites,
  )
  comment: NewsComment;

  @ManyToOne(() => User, (user) => user.newsCommentFavorites)
  user: User;
}
