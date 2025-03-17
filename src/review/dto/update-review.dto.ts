import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    nullable: true,
    description: 'The title of the review',
  })
  content: string;

  @IsPositive()
  @IsOptional()
  @Min(0)
  @Max(10)
  @ApiProperty({
    required: false,
    minimum: 0,
    maximum: 10,
    nullable: true,
    description: 'The score given in the review',
  })
  score: number;
}
