import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({ required: false })
  website: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  about: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  parentId: number;
}
