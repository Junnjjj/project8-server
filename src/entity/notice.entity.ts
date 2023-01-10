import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAuthority } from './userAuthority.entity';

@Entity()
export class Notice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createDate: Date;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ name: 'authorityId' })
  authorityId: number;

  // 공지 작성자
  @ManyToOne(() => UserAuthority, (userAuthority) => userAuthority.notices)
  @JoinColumn({ name: 'authorityId' })
  userAuthority: UserAuthority;
}
