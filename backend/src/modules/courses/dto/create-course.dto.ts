import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsNumber, 
  IsBoolean, 
  MinLength, 
  Min 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CourseCategory, CourseLevel, CourseStatus } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({ description: 'Course name', example: 'Full Stack Web Development Bootcamp' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'Unique course code', example: 'FSWD-2024' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  code: string;

  @ApiPropertyOptional({ description: 'Course description', example: 'Comprehensive bootcamp covering frontend and backend development' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Course category', enum: CourseCategory, example: CourseCategory.TECHNICAL })
  @IsEnum(CourseCategory)
  category: CourseCategory;

  @ApiProperty({ description: 'Duration in hours', example: 120 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  duration: number;

  @ApiProperty({ description: 'Course level', enum: CourseLevel, example: CourseLevel.INTERMEDIATE })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @ApiPropertyOptional({ description: 'Version number', example: '1.0', default: '1.0' })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiProperty({ description: 'Course status', enum: CourseStatus, example: CourseStatus.DRAFT })
  @IsEnum(CourseStatus)
  status: CourseStatus;

  @ApiPropertyOptional({ description: 'Is this a template course?', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  isTemplate?: boolean;

  @ApiPropertyOptional({ description: 'LMS identifier for integration', example: 'learnyst-course-123' })
  @IsString()
  @IsOptional()
  lmsIdentifier?: string;

  @ApiPropertyOptional({ description: 'Course thumbnail URL', example: 'https://example.com/thumbnail.jpg' })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ description: 'Syllabus PDF URL', example: 'https://example.com/syllabus.pdf' })
  @IsString()
  @IsOptional()
  syllabusPdfUrl?: string;

  @ApiPropertyOptional({ description: 'Marketing content/description', example: 'Transform your career with our comprehensive bootcamp...' })
  @IsString()
  @IsOptional()
  marketingContent?: string;

  @ApiPropertyOptional({ description: 'Course price', example: 49999.99 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  price?: number;
}
