import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    
    if (!redisUrl) {
      console.warn('REDIS_URL not found, cache service will not be available.');
      return;
    }

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) {
          // Stop retrying after 3 attempts in dev to avoid spam
          return null;
        }
        return Math.min(times * 100, 3000);
      },
    });
  }

  onModuleInit() {
    if (this.client) {
      this.client.on('error', (err: any) => {
        // Only log serious errors, or log once if connection is refused
        if (err.code === 'ECONNREFUSED') {
          // We already handle this via strategy or can log once
        } else {
          console.error('Redis error:', err);
        }
      });
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      return null;
    }
  }

  async set(key: string, value: any, ttlInSeconds?: number): Promise<void> {
    if (!this.client) return;
    try {
      const data = JSON.stringify(value);
      if (ttlInSeconds) {
        await this.client.set(key, data, 'EX', ttlInSeconds);
      } else {
        await this.client.set(key, data);
      }
    } catch (err) { }
  }

  async del(key: string): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.del(key);
    } catch (err) { }
  }

  async flushAll(): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.flushall();
    } catch (err) { }
  }
}
