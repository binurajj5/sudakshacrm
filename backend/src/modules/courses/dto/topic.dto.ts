import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsInt, 
  Min 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({ description: 'Topic title', example: 'Introduction to Web Development' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Topic description', example: 'Learn the basics of HTML, CSS, and JavaScript' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Order index for sequencing', example: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  orderIndex: number;

  @ApiPropertyOptional({ description: 'Estimated duration in hours', example: 10 })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  estimatedHours?: number;
}

export class UpdateTopicDto extends PartialType(CreateTopicDto) {}
