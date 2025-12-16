import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { QueryActivitiesDto } from './dto/query-activities.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createActivityDto: CreateActivityDto, currentUser: User): Promise<ActivityResponseDto> {
    const data: any = {
      ...createActivityDto,
      createdById: currentUser.id,
    };

    // Convert scheduledAt string to Date if provided
    if (createActivityDto.scheduledAt) {
      data.scheduledAt = new Date(createActivityDto.scheduledAt);
    }

    const activity = await this.prisma.activity.create({
      data,
      include: {
        contact: true,
        company: true,
        deal: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return activity as ActivityResponseDto;
  }

  async findAll(
    query: QueryActivitiesDto,
    currentUser: User,
  ): Promise<{ data: ActivityResponseDto[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, type, contactId, companyId, dealId, completed, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (contactId) {
      where.contactId = contactId;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    if (dealId) {
      where.dealId = dealId;
    }

    if (completed !== undefined) {
      where.completed = completed;
    }

    // Date range filtering for scheduledAt
    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) {
        where.scheduledAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.scheduledAt.lte = new Date(endDate);
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        skip,
        take: limit,
        include: {
          contact: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          deal: {
            select: {
              id: true,
              title: true,
              amount: true,
              stage: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: [
          { completed: 'asc' },
          { scheduledAt: 'asc' },
          { createdAt: 'desc' },
        ],
      }),
      this.prisma.activity.count({ where }),
    ]);

    return { data: data as ActivityResponseDto[], total, page, limit };
  }

  async findOne(id: string, currentUser: User): Promise<ActivityResponseDto> {
    const activity = await this.prisma.activity.findUnique({
      where: { id, deletedAt: null },
      include: {
        contact: true,
        company: true,
        deal: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity as ActivityResponseDto;
  }

  async update(id: string, updateActivityDto: UpdateActivityDto, currentUser: User): Promise<ActivityResponseDto> {
    const activity = await this.prisma.activity.findUnique({
      where: { id, deletedAt: null },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const data: any = { ...updateActivityDto };

    // Convert scheduledAt string to Date if provided
    if (updateActivityDto.scheduledAt) {
      data.scheduledAt = new Date(updateActivityDto.scheduledAt);
    }

    // Set completedAt when marking as completed
    if (updateActivityDto.completed === true && !activity.completed) {
      data.completedAt = new Date();
    } else if (updateActivityDto.completed === false) {
      data.completedAt = null;
    }

    const updatedActivity = await this.prisma.activity.update({
      where: { id },
      data,
      include: {
        contact: true,
        company: true,
        deal: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return updatedActivity as ActivityResponseDto;
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const activity = await this.prisma.activity.findUnique({
      where: { id, deletedAt: null },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    await this.prisma.activity.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Timeline endpoints - get activities for a specific entity
  async getTimelineForContact(contactId: string, currentUser: User): Promise<ActivityResponseDto[]> {
    const activities = await this.prisma.activity.findMany({
      where: {
        contactId,
        deletedAt: null,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            amount: true,
            stage: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to most recent 50 activities
    });

    return activities as ActivityResponseDto[];
  }

  async getTimelineForCompany(companyId: string, currentUser: User): Promise<ActivityResponseDto[]> {
    const activities = await this.prisma.activity.findMany({
      where: {
        companyId,
        deletedAt: null,
      },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            amount: true,
            stage: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return activities as ActivityResponseDto[];
  }

  async getTimelineForDeal(dealId: string, currentUser: User): Promise<ActivityResponseDto[]> {
    const activities = await this.prisma.activity.findMany({
      where: {
        dealId,
        deletedAt: null,
      },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return activities as ActivityResponseDto[];
  }
}
