import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompaniesDto } from './dto/query-companies.dto';
import { CompanyResponseDto } from './dto/company-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto, currentUser: User): Promise<CompanyResponseDto> {
    const company = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
        createdById: currentUser.id,
      },
      include: {
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

    return company as CompanyResponseDto;
  }

  async findAll(query: QueryCompaniesDto, currentUser: User): Promise<{ data: CompanyResponseDto[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, type, industry } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { website: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (industry) {
      where.industry = { contains: industry, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        include: {
          createdBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              contacts: true,
              deals: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.company.count({ where }),
    ]);

    return { data: data as any[], total, page, limit };
  }

  async findOne(id: string, currentUser: User): Promise<CompanyResponseDto> {
    const company = await this.prisma.company.findUnique({
      where: { id, deletedAt: null },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        contacts: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
        deals: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company as CompanyResponseDto;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, currentUser: User): Promise<CompanyResponseDto> {
    const company = await this.prisma.company.findUnique({
      where: { id, deletedAt: null },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
      include: {
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

    return updatedCompany as CompanyResponseDto;
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const company = await this.prisma.company.findUnique({
      where: { id, deletedAt: null },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    await this.prisma.company.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
