import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from 'src/mail/mail.service';
import { type SendWelcome } from 'src/shared/interfaces/send-welcome.interface';

@Processor('SEND_WELCOME')
export class SendWelcomeConsumer extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }
  async process(job: Job<SendWelcome, any, string>) {
    switch (job.name) {
      case 'SEND_EMAIL':
        await this.mailService.sendWelcomeMail(job.data);
        return {};
      case 'concatenate': {
        break;
      }
    }
    return {};
  }
}
