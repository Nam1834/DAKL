import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { Permission } from '@/models/permission.model';
import { IPermissionService } from '@/service/interface/i.permission.service';
import { ITYPES } from '@/types/interface.types';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class PermissionController {
  public common: IBaseCrudController<Permission>;
  private permissionService: IPermissionService<Permission>;
  constructor(
    @inject('PermissionService') permissionService: IPermissionService<Permission>,
    @inject(ITYPES.Controller) common: IBaseCrudController<Permission>
  ) {
    this.permissionService = permissionService;
    this.common = common;
  }
}
