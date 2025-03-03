import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { taskService } from './task.service';

const createTask = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await taskService.createTaskIntoDb(user.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Task created successfully',
    data: result,
  });
});

const getTaskList = catchAsync(async (req, res) => {
  const user = req.user as any;
  const projectId = req.params.projectId;
  const result = await taskService.getTaskListFromDb(user.id, projectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task list retrieved successfully',
    data: result,
  });
});

const getTaskById = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await taskService.getTaskByIdFromDb(user.id, req.params.taskId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task details retrieved successfully',
    data: result,
  });
});

const updateTask = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await taskService.updateTaskIntoDb(user.id, req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task updated successfully',
    data: result,
  });
});

const deleteTask = catchAsync(async (req, res) => {
  const user = req.user as any;
  const result = await taskService.deleteTaskItemFromDb(user.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task deleted successfully',
    data: result,
  });
});

export const taskController = {
  createTask,
  getTaskList,
  getTaskById,
  updateTask,
  deleteTask,
};