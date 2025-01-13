import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateMeetingReq {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Topic must not exceed 100 characters' })
  topic!: string;
}
