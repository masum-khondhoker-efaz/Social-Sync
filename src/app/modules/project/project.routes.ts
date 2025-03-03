import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { projectController } from './project.controller';
import { projectValidation } from './project.validation';
import { UserRoleEnum } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  validateRequest(projectValidation.createSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  projectController.createProject,
);

router.get('/', auth(), projectController.getProjectList);

router.get('/:id', auth(), projectController.getProjectById);

router.put(
  '/:id',
  validateRequest(projectValidation.updateSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  projectController.updateProject,
);

router.delete('/:id', auth(), projectController.deleteProject);

export const projectRoutes = router;
