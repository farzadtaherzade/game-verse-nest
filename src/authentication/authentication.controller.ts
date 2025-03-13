import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-in')
  signIn(@Body() signinDto: SigninDto) {
    return this.authenticationService.signin(signinDto);
  }

  @Post('sign-up')
  signup(@Body() signupDto: SignupDto) {
    return this.authenticationService.signup(signupDto);
  }

  @Post('refresh-token')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authenticationService.refresh(dto.token);
  }
}
