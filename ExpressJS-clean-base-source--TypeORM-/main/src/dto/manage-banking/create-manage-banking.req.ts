import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateManageBankingReq {
  @Type(() => Number) // Parse từ string sang number nếu cần
  @IsNotEmpty({ message: 'coinWithdraw không được để trống' })
  @IsInt({ message: 'coinWithdraw phải là số nguyên' }) // ❌ Không chấp nhận số thập phân như 1.2
  @Min(10, { message: 'coinWithdraw phải lớn hơn 10' }) // ❌ Không cho phép 0 hoặc số âm
  coinWithdraw!: number;
}
