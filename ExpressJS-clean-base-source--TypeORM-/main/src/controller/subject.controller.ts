import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search-data.dto';
import { CreateSubjectReq } from '@/dto/subject/create-subject.req';
import { UpdateSubjectReq } from '@/dto/subject/update-subject.req';
import { ErrorCode } from '@/enums/error-code.enums';
import { Subject } from '@/models/subject.model';
import { ISubjectService } from '@/service/interface/i.subject.service';
import { ITYPES } from '@/types/interface.types';
import BaseError from '@/utils/error/base.error';
import { getSearchData } from '@/utils/get-search-data.util';
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

  async searchSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.subjectService.search(searchData);
      res.send_ok('Subject fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestBody: CreateSubjectReq = req.body;

      const result = await this.subjectService.createSubject(requestBody);

      res.send_ok('Create subject successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const data: UpdateSubjectReq = req.body;

      await this.subjectService.updateSubject(id, data);

      res.send_ok('Update subject successfully', data);
    } catch (error) {
      next(error);
    }
  }

  async deleteSubjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.id;

    const existingSubject = await this.subjectService.findOne({
      filter: { subjectId: id }
    });
    if (!existingSubject) {
      throw new BaseError(ErrorCode.DOES_NOT_EXISTS, 'Subject does not exist');
    }

    await this.subjectService.findOneAndDelete({ filter: { subjectId: id } });

    res.send_ok('Delete subject successfully');
  }
}
