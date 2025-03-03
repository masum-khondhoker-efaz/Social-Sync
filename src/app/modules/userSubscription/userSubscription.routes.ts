import express from 'express';
import auth from '../../middlewares/auth';
import { userSubscriptionController } from './userSubscription.controller';
import { UserRoleEnum } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  auth(UserRoleEnum.MANAGER),
  userSubscriptionController.createUserSubscription,
);

router.get(
  '/',
  auth(UserRoleEnum.MANAGER, UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN),
  userSubscriptionController.getUserSubscriptionList,
);

router.get(
  '/admin',
  auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN),
  userSubscriptionController.getUserSubscriptionListByAdmin,
);

router.get('/:id', auth(), userSubscriptionController.getUserSubscriptionById);

router.put(
  '/:id',
  auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN),
  userSubscriptionController.updateUserSubscription,
);

router.delete(
  '/:id',
  auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN),
  userSubscriptionController.deleteUserSubscription,
);

export const userSubscriptionRoutes = router;
