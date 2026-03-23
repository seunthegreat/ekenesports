import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  async createCheckout(@Body() body: { userId: string, items: any[], successUrl: string, cancelUrl: string }) {
    return this.stripeService.createCheckoutSession(
      body.userId,
      body.items,
      body.successUrl,
      body.cancelUrl
    );
  }
}
