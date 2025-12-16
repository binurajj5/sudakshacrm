import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from '../../modules/audit-logs/audit-logs.service';
import { Reflector } from '@nestjs/core';

export const AUDIT_LOG_KEY = 'audit_log';

export interface AuditLogMetadata {
  entityType: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
}

export const AuditLog = (metadata: AuditLogMetadata) => 
  Reflect.metadata(AUDIT_LOG_KEY, metadata);

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditLogsService: AuditLogsService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const metadata = this.reflector.get<AuditLogMetadata>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );

    if (!metadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { entityType, action } = metadata;

    // Get entity ID from params or body
    const entityId = request.params.id || request.body?.id;

    return next.handle().pipe(
      tap(async (response) => {
        if (user && entityId) {
          const changes: any = {};

          // Capture changes based on action
          if (action === 'CREATE') {
            changes.after = response;
          } else if (action === 'UPDATE') {
            changes.before = request.body;
            changes.after = response;
          } else if (action === 'DELETE') {
            changes.deletedId = entityId;
          }

          await this.auditLogsService.create({
            entityType,
            entityId,
            action,
            changes,
            userId: user.id,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          });
        }
      }),
    );
  }
}
