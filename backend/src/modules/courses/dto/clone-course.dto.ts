import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CloneCourseDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(2)
  code: string;

  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsBoolean()
  cloneTopics?: boolean = true;

  @IsOptional()
  @IsBoolean()
  cloneModules?: boolean = true;

  @IsOptional()
  @IsBoolean()
  cloneLessons?: boolean = true;

  @IsOptional()
  @IsBoolean()
  cloneAssets?: boolean = true;
}
