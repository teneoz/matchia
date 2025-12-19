import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('predictions')
export class Prediction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.predictions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  @Index()
  userId: string;

  @ManyToOne(() => Project, (project) => project.predictions, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @Column({ name: 'match_id' })
  @Index()
  matchId: number;

  @Column({ name: 'predicted_home_score', nullable: true })
  predictedHomeScore: number;

  @Column({ name: 'predicted_away_score', nullable: true })
  predictedAwayScore: number;

  @Column({ name: 'predicted_winner', nullable: true })
  predictedWinner: 'home' | 'away' | 'draw';

  @Column({ name: 'confidence_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  confidenceScore: number;

  @Column({ name: 'home_win_probability', type: 'decimal', precision: 5, scale: 2, nullable: true })
  homeWinProbability: number;

  @Column({ name: 'draw_probability', type: 'decimal', precision: 5, scale: 2, nullable: true })
  drawProbability: number;

  @Column({ name: 'away_win_probability', type: 'decimal', precision: 5, scale: 2, nullable: true })
  awayWinProbability: number;

  @Column({ name: 'analysis_text', type: 'text', nullable: true })
  analysisText: string;

  @Column({ name: 'key_factors', type: 'jsonb', nullable: true })
  keyFactors: string[];

  @Column({ name: 'model_version', nullable: true })
  modelVersion: string;

  @CreateDateColumn()
  createdAt: Date;
}
