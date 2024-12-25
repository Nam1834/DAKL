import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateAdminReq } from '@/dto/admin/create-admin.req';
import { GetProfileAdminRes } from '@/dto/admin/get-profile-admin.res';
import { LoginAdminReq } from '@/dto/admin/login-admin.req';
import { Admin } from '@/models/admin.model';
import { IAdminService } from '@/service/interface/i.admin.service';
import { ITYPES } from '@/types/interface.types';
import { convertToDto } from '@/utils/dto-convert/convert-to-dto.util';
import c from 'config';
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

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const admin = req.user;

      const adminId = admin!.id;

      await this.adminService.logout(adminId);

      res.send_ok('Logout success');
    } catch (error) {
      next(error);
    }
  }

  async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestBody: CreateAdminReq = req.body;
      const result = await this.adminService.createAdmin(requestBody);
      res.send_ok('Register Admin successful', result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestBody: LoginAdminReq = req.body;
      const result = await this.adminService.login(requestBody);
      res.send_ok('Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const admin = req.user;

      const adminId = admin?.id;
      if (!adminId) {
        throw new Error('You must login');
      }

      const profileData = await this.adminService.getProfile(adminId);
      const responseBody = convertToDto(GetProfileAdminRes, profileData);
      res.send_ok('Get Profile success', responseBody);
    } catch (error) {
      next(error);
    }
  }
}
