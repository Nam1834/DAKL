import { AddToMyCurriculumnReq } from '@/dto/my-curriculumn/add-to-my-curriculumn.req';
import { PagingResponseDto } from '@/dto/paging-response.dto';
import { PagingDto } from '@/dto/paging.dto';
import { MyCurriculumn } from '@/models/my-curriculumn.model';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface IMyCurriculumnService<T extends BaseModelType> extends IBaseCrudService<T> {
  getMyCurriculumn(userId: string, paging: PagingDto): Promise<PagingResponseDto<MyCurriculumn>>;
  addToMyCurrriculumn(userId: string, data: AddToMyCurriculumnReq): Promise<void>;
  removeFromMyCurriculumn(userId: string, curriculumnId: string): Promise<void>;
}
