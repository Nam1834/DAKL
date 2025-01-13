import { PagingResponseDto } from '@/dto/paging-response.dto';
import { User } from '@/models/user.model';

export class GetListRequestRes extends PagingResponseDto<User> {
  counts!: {
    totalRequest: number;
    totalNewRequest: number;
  };
}
