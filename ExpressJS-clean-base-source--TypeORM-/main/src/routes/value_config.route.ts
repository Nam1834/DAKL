import { Permissions } from '@/constants/permission.constants';
import { valueConfigController } from '@/container/value_config.container';
import { CreateValueConfigReq } from '@/dto/value-config/create-value-config.req';
import { UpdateValueConfigReq } from '@/dto/value-config/update-value-config.req';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import { checkPermission } from '@/middleware/check-permission.middleware';
import { classValidate } from '@/middleware/class-validate.middleware';
import express from 'express';
const valueConfigRouter = express.Router();

valueConfigRouter
  .post(
    '/create',
    authenticateJWT,
    classValidate(CreateValueConfigReq),
    checkPermission([Permissions.QUAN_LY_GOI_THANH_TOAN]),
    valueConfigController.create.bind(valueConfigController)
  )
  .put(
    '/update/:id',
    authenticateJWT,
    classValidate(UpdateValueConfigReq),
    checkPermission([Permissions.QUAN_LY_GOI_THANH_TOAN]),
    valueConfigController.updateById.bind(valueConfigController)
  )
  .delete(
    '/delete/:id',
    authenticateJWT,
    checkPermission([Permissions.QUAN_LY_GOI_THANH_TOAN]),
    valueConfigController.deleteValueConfigById.bind(valueConfigController)
  )
  .get('/get-list', authenticateJWT, valueConfigController.getListValueConfig.bind(valueConfigController));

export default valueConfigRouter;
