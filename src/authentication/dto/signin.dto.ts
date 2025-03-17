import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SigninDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  // @IsStrongPassword()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
