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
}
