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

export class CreateModuleDto {
  @ApiProperty({ description: 'Module title', example: 'HTML Fundamentals' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Module description', example: 'Learn HTML structure, tags, and semantic elements' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Order index for sequencing', example: 1 })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  orderIndex: number;

  @ApiPropertyOptional({ description: 'Estimated duration in hours', example: 3 })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  estimatedHours?: number;
}

export class UpdateModuleDto extends PartialType(CreateModuleDto) {}
