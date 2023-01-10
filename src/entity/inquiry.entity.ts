import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UserAuthority } from './userAuthority.entity';

@Entity()
export class Inquiry extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createDate: Date;

  @Column()
  phoneNumber: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: null })
  answer: string;

  @Column({
    type: 'timestamp',
    default: null,
  })
  answerDate: Date;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'authorityId', default: null })
  authorityId: number;

  // 문의 등록한 유저
  @ManyToOne(() => User, (user) => user.inquiries)
  @JoinColumn({ name: 'userId' })
  user: User;

  // 문의 답변한 운영자
  @ManyToOne(() => UserAuthority, (userAuthority) => userAuthority.inquiries)
  @JoinColumn({ name: 'authorityId' })
  userAuthority: UserAuthority;
}
