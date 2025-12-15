import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() user: User) {
    return this.usersService. create(createUserDto, user);
  }

  @Get()
  @Roles(Role. ADMIN, Role.MANAGER)
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService. findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.usersService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.usersService.remove(id, user);
  }
}