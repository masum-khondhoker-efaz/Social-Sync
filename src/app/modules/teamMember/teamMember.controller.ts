import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { teamMemberService } from './teamMember.service';

const createTeamMember = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamMemberService.createTeamMemberIntoDb(user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'TeamMember created successfully',
    data: result,
  });
});

const getTeamMemberList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamMemberService.getTeamMemberListFromDb(user.id, req.params.teamId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TeamMember list retrieved successfully',
    data: result,
  });
});

const getTeamMemberById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamMemberService.getTeamMemberByIdFromDb(user.id, req.params.id, req.params.teamId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TeamMember details retrieved successfully',
    data: result,
  });
});

const updateTeamMember = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamMemberService.updateTeamMemberIntoDb(user.id, req.params.teamId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TeamMember updated successfully',
    data: result,
  });
});

const deleteTeamMember = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await teamMemberService.deleteTeamMemberItemFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'TeamMember deleted successfully',
    data: result,
  });
});

export const teamMemberController = {
  createTeamMember,
  getTeamMemberList,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
};