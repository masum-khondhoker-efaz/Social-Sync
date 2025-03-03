import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidations } from '../user/user.validation';
import { UserControllers } from '../user/user.controller';
import { UserRoleEnum } from '@prisma/client';
import { multerUpload } from '../../utils/multerUpload';
const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidations.registerUser),
  UserControllers.registerUser,
);

router.get(
  '/',
  auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN, UserRoleEnum.MANAGER),
  UserControllers.getAllUsers,
);

router.get('/me', auth(), UserControllers.getMyProfile);

router.get('/:id', UserControllers.getUserDetails);

router.put('/update-profile', auth(), UserControllers.updateMyProfile);

router.put(
  '/role-switch',
  auth(),
  UserControllers.updateUserRoleStatus,
);

router.put('/change-password', auth(), UserControllers.changePassword);

router.post(
  '/forgot-password',
  validateRequest(UserValidations.forgetPasswordSchema),
  UserControllers.forgotPassword,
);

router.post('/resend-otp', UserControllers.resendOtp);

router.put(
  '/verify-otp',
  validateRequest(UserValidations.verifyOtpSchema),
  UserControllers.verifyOtp,
);

router.put(
  '/verify-otp-forgot-password',
  validateRequest(UserValidations.verifyOtpSchema),
  UserControllers.verifyOtpForgotPassword,
);

router.put('/reset-password', UserControllers.updatePassword);

router.post(
  '/social-sign-up',
  validateRequest(UserValidations.socialLoginSchema),
  UserControllers.socialLogin,
);

router.put(
  '/update-profile-image',
  multerUpload.single('profileImage'),
  auth(),
  UserControllers.updateProfileImage,
);

router.post(
  '/image-to-link',
  multerUpload.single('chatImage'),
  auth(),
  UserControllers.imageToLink,
);

export const UserRouters = router;
