import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  score: number;

  @IsOptional()
  slug: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @Type(() => String)
  genres: string[];

  @IsNotEmpty()
  release_date: Date;

  cover: string;

  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  platforms: number[];

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  companyId: number;
}
