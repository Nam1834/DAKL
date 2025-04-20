import { SendEmailParams } from '@/dto/send-email/send-email-params.req';
import { IEmailService } from '@/service/interface/i.email.service';
import { injectable } from 'inversify';

const EMAIL_API_URL: any = process.env.EMAIL_API_URL;
const SECRET_KEY: any = process.env.SECRET_KEY;

@injectable()
export class EmailService implements IEmailService {
  async sendEmailViaApi(params: SendEmailParams): Promise<void> {
    const response = await axios.post(
      EMAIL_API_URL,
      {
        from: params.from,
        to: { emailAddresses: params.to.emailAddress },
        subject: params.subject,
        html: params.html
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-SECRET-KEY': SECRET_KEY
        }
      }
    );
  }
}
