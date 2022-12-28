import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Qna } from './qna.entity';
import { User } from './user.entity';

@Entity()
export class QnaReport extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Qna, (qna) => qna.qnaReports)
  qna: Qna;

  @ManyToOne(() => User, (user) => user.qnaReports)
  user: User;
}
