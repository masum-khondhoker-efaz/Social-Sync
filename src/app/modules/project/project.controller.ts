import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { projectService } from './project.service';

const createProject = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await projectService.createProjectIntoDb(user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Project created successfully',
    data: result,
  });
});

const getProjectList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await projectService.getProjectListFromDb(user.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project list retrieved successfully',
    data: result,
  });
});

const getProjectById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await projectService.getProjectByIdFromDb(
    user.id, req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project details retrieved successfully',
    data: result,
  });
});

const updateProject = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await projectService.updateProjectIntoDb(user.id, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project updated successfully',
    data: result,
  });
});

const deleteProject = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await projectService.deleteProjectItemFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project deleted successfully',
    data: result,
  });
});

export const projectController = {
  createProject,
  getProjectList,
  getProjectById,
  updateProject,
  deleteProject,
};