import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateSubjectReq } from '@/dto/subject/create-subject.req';
import { Subject } from '@/models/subject.model';
import { ISubjectService } from '@/service/interface/i.subject.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class SubjectController {
  public common: IBaseCrudController<Subject>;
  private subjectService: ISubjectService<Subject>;
  constructor(
    @inject('SubjectService') subjectService: ISubjectService<Subject>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Subject>
  ) {
    this.subjectService = subjectService;
    this.common = common;
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestBody: CreateSubjectReq = req.body;

      const result = await this.subjectService.create({ data: requestBody });

      res.send_ok('Create subject successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
