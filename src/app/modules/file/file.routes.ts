import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { fileController } from './file.controller';
import { fileValidation } from './file.validation';
import { multerUpload } from '../../utils/multerUpload';
import { parseBody } from '../../middlewares/parseBody';
import { UserRoleEnum } from '@prisma/client';

const router = express.Router();

router.post(
  '/',
  multerUpload.single('file'),
  parseBody,
  validateRequest(fileValidation.createSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  fileController.createFile,
);

router.get('/:id', auth(), fileController.getFileList);

router.get('/details/:id', auth(), fileController.getFileById);

router.put(
  '/:fileId',
  multerUpload.single('file'),
  parseBody,
  validateRequest(fileValidation.updateSchema),
  auth(
    UserRoleEnum.MANAGER,
    UserRoleEnum.SUPERVISOR,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SUPER_ADMIN,
  ),
  fileController.updateFile,
);

router.delete('/:id', auth(), fileController.deleteFile);

export const fileRoutes = router;
