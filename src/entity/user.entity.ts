import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BiddingLog } from './biddingLog.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdDate: Date;

  @Column()
  loginId: string;

  @Column()
  passwd: string;

  @Column()
  name: string;

  @Column()
  tel1: number;

  @Column()
  tel2: number;

  @Column()
  tel3: number;

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @ManyToMany(() => BiddingLog, (biddingLog) => biddingLog.user)
  biddingLogs: BiddingLog[];
}
