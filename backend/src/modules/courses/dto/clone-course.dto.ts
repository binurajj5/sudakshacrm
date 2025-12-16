import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsBoolean, 
  MinLength 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CloneCourseDto {
  @ApiProperty({ description: 'Name for the cloned course', example: 'Full Stack Web Development Bootcamp - Client ABC' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'Unique code for the cloned course', example: 'FSWD-ABC-2024' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  code: string;

  @ApiPropertyOptional({ description: 'Version for the cloned course', example: '1.0', default: '1.0' })
  @IsString()
  @IsOptional()
  version?: string;

  @ApiPropertyOptional({ description: 'Clone topics along with the course', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  cloneTopics?: boolean;

  @ApiPropertyOptional({ description: 'Clone modules along with topics', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  cloneModules?: boolean;

  @ApiPropertyOptional({ description: 'Clone lessons along with modules', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  cloneLessons?: boolean;

  @ApiPropertyOptional({ description: 'Clone learning assets along with lessons', example: true, default: true })
  @IsBoolean()
  @IsOptional()
  cloneAssets?: boolean;
}
