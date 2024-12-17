import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { Admin } from '@/models/admin.model';
import { IAdminService } from '@/service/interface/i.admin.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class AdminController {
  public common: IBaseCrudController<Admin>;
  private adminService: IAdminService<Admin>;
  constructor(
    @inject('AdminService') adminService: IAdminService<Admin>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Admin>
  ) {
    this.adminService = adminService;
    this.common = common;
  }
}
