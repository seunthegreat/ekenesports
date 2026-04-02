import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { StripeModule } from './stripe/stripe.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrpcModule } from './trpc/trpc.module';
import { ProductsModule } from './products/products.module';
import { CacheModule } from './cache/cache.module';
import { MediaModule } from './media/media.module';
import { CategoriesModule } from './categories/categories.module';
import { SportsModule } from './sports/sports.module';
import { CheckoutModule } from './checkout/checkout.module';




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    StripeModule.forRoot(),
    PrismaModule,
    TrpcModule,
    ProductsModule,
    CacheModule,
    MediaModule,
    CategoriesModule,
    SportsModule,
    CheckoutModule,
  ],


  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
