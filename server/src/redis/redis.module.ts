import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Redis from 'redis';

export const REDIS = Symbol('AUTH:REDIS');

@Module({
  imports: [forwardRef(() => ConfigModule)], // Use forwardRef to avoid circular dependency
  providers: [
    {
      provide: REDIS,
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL'); // Replace 'REDIS_URL' with your actual environment variable name
        console.log(redisUrl);

        const client = Redis.createClient({
          url: redisUrl,
          // legacyMode: true,
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
