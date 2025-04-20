import { sgMail } from './transporter.sendgrid';

export async function sendEmailWithSendGrid(data: {
  from: { name: string };
  to: { emailAddress: string[] };
  subject: string;
  html: string;
}): Promise<void> {
  const msg = {
    to: data.to.emailAddress,
    from: {
      email: process.env.EMAIL_FROM || '',
      name: data.from.name
    },
    subject: data.subject,
    html: data.html
  };

  const result = await sgMail.sendMultiple(msg);
  console.log('Email sent: ', result);
}
