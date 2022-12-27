import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { News } from './news.entity';
import { User } from './user.entity';
import { NewsCommentFavorite } from './newsCommentFavorite.entity';
import { NewsCommentReport } from './newsCommentReport.entity';

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

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => News, (news) => news.newsComments)
  @JoinColumn({ name: 'newsId' })
  news: News;

  @ManyToOne(() => User, (user) => user.newsComments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(
    () => NewsCommentFavorite,
    (newsCommentFavorite) => newsCommentFavorite.comment,
  )
  newsCommentFavorites: NewsCommentFavorite[];

  @OneToMany(
    () => NewsCommentReport,
    (newsCommentReport) => newsCommentReport.comment,
  )
  newsCommentReports: NewsCommentReport[];
}
