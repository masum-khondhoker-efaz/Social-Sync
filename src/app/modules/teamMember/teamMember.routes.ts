import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { teamMemberController } from './teamMember.controller';
import { teamMemberValidation } from './teamMember.validation';
import { UserRoleEnum } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  validateRequest(teamMemberValidation.createSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  teamMemberController.createTeamMember,
);

router.get('/:teamId', auth(), teamMemberController.getTeamMemberList);

router.get('/member/:id/:teamId', auth(), teamMemberController.getTeamMemberById);

router.put(
  '/:teamId',
  validateRequest(teamMemberValidation.updateSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  teamMemberController.updateTeamMember,
);

router.delete('/:id', auth(), teamMemberController.deleteTeamMember);

export const teamMemberRoutes = router;
