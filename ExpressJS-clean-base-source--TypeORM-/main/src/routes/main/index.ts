import { ErrorCode } from '@/enums/error-code.enums';
import accountRouter from '@/routes/account.route';
import roleRouter from '@/routes/role.route';
import BaseError from '@/utils/error/base.error';
import userRouter from '../user.route';
import adminRouter from '../admin.route';

export function route(app: any, root_api: string) {
  app.use(`${root_api}/account`, accountRouter);
  app.use(`/role`, roleRouter);
  app.use(`/user`, userRouter);
  app.use(`/admin`, adminRouter);
  app.all('*', (req: any, res: any, next: any) => {
    const err = new BaseError(ErrorCode.API_NOT_EXISTS, 'API Not Exists');
    next(err);
  });
}
