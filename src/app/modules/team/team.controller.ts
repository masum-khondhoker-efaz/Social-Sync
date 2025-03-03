import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { teamService } from './team.service';
import AppError from '../../errors/AppError';
import { uploadFileToSpace } from '../../utils/multerUpload';
import { uploadFileToSpaceForUpdate } from '../../utils/updateMulterUpload';

const createTeam = catchAsync(async (req, res) => {
  const user = req.user as any;
  const data = req.body;
  const file = req.file;

  if (!file) {
    throw new AppError(httpStatus.CONFLICT, 'file not found');
  }

  const fileUrl = await uploadFileToSpace(file, 'skippy');

  const teamData = {
    data,
    teamLogo: fileUrl,
  };

  const result = await teamService.createTeamIntoDb(user.id, teamData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Team created successfully',
    data: result,
  });
});

const getTeamList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamService.getTeamListFromDb(user.id, req.params.projectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Team list retrieved successfully',
    data: result,
  });
});

const getTeamById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamService.getTeamByIdFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Team details retrieved successfully',
    data: result,
  });
});

const updateTeam = catchAsync(async (req, res) => {
  const user = req.user as any;
  const data = req.body;
  const file = req.file;


  let teamData: { data: any; teamLogo?: string } = { data };

  if (file) {
    const fileUrl = await uploadFileToSpaceForUpdate(file, 'skippy');
    teamData.teamLogo = fileUrl;
  }
  const result = await teamService.updateTeamIntoDb(user.id, req.params.id, teamData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Team updated successfully',
    data: result,
  });
});

const deleteTeam = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamService.deleteTeamItemFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Team deleted successfully',
    data: result,
  });
});

export const teamController = {
  createTeam,
  getTeamList,
  getTeamById,
  updateTeam,
  deleteTeam,
};