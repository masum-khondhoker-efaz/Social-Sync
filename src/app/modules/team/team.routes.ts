import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { teamController } from './team.controller';
import { teamValidation } from './team.validation';
import { multerUpload } from '../../utils/multerUpload';
import { parse } from 'path';
import { parseBody } from '../../middlewares/parseBody';
import { updateMulterUpload } from '../../utils/updateMulterUpload';
import { UserRoleEnum } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  multerUpload.single('teamLogo'),
  parseBody,
  validateRequest(teamValidation.createSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  teamController.createTeam,
);

router.get('/:projectId', auth(), teamController.getTeamList);

router.get('/details/:id', auth(), teamController.getTeamById);

router.put(
  '/:id',
  updateMulterUpload.single('teamLogo'),
  parseBody,
  validateRequest(teamValidation.updateSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  teamController.updateTeam,
);

router.delete('/:id', auth(), teamController.deleteTeam);

export const teamRoutes = router;
