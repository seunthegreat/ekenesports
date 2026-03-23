import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private isMock: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.isMock = this.configService.get('STRIPE_MOCK') === 'true';
    
    if (!this.isMock) {
      this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!, {
        apiVersion: '2025-02-24.acacia',
      });
    }
  }

  async createCheckoutSession(userId: string, items: any[], successUrl: string, cancelUrl: string) {
    // 1. Create a Pending Order in the Database
    const orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = await this.prisma.order.create({
        data: {
            orderNumber,
            userId,
            total,
            status: 'PENDING',
            items: {
                create: items.map(item => ({
                    productId: item.productId, // Ensure item has productId
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        }
    });

    if (this.isMock) {
      console.log('MOCK STRIPE: Creating checkout session', items);
      return {
        url: `${successUrl}?session_id=mock_session_${order.id}`,
        orderId: order.id,
        mock: true
      };
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Stripe expects cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      client_reference_id: order.id, // Link to our internal order
    });

    return { url: session.url, orderId: order.id, mock: false };
  }
}
