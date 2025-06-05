import { PagingResponseDto } from './paging-response.dto';

export class AssessmentPagingResponseDto<T> extends PagingResponseDto<T> {
  public positiveRate: number;

  constructor(total: number, items: Array<T>, positiveRate: number) {
    super(total, items);
    this.positiveRate = positiveRate;
  }
}
