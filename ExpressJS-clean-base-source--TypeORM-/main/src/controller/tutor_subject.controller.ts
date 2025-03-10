import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { TutorSubject } from '@/models/tutor_subject.model';
import { ITutorSubjectService } from '@/service/interface/i.tutor_subject.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class TutorSubjectController {
  public common: IBaseCrudController<TutorSubject>;
  private tutorSubjectService: ITutorSubjectService<TutorSubject>;
  constructor(
    @inject('TutorSubjectService') tutorSubjectService: ITutorSubjectService<TutorSubject>,
    @inject(ITYPES.Controller) common: IBaseCrudController<TutorSubject>
  ) {
    this.tutorSubjectService = tutorSubjectService;
    this.common = common;
  }
}
