import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { News } from './news.entity';
import { User } from './user.entity';

@Entity()
export class NewsComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'newsId' })
  newsId: number;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => News, (news) => news.newsComments)
  @JoinColumn({ name: 'newsId' })
  news: News;

  @ManyToOne(() => User, (user) => user.newsComments)
  @JoinColumn({ name: 'userId' })
  user: User;
}
