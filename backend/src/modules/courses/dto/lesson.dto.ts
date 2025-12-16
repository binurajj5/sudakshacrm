import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsInt, 
  IsBoolean, 
  Min 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { LessonContentType } from '@prisma/client';

export class CreateLessonDto {
  @ApiProperty({ description: 'Lesson title', example: 'Introduction to HTML Tags' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Lesson description', example: 'Learn about basic HTML tags and their usage' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Content type', enum: LessonContentType, example: LessonContentType.VIDEO })
  @IsEnum(LessonContentType)
  contentType: LessonContentType;

  @ApiPropertyOptional({ description: 'Content URL', example: 'https://example.com/video/html-tags.mp4' })
  @IsString()
  @IsOptional()
  contentUrl?: string;

  @ApiProperty({ description: 'Order index for sequencing', example: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  orderIndex: number;

  @ApiPropertyOptional({ description: 'Duration in minutes', example: 15 })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  durationMinutes?: number;

  @ApiPropertyOptional({ description: 'Is this lesson free to preview?', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @ApiPropertyOptional({ description: 'LMS identifier for integration', example: 'learnyst-lesson-456' })
  @IsString()
  @IsOptional()
  lmsIdentifier?: string;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
