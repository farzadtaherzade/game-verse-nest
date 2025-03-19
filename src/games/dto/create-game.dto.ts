import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
export class CreateGameDto {
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
  @ApiProperty({ required: false })
  slug?: string;

  @IsArray()
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return Array.isArray(value) ? value : [];
  })
  @ApiProperty({
    type: [String],
    examples: ['RPG', 'Adventure'],
  })
  genres: string[];

  @IsNotEmpty()
  @ApiProperty()
  release_date: Date;

  cover: string;

  @IsArray()
  @ArrayMinSize(1)
  @Transform(({ value }): number[] => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => Number(item.trim()));
    }
    return Array.isArray(value) ? value.map(Number) : [];
  })
  @ApiProperty({
    type: [Number],
  })
  platforms: number[];

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  companyId: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
