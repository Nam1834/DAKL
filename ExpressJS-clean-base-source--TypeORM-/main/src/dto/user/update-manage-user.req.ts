import { UserCheckActiveEnum } from '@/enums/user-check-active.enum';
import { UserStatus } from '@/enums/user-status.enum';
import { UserTypeEnum } from '@/enums/user-type.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateManageUserReq {
  @IsOptional()
  @IsEnum(UserCheckActiveEnum, { message: 'Check Active must be either ACTIVE or BLOCKED' })
  checkActive!: UserCheckActiveEnum;

  @IsOptional()
  @IsEnum(UserTypeEnum, { message: 'RoleId must be either USER, TUTOR' })
  roleId!: UserTypeEnum;

  @IsOptional()
  @IsEnum(UserStatus, { message: 'Check Status must be either PENDING, REQUEST, ACCEPT or REFUSE' })
  status!: UserStatus;

  @IsOptional()
  tutorLevelId!: string;
}
