import { PagingResponseDto } from '@/dto/paging-response.dto';
import { User } from '@/models/user.model';

export class GetListPublicTutorProfileRes extends PagingResponseDto<User> {
  counts!: {
    totalPublic: number;
  };
}
