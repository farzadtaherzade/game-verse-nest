import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-in')
  async signIn(@Body() signinDto: SigninDto): Promise<
    ApiResponse<{
      accessToken: string;
      refreshToken: string;
    }>
  > {
    const {} = await this.authenticationService.signin(signinDto);
    return;
  }

  @Post('sign-up')
  async signup(@Body() signupDto: SignupDto) {
    return await this.authenticationService.signup(signupDto);
  }

  @Post('refresh-token')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authenticationService.refresh(dto.token);
  }
}
