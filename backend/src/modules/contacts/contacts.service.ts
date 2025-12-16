import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { QueryContactsDto } from './dto/query-contacts.dto';
import { ContactResponseDto } from './dto/contact-response.dto';
import { User, Role } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto, currentUser: User): Promise<ContactResponseDto> {
    const contact = await this.prisma.contact.create({
      data: {
        ...createContactDto,
        createdById: currentUser.id,
      },
      include: {
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

    return contact as ContactResponseDto;
  }

  async findAll(query: QueryContactsDto, currentUser: User): Promise<{ data: ContactResponseDto[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, search, type, status, companyId } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip,
        take: limit,
        include: {
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
      this.prisma.contact.count({ where }),
    ]);

    return { data: data as ContactResponseDto[], total, page, limit };
  }

  async findOne(id: string, currentUser: User): Promise<ContactResponseDto> {
    const contact = await this.prisma.contact.findUnique({
      where: { id, deletedAt: null },
      include: {
        company: true,
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        deals: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact as ContactResponseDto;
  }

  async update(id: string, updateContactDto: UpdateContactDto, currentUser: User): Promise<ContactResponseDto> {
    const contact = await this.prisma.contact.findUnique({
      where: { id, deletedAt: null },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const updatedContact = await this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
      include: {
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

    return updatedContact as ContactResponseDto;
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const contact = await this.prisma.contact.findUnique({
      where: { id, deletedAt: null },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    await this.prisma.contact.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
