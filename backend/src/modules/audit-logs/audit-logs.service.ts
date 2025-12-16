import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';
import { AuditLogResponseDto } from './dto/audit-log-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    entityType: string;
    entityId: string;
    action: string;
    changes: any;
    userId: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        entity: data.entityType,
        entityId: data.entityId,
        action: data.action,
        changes: data.changes || {},
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  async findAll(
    query: QueryAuditLogsDto,
    currentUser: User,
  ): Promise<{ data: AuditLogResponseDto[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 50, entityType, entityId, action, userId, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (entityType) {
      where.entity = entityType;
    }

    if (entityId) {
      where.entityId = entityId;
    }

    if (action) {
      where.action = action;
    }

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data: data as AuditLogResponseDto[], total, page, limit };
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLogResponseDto[]> {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        entity: entityType,
        entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return logs as AuditLogResponseDto[];
  }
}
