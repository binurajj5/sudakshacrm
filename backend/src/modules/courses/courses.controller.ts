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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
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
import { AuditLog } from '../../common/decorators/audit-log.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('courses')
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @AuditLog('CREATE', 'Course')
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 409, description: 'Course code already exists' })
  create(@CurrentUser('id') userId: string, @Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(userId, createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Courses retrieved successfully' })
  findAll(@Query() query: QueryCoursesDto) {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID with full hierarchy' })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @AuditLog('UPDATE', 'Course')
  @ApiOperation({ summary: 'Update a course' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 409, description: 'Course code already exists' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @AuditLog('DELETE', 'Course')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Post(':id/clone')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @AuditLog('CLONE', 'Course')
  @ApiOperation({ summary: 'Clone a course with configurable depth' })
  @ApiResponse({ status: 201, description: 'Course cloned successfully' })
  @ApiResponse({ status: 404, description: 'Source course not found' })
  @ApiResponse({ status: 409, description: 'Course code already exists' })
  clone(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() cloneDto: CloneCourseDto,
  ) {
    return this.coursesService.cloneCourse(id, userId, cloneDto);
  }

  // Topic endpoints
  @Post(':courseId/topics')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @AuditLog('CREATE', 'CourseTopic')
  @ApiOperation({ summary: 'Create a topic for a course' })
  @ApiResponse({ status: 201, description: 'Topic created successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  createTopic(@Param('courseId') courseId: string, @Body() createTopicDto: CreateTopicDto) {
    return this.coursesService.createTopic(courseId, createTopicDto);
  }

  @Patch('topics/:topicId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @AuditLog('UPDATE', 'CourseTopic')
  @ApiOperation({ summary: 'Update a topic' })
  @ApiResponse({ status: 200, description: 'Topic updated successfully' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  updateTopic(@Param('topicId') topicId: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.coursesService.updateTopic(topicId, updateTopicDto);
  }

  @Delete('topics/:topicId')
  @Roles(UserRole.ADMIN)
  @AuditLog('DELETE', 'CourseTopic')
  @ApiOperation({ summary: 'Delete a topic' })
  @ApiResponse({ status: 200, description: 'Topic deleted successfully' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  removeTopic(@Param('topicId') topicId: string) {
    return this.coursesService.removeTopic(topicId);
  }

  // Module endpoints
  @Post('topics/:topicId/modules')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @AuditLog('CREATE', 'CourseModule')
  @ApiOperation({ summary: 'Create a module for a topic' })
  @ApiResponse({ status: 201, description: 'Module created successfully' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  createModule(@Param('topicId') topicId: string, @Body() createModuleDto: CreateModuleDto) {
    return this.coursesService.createModule(topicId, createModuleDto);
  }

  @Patch('modules/:moduleId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @AuditLog('UPDATE', 'CourseModule')
  @ApiOperation({ summary: 'Update a module' })
  @ApiResponse({ status: 200, description: 'Module updated successfully' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  updateModule(@Param('moduleId') moduleId: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.coursesService.updateModule(moduleId, updateModuleDto);
  }

  @Delete('modules/:moduleId')
  @Roles(UserRole.ADMIN)
  @AuditLog('DELETE', 'CourseModule')
  @ApiOperation({ summary: 'Delete a module' })
  @ApiResponse({ status: 200, description: 'Module deleted successfully' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  removeModule(@Param('moduleId') moduleId: string) {
    return this.coursesService.removeModule(moduleId);
  }

  // Lesson endpoints
  @Post('modules/:moduleId/lessons')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @AuditLog('CREATE', 'CourseLesson')
  @ApiOperation({ summary: 'Create a lesson for a module' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  createLesson(@Param('moduleId') moduleId: string, @Body() createLessonDto: CreateLessonDto) {
    return this.coursesService.createLesson(moduleId, createLessonDto);
  }

  @Patch('lessons/:lessonId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @AuditLog('UPDATE', 'CourseLesson')
  @ApiOperation({ summary: 'Update a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  updateLesson(@Param('lessonId') lessonId: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.coursesService.updateLesson(lessonId, updateLessonDto);
  }

  @Delete('lessons/:lessonId')
  @Roles(UserRole.ADMIN)
  @AuditLog('DELETE', 'CourseLesson')
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  removeLesson(@Param('lessonId') lessonId: string) {
    return this.coursesService.removeLesson(lessonId);
  }
}
