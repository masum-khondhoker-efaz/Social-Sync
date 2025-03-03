import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { supervisorService } from './supervisor.service';

const createSupervisor = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await supervisorService.createSupervisorIntoDb(user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Supervisor created successfully',
    data: result,
  });
});

const getSupervisorList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const { search } = req.query;
  const searchString = search as string;
  const result = await supervisorService.getSupervisorListFromDb(searchString);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supervisor list retrieved successfully',
    data: result,
  });
});

const getSupervisorById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await supervisorService.getSupervisorByIdFromDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supervisor details retrieved successfully',
    data: result,
  });
});

const updateSupervisor = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await supervisorService.updateSupervisorIntoDb(user.id, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supervisor updated successfully',
    data: result,
  });
});

const deleteSupervisor = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await supervisorService.deleteSupervisorItemFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Supervisor deleted successfully',
    data: result,
  });
});

export const supervisorController = {
  createSupervisor,
  getSupervisorList,
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor,
};