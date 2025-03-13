import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  platformId: number;

  @IsNumber()
  @IsNotEmpty()
  gameId: number;

  @IsNumber()
  score: number;
}
