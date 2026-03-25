import { Controller, Post, Body, Headers, Req, RawBodyRequest, Param } from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('initialize-order')
  async initializeOrder(@Body() body: { userId: string, items: any[], successUrl: string, cancelUrl: string, paymentIntentId?: string }) {
    return this.stripeService.initializeOrder(
      body.userId,
      body.items,
      body.successUrl,
      body.cancelUrl,
      body.paymentIntentId
    );
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.stripeService.handleWebhook(req.rawBody!, signature);
  }

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { userId: string, items: any[], shippingCost?: number, paymentIntentId?: string }) {
    return this.stripeService.createPaymentIntent(body.userId, body.items, body.shippingCost, body.paymentIntentId);
  }

  @Post('session/:sessionId')
  async getOrderSession(@Param('sessionId') sessionId: string) {
    return this.stripeService.getOrderSession(sessionId);
  }
}
