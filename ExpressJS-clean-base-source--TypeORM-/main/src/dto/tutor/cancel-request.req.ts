import { TutorRequestStatus } from '@/enums/tutor_request_status.enum';
import { IsEnum, IsIn, IsNotEmpty } from 'class-validator';

export class CancelRequestReq {
  @IsNotEmpty()
  @IsIn([TutorRequestStatus.CANCEL])
  status!: TutorRequestStatus;
}
