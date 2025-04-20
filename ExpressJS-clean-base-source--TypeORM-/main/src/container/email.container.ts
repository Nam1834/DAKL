import { EmailController } from '@/controller/email.controller';
import { EmailService } from '@/service/email.service';
import { IEmailService } from '@/service/interface/i.email.service';
import { Container } from 'inversify';

class EmailContainer {
  private container = new Container();
  constructor() {
    this.container.bind<IEmailService>('EmailService').to(EmailService);
    this.container.bind<EmailController>(EmailController).toSelf();
  }

  export() {
    const emailController = this.container.get<EmailController>(EmailController);
    const emailService = this.container.get<IEmailService>('EmailService');

    return { emailController, emailService };
  }
}

const emailContainer = new EmailContainer();
const { emailController, emailService } = emailContainer.export();
export { emailController, emailService };
