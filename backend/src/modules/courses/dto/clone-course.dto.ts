import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsBoolean, 
  MinLength 
} from 'class-validator';

export class CloneCourseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  code: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsBoolean()
  @IsOptional()
  cloneTopics?: boolean;

  @IsBoolean()
  @IsOptional()
  cloneModules?: boolean;

  @IsBoolean()
  @IsOptional()
  cloneLessons?: boolean;

  @IsBoolean()
  @IsOptional()
  cloneAssets?: boolean;
}
