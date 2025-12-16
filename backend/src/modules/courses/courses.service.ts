import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { CloneCourseDto } from './dto/clone-course.dto';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic.dto';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  // ==================== COURSE CRUD ====================

  async create(createCourseDto: CreateCourseDto, userId: string) {
    // Check for unique code
    const existing = await this.prisma.course.findUnique({
      where: { code: createCourseDto.code },
    });

    if (existing) {
      throw new ConflictException(`Course with code "${createCourseDto.code}" already exists`);
    }

    return this.prisma.course.create({
      data: {
        ...createCourseDto,
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

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
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
              enrollments: true,
              deals: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
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
        clonedFrom: {
          select: {
            id: true,
            name: true,
            code: true,
            version: true,
          },
        },
        topics: {
          where: { deletedAt: null },
          orderBy: { orderIndex: 'asc' },
          include: {
            modules: {
              where: { deletedAt: null },
              orderBy: { orderIndex: 'asc' },
              include: {
                lessons: {
                  where: { deletedAt: null },
                  orderBy: { orderIndex: 'asc' },
                },
                assets: {
                  where: { deletedAt: null },
                  orderBy: { orderIndex: 'asc' },
                },
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            deals: true,
            clones: true,
          },
        },
      },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException(`Course with ID "${id}" not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    await this.findOne(id); // Verify exists

    // If updating code, check uniqueness
    if (updateCourseDto.code) {
      const existing = await this.prisma.course.findUnique({
        where: { code: updateCourseDto.code },
      });

      if (existing && existing.id !== id) {
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
    await this.findOne(id); // Verify exists

    return this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ==================== COURSE CLONING (FR 3.2) ====================

  async cloneCourse(id: string, cloneDto: CloneCourseDto, userId: string) {
    const sourceCourse = await this.findOne(id);

    // Check for unique code
    const existing = await this.prisma.course.findUnique({
      where: { code: cloneDto.code },
    });

    if (existing) {
      throw new ConflictException(`Course with code "${cloneDto.code}" already exists`);
    }

    // Create cloned course with all nested structures
    const clonedCourse = await this.prisma.course.create({
      data: {
        name: cloneDto.name,
        code: cloneDto.code,
        description: sourceCourse.description,
        category: sourceCourse.category,
        duration: sourceCourse.duration,
        level: sourceCourse.level,
        version: cloneDto.version || '1.0',
        status: 'DRAFT',
        isTemplate: false,
        clonedFromId: sourceCourse.id,
        thumbnailUrl: sourceCourse.thumbnailUrl,
        syllabusPdfUrl: sourceCourse.syllabusPdfUrl,
        marketingContent: sourceCourse.marketingContent,
        price: sourceCourse.price,
        createdById: userId,
        // Clone topics if requested
        ...(cloneDto.cloneTopics && {
          topics: {
            create: await this.prepareTopicsForCloning(
              sourceCourse.topics,
              cloneDto.cloneModules,
              cloneDto.cloneLessons,
              cloneDto.cloneAssets,
            ),
          },
        }),
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
                assets: true,
              },
            },
          },
        },
      },
    });

    return clonedCourse;
  }

  private async prepareTopicsForCloning(
    topics: any[],
    cloneModules: boolean,
    cloneLessons: boolean,
    cloneAssets: boolean,
  ) {
    return topics.map((topic) => ({
      title: topic.title,
      description: topic.description,
      orderIndex: topic.orderIndex,
      duration: topic.duration,
      ...(cloneModules && {
        modules: {
          create: topic.modules.map((module: any) => ({
            title: module.title,
            description: module.description,
            orderIndex: module.orderIndex,
            duration: module.duration,
            ...(cloneLessons && {
              lessons: {
                create: module.lessons.map((lesson: any) => ({
                  title: lesson.title,
                  description: lesson.description,
                  contentType: lesson.contentType,
                  contentUrl: lesson.contentUrl,
                  orderIndex: lesson.orderIndex,
                  duration: lesson.duration,
                  isFree: lesson.isFree,
                  lmsIdentifier: lesson.lmsIdentifier,
                })),
              },
            }),
            ...(cloneAssets && {
              assets: {
                create: module.assets
                  .filter((asset: any) => !asset.lessonId)
                  .map((asset: any) => ({
                    type: asset.type,
                    title: asset.title,
                    description: asset.description,
                    lmsIdentifier: asset.lmsIdentifier,
                    assetUrl: asset.assetUrl,
                    dueOffset: asset.dueOffset,
                    passingScore: asset.passingScore,
                    orderIndex: asset.orderIndex,
                  })),
              },
            }),
          })),
        },
      }),
    }));
  }

  // ==================== TOPIC MANAGEMENT ====================

  async createTopic(courseId: string, createTopicDto: CreateTopicDto) {
    await this.findOne(courseId); // Verify course exists

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

    if (!topic || topic.deletedAt) {
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

    if (!topic || topic.deletedAt) {
      throw new NotFoundException(`Topic with ID "${topicId}" not found`);
    }

    return this.prisma.courseTopic.update({
      where: { id: topicId },
      data: { deletedAt: new Date() },
    });
  }

  // ==================== MODULE MANAGEMENT ====================

  async createModule(topicId: string, createModuleDto: CreateModuleDto) {
    const topic = await this.prisma.courseTopic.findUnique({
      where: { id: topicId },
    });

    if (!topic || topic.deletedAt) {
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

    if (!module || module.deletedAt) {
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

    if (!module || module.deletedAt) {
      throw new NotFoundException(`Module with ID "${moduleId}" not found`);
    }

    return this.prisma.courseModule.update({
      where: { id: moduleId },
      data: { deletedAt: new Date() },
    });
  }

  // ==================== LESSON MANAGEMENT ====================

  async createLesson(moduleId: string, createLessonDto: CreateLessonDto) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id: moduleId },
    });

    if (!module || module.deletedAt) {
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

    if (!lesson || lesson.deletedAt) {
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

    if (!lesson || lesson.deletedAt) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" not found`);
    }

    return this.prisma.courseLesson.update({
      where: { id: lessonId },
      data: { deletedAt: new Date() },
    });
  }
}
