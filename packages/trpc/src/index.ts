import { router, publicProcedure } from './trpc';
import { z } from 'zod';

export interface ProductMinimal {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brand: string;
  gender: string;
  basePrice: number;
  compareAtPrice?: number | null;
  featured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  images: Array<{ url: string; alt?: string }>;
  variants: Array<{ id: string; size: string; color: string; price: number; stock: number }>;
  sportId: string;
  categoryId: string;
  createdAt: string | Date;
}

export interface ProductListResponse {
  products: ProductMinimal[];
  total: number;
  totalPages: number;
  page: number;
}

export const appRouter = router({
  products: router({
    list: publicProcedure.input(z.any().optional()).query(() => ({} as ProductListResponse)),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(() => ({} as ProductMinimal)),
    create: publicProcedure.input(z.any()).mutation(() => ({} as any)),
    update: publicProcedure.input(z.any()).mutation(() => ({} as any)),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(() => ({} as any)),
  }),
  sports: router({
    list: publicProcedure.query(() => [] as any[]),
    create: publicProcedure.input(z.any()).mutation(() => ({} as any)),
  }),
  categories: router({
    list: publicProcedure.query(() => [] as any[]),
    create: publicProcedure.input(z.any()).mutation(() => ({} as any)),
    update: publicProcedure.input(z.any()).mutation(() => ({} as any)),
  }),
  checkout: router({
    createIntent: publicProcedure.input(z.any()).mutation(() => ({} as any)),
    initialize: publicProcedure.input(z.any()).mutation(() => ({} as any)),
    confirm: publicProcedure.input(z.object({ sessionId: z.string() })).query(() => ({} as any)),
  }),
});




export type AppRouter = typeof appRouter;
export * from './trpc';
export * from '@trpc/server';
export * from '@trpc/client';
export * from '@trpc/react-query';
