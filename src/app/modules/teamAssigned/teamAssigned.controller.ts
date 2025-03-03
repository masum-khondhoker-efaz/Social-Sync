import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { teamAssignedService } from './teamAssigned.service';

const createTeamAssigned = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamAssignedService.createTeamAssignedIntoDb(user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'TeamAssigned created successfully',
    data: result,
  });
});

const getTeamAssignedList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamAssignedService.getTeamAssignedListFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TeamAssigned list retrieved successfully',
    data: result,
  });
});

const getTeamAssignedById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamAssignedService.getTeamAssignedByIdFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TeamAssigned details retrieved successfully',
    data: result,
  });
});

const updateTeamAssigned = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamAssignedService.updateTeamAssignedIntoDb(user.id, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TeamAssigned updated successfully',
    data: result,
  });
});

const deleteTeamAssigned = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamAssignedService.deleteTeamAssignedItemFromDb(user.id, req.params.teamId, req.params.taskId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TeamAssigned deleted successfully',
    data: result,
  });
});

export const teamAssignedController = {
  createTeamAssigned,
  getTeamAssignedList,
  getTeamAssignedById,
  updateTeamAssigned,
  deleteTeamAssigned,
};