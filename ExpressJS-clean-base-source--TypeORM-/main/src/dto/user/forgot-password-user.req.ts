import { IsNotEmpty, IsEmail, IsString, Matches } from 'class-validator';

export class ForgotPasswordUserReq {
  @IsNotEmpty()
  @IsString()
  @Matches(/^(0(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7,8}|[\w\-.]+@[a-zA-Z\d\-.]+\.[a-zA-Z]{2,4})$/, {
    message: 'Must be a valid email or Vietnamese phone number'
  })
  emailOrPhoneNumber!: string;
}
