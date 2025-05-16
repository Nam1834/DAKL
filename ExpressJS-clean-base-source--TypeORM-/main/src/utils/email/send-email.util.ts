import axios from 'axios';

export async function sendEmail(data: {
  from: { name: string };
  to: { emailAddress: string[] };
  subject: string;
  html: string;
}): Promise<void> {
  const msg = {
    to: { emailAddresses: data.to.emailAddress },
    from: {
      email: process.env.EMAIL_FROM || '',
      name: data.from.name
    },
    subject: data.subject,
    html: data.html
  };

  try {
    const result = await axios.post(`${process.env.EMAIL_API_URL}/email/send`, msg, {
      headers: {
        'Content-Type': 'application/json',
        'X-SECRET-KEY': process.env.X_SECRET_KEY || ''
      }
    });
    console.log('Email sent: ', result);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}
