import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { subscriptionOfferController } from './subscriptionOffer.controller';
import { subscriptionOfferValidation } from './subscriptionOffer.validation';
import { UserRoleEnum } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  validateRequest(subscriptionOfferValidation.createSchema),
  auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN),
  subscriptionOfferController.createSubscriptionOffer,
);

router.get('/', auth(), subscriptionOfferController.getSubscriptionOfferList);

router.get(
  '/:id',
  auth(),
  subscriptionOfferController.getSubscriptionOfferById,
);

router.put(
  '/:id',
  validateRequest(subscriptionOfferValidation.updateSchema),
  auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN),
  subscriptionOfferController.updateSubscriptionOffer,
);

router.delete(
  '/:id',
  auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN),
  subscriptionOfferController.deleteSubscriptionOffer,
);

export const subscriptionOfferRoutes = router;
