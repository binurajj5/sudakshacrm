import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { CloneCourseDto } from './dto/clone-course.dto';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic.dto';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.guard';
import { RolesGuard } from '../auth/gaurds/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditLog } from '../../common/interceptors/audit.interceptor';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { Role } from '@prisma/client';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // ==================== COURSE ENDPOINTS ====================

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'Course', action: 'CREATE' })
  create(@Body() createCourseDto: CreateCourseDto, @CurrentUser() user: any) {
    return this.coursesService.create(createCourseDto, user.sub);
  }

  @Get()
  findAll(@Query() query: QueryCoursesDto) {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'Course', action: 'UPDATE' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @AuditLog({ entityType: 'Course', action: 'DELETE' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  // ==================== COURSE CLONING (FR 3.2) ====================

  @Post(':id/clone')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'Course', action: 'CREATE' })
  cloneCourse(
    @Param('id') id: string,
    @Body() cloneDto: CloneCourseDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.cloneCourse(id, cloneDto, user.sub);
  }

  // ==================== TOPIC ENDPOINTS ====================

  @Post(':courseId/topics')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseTopic', action: 'CREATE' })
  createTopic(
    @Param('courseId') courseId: string,
    @Body() createTopicDto: CreateTopicDto,
  ) {
    return this.coursesService.createTopic(courseId, createTopicDto);
  }

  @Patch('topics/:topicId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseTopic', action: 'UPDATE' })
  updateTopic(
    @Param('topicId') topicId: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return this.coursesService.updateTopic(topicId, updateTopicDto);
  }

  @Delete('topics/:topicId')
  @Roles(Role.ADMIN)
  @AuditLog({ entityType: 'CourseTopic', action: 'DELETE' })
  removeTopic(@Param('topicId') topicId: string) {
    return this.coursesService.removeTopic(topicId);
  }

  // ==================== MODULE ENDPOINTS ====================

  @Post('topics/:topicId/modules')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseModule', action: 'CREATE' })
  createModule(
    @Param('topicId') topicId: string,
    @Body() createModuleDto: CreateModuleDto,
  ) {
    return this.coursesService.createModule(topicId, createModuleDto);
  }

  @Patch('modules/:moduleId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseModule', action: 'UPDATE' })
  updateModule(
    @Param('moduleId') moduleId: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.coursesService.updateModule(moduleId, updateModuleDto);
  }

  @Delete('modules/:moduleId')
  @Roles(Role.ADMIN)
  @AuditLog({ entityType: 'CourseModule', action: 'DELETE' })
  removeModule(@Param('moduleId') moduleId: string) {
    return this.coursesService.removeModule(moduleId);
  }

  // ==================== LESSON ENDPOINTS ====================

  @Post('modules/:moduleId/lessons')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseLesson', action: 'CREATE' })
  createLesson(
    @Param('moduleId') moduleId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.coursesService.createLesson(moduleId, createLessonDto);
  }

  @Patch('lessons/:lessonId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseLesson', action: 'UPDATE' })
  updateLesson(
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.coursesService.updateLesson(lessonId, updateLessonDto);
  }

  @Delete('lessons/:lessonId')
  @Roles(Role.ADMIN)
  @AuditLog({ entityType: 'CourseLesson', action: 'DELETE' })
  removeLesson(@Param('lessonId') lessonId: string) {
    return this.coursesService.removeLesson(lessonId);
  }
}
