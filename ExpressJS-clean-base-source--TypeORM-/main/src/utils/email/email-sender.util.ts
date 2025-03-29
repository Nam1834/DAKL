import { transporter } from '@/utils/email/transporter.nodemailer';

export async function sendEmail(data: {
  from: {
    name: string;
  };
  to: {
    emailAddress: string[];
  };
  subject: string;
  html: string;
}): Promise<void> {
  const mailOptions = {
    from: {
      name: data.from.name,
      address: process.env.EMAIL_USERNAME || ''
    },
    to: data.to.emailAddress,
    subject: data.subject,
    html: data.html
  };

  const result = await transporter.sendMail(mailOptions);
  console.log('Email sent: ', result);
}
