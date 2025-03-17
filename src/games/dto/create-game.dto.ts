import { UploadCoverGameDto } from './upload-cover-game.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
export class CreateGameDto extends IntersectionType(UploadCoverGameDto) {
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  score: number;

  @IsOptional()
  @ApiProperty()
  slug: string;

  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }): string[] => {
    // Handle both string and array inputs for genres
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return Array.isArray(value) ? value : [];
  })
  @ApiProperty({
    type: [String],
    description: 'Array of genre names (comma-separated string or array)',
    example: 'RPG,Adventure',
  })
  genres: string[];

  @IsNotEmpty()
  @ApiProperty()
  release_date: Date;

  cover: string;

  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }): number[] => {
    // Handle string input for platform IDs
    if (typeof value === 'string') {
      return value.split(',').map((item) => Number(item.trim()));
    }
    return Array.isArray(value) ? value.map(Number) : [];
  })
  @ApiProperty({
    type: [Number],
    description: 'Array of platform IDs (comma-separated string or array)',
    example: '1,2',
  })
  platforms: number[];

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  companyId: number;
}
