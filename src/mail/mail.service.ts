import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendWelcome } from 'src/common/interfaces/send-welcome.interface';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private readonly emailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendWelcomeMail(data: SendWelcome) {
    try {
      console.log(`email sending ${data.email}`);
      await this.emailService.sendMail({
        from: `no reply <${this.configService.get('EMAIL_USER')}>`,
        to: data.email,
        subject: `Welcome ${data.username} to our platform`,
        text: `Hello ${data.username}, welcome to our platform`,
      });
      console.log(`email sended successfully ${data.email}`);
      this.logger.debug(`email sended ${data.email}`);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
