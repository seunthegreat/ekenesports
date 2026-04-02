import { Router, Query, Mutation, Input } from 'nestjs-trpc';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Router({ alias: 'products' })
export class ProductsRouter {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService
  ) {}

  @Query({
    input: z.object({
      limit: z.number().optional().default(12),
      page: z.number().optional().default(1),
      featured: z.boolean().optional(),
      isNew: z.boolean().optional(),
      sport: z.string().optional(),
      category: z.string().optional(),
      gender: z.string().optional(),
      brand: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      sizes: z.array(z.string()).optional(),
      colors: z.array(z.string()).optional(),
      sort: z.enum(['newest', 'price-asc', 'price-desc', 'popular']).optional().default('newest'),
      search: z.string().optional(),
    }).optional(),
  })
  async list(@Input() input: any) {
    const filters = input || {};
    const { 
      limit = 12, 
      page = 1, 
      featured, 
      isNew, 
      sport: sportSlug, 
      category: categorySlug, 
      gender, 
      brand, 
      minPrice, 
      maxPrice, 
      sizes, 
      colors, 
      sort, 
      search 
    } = filters;
    
    const skip = (page - 1) * limit;

    // Build the "where" clause
    const where: any = { status: 'active' };

    if (featured !== undefined) where.featured = featured;
    if (isNew !== undefined) where.isNew = isNew;
    if (gender) where.gender = gender;
    if (brand) where.brand = { contains: brand, mode: 'insensitive' };
    
    if (sportSlug) {
      where.sport = { slug: sportSlug };
    }

    if (categorySlug) {
      where.category = { 
        OR: [
          { slug: categorySlug },
          { parent: { slug: categorySlug } }
        ]
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    if (sizes && sizes.length > 0) {
      where.variants = { some: { size: { in: sizes } } };
    }

    if (colors && colors.length > 0) {
      where.variants = { some: { color: { in: colors } } };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Determine sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { basePrice: 'asc' };
    if (sort === 'price-desc') orderBy = { basePrice: 'desc' };
    if (sort === 'popular') orderBy = { reviewCount: 'desc' };

    // Execute queries
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        take: limit,
        skip,
        include: {
          images: true,
          variants: true,
          sport: true,
          category: true,
        },
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    // Simple Facet Calculation (This can be optimized with raw SQL or separate queries later)
    // For now, we'll return a basic structure to satisfy the frontend if needed
    // or just return the products and total.
    
    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Query({
    input: z.object({
      slug: z.string(),
    }),
  })
  async getBySlug(@Input() input: { slug: string }) {
    return this.prisma.product.findUnique({
      where: { slug: input.slug },
      include: {
        images: true,
        variants: true,
        sport: true,
        category: true,
      },
    });
  }

  @Mutation({
    input: z.object({
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      basePrice: z.number(),
      brand: z.string().optional(),
      gender: z.string().optional(),
      sportId: z.string(),
      categoryId: z.string(),
      featured: z.boolean().optional(),
      images: z.array(z.object({
        url: z.string(),
        alt: z.string().optional(),
      })),
      variants: z.array(z.object({
        size: z.string(),
        color: z.string(),
        colorHex: z.string(),
        sku: z.string(),
        price: z.number(),
        stock: z.number(),
      })),
    }),
  })
  async create(@Input() input: any) {
    const product = await this.prisma.product.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        basePrice: input.basePrice,
        brand: input.brand,
        gender: input.gender,
        sportId: input.sportId,
        categoryId: input.categoryId,
        featured: input.featured,
        images: {
          create: input.images,
        },
        variants: {
          create: input.variants,
        },
      },
    });

    // Invalidate all product caches
    await this.cache.flushAll();
    
    return product;
  }

  @Mutation({
    input: z.object({
      id: z.string(),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      basePrice: z.number().optional(),
      brand: z.string().optional(),
      gender: z.string().optional(),
      sportId: z.string().optional(),
      categoryId: z.string().optional(),
      featured: z.boolean().optional(),
      images: z.array(z.object({
        url: z.string(),
        alt: z.string().optional(),
      })).optional(),
      variants: z.array(z.object({
        id: z.string().optional(),
        size: z.string(),
        color: z.string(),
        colorHex: z.string(),
        sku: z.string(),
        price: z.number(),
        stock: z.number(),
      })).optional(),
    }),
  })
  async update(@Input() input: any) {
    const { id, images, variants, ...data } = input;

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        // For simplicity in this stage, we replace images/variants
        // A more advanced sync logic can be added later
        images: images ? {
          deleteMany: {},
          create: images,
        } : undefined,
        variants: variants ? {
          deleteMany: {},
          create: variants,
        } : undefined,
      },
    });

    await this.cache.flushAll();
    return product;
  }

  @Mutation({
    input: z.object({
      id: z.string(),
    }),
  })
  async delete(@Input() input: { id: string }) {
    const product = await this.prisma.product.delete({
      where: { id: input.id },
    });

    await this.cache.flushAll();
    return product;
  }
}


