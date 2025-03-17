import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'The title of the review' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The content of the review' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'The ID of the platform' })
  @IsNumber()
  @IsNotEmpty()
  platformId: number;

  @ApiProperty({ description: 'The ID of the game' })
  @IsNumber()
  @IsNotEmpty()
  gameId: number;

  @ApiProperty({
    description: 'The score given in the review',
    minimum: 0,
    maximum: 10,
  })
  @IsNumber()
  score: number;
}
