import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { DealsModule } from './modules/deals/deals.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TerminusModule,
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal:  true,
      ttl: 300,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ContactsModule,
    CompaniesModule,
    DealsModule,
    ActivitiesModule,
    AuditLogsModule,
    // CoursesModule, // Temporarily disabled
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}