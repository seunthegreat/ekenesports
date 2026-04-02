import { Router, Query, Mutation, Input } from 'nestjs-trpc';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Router({ alias: 'sports' })
export class SportsRouter {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService
  ) {}

  @Query()
  async list() {
    const cacheKey = 'sports:list:all';
    const cached = await this.cache.get<any[]>(cacheKey);
    if (cached) return cached;

    const sports = await this.prisma.sport.findMany({
      include: {
        categories: true,
      },
    });

    await this.cache.set(cacheKey, sports, 3600); // 1 hour cache
    return sports;
  }

  @Mutation({
    input: z.object({
      name: z.string(),
      slug: z.string(),
      icon: z.string().optional(),
      image: z.string().optional(),
    }),
  })
  async create(@Input() input: any) {
    const sport = await this.prisma.sport.create({
      data: input,
    });

    await this.cache.flushAll();
    return sport;
  }
}
