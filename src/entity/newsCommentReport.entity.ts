import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NewsComment } from './newsComment.entity';
import { User } from './user.entity';

@Entity()
export class NewsCommentReport extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => NewsComment, (newsComment) => newsComment.newsCommentReports)
  comment: NewsComment;

  @ManyToOne(() => User, (user) => user.newsCommentReports)
  user: User;
}
