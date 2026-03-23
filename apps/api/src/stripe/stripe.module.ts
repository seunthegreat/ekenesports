import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Global()
@Module({})
export class StripeModule {
  static forRoot(): DynamicModule {
    return {
      module: StripeModule,
      providers: [StripeService],
      controllers: [StripeController],
      exports: [StripeService],
    };
  }
}
