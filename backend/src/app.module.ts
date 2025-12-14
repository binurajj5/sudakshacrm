import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app. controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Health checks
    TerminusModule,

    // Task scheduling (for future automations)
    ScheduleModule. forRoot(),

    // Caching (Redis-ready, memory fallback)
    CacheModule.register({
      isGlobal: true,
      ttl:  300, // 5 minutes default TTL
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
