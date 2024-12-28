import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
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

export class CreateAdminReq {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, { message: 'Fullname must not exceed 30 characters' })
  @Matches(/^[a-zA-ZÀ-ỹ\s]*$/, { message: 'Fullname must not contain special characters' })
  @Matches(/^\S.*\S$|^[\S]$/, { message: 'Fullname must not have leading or trailing spaces' })
  fullname!: string;

  @IsNotEmpty()
  @IsDateString()
  birthday!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @Matches(/^0(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7,8}$/, {
    message: 'Phone number must be a valid Vietnamese number'
  })
  phoneNumber!: string;

  @IsNotEmpty()
  @IsString()
  homeAddress!: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(MALE|FEMALE)$/, { message: 'Gender must be either MALE or FEMALE' })
  gender!: 'MALE' | 'FEMALE';

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(15, { message: 'Password must not exceed 15 characters' })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.password !== undefined)
  @Validate(IsPasswordMatch)
  confirmPassword!: string;

  @IsNotEmpty()
  @IsString()
  roleId!: string;
}
