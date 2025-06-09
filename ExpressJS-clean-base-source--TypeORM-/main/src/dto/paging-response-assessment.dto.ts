import { PagingResponseDto } from './paging-response.dto';

export class AssessmentPagingResponseDto<T> extends PagingResponseDto<T> {
  public averageRatingWithTime: number | null;

  constructor(total: number, items: Array<T>, averageRatingWithTime: number | null) {
    super(total, items);
    this.averageRatingWithTime = averageRatingWithTime;
  }
}
