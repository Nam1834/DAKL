import { AdminStatus } from '@/enums/admin-status.enum';
import { AdminTypeEnum } from '@/enums/admin-type.enum';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

export class UpdateManageAdminReq {
  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'Fullname must not exceed 30 characters' })
  @Matches(/^[a-zA-ZÀ-ỹ\s]*$/, { message: 'Fullname must not contain special characters' })
  @Matches(/^\S.*\S$|^[\S]$/, { message: 'Fullname must not have leading or trailing spaces' })
  fullname!: string;

  @IsOptional()
  @IsDateString()
  birthday!: string;

  @IsOptional()
  @IsEmail()
  email!: string;

  @IsOptional()
  @Matches(/^0(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7,8}$/, {
    message: 'Phone number must be a valid Vietnamese number'
  })
  phoneNumber!: string;

  @IsOptional()
  @IsString()
  homeAddress!: string;

  @IsOptional()
  @IsString()
  @Matches(/^(MALE|FEMALE)$/, { message: 'Gender must be either MALE or FEMALE' })
  gender!: 'MALE' | 'FEMALE';

  @IsOptional()
  @IsEnum(AdminStatus, { message: 'Status must be either ACTIVE or BLOCKED' })
  status!: AdminStatus;

  @IsOptional()
  @IsEnum(AdminTypeEnum, { message: 'RoleId must be either ADMIN, BEST_ADMIN, or UNKNOWN' })
  roleId!: AdminTypeEnum;
}
