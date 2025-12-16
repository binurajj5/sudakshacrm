import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { User, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, currentUser: User): Promise<UserResponseDto> {
    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can create users');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ... createUserDto,
        password:  hashedPassword,
      },
    });

    const { password, ...result } = user;
    return result as UserResponseDto;
  }

  async findAll(query: QueryUsersDto): Promise<{ data: UserResponseDto[]; total:  number; page: number; limit: number }> {
    const { role, status, search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user. count({ where }),
    ]);

    const data = users.map(({ password, ...user }) => user as UserResponseDto);

    return { data, total, page, limit };
  }

  async findOne(id: string, currentUser: User): Promise<UserResponseDto> {
    const canViewAll = ([Role.ADMIN, Role.MANAGER] as Role[]).includes(currentUser.role);
    
    if (!canViewAll && currentUser.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result as UserResponseDto;
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUser: User): Promise<UserResponseDto> {
    const canUpdateAll = currentUser.role === Role.ADMIN;
    const isSelf = currentUser.id === id;

    if (!canUpdateAll && !isSelf) {
      throw new ForbiddenException('You can only update your own profile');
    }

    if (! canUpdateAll && (updateUserDto.role || updateUserDto.status)) {
      throw new ForbiddenException('You cannot change your own role or status');
    }

    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = { ...updateUserDto };

    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { password, ...result } = updatedUser;
    return result as UserResponseDto;
  }

  async remove(id: string, currentUser:  User): Promise<void> {
    if (currentUser.role !== Role. ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }

    if (currentUser.id === id) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}