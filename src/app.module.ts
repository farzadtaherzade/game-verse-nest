import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GamesModule } from './games/games.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { GenresModule } from './genres/genres.module';
import { PlatformModule } from './platform/platform.module';
import { ReviewModule } from './review/review.module';
import { CompanyModule } from './company/company.module';
import { MailModule } from './mail/mail.module';
import { QueuesModule } from './queues/queues.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRESQL_HOST'),
        username: configService.get('POSTGRESQL_USERNAME'),
        password: configService.get('POSTGRESQL_PASSWORD'),
        port: +configService.get('POSTGRESQL_PORT'),
        database: configService.get('POSTGRESQL_DATABASE'),
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    GamesModule,
    AuthenticationModule,
    UsersModule,
    GenresModule,
    PlatformModule,
    ReviewModule,
    CompanyModule,
    MailModule,
    QueuesModule,
  ],
})
export class AppModule {}
