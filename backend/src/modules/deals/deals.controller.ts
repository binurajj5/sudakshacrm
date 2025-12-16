import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { QueryDealsDto } from './dto/query-deals.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { AuditInterceptor, AuditLog } from '../../common/interceptors';

@Controller('deals')
@UseInterceptors(AuditInterceptor)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @AuditLog({ entityType: 'Deal', action: 'CREATE' })
  create(@Body() createDealDto: CreateDealDto, @CurrentUser() user: User) {
    return this.dealsService.create(createDealDto, user);
  }

  @Get()
  findAll(@Query() query: QueryDealsDto, @CurrentUser() user: User) {
    return this.dealsService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.dealsService.findOne(id, user);
  }

  @AuditLog({ entityType: 'Deal', action: 'UPDATE' })
  update(@Param('id') id: string, @Body() updateDealDto: UpdateDealDto, @CurrentUser() user: User) {
    return this.dealsService.update(id, updateDealDto, user);
  }

  @Delete(':id')
  @AuditLog({ entityType: 'Deal', action: 'DELETE' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.dealsService.remove(id, user);
  }
}
