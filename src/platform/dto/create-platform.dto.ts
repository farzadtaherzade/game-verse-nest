import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlatformDto {
  @ApiProperty({
    description: 'The name of the platform',
    example: 'PlayStation 5',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The shortcut/abbreviation for the platform',
    example: 'PS5',
  })
  @IsString()
  @IsNotEmpty()
  shortcut: string;

  @ApiProperty({
    description: 'The URL-friendly slug for the platform',
    example: 'playstation-5',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
