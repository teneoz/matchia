import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Prediction } from '../entities/prediction.entity';
import { CreditTransaction } from '../entities/credit-transaction.entity';

config();

const configService = new ConfigService();

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres'),
  database: configService.get<string>('DB_DATABASE', 'matchinsight'),
  entities: [User, Project, Prediction, CreditTransaction],
  migrations: ['src/database/migrations/**/*.ts'],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  logging: configService.get<string>('NODE_ENV') === 'development',
  ssl: configService.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
};

export default new DataSource(typeormConfig);
