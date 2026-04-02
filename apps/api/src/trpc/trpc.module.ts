import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import superjson from 'superjson';
import { TrpcContextProvider } from './trpc-context';

import { ProductsRouter } from '../products/products.router';
import { SportsRouter } from '../sports/sports.router';
import { CategoriesRouter } from '../categories/categories.router';
import { CheckoutRouter } from '../checkout/checkout.router';

@Module({
  imports: [
    TRPCModule.forRoot({
      basePath: '/trpc',
      context: TrpcContextProvider,
      transformer: superjson,
    }),
  ],
  providers: [
    TrpcContextProvider,
    ProductsRouter,
    SportsRouter,
    CategoriesRouter,
    CheckoutRouter,
  ],
})
export class TrpcModule {}
