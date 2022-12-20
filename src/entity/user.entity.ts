import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
  BaseEntity,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { BiddingLog } from './biddingLog.entity';
import { Product } from './product.entity';
import { UserProfile } from './userProfile.entity';
import { ProductFavorite } from './productFavorite.entity';
import { Alarm } from './alarm.entity';
import { UserAuthority } from './userAuthority.entity';
import { NewsComment } from './newsComment.entity';

@Entity()
export class User extends BaseEntity {
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

  @Column({ nullable: true })
  @Exclude()
  currentHashedRefreshToken?: string;

  @OneToOne(() => UserProfile)
  @JoinColumn()
  profile: UserProfile;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => BiddingLog, (biddingLog) => biddingLog.user)
  biddingLogs: BiddingLog[];

  @OneToMany(() => ProductFavorite, (productFavorite) => productFavorite.user)
  productFavorites: ProductFavorite[];

  @OneToMany(() => Alarm, (alarm) => alarm.user)
  alarms: Alarm[];

  @OneToMany(() => UserAuthority, (userAuthority) => userAuthority.user)
  authorities: UserAuthority[];

  @OneToMany(() => NewsComment, (newsComment) => newsComment.user)
  newsComments: NewsComment[];
}
