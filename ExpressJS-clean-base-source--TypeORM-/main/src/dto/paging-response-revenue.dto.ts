import { PagingResponseDto } from './paging-response.dto';

export class RevenuePagingResponseDto<T> extends PagingResponseDto<T> {
  public totalRevenue: number;

  constructor(total: number, items: Array<T>, totalRevenue: number) {
    super(total, items);
    this.totalRevenue = totalRevenue;
  }
}
