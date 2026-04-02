import { Router, Query, Mutation, Input, UseMiddlewares } from 'nestjs-trpc';
import { z } from 'zod';
import { StripeService } from '../stripe/stripe.service';
import { PrismaService } from '../prisma/prisma.service';

@Router({ alias: 'checkout' })
export class CheckoutRouter {
  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation({
    input: z.object({
      items: z.array(z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        price: z.number(),
        quantity: z.number(),
        name: z.string(),
        image: z.string().optional(),
      })),
      shippingCost: z.number().optional(),
      paymentIntentId: z.string().optional(),
      userId: z.string(),
    }),
  })
  async createIntent(@Input() input: any) {
    return this.stripeService.createPaymentIntent(
      input.userId,
      input.items,
      input.shippingCost || 0,
      input.paymentIntentId,
    );
  }

  @Mutation({
    input: z.object({
      userId: z.string(),
      items: z.array(z.object({
        productId: z.string(),
        variantId: z.string(),
        name: z.string(),
        variantName: z.string(),
        price: z.number(),
        quantity: z.number(),
        image: z.string().optional(),
      })),
      total: z.number(),
      paymentIntentId: z.string(),
      shippingAddress: z.any(),
      shippingMethod: z.string(),
    }),
  })
  async initialize(@Input() input: any) {
    const { userId, items, total, paymentIntentId, shippingAddress, shippingMethod } = input;
    
    // Create/Update the pending order
    return this.stripeService.initializeOrder(
      userId,
      items,
      '', // successUrl (not needed for Elements)
      '', // cancelUrl (not needed for Elements)
      paymentIntentId
    );
  }

  @Query({
    input: z.object({
      sessionId: z.string(),
    }),
  })
  async confirm(@Input() input: { sessionId: string }) {
    return this.stripeService.getOrderSession(input.sessionId);
  }
}
