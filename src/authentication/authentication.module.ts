import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RedisService } from 'src/services/redis.service';
import { PasswordService } from 'src/users/password/password.service';

@Module({
  imports: [UsersModule, JwtModule, PassportModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    RedisService,
    PasswordService,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
