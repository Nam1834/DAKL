import { TutorRequest } from '@/models/tutor_request.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ITutorRequestRepository } from '@/repository/interface/i.tutor_request.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class TutorRequestRepository
  extends BaseRepository<TutorRequest>
  implements ITutorRequestRepository<TutorRequest>
{
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(TutorRequest));
  }

  async createNewTutorRequest(tutorRequest: TutorRequest): Promise<void> {
    const maxTutorRequestId = await this.ormRepository
      .createQueryBuilder('tutorRequest')
      .select("MAX(CAST(NULLIF(SUBSTRING(tutorRequest.tutorRequestId, 3), '') AS INTEGER))", 'maxTutorRequestId')
      .where("tutorRequest.tutorRequestId ~ '^TR[0-9]+$'") // Chỉ lấy những ID hợp lệ
      .getRawOne();

    const newTutorRequestIdNumber = (maxTutorRequestId?.maxTutorRequestId || 0) + 1;
    const newTutorRequestId = 'TR' + newTutorRequestIdNumber.toString().padStart(5, '0');

    tutorRequest.tutorRequestId = newTutorRequestId;
  }
}
