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
import orderRouter from '../order.route';
import paymentRouter from '../payment.route';
import curriculumnRouter from '../curriculumn.route';
import staticDataRouter from '../static_data.route';
import myCurriculumnRouter from '../my_curriculumn.route';
import subjectRouter from '../subject.route';
import tutorLevelRouter from '../tutor_level.route';

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
  app.use(`/order`, orderRouter);
  app.use(`/payment`, paymentRouter);
  app.use(`/curriculumn`, curriculumnRouter);
  app.use(`/static-data`, staticDataRouter);
  app.use(`/my-curriculumn`, myCurriculumnRouter);
  app.use(`/subject`, subjectRouter);
  app.use(`/tutor-level`, tutorLevelRouter);
  app.all('*', (req: any, res: any, next: any) => {
    const err = new BaseError(ErrorCode.API_NOT_EXISTS, 'API Not Exists');
    next(err);
  });
}
