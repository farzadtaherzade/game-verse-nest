import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { SendWelcomeConsumer } from './cunsumers/send-welcome.consumer';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'SEND_EMAIL',
    }),
    MailModule,
  ],
  providers: [SendWelcomeConsumer],
  exports: [SendWelcomeConsumer],
})
export class QueuesModule {}
