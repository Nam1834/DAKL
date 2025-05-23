import {
  IsDateString,
  IsEmail,
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

@ValidatorConstraint({ name: 'IsPasswordMatch', async: false })
export class IsPasswordMatch implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as any;
    return confirmPassword === object.password;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Confirm Password must match Password';
  }
}

export class UpdateAdminReq {
  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'Fullname must not exceed 30 characters' })
  @Matches(/^[a-zA-ZÀ-ỹ\s]*$/, { message: 'Fullname must not contain special characters' })
  @Matches(/^\S.*\S$|^[\S]$/, { message: 'Fullname must not have leading or trailing spaces' })
  fullname!: string;

  @IsOptional()
  birthday!: string;

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
  homeAddress!: string;

  @IsOptional()
  @IsString()
  @Matches(/^(MALE|FEMALE)$/, { message: 'Gender must be either MALE or FEMALE' })
  gender!: 'MALE' | 'FEMALE';
}
