import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CloneCourseDto } from './dto/clone-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic.dto';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { CourseStatus } from '@prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCourseDto: CreateCourseDto) {
    // Check if course code already exists
    const existing = await this.prisma.course.findUnique({
      where: { code: createCourseDto.code },
    });

    if (existing) {
      throw new ConflictException(`Course with code "${createCourseDto.code}" already exists`);
    }

    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        version: createCourseDto.version || '1.0',
        createdById: userId,
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
  }

  async findAll(query: QueryCoursesDto) {
    const { page = 1, limit = 10, search, category, level, status, isTemplate, version } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) where.category = category;
    if (level) where.level = level;
    if (status) where.status = status;
    if (typeof isTemplate === 'boolean') where.isTemplate = isTemplate;
    if (version) where.version = version;

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
              topics: true,
            },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        topics: {
          orderBy: { orderIndex: 'asc' },
          include: {
            modules: {
              orderBy: { orderIndex: 'asc' },
              include: {
                lessons: {
                  orderBy: { orderIndex: 'asc' },
                },
              },
            },
          },
        },
        _count: {
          select: {
            topics: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    // Check if course exists
    await this.findOne(id);

    // If updating code, check for uniqueness
    if (updateCourseDto.code) {
      const existing = await this.prisma.course.findFirst({
        where: {
          code: updateCourseDto.code,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException(`Course with code "${updateCourseDto.code}" already exists`);
      }
    }

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
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
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.course.delete({
      where: { id },
    });
  }

  /**
   * Clone a course with configurable depth
   * This is a critical feature for B2B customization workflows
   */
  async cloneCourse(id: string, userId: string, cloneDto: CloneCourseDto) {
    const sourceCourse = await this.findOne(id);

    // Check if new code is unique
    const existing = await this.prisma.course.findUnique({
      where: { code: cloneDto.code },
    });

    if (existing) {
      throw new ConflictException(`Course with code "${cloneDto.code}" already exists`);
    }

    // Prepare the topics for cloning based on flags
    const topicsData = cloneDto.cloneTopics
      ? await this.prepareTopicsForCloning(
          sourceCourse.topics,
          cloneDto.cloneModules || false,
          cloneDto.cloneLessons || false,
          cloneDto.cloneAssets || false,
        )
      : [];

    // Create the cloned course
    const clonedCourse = await this.prisma.course.create({
      data: {
        name: cloneDto.name,
        code: cloneDto.code,
        description: sourceCourse.description,
        category: sourceCourse.category,
        duration: sourceCourse.duration,
        level: sourceCourse.level,
        version: cloneDto.version || '1.0',
        status: CourseStatus.DRAFT, // Always start as draft
        isTemplate: false, // Clones are not templates
        thumbnailUrl: sourceCourse.thumbnailUrl,
        syllabusPdfUrl: sourceCourse.syllabusPdfUrl,
        marketingContent: sourceCourse.marketingContent,
        price: sourceCourse.price,
        clonedFromId: sourceCourse.id,
        createdById: userId,
        topics: {
          create: topicsData,
        },
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
        clonedFrom: {
          select: {
            id: true,
            name: true,
            code: true,
            version: true,
          },
        },
        topics: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    return clonedCourse;
  }

  /**
   * Prepare topics for cloning with nested modules and lessons
   */
  private async prepareTopicsForCloning(
    topics: any[],
    includeModules: boolean,
    includeLessons: boolean,
    includeAssets: boolean,
  ) {
    return topics.map((topic) => {
      const topicData: any = {
        title: topic.title,
        description: topic.description,
        orderIndex: topic.orderIndex,
        estimatedHours: topic.estimatedHours,
      };

      if (includeModules && topic.modules) {
        topicData.modules = {
          create: topic.modules.map((module: any) => {
            const moduleData: any = {
              title: module.title,
              description: module.description,
              orderIndex: module.orderIndex,
              estimatedHours: module.estimatedHours,
            };

            if (includeLessons && module.lessons) {
              moduleData.lessons = {
                create: module.lessons.map((lesson: any) => ({
                  title: lesson.title,
                  description: lesson.description,
                  contentType: lesson.contentType,
                  contentUrl: lesson.contentUrl,
                  orderIndex: lesson.orderIndex,
                  durationMinutes: lesson.durationMinutes,
                  isFree: lesson.isFree,
                  lmsIdentifier: lesson.lmsIdentifier,
                })),
              };
            }

            return moduleData;
          }),
        };
      }

      return topicData;
    });
  }

  // Topic CRUD
  async createTopic(courseId: string, createTopicDto: CreateTopicDto) {
    await this.findOne(courseId);

    return this.prisma.courseTopic.create({
      data: {
        ...createTopicDto,
        courseId,
      },
    });
  }

  async updateTopic(topicId: string, updateTopicDto: UpdateTopicDto) {
    const topic = await this.prisma.courseTopic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      throw new NotFoundException(`Topic with ID "${topicId}" not found`);
    }

    return this.prisma.courseTopic.update({
      where: { id: topicId },
      data: updateTopicDto,
    });
  }

  async removeTopic(topicId: string) {
    const topic = await this.prisma.courseTopic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      throw new NotFoundException(`Topic with ID "${topicId}" not found`);
    }

    return this.prisma.courseTopic.delete({
      where: { id: topicId },
    });
  }

  // Module CRUD
  async createModule(topicId: string, createModuleDto: CreateModuleDto) {
    const topic = await this.prisma.courseTopic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      throw new NotFoundException(`Topic with ID "${topicId}" not found`);
    }

    return this.prisma.courseModule.create({
      data: {
        ...createModuleDto,
        topicId,
      },
    });
  }

  async updateModule(moduleId: string, updateModuleDto: UpdateModuleDto) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found`);
    }

    return this.prisma.courseModule.update({
      where: { id: moduleId },
      data: updateModuleDto,
    });
  }

  async removeModule(moduleId: string) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found`);
    }

    return this.prisma.courseModule.delete({
      where: { id: moduleId },
    });
  }

  // Lesson CRUD
  async createLesson(moduleId: string, createLessonDto: CreateLessonDto) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found`);
    }

    return this.prisma.courseLesson.create({
      data: {
        ...createLessonDto,
        moduleId,
      },
    });
  }

  async updateLesson(lessonId: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.prisma.courseLesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" not found`);
    }

    return this.prisma.courseLesson.update({
      where: { id: lessonId },
      data: updateLessonDto,
    });
  }

  async removeLesson(lessonId: string) {
    const lesson = await this.prisma.courseLesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" not found`);
    }

    return this.prisma.courseLesson.delete({
      where: { id: lessonId },
    });
  }
}
