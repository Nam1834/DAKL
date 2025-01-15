import { ErrorCode } from '@/enums/error-code.enums';
import roleRouter from '@/routes/role.route';
import BaseError from '@/utils/error/base.error';
import userRouter from '../user.route';
import adminRouter from '../admin.route';
import authRouter from '../auth.route';
import menuRouter from '../menu.route';
import mediaRouter from '../media.route';
import majorRouter from '../major.route';
import meetingRouter from '../meeting.route';
import valueConfigRouter from '../value_config.route';

export function route(app: any, root_api: string) {
  app.use(`/role`, roleRouter);
  app.use(`/user`, userRouter);
  app.use(`/admin`, adminRouter);
  app.use(`/auth`, authRouter);
  app.use(`/menu`, menuRouter);
  app.use(`/media`, mediaRouter);
  app.use(`/major`, majorRouter);
  app.use(`/meeting`, meetingRouter);
  app.use(`/value-config`, valueConfigRouter);
  app.all('*', (req: any, res: any, next: any) => {
    const err = new BaseError(ErrorCode.API_NOT_EXISTS, 'API Not Exists');
    next(err);
  });
}
