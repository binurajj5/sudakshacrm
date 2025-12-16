export class AuditLogResponseDto {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  changes: any;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  user?: any;
}
