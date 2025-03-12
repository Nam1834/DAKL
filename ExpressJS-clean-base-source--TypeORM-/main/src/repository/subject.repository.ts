import { Subject } from '@/models/subject.model';
import { BaseRepository } from '@/repository/base/base.repository';
import { ISubjectRepository } from '@/repository/interface/i.subject.repository';
import { ITYPES } from '@/types/interface.types';
import { inject } from 'inversify';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export class SubjectRepository extends BaseRepository<Subject> implements ISubjectRepository<Subject> {
  constructor(@inject(ITYPES.Datasource) dataSource: DataSource) {
    super(dataSource.getRepository(Subject));
  }

  async createNewSubject(subject: Subject): Promise<void> {
    const maxSubjectId = await this.ormRepository
      .createQueryBuilder('subject')
      .select("MAX(CAST(NULLIF(SUBSTRING(subject.subjectId, 2), '') AS INTEGER))", 'maxSubjectId')
      .where("subject.subjectId ~ '^S[0-9]+$'") // Chỉ lấy những ID hợp lệ
      .getRawOne();

    const newSubjectIdNumber = (maxSubjectId?.maxSubjectId || 0) + 1;
    const newSubjectId = 'S' + newSubjectIdNumber.toString().padStart(4, '0');

    subject.subjectId = newSubjectId;
  }
}
