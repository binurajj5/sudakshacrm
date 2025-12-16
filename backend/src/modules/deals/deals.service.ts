import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { QueryDealsDto } from './dto/query-deals.dto';
import { DealResponseDto } from './dto/deal-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async create(createDealDto: CreateDealDto, currentUser: User): Promise<DealResponseDto> {
    const deal = await this.prisma.deal.create({
      data: {
        ...createDealDto,
        createdById: currentUser.id,
      },
      include: {
        contact: true,
        company: true,
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

    return deal as DealResponseDto;
  }

  async findAll(query: QueryDealsDto, currentUser: User): Promise<{ data: DealResponseDto[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, stage, contactId, companyId, minAmount, maxAmount } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (stage) {
      where.stage = stage;
    }

    if (contactId) {
      where.contactId = contactId;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {};
      if (minAmount !== undefined) {
        where.amount.gte = minAmount;
      }
      if (maxAmount !== undefined) {
        where.amount.lte = maxAmount;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.deal.findMany({
        where,
        skip,
        take: limit,
        include: {
          contact: true,
          company: true,
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
      }),
      this.prisma.deal.count({ where }),
    ]);

    return { data: data as DealResponseDto[], total, page, limit };
  }

  async findOne(id: string, currentUser: User): Promise<DealResponseDto> {
    const deal = await this.prisma.deal.findUnique({
      where: { id, deletedAt: null },
      include: {
        contact: true,
        company: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return deal as DealResponseDto;
  }

  async update(id: string, updateDealDto: UpdateDealDto, currentUser: User): Promise<DealResponseDto> {
    const deal = await this.prisma.deal.findUnique({
      where: { id, deletedAt: null },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    const updatedDeal = await this.prisma.deal.update({
      where: { id },
      data: updateDealDto,
      include: {
        contact: true,
        company: true,
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

    return updatedDeal as DealResponseDto;
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const deal = await this.prisma.deal.findUnique({
      where: { id, deletedAt: null },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    await this.prisma.deal.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
