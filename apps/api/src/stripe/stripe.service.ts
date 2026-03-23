import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  async createCheckoutSession(userId: string, items: any[], successUrl: string, cancelUrl: string, paymentIntentId?: string) {
    // 1. Create a Pending Order in the Database
    const orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = await this.prisma.order.create({
        data: {
            orderNumber,
            userId,
            total,
            status: 'PENDING',
            stripePaymentIntentId: paymentIntentId ?? null,
            items: {
                create: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        }
    });

    // 2. Link PaymentIntent to Order if we are using Elements
    if (paymentIntentId && !this.isMock) {
      await this.stripe.paymentIntents.update(paymentIntentId, {
        metadata: { orderId: order.id }
      });
      // If we're using elements, we don't want a hosted checkout URL
      return { orderId: order.id, mock: false };
    }

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
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      client_reference_id: order.id,
    });

    return { url: session.url, orderId: order.id, mock: false };
  }

  async getOrCreateCustomer(userId: string) {
    if (this.isMock) return 'mock_cus_123';

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const customer = await this.stripe.customers.create({
      email: user.email,
      name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || undefined,
      metadata: { userId: user.id },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  async createPaymentIntent(userId: string, items: any[], shippingCost: number = 0, paymentIntentId?: string) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;
    const amount = Math.round(total * 100);

    if (this.isMock) {
      return {
        clientSecret: paymentIntentId ? `mock_secret_${paymentIntentId.split('_')[1]}` : `mock_secret_${Math.random().toString(36).substring(7)}`,
        amount,
      };
    }

    if (paymentIntentId) {
      try {
        const updatedIntent = await this.stripe.paymentIntents.update(paymentIntentId, {
          amount,
        });
        return {
          clientSecret: updatedIntent.client_secret,
          amount,
        };
      } catch (err) {
        console.warn(`Failed to update PaymentIntent ${paymentIntentId}, creating new one: ${err.message}`);
      }
    }

    const customerId = await this.getOrCreateCustomer(userId);

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customerId,
      setup_future_usage: 'off_session',
      metadata: { userId },
      automatic_payment_methods: { enabled: true },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      amount,
    };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    if (this.isMock) {
      console.log('MOCK STRIPE: Webhook received (Mock ignored)');
      return { received: true };
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.configService.get('STRIPE_WEBHOOK_SECRET')!,
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      throw new HttpException(`Webhook Error: ${err.message}`, HttpStatus.BAD_REQUEST);
    }

    console.log(`[Stripe Webhook] Received ${event.type} event`);

    // Handle both Checkout and direct Payment Intents
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id;

      if (orderId) {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' },
        });
        console.log(`Order ${orderId} marked as PAID via Checkout`);
      }
    } else if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      let orderId = intent.metadata?.orderId;

      if (!orderId) {
        // Fallback: find order by the stored payment intent ID
        const order = await this.prisma.order.findFirst({
          where: { stripePaymentIntentId: intent.id }
        });
        orderId = order?.id;
      }

      if (orderId) {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' },
        });
        console.log(`[Stripe Webhook] Order ${orderId} marked as PAID via Payment Intent`);
      } else {
        console.warn(`[Stripe Webhook] payment_intent.succeeded: no order found for intent ${intent.id}`);
      }
    }

    return { received: true };
  }

  async getOrderSession(sessionId: string) {
    let orderId: string;

    if (sessionId.startsWith('mock_session_')) {
        orderId = sessionId.replace('mock_session_', '');
    } else if (sessionId.startsWith('pi_')) {
      // If it's a payment intent ID — first try metadata, then DB fallback
      const intent = await this.stripe.paymentIntents.retrieve(sessionId);
      orderId = intent.metadata?.orderId;

      if (!orderId) {
        // Fallback: look up order by the stored stripePaymentIntentId
        const orderByIntent = await this.prisma.order.findFirst({
          where: { stripePaymentIntentId: sessionId }
        });
        orderId = orderByIntent?.id;
      }
    } else {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      orderId = session.client_reference_id!;
    }

    if (!orderId) {
      throw new HttpException('Order not found for session', HttpStatus.NOT_FOUND);
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    });

    if (!order) return null;

    return {
      ...order,
      waybill: `DL${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
      shippingCost: 0,
      shippingRate: {
        name: 'DHL Express',
        estimatedDays: { min: 2, max: 5 }
      },
      shippingAddress: {
        firstName: 'Valued',
        lastName: 'Customer',
        street: '123 Sport Avenue',
        city: 'Lagos',
        state: 'LA',
        postalCode: '100001',
        country: 'NG'
      },
      items: order.items.map(item => ({
        ...item,
        name: item.product.name,
      }))
    };
  }
}
