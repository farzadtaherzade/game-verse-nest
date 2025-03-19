import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiResponse } from 'src/shared/responses/api.response';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-in')
  async signIn(@Body() signinDto: SigninDto): Promise<
    ApiResponse<{
      access_token: string;
      refresh_token: string;
    }>
  > {
    const { access_token, refresh_token } =
      await this.authenticationService.signin(signinDto);
    return new ApiResponse(
      { access_token, refresh_token },
      'Signin successful',
      HttpStatus.OK,
    );
  }

  @Post('sign-up')
  async signup(@Body() signupDto: SignupDto): Promise<
    ApiResponse<{
      message: string;
    }>
  > {
    const { message } = await this.authenticationService.signup(signupDto);
    return new ApiResponse(
      { message },
      'Signup successful',
      HttpStatus.CREATED,
    );
  }

  @Post('refresh-token')
  async refresh(@Body() dto: RefreshTokenDto): Promise<
    ApiResponse<{
      access_token: string;
      refresh_token: string;
    }>
  > {
    const { access_token, refresh_token } =
      await this.authenticationService.refresh(dto.token);
    return new ApiResponse(
      { access_token, refresh_token },
      'Token refreshed',
      HttpStatus.OK,
    );
  }
}
