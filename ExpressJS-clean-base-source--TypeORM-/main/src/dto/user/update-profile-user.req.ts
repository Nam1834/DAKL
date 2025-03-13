import { IsDateString, IsEmail, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateProfileUserReq {
  @IsOptional()
  @IsString()
  @MaxLength(15, { message: 'Fullname must not exceed 15 characters' })
  @Matches(/^[a-zA-ZÀ-ỹ\s]*$/, { message: 'Fullname must not contain special characters' })
  @Matches(/^\S.*\S$|^[\S]$/, { message: 'Fullname must not have leading or trailing spaces' })
  fullname!: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @Matches(/^0(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7,8}$/, {
    message: 'Phone number must be a valid Vietnamese number'
  })
  phoneNumber!: string;

  @IsOptional()
  @IsEmail()
  workEmail!: string;

  @IsOptional()
  @IsString()
  homeAddress?: string;

  @IsOptional()
  @IsDateString()
  birthday?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(MALE|FEMALE)$/, { message: 'Gender must be either MALE or FEMALE' })
  gender?: 'MALE' | 'FEMALE';

  @IsOptional()
  majorId!: string;
}
