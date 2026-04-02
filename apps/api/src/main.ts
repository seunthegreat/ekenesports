import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true, // Required for Stripe Webhook signature verification
  });

  app.use(cookieParser());

  // Security Headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS for specified origins
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  const adminUrl = configService.get<string>('ADMIN_URL') || 'http://localhost:3001';
  
  app.enableCors({
    origin: [frontendUrl, adminUrl],
    credentials: true,
  });

  // Static Assets for uploads
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger setup
  setupSwagger(app);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  const baseUrl = `http://localhost:${port}`;
  console.log(`Application is running on: ${baseUrl}`);
  console.log(`Swagger UI available at: ${baseUrl}/docs`);
}
bootstrap();
