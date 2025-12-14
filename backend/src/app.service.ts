import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok',
      service: this.configService.get<string>('APP_NAME') || 'Sudaksha CRM Backend',
      timestamp: new Date().toISOString(),
      environment: this.configService.get<string>('APP_ENV') || 'development',
    };
  }
}
