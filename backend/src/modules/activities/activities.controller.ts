import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { QueryActivitiesDto } from './dto/query-activities.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { AuditInterceptor, AuditLog } from '../../common/interceptors';

@Controller('activities')
@UseInterceptors(AuditInterceptor)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @AuditLog({ entityType: 'Activity', action: 'CREATE' })
  create(@Body() createActivityDto: CreateActivityDto, @CurrentUser() user: User) {
    return this.activitiesService.create(createActivityDto, user);
  }

  @Get()
  findAll(@Query() query: QueryActivitiesDto, @CurrentUser() user: User) {
    return this.activitiesService.findAll(query, user);
  }

  @Get('timeline/contact/:contactId')
  getTimelineForContact(@Param('contactId') contactId: string, @CurrentUser() user: User) {
    return this.activitiesService.getTimelineForContact(contactId, user);
  }

  @Get('timeline/company/:companyId')
  getTimelineForCompany(@Param('companyId') companyId: string, @CurrentUser() user: User) {
    return this.activitiesService.getTimelineForCompany(companyId, user);
  }

  @Get('timeline/deal/:dealId')
  getTimelineForDeal(@Param('dealId') dealId: string, @CurrentUser() user: User) {
    return this.activitiesService.getTimelineForDeal(dealId, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.activitiesService.findOne(id, user);
  }

  @AuditLog({ entityType: 'Activity', action: 'UPDATE' })
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto, @CurrentUser() user: User) {
    return this.activitiesService.update(id, updateActivityDto, user);
  }

  @Delete(':id')
  @AuditLog({ entityType: 'Activity', action: 'DELETE' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.activitiesService.remove(id, user);
  }
}
