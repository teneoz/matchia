import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return new Redis({
          host: redisConfig?.host || 'localhost',
          port: redisConfig?.port || 6379,
          password: redisConfig?.password,
          keyPrefix: redisConfig?.keyPrefix || 'matchinsight:',
          retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: RedisService,
      useFactory: (redisClient) => {
        return new RedisService(redisClient);
      },
      inject: ['REDIS_CLIENT'],
    },
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
