import { Module } from '@nestjs/common';
import { ProductsRouter } from './products.router';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProductsRouter],
  exports: [ProductsRouter],
})
export class ProductsModule {}
