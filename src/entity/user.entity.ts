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
import { NewsCommentFavorite } from './newsCommentFavorite.entity';
import { NewsCommentReport } from './newsCommentReport.entity';
import { NewsFavorite } from './NewsFavorite.entity';
import { Qna } from './qna.entity';

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

  @OneToMany(
    () => NewsCommentFavorite,
    (newsCommentFavorite) => newsCommentFavorite.user,
  )
  newsCommentFavorites: NewsCommentFavorite[];

  @OneToMany(
    () => NewsCommentReport,
    (newsCommentReport) => newsCommentReport.user,
  )
  newsCommentReports: NewsCommentReport[];

  @OneToMany(() => NewsFavorite, (newsFavorite) => newsFavorite.user)
  newsFavorites: NewsFavorite[];

  @OneToMany(() => Qna, (qna) => qna.user)
  qnas: Qna[];
}
