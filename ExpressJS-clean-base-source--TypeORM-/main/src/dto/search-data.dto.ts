import { SearchFilterReq } from './search-filter.req';
import { SearchSortReq } from './search-sort.req';

export class SearchDataDto {
  filters!: SearchFilterReq[];
  sorts!: SearchSortReq[];
  rpp!: number;
  page!: number;

  //Import
  periodType?: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  periodValue?: number;

  startDate?: string; // ISO format
  endDate?: string;
}
