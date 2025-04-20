export interface SendEmailParams {
  from: { name: string };
  to: { emailAddress: string[] };
  subject: string;
  html: string;
}
