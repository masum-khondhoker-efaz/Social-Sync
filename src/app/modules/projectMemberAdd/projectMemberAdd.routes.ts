import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { projectMemberAddController } from './projectMemberAdd.controller';
import { projectMemberAddValidation } from './projectMemberAdd.validation';
import { UserRoleEnum } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  validateRequest(projectMemberAddValidation.createSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  projectMemberAddController.createProjectMemberAdd,
);

router.get(
  '/project/:id',
  auth(),
  projectMemberAddController.getProjectMemberAddList,
);

router.get('/:id/:memberId', auth(), projectMemberAddController.getProjectMemberAddById);

router.put(
  '/:id',
  validateRequest(projectMemberAddValidation.updateSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  projectMemberAddController.updateProjectMemberAdd,
);

router.delete(
  '/:projectId/:memberId',
  auth(),
  projectMemberAddController.deleteProjectMemberAdd,
);

export const projectMemberAddRoutes = router;
