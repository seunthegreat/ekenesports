import { Module } from '@nestjs/common';
import { CheckoutRouter } from './checkout.router';
import { StripeModule } from '../stripe/stripe.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [StripeModule, PrismaModule],
  providers: [CheckoutRouter],
  exports: [CheckoutRouter],
})
export class CheckoutModule {}
