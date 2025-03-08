import { SubmitTestDto } from '@/dto/test/submit-test.dto';
import { IBaseCrudService } from '@/service/interface/i.base.service';
import { BaseModelType } from '@/types/base-model.types';

export interface ITestResultService<T extends BaseModelType> extends IBaseCrudService<T> {
  submitTest(userId: string, submitTestDto: SubmitTestDto): Promise<void>;
  checkPassTest(userId: string): Promise<boolean>;
}
