import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { ForgotPasswordUserReq } from '@/dto/user/forgot-password-user.req';
import { GetProfileRes } from '@/dto/user/get-profile-user.res';
import { LoginUserReq } from '@/dto/user/login-user.req';
import { RegisterUserReq } from '@/dto/user/register-user.req';
import { UpdateProfileUserReq } from '@/dto/user/update-profile-user.req';
import { UpdateProfileUserRes } from '@/dto/user/update-profile-user.res';
import { User } from '@/models/user.model';
import { IUserService } from '@/service/interface/i.user.service';
import { ITYPES } from '@/types/interface.types';
import { convertToDto } from '@/utils/dto-convert/convert-to-dto.util';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class UserController {
  public common: IBaseCrudController<User>;
  private userService: IUserService<User>;
  constructor(
    @inject('UserService') userService: IUserService<User>,
    @inject(ITYPES.Controller) common: IBaseCrudController<User>
  ) {
    this.userService = userService;
    this.common = common;
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestBody: RegisterUserReq = req.body;
      const result = await this.userService.register(requestBody);
      res.send_ok('Register Borrower successful', result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestBody: LoginUserReq = req.body;
      const result = await this.userService.login(requestBody);
      res.send_ok('Login successful', result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const userId = user?.id;

      console.log(userId, 'aaaaaaaaaa');

      if (!userId) {
        throw new Error('You must login');
      }

      const profileData = await this.userService.getProfile(userId);
      const responseBody = convertToDto(GetProfileRes, profileData);
      res.send_ok('Get Profile success', responseBody);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const userId = user?.id;

      if (!userId) {
        throw new Error('You must login');
      }

      const updateData: UpdateProfileUserReq = req.body;
      const updatedProfile = await this.userService.updateProfile(userId, updateData);
      const responseBody = convertToDto(UpdateProfileUserRes, updatedProfile);

      res.send_ok('Profile updated successfully', responseBody);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const requestBody: ForgotPasswordUserReq = req.body;
      await this.userService.forgotPassword(requestBody);
      res.send_ok('OTP sent successfully');
    } catch (error) {
      next(error);
    }
  }
}
