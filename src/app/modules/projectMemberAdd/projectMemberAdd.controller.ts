import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { projectMemberAddService } from './projectMemberAdd.service';

const createProjectMemberAdd = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await projectMemberAddService.createProjectMemberAddIntoDb(user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'ProjectMemberAdd created successfully',
    data: result,
  });
});

const getProjectMemberAddList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const projectId = req.params.id;
  const result = await projectMemberAddService.getProjectMemberAddListFromDb(user.id, projectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ProjectMemberAdd list retrieved successfully',
    data: result,
  });
});

const getProjectMemberAddById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await projectMemberAddService.getProjectMemberAddByIdFromDb(user.id, req.params.id, req.params.memberId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ProjectMemberAdd details retrieved successfully',
    data: result,
  });
});

const updateProjectMemberAdd = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await projectMemberAddService.updateProjectMemberAddIntoDb(user.id, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ProjectMemberAdd updated successfully',
    data: result,
  });
});

const deleteProjectMemberAdd = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await projectMemberAddService.deleteProjectMemberAddItemFromDb(user.id, req.params.projectId, req.params.memberId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ProjectMemberAdd deleted successfully',
    data: result,
  });
});

export const projectMemberAddController = {
  createProjectMemberAdd,
  getProjectMemberAddList,
  getProjectMemberAddById,
  updateProjectMemberAdd,
  deleteProjectMemberAdd,
};