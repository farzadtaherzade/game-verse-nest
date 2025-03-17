import {
  UnauthorizedException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './token-payload.interface';
import { SignupDto } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/common/services/redis.service';
import { PasswordService } from 'src/users/password/password.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AuthenticationService {
  private readonly ttl: number = 7 * 24 * 60 * 60;

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly passwordService: PasswordService,
    @InjectQueue('SEND_WELCOME') private readonly emailQueue: Queue,
  ) {}

  async signin(
    dto: SigninDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findOneByUsername(dto.username);
    if (!user)
      throw new UnauthorizedException('Username or Password not valid!');
    const compare: boolean = await this.passwordService.verify(
      dto.password,
      user.password,
    );
    if (!compare)
      throw new BadRequestException('Username or Password not valid!');
    const payload: TokenPayload = { userId: user.id };
    const { access_token, refresh_token } = this.generateToken(payload);

    await this.emailQueue.add('SEND_EMAIL', {
      email: user.email,
      username: user.username,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async signup(dto: SignupDto) {
    await this.userService.create({ ...dto });
    return {
      message: 'user created successfully',
    };
  }

  async refresh(
    token: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    console.log(token);
    const isBlacklist = await this.redisService.getBlackList(token);
    if (isBlacklist)
      throw new UnauthorizedException('Refresh Token is invalid');

    const { userId }: TokenPayload = await this.jwtService.verify(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    if (!userId) throw new UnauthorizedException('Refresh Token is invalid');

    await this.redisService.setBlacklist(token, this.ttl);

    const payload: TokenPayload = { userId };
    const { access_token, refresh_token } = this.generateToken(payload);

    return {
      refresh_token,
      access_token,
    };
  }

  private generateToken(payload: TokenPayload): {
    access_token: string;
    refresh_token: string;
  } {
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '14d',
    });
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '14d',
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    return {
      access_token,
      refresh_token,
    };
  }
}
