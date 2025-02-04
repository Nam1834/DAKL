import { IBaseCrudController } from '@/controller/interfaces/i.base-curd.controller';
import { SearchDataDto } from '@/dto/search-data.dto';
import { RegisToTutorReq } from '@/dto/tutor/regis-tutor.req';
import { ForgotPasswordUserReq } from '@/dto/user/forgot-password-user.req';
import { GetProfileRes } from '@/dto/user/get-profile-user.res';
import { LoginMicrosoftRes } from '@/dto/user/login-microsoft.res';
import { LoginUserReq } from '@/dto/user/login-user.req';
import { LoginUserRes } from '@/dto/user/login-user.res';
import { RegisterUserReq } from '@/dto/user/register-user.req';
import { ResetPasswordReq } from '@/dto/user/reset-password-user.req';
import { ResetPasswordRes } from '@/dto/user/reset-password-user.res';
import { UpdateProfileUserReq } from '@/dto/user/update-profile-user.req';
import { UpdateProfileUserRes } from '@/dto/user/update-profile-user.res';
import { VerifyOtpReq } from '@/dto/user/verify-otp.req';
import { VerifyOtpRes } from '@/dto/user/verify-otp.res';
import { User } from '@/models/user.model';
import { IUserService } from '@/service/interface/i.user.service';
import { ITYPES } from '@/types/interface.types';
import { convertToDto } from '@/utils/dto-convert/convert-to-dto.util';
import { getSearchData } from '@/utils/get-search-data.util';
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

  async searchUser(req: Request, res: Response, next: NextFunction) {
    try {
      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.userService.search(searchData);
      res.send_ok('Users fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;

      const userId = user!.id;

      await this.userService.logout(userId);

      res.send_ok('Logout success');
    } catch (error) {
      next(error);
    }
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

  async getMicrosoftAuthUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.userService.getMicrosoftAuthUrl();
      res.send_ok('Microsoft Auth URL generated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async handleMicrosoftCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.query;

      if (!code) {
        throw new Error('Authorization code not found.');
      }
      res.send_ok('Authorization code successful', code);
    } catch (error) {
      next(error);
    }
  }

  async exchangeCodeForToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const code = typeof req.body.code === 'string' ? req.body.code.trim() : undefined;

      if (!code) {
        res.status(400).send({ error: 'Invalid or missing authorization code.' });
        return;
      }
      const result = await this.userService.exchangeCodeForToken(code);
      res.status(200).json({
        message: 'Microsoft Auth URL generated successfully',
        data: result
      });
      res.send_ok('Microsoft Auth URL generated successfully', result);
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
      const result = await this.userService.loginMicrosoft(code);
      res.send_ok('Login successful', result);
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

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const verifyOtpReq: VerifyOtpReq = req.body;
      const result = await this.userService.verifyOtp(verifyOtpReq);
      const responseBody = convertToDto(VerifyOtpRes, result);
      res.send_ok(responseBody.message);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resetPasswordReq: ResetPasswordReq = req.body;
      const result = await this.userService.resetPassword(resetPasswordReq);

      res.send_ok('Reset password successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async regisUserToTutor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user;
      const userId = user?.id;

      if (!userId) {
        throw new Error('You must login');
      }

      const requestBody: RegisToTutorReq = req.body;
      const result = await this.userService.regisToTutor(userId, requestBody);
      res.send_ok('Register Tutor successful', result);
    } catch (error) {
      next(error);
    }
  }

  async getListRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.params.status;

      const searchData: SearchDataDto = getSearchData(req);
      const result = await this.userService.getListRequest(status, searchData);

      res.send_ok('Request fetched successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async solveRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;

      const click: string = req.body.click;
      const result = await this.userService.solveRequest(userId, click);

      res.send_ok('Request solve successfully', result);
    } catch (error) {
      next(error);
    }
  }
}
