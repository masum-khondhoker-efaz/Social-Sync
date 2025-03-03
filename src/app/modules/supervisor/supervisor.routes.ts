import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { supervisorController } from './supervisor.controller';
import { supervisorValidation } from './supervisor.validation';
import { UserRoleEnum } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  validateRequest(supervisorValidation.createSchema),
  auth(UserRoleEnum.MANAGER, UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN),
  supervisorController.createSupervisor,
);

router.get(
  '/',
  auth(UserRoleEnum.MANAGER, UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN),
  supervisorController.getSupervisorList,
);

router.get(
  '/:id',
  auth(UserRoleEnum.MANAGER, UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN),
  supervisorController.getSupervisorById,
);

router.put(
  '/:id',
  validateRequest(supervisorValidation.updateSchema),
  auth(UserRoleEnum.MANAGER, UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN),
  supervisorController.updateSupervisor,
);

router.delete(
  '/:id',
  auth(UserRoleEnum.MANAGER, UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN),
  supervisorController.deleteSupervisor,
);

export const supervisorRoutes = router;
