import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { News } from './news.entity';
import { User } from './user.entity';

@Entity()
export class NewsFavorite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => News, (news) => news.newsFavorites)
  news: News;

  @ManyToOne(() => User, (user) => user.newsFavorites)
  user: User;
}
