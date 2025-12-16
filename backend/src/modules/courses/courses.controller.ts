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
  UseInterceptors,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CloneCourseDto } from './dto/clone-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic.dto';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { JwtAuthGuard } from '../auth/gaurds/jwt-auth.guard';
import { RolesGuard } from '../auth/gaurds/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditInterceptor, AuditLog } from '../../common/interceptors';
import { Role } from '@prisma/client';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(AuditInterceptor)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'Course', action: 'CREATE' })
  create(@CurrentUser('id') userId: string, @Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(userId, createCourseDto);
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

  @Post(':id/clone')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'Course', action: 'CREATE' })
  clone(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() cloneDto: CloneCourseDto,
  ) {
    return this.coursesService.cloneCourse(id, userId, cloneDto);
  }

  // Topic endpoints
  @Post(':courseId/topics')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseTopic', action: 'CREATE' })
  createTopic(@Param('courseId') courseId: string, @Body() createTopicDto: CreateTopicDto) {
    return this.coursesService.createTopic(courseId, createTopicDto);
  }

  @Patch('topics/:topicId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseTopic', action: 'UPDATE' })
  updateTopic(@Param('topicId') topicId: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.coursesService.updateTopic(topicId, updateTopicDto);
  }

  @Delete('topics/:topicId')
  @Roles(Role.ADMIN)
  @AuditLog({ entityType: 'CourseTopic', action: 'DELETE' })
  removeTopic(@Param('topicId') topicId: string) {
    return this.coursesService.removeTopic(topicId);
  }

  // Module endpoints
  @Post('topics/:topicId/modules')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseModule', action: 'CREATE' })
  createModule(@Param('topicId') topicId: string, @Body() createModuleDto: CreateModuleDto) {
    return this.coursesService.createModule(topicId, createModuleDto);
  }

  @Patch('modules/:moduleId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseModule', action: 'UPDATE' })
  updateModule(@Param('moduleId') moduleId: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.coursesService.updateModule(moduleId, updateModuleDto);
  }

  @Delete('modules/:moduleId')
  @Roles(Role.ADMIN)
  @AuditLog({ entityType: 'CourseModule', action: 'DELETE' })
  removeModule(@Param('moduleId') moduleId: string) {
    return this.coursesService.removeModule(moduleId);
  }

  // Lesson endpoints
  @Post('modules/:moduleId/lessons')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseLesson', action: 'CREATE' })
  createLesson(@Param('moduleId') moduleId: string, @Body() createLessonDto: CreateLessonDto) {
    return this.coursesService.createLesson(moduleId, createLessonDto);
  }

  @Patch('lessons/:lessonId')
  @Roles(Role.ADMIN, Role.MANAGER)
  @AuditLog({ entityType: 'CourseLesson', action: 'UPDATE' })
  updateLesson(@Param('lessonId') lessonId: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.coursesService.updateLesson(lessonId, updateLessonDto);
  }

  @Delete('lessons/:lessonId')
  @Roles(Role.ADMIN)
  @AuditLog({ entityType: 'CourseLesson', action: 'DELETE' })
  removeLesson(@Param('lessonId') lessonId: string) {
    return this.coursesService.removeLesson(lessonId);
  }
}
