import { IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  content: string;

  @IsPositive()
  @IsOptional()
  @Min(0)
  @Max(10)
  score: number;
}
