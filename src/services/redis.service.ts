/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: '127.0.0.1',
      port: 6379,
    });
  }

  async setBlacklist(token: string, ttl: number) {
    return await this.client.setex(
      `blacklist:token:${token}`,
      ttl,
      'blacklisted',
    );
  }

  async getBlackList(token: string): Promise<string | null> {
    return await this.client.get(`blacklist:token:${token}`);
  }

  async removeBlacklist(token: string) {
    return await this.client.del(`blacklist:token:${token}`);
  }
}
