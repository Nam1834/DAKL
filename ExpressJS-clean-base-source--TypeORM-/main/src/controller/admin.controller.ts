import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { CreateAdminReq } from '@/dto/admin/create-admin.req';
import { GetProfileAdminRes } from '@/dto/admin/get-profile-admin.res';
import { LoginAdminReq } from '@/dto/admin/login-admin.req';
import { UpdateAdminReq } from '@/dto/admin/update-admin.req';
import { SearchDataDto } from '@/dto/search-data.dto';
import { Admin } from '@/models/admin.model';
import { IAdminService } from '@/service/interface/i.admin.service';
import { ITYPES } from '@/types/interface.types';
import { convertToDto } from '@/utils/dto-convert/convert-to-dto.util';
import { getSearchData } from '@/utils/get-search-data.util';
import c from 'config';
import { NextFunction, Request, Response } from 'express';
import { id, inject, injectable } from 'inversify';

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

  async searchAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.adminService.search(searchData);
      res.send_ok('Employees fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async loginMicrosoft(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const code = typeof req.body.code === 'string' ? req.body.code.trim() : undefined;

      if (!code) {
        res.status(400).send({ error: 'Invalid or missing authorization code.' });
        return;
      }
      const result = await this.adminService.loginMicrosoft(code);
      res.send_ok('Login successful', result);
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

  async getDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      const result = await this.adminService.findOne({
        filter: {
          adminId: id
        },
        relations: ['adminProfile']
      });

      delete (result as any).password;
      res.send_ok('Admin fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const data: UpdateAdminReq = req.body;
      const result = await this.adminService.updateAdmin(id, data);
      res.send_ok('Admin updated successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
