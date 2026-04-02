import { Router, Query, Mutation, Input } from 'nestjs-trpc';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Router({ alias: 'categories' })
export class CategoriesRouter {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService
  ) {}

  @Query()
  async list() {
    const cacheKey = 'categories:list:all';
    const cached = await this.cache.get<any[]>(cacheKey);
    if (cached) return cached;

    const categories = await this.prisma.category.findMany({
      include: {
        sport: true,
        parent: true,
        children: true,
      },
    });

    await this.cache.set(cacheKey, categories, 3600); // 1 hour cache
    return categories;
  }

  @Mutation({
    input: z.object({
      name: z.string(),
      slug: z.string(),
      image: z.string().optional(),
      parentId: z.string().optional(),
      sportId: z.string(),
    }),
  })
  async create(@Input() input: any) {
    const category = await this.prisma.category.create({
      data: input,
    });

    await this.cache.flushAll();
    return category;
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      name: z.string().optional(),
      slug: z.string().optional(),
      image: z.string().optional(),
      parentId: z.string().optional(),
      sportId: z.string().optional(),
    }),
  })
  async update(@Input() input: any) {
    const { id, ...data } = input;
    const category = await this.prisma.category.update({
      where: { id },
      data,
    });

    await this.cache.flushAll();
    return category;
  }
}
