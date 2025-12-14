import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory. create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const configService = app.get(ConfigService);

  // Global prefix for API versioning
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions:  {
        enableImplicitConversion: true,
      },
    }),
  );

  // Graceful shutdown
  app. enableShutdownHooks();

  const port = configService. get<number>('APP_PORT') || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Sudaksha CRM Backend running on: ${await app. getUrl()}/api/v1`);
  console.log(`📊 Health check: ${await app.getUrl()}/api/v1/health`);
}

bootstrap();