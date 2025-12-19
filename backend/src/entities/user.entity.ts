import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../common/enums/role.enum';
import { Project } from './project.entity';
import { Prediction } from './prediction.entity';
import { CreditTransaction } from './credit-transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    type: 'varchar',
    default: 'free',
  })
  subscriptionTier: 'free' | 'pro' | 'premium';

  @Column({ default: 10 })
  creditsRemaining: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Prediction, (prediction) => prediction.user)
  predictions: Prediction[];

  @OneToMany(() => CreditTransaction, (transaction) => transaction.user)
  transactions: CreditTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
