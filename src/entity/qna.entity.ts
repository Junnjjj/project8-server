import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  BaseEntity,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';
import { QnaReport } from './qnaReport.entity';

@Entity()
export class Qna extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdDate: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  //answer인 경우 가리키는 question의 id 저장
  //question인 경우 null
  @Column({ default: null })
  reference: number;

  @Column()
  content: string;

  @Column({ name: 'productId' })
  productId: string;

  @Column({ name: 'userId' })
  userId: string;

  @ManyToOne(() => Product, (product) => product.qnas)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => User, (user) => user.qnas)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => QnaReport, (qnaReport) => qnaReport.qna)
  qnaReports: QnaReport;
}
