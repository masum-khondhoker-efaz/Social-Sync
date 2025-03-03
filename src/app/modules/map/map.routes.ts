import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { mapController } from './map.controller';
import { mapValidation } from './map.validation';
import { multerUpload } from '../../utils/multerUpload';
import { parseBody } from '../../middlewares/parseBody';
import { updateMulterUpload } from '../../utils/updateMulterUpload';
import { UserRoleEnum } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  multerUpload.single('mapDocument'),
  parseBody,
  validateRequest(mapValidation.createSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  mapController.createMap,
);

router.get(
  '/',
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  mapController.getMapList,
);

router.get('/:mapId', auth(), mapController.getMapById);

router.put(
  '/:mapId',
  updateMulterUpload.single('mapDocument'),
  parseBody,
  validateRequest(mapValidation.updateSchema),
  auth(),
  mapController.updateMap,
);

router.delete('/:mapId', auth(), mapController.deleteMap);

export const mapRoutes = router;
