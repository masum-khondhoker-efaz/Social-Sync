import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { userSubscriptionService } from './userSubscription.service';

const createUserSubscription = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await userSubscriptionService.createUserSubscriptionIntoDb(
    user.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'UserSubscription created successfully',
    data: result,
  });
});

const getUserSubscriptionList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await userSubscriptionService.getUserSubscriptionListFromDb(
    user.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Subscription list retrieved successfully',
    data: result,
  });
});

const getUserSubscriptionListByAdmin = catchAsync(async (req, res) => {
  const result =
    await userSubscriptionService.getUserSubscriptionListByAdminFromDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'UserSubscription list retrieved successfully',
    data: result,
  });
});

const getUserSubscriptionById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await userSubscriptionService.getUserSubscriptionByIdFromDb(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'UserSubscription details retrieved successfully',
    data: result,
  });
});

const updateUserSubscription = catchAsync(async (req, res) => {
  const { userId, paymentStatus } = req.body;

  // Assuming paymentStatus and other data are being passed correctly in the body
  const data = { paymentStatus }; // You can add other fields to `data` as needed

  // Call the service to update the subscription
  const result = await userSubscriptionService.updateUserSubscriptionIntoDb(
    userId,
    req.params.id,
    data,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'UserSubscription updated successfully',
    data: result,
  });
});

const deleteUserSubscription = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await userSubscriptionService.deleteUserSubscriptionItemFromDb(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'UserSubscription deleted successfully',
    data: result,
  });
});

export const userSubscriptionController = {
  createUserSubscription,
  getUserSubscriptionList,
  getUserSubscriptionListByAdmin,
  getUserSubscriptionById,
  updateUserSubscription,
  deleteUserSubscription,
};
