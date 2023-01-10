import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { News } from './news.entity';
import { Inquiry } from './inquiry.entity';
import { Notice } from './notice.entity';

@Entity()
export class UserAuthority extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', nullable: true })
  @Index()
  userId: number;

  @Column()
  authorityName: string;

  @ManyToOne(() => User, (user) => user.authorities)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => News, (news) => news.userAuthority)
  news: News[];

  @OneToMany(() => Inquiry, (inquiry) => inquiry.userAuthority)
  inquiries: Inquiry[];

  @OneToMany(() => Notice, (notice) => notice.userAuthority)
  notices: Notice[];
}
