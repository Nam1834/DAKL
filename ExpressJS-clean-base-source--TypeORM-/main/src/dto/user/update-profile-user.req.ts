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
}
