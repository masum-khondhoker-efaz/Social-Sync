import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { teamAssignedController } from './teamAssigned.controller';
import { teamAssignedValidation } from './teamAssigned.validation';
import { UserRoleEnum } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  validateRequest(teamAssignedValidation.createSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  teamAssignedController.createTeamAssigned,
);

router.get('/:id', auth(), teamAssignedController.getTeamAssignedList);

router.get('/details/:id', auth(), teamAssignedController.getTeamAssignedById);

router.put(
  '/:id',
  validateRequest(teamAssignedValidation.updateSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  teamAssignedController.updateTeamAssigned,
);

router.delete('/:teamId/:taskId', auth(), teamAssignedController.deleteTeamAssigned);

export const teamAssignedRoutes = router;
