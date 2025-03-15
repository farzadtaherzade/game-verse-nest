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
  name: string;

  @IsUrl()
  @IsOptional()
  website: string;

  @IsOptional()
  @IsString()
  about: string;

  @IsNumber()
  @IsOptional()
  parentId: number;
}
