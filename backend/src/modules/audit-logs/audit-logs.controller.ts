import { Controller, Get, Query, Param } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  findAll(@Query() query: QueryAuditLogsDto, @CurrentUser() user: User) {
    return this.auditLogsService.findAll(query, user);
  }

  @Get('entity/:entityType/:entityId')
  @Roles(Role.ADMIN, Role.MANAGER)
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditLogsService.findByEntity(entityType, entityId);
  }
}
